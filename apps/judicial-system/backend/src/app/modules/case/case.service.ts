import { Op } from 'sequelize'
import { Includeable, OrderItem, Transaction } from 'sequelize/types'
import { Sequelize } from 'sequelize-typescript'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import {
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import {
  Message,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseFileState,
  CaseOrigin,
  CaseState,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import type { User as TUser } from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import {
  getRequestPdfAsBuffer,
  getRulingPdfAsString,
  getRulingPdfAsBuffer,
  getCustodyNoticePdfAsBuffer,
  getCourtRecordPdfAsBuffer,
  getCourtRecordPdfAsString,
  formatRulingModifiedHistory,
  createCaseFilesRecord,
} from '../../formatters'
import { CaseFile, FileService } from '../file'
import { DefendantService, Defendant } from '../defendant'
import { Institution } from '../institution'
import { User } from '../user'
import { AwsS3Service } from '../aws-s3'
import { CourtService } from '../court'
import { EventService } from '../event'
import { CreateCaseDto } from './dto/createCase.dto'
import { UpdateCaseDto } from './dto/updateCase.dto'
import { getCasesQueryFilter } from './filters/case.filters'
import { Case } from './models/case.model'
import { SignatureConfirmationResponse } from './models/signatureConfirmation.response'
import { caseModuleConfig } from './case.config'

export const includes: Includeable[] = [
  { model: Defendant, as: 'defendants' },
  { model: Institution, as: 'court' },
  {
    model: User,
    as: 'creatingProsecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'prosecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  { model: Institution, as: 'sharedWithProsecutorsOffice' },
  {
    model: User,
    as: 'judge',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'registrar',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'courtRecordSignatory',
    include: [{ model: Institution, as: 'institution' }],
  },
  { model: Case, as: 'parentCase' },
  { model: Case, as: 'childCase' },
  {
    model: CaseFile,
    as: 'caseFiles',
    required: false,
    where: {
      state: { [Op.not]: CaseFileState.DELETED },
    },
  },
]

export const defendantsOrder: OrderItem = [
  { model: Defendant, as: 'defendants' },
  'created',
  'ASC',
]

@Injectable()
export class CaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @Inject(caseModuleConfig.KEY)
    private readonly config: ConfigType<typeof caseModuleConfig>,
    private readonly defendantService: DefendantService,
    private readonly fileService: FileService,
    private readonly awsS3Service: AwsS3Service,
    private readonly courtService: CourtService,
    private readonly signingService: SigningService,
    private readonly intlService: IntlService,
    private readonly eventService: EventService,
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private formatMessage: FormatMessage = () => {
    throw new InternalServerErrorException('Format message not initialized')
  }

  private async refreshFormatMessage(): Promise<void> {
    return this.intlService
      .useIntl(['judicial.system.backend'], 'is')
      .then((res) => {
        this.formatMessage = res.formatMessage
      })
      .catch((reason) => {
        this.logger.error('Unable to refresh format messages', { reason })
      })
  }

  private async uploadSignedRulingPdfToS3(
    theCase: Case,
    pdf: string,
  ): Promise<boolean> {
    return this.awsS3Service
      .putObject(`generated/${theCase.id}/ruling.pdf`, pdf)
      .then(() => true)
      .catch((reason) => {
        this.logger.error(
          `Failed to upload signed ruling pdf to AWS S3 for case ${theCase.id}`,
          { reason },
        )

        return false
      })
  }

  private async createCase(
    caseToCreate: CreateCaseDto,
    transaction?: Transaction,
  ): Promise<string> {
    const theCase = await (transaction
      ? this.caseModel.create(
          {
            ...caseToCreate,
            state: isIndictmentCase(caseToCreate.type)
              ? CaseState.DRAFT
              : undefined,
          },
          { transaction },
        )
      : this.caseModel.create({ ...caseToCreate }))

    return theCase.id
  }

  private addCompletedCaseMessagesToQueue(caseId: string): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      { type: MessageType.CASE_COMPLETED, caseId },
      { type: MessageType.DELIVER_COURT_RECORD_TO_COURT, caseId },
      { type: MessageType.DELIVER_SIGNED_RULING_TO_COURT, caseId },
      { type: MessageType.SEND_RULING_NOTIFICATION, caseId },
    ])
  }

  private addIndictmentCaseConnectedToCourtCaseMessagesToQueue(
    theCase: Case,
  ): Promise<void> {
    const messages = theCase.policeCaseNumbers
      .map<Message>((policeCaseNumber) => ({
        type: MessageType.DELIVER_CASE_FILES_RECORD_TO_COURT,
        caseId: theCase.id,
        policeCaseNumber,
      }))
      .concat(
        theCase.caseFiles
          ?.filter(
            (caseFile) =>
              (caseFile.category &&
                [
                  CaseFileCategory.COVER_LETTER,
                  CaseFileCategory.INDICTMENT,
                  CaseFileCategory.CRIMINAL_RECORD,
                  CaseFileCategory.COST_BREAKDOWN,
                ].includes(caseFile.category)) ||
              (caseFile.category === CaseFileCategory.CASE_FILE &&
                !caseFile.policeCaseNumber),
          )
          .map((caseFile) => ({
            type: MessageType.DELIVER_CASE_FILE_TO_COURT,
            caseId: theCase.id,
            caseFileId: caseFile.id,
          })) ?? [],
      )

    return this.messageService.sendMessagesToQueue(messages)
  }

  // Note that the court record and ruling are not delieverd to court for indictment cases
  addCompletedIndictmentCaseMessagesToQueue(theCase: Case): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      { type: MessageType.CASE_COMPLETED, caseId: theCase.id },
      { type: MessageType.SEND_RULING_NOTIFICATION, caseId: theCase.id },
    ])
  }

  addCaseConnectedToCourtCaseMessagesToQueue(theCase: Case): Promise<void> {
    return isIndictmentCase(theCase.type)
      ? this.addIndictmentCaseConnectedToCourtCaseMessagesToQueue(theCase)
      : this.messageService.sendMessageToQueue({
          type: MessageType.DELIVER_REQUEST_TO_COURT,
          caseId: theCase.id,
        })
  }

  async findById(caseId: string): Promise<Case> {
    const theCase = await this.caseModel.findOne({
      include: includes,
      order: [defendantsOrder],
      where: {
        id: caseId,
        state: { [Op.not]: CaseState.DELETED },
        isArchived: false,
      },
    })

    if (!theCase) {
      throw new NotFoundException(`Case ${caseId} does not exist`)
    }

    return theCase
  }

  async findOriginalAncestor(theCase: Case): Promise<Case> {
    let originalAncestor: Case = theCase

    while (originalAncestor.parentCaseId) {
      const parentCase = await this.caseModel.findByPk(
        originalAncestor.parentCaseId,
      )

      if (!parentCase) {
        throw new InternalServerErrorException(
          `Original ancestor of case ${theCase.id} not found`,
        )
      }

      originalAncestor = parentCase
    }

    return originalAncestor
  }

  getAll(user: TUser): Promise<Case[]> {
    return this.caseModel.findAll({
      include: includes,
      order: [defendantsOrder],
      where: getCasesQueryFilter(user),
    })
  }

  async create(caseToCreate: CreateCaseDto, prosecutor: TUser): Promise<Case> {
    this.logger.debug('Creating case', { caseToCreate })
    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          {
            ...caseToCreate,
            origin: CaseOrigin.RVG,
            creatingProsecutorId: prosecutor.id,
            prosecutorId: prosecutor.id,
            courtId: prosecutor.institution?.defaultCourtId,
          } as CreateCaseDto,
          transaction,
        )

        await this.defendantService.create(caseId, {}, transaction)

        return caseId
      })
      .then((caseId) => this.findById(caseId))
  }

  async update(
    theCase: Case,
    update: UpdateCaseDto,
    returnUpdatedCase = true,
  ): Promise<Case | undefined> {
    return this.sequelize
      .transaction(async (transaction) => {
        const [numberOfAffectedRows] = await this.caseModel.update(update, {
          where: { id: theCase.id },
          transaction,
        })

        if (numberOfAffectedRows > 1) {
          // Tolerate failure, but log error
          this.logger.error(
            `Unexpected number of rows (${numberOfAffectedRows}) affected when updating case ${theCase.id}`,
          )
        } else if (numberOfAffectedRows < 1) {
          throw new InternalServerErrorException(
            `Could not update case ${theCase.id}`,
          )
        }

        if (update.policeCaseNumbers && theCase.caseFiles) {
          const oldPoliceCaseNumbers = theCase.policeCaseNumbers
          const newPoliceCaseNumbers = update.policeCaseNumbers
          const maxIndex = Math.max(
            oldPoliceCaseNumbers.length,
            newPoliceCaseNumbers.length,
          )

          // Assumptions:
          // 1. The police case numbers are in the same order as they were before
          // 2. The police case numbers are not duplicated
          // 3. At most one police case number is changed, added or removed
          for (let i = 0; i < maxIndex; i++) {
            // Police case number added
            if (i === oldPoliceCaseNumbers.length) {
              break
            }

            // Police case number deleted
            if (
              i === newPoliceCaseNumbers.length ||
              (newPoliceCaseNumbers[i] !== oldPoliceCaseNumbers[i] &&
                newPoliceCaseNumbers.length < oldPoliceCaseNumbers.length)
            ) {
              for (const caseFile of theCase.caseFiles) {
                if (caseFile.policeCaseNumber === oldPoliceCaseNumbers[i]) {
                  await this.fileService.deleteCaseFile(caseFile, transaction)
                }
              }

              break
            }

            // Police case number unchanged
            if (newPoliceCaseNumbers[i] === oldPoliceCaseNumbers[i]) {
              continue
            }

            // Police case number changed
            for (const caseFile of theCase.caseFiles) {
              if (caseFile.policeCaseNumber === oldPoliceCaseNumbers[i]) {
                await this.fileService.updateCaseFile(
                  theCase.id,
                  caseFile.id,
                  { policeCaseNumber: newPoliceCaseNumbers[i] },
                  transaction,
                )
              }
            }

            break
          }
        }
      })
      .then(() => {
        if (returnUpdatedCase) {
          return this.findById(theCase.id)
        }
      })
  }

  async getRequestPdf(theCase: Case): Promise<Buffer> {
    await this.refreshFormatMessage()

    return getRequestPdfAsBuffer(theCase, this.formatMessage)
  }

  async getCourtRecordPdf(theCase: Case, user: TUser): Promise<Buffer> {
    try {
      return await this.awsS3Service.getObject(
        `generated/${theCase.id}/courtRecord.pdf`,
      )
    } catch (error) {
      this.logger.info(
        `The court record for case ${theCase.id} was not found in AWS S3`,
        { error },
      )
    }

    await this.refreshFormatMessage()

    return getCourtRecordPdfAsBuffer(theCase, this.formatMessage, user)
  }

  async getCaseFilesPdf(
    theCase: Case,
    policeCaseNumber: string,
  ): Promise<Buffer> {
    await this.refreshFormatMessage()

    const caseFiles = theCase.caseFiles
      ?.filter(
        (caseFile) =>
          caseFile.policeCaseNumber === policeCaseNumber &&
          caseFile.category === CaseFileCategory.CASE_FILE &&
          caseFile.type === 'application/pdf' &&
          caseFile.key &&
          caseFile.chapter !== null &&
          caseFile.orderWithinChapter !== null,
      )
      ?.sort(
        (caseFile1, caseFile2) =>
          (caseFile1.chapter ?? 0) - (caseFile2.chapter ?? 0) ||
          (caseFile1.orderWithinChapter ?? 0) -
            (caseFile2.orderWithinChapter ?? 0),
      )
      ?.map((caseFile) => async () => {
        const buffer = await this.awsS3Service
          .getObject(caseFile.key ?? '')
          .catch((reason) => {
            // Tolerate failure, but log error
            this.logger.error(
              `Unable to get file ${caseFile.id} of case ${theCase.id} from AWS S3`,
              { reason },
            )
          })

        return {
          chapter: caseFile.chapter as number,
          date: caseFile.displayDate ?? caseFile.created,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          buffer: buffer ?? undefined,
        }
      })

    return createCaseFilesRecord(
      theCase,
      policeCaseNumber,
      caseFiles ?? [],
      this.formatMessage,
    )
  }

  async getRulingPdf(theCase: Case, useSigned = true): Promise<Buffer> {
    if (useSigned) {
      try {
        return await this.awsS3Service.getObject(
          `generated/${theCase.id}/ruling.pdf`,
        )
      } catch (error) {
        this.logger.info(
          `The ruling for case ${theCase.id} was not found in AWS S3`,
          { error },
        )
      }
    }

    await this.refreshFormatMessage()

    return getRulingPdfAsBuffer(theCase, this.formatMessage)
  }

  async getCustodyPdf(theCase: Case): Promise<Buffer> {
    await this.refreshFormatMessage()

    return getCustodyNoticePdfAsBuffer(theCase, this.formatMessage)
  }

  async requestCourtRecordSignature(
    theCase: Case,
    user: TUser,
  ): Promise<SigningServiceResponse> {
    await this.refreshFormatMessage()

    const pdf = await getCourtRecordPdfAsString(theCase, this.formatMessage)

    return this.signingService
      .requestSignature(
        user.mobileNumber ?? '',
        'Undirrita skjal - Öryggistala',
        user.name ?? '',
        'Ísland',
        'courtRecord.pdf',
        pdf,
      )
      .catch((error) => {
        this.eventService.postErrorEvent(
          'Failed to request a court record signature',
          {
            caseId: theCase.id,
            policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
            courtCaseNumber: theCase.courtCaseNumber,
            actor: user.name,
            institution: user.institution?.name,
          },
          error,
        )

        throw error
      })
  }

  async getCourtRecordSignatureConfirmation(
    theCase: Case,
    user: TUser,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestCourtRecordSignature

    try {
      const courtRecordPdf = await this.signingService.waitForSignature(
        'courtRecord.pdf',
        documentToken,
      )

      this.awsS3Service
        .putObject(`generated/${theCase.id}/courtRecord.pdf`, courtRecordPdf)
        .catch((reason) => {
          // Tolerate failure, but log error
          this.logger.error(
            `Failed to upload signed court record pdf to AWS S3 for case ${theCase.id}`,
            { reason },
          )
        })
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to get a court record signature confirmation',
        {
          caseId: theCase.id,
          policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
          courtCaseNumber: theCase.courtCaseNumber,
          actor: user.name,
          institution: user.institution?.name,
        },
        error as Error,
      )

      if (error instanceof DokobitError) {
        return {
          documentSigned: false,
          code: error.code,
          message: error.message,
        }
      }

      throw error
    }

    // TODO: UpdateCaseDto does not contain courtRecordSignatoryId and courtRecordSignatureDate - create a new type for CaseService.update
    await this.update(
      theCase,
      {
        courtRecordSignatoryId: user.id,
        courtRecordSignatureDate: nowFactory(),
      } as UpdateCaseDto,
      false,
    )

    return { documentSigned: true }
  }

  async requestRulingSignature(theCase: Case): Promise<SigningServiceResponse> {
    await this.refreshFormatMessage()

    const pdf = await getRulingPdfAsString(theCase, this.formatMessage)

    return this.signingService
      .requestSignature(
        theCase.judge?.mobileNumber ?? '',
        'Undirrita skjal - Öryggistala',
        theCase.judge?.name ?? '',
        'Ísland',
        'ruling.pdf',
        pdf,
      )
      .catch((error) => {
        this.eventService.postErrorEvent(
          'Failed to request a ruling signature',
          {
            caseId: theCase.id,
            policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
            courtCaseNumber: theCase.courtCaseNumber,
            actor: theCase.judge?.name,
            institution: theCase.judge?.institution?.name,
          },
          error,
        )

        throw error
      })
  }

  async getRulingSignatureConfirmation(
    theCase: Case,
    user: TUser,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestRulingSignature
    try {
      const signedPdf = await this.signingService.waitForSignature(
        'ruling.pdf',
        documentToken,
      )
      const awsSuccess = await this.uploadSignedRulingPdfToS3(
        theCase,
        signedPdf,
      )

      if (!awsSuccess) {
        return { documentSigned: false, message: 'Failed to upload to S3' }
      }

      // TODO: UpdateCaseDto does not contain rulingDate - create a new type for CaseService.update
      const newRulingDate = nowFactory()
      await this.update(
        theCase,
        {
          rulingDate: newRulingDate,
          ...(!theCase.rulingDate
            ? {}
            : {
                rulingModifiedHistory: formatRulingModifiedHistory(
                  theCase.rulingModifiedHistory,
                  newRulingDate,
                  theCase.judge?.name,
                  theCase.judge?.title,
                ),
              }),
        } as UpdateCaseDto,
        false,
      )

      // No need to wait for now, but may consider including this in a transaction with the database update later
      this.addCompletedCaseMessagesToQueue(theCase.id)

      return { documentSigned: true }
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to get a ruling signature confirmation',
        {
          caseId: theCase.id,
          policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
          courtCaseNumber: theCase.courtCaseNumber,
          actor: user.name,
          institution: user.institution?.name,
        },
        error as Error,
      )

      if (error instanceof DokobitError) {
        return {
          documentSigned: false,
          code: error.code,
          message: error.message,
        }
      }

      throw error
    }
  }

  async extend(theCase: Case, user: TUser): Promise<Case> {
    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          {
            origin: theCase.origin,
            type: theCase.type,
            description: theCase.description,
            policeCaseNumbers: theCase.policeCaseNumbers,
            defenderName: theCase.defenderName,
            defenderNationalId: theCase.defenderNationalId,
            defenderEmail: theCase.defenderEmail,
            defenderPhoneNumber: theCase.defenderPhoneNumber,
            leadInvestigator: theCase.leadInvestigator,
            courtId: theCase.courtId,
            translator: theCase.translator,
            lawsBroken: theCase.lawsBroken,
            legalBasis: theCase.legalBasis,
            legalProvisions: theCase.legalProvisions,
            requestedCustodyRestrictions: theCase.requestedCustodyRestrictions,
            caseFacts: theCase.caseFacts,
            legalArguments: theCase.legalArguments,
            requestProsecutorOnlySession: theCase.requestProsecutorOnlySession,
            prosecutorOnlySessionRequest: theCase.prosecutorOnlySessionRequest,
            parentCaseId: theCase.id,
            initialRulingDate: theCase.initialRulingDate ?? theCase.rulingDate,
            creatingProsecutorId: user.id,
            prosecutorId: user.id,
          } as CreateCaseDto,
          transaction,
        )

        if (theCase.defendants && theCase.defendants?.length > 0) {
          await Promise.all(
            theCase.defendants?.map((defendant) =>
              this.defendantService.create(
                caseId,
                {
                  noNationalId: defendant.noNationalId,
                  nationalId: defendant.nationalId,
                  name: defendant.name,
                  gender: defendant.gender,
                  address: defendant.address,
                  citizenship: defendant.citizenship,
                },
                transaction,
              ),
            ),
          )
        }

        return caseId
      })
      .then((caseId) => this.findById(caseId))
  }

  async createCourtCase(theCase: Case, user: TUser): Promise<Case> {
    const courtCaseNumber = await this.courtService.createCourtCase(
      user,
      theCase.id,
      theCase.courtId,
      theCase.type,
      theCase.policeCaseNumbers,
      Boolean(theCase.parentCaseId),
      theCase.indictmentSubtypes,
    )

    const updatedCase = (await this.update(
      theCase,
      { courtCaseNumber },
      true,
    )) as Case

    // No need to wait for now, but may consider including this in a transaction with the database update later
    this.addCaseConnectedToCourtCaseMessagesToQueue(updatedCase)

    return updatedCase
  }
}
