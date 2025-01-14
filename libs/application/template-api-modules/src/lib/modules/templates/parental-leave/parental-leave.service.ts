import { Inject, Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import cloneDeep from 'lodash/cloneDeep'

import type { Attachment, Period } from '@island.is/clients/vmst'
import {
  ParentalLeaveApi,
  ApplicationInformationApi,
} from '@island.is/clients/vmst'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicationConfigurations,
  Application,
} from '@island.is/application/types'
import {
  getApplicationAnswers,
  getAvailableRightsInDays,
  getAvailablePersonalRightsInDays,
  YES,
  NO,
  StartDateOptions,
  UnEmployedBenefitTypes,
  PARENTAL_LEAVE,
  PARENTAL_GRANT_STUDENTS,
  getMultipleBirthsDays,
  SINGLE,
  getAdditionalSingleParentRightsInDays,
  getApplicationExternalData,
} from '@island.is/application/templates/parental-leave'

import { SharedTemplateApiService } from '../../shared'
import {
  BaseTemplateAPIModuleConfig,
  TemplateApiModuleActionProps,
} from '../../../types'
import {
  generateAssignOtherParentApplicationEmail,
  generateAssignEmployerApplicationEmail,
  generateOtherParentRejected,
  generateEmployerRejected,
  generateApplicationApprovedByEmployerEmail,
  generateApplicationApprovedByEmployerToEmployerEmail,
} from './emailGenerators'
import {
  generateAssignEmployerApplicationSms,
  generateAssignOtherParentApplicationSms,
  generateEmployerRejectedApplicationSms,
  generateOtherParentRejectedApplicationSms,
} from './smsGenerators'
import {
  transformApplicationToParentalLeaveDTO,
  getRatio,
  getRightsCode,
} from './parental-leave.utils'
import { apiConstants } from './constants'
import { ConfigService } from '@nestjs/config'
import { getConfigValue } from '../../shared/shared.utils'

interface VMSTError {
  type: string
  title: string
  status: number
  traceId: string
  errors: Record<string, string[]>
}

type YesOrNo = typeof NO | typeof YES
interface AnswerPeriod {
  startDate: string
  endDate: string
  ratio: string
  firstPeriodStart?: string
  useLength?: YesOrNo
  daysToUse?: string
  rawIndex?: number
  rightCodePeriod?: string
}

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'
const SIX_MONTHS_IN_SECONDS_EXPIRES = 6 * 30 * 24 * 60 * 60
const df = 'yyyy-MM-dd'

@Injectable()
export class ParentalLeaveService {
  s3 = new S3()

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private parentalLeaveApi: ParentalLeaveApi,
    private applicationInformationAPI: ApplicationInformationApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(APPLICATION_ATTACHMENT_BUCKET)
    private readonly attachmentBucket: string,
    private readonly configService: ConfigService<BaseTemplateAPIModuleConfig>,
  ) {}

  private parseErrors(e: Error | VMSTError) {
    if (e instanceof Error) {
      return e.message
    }

    return {
      message: Object.entries(e.errors).map(([, values]) => values.join(', ')),
    }
  }

  async assignOtherParent({ application }: TemplateApiModuleActionProps) {
    const { otherParentPhoneNumber } = getApplicationAnswers(
      application.answers,
    )

    await this.sharedTemplateAPIService.sendEmail(
      generateAssignOtherParentApplicationEmail,
      application,
    )

    if (otherParentPhoneNumber) {
      const clientLocationOrigin = getConfigValue(
        this.configService,
        'clientLocationOrigin',
      ) as string
      const link = `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`

      await this.sharedTemplateAPIService.sendSms(
        () => generateAssignOtherParentApplicationSms(application, link),
        application,
      )
    }
  }

  async notifyApplicantOfRejectionFromOtherParent({
    application,
  }: TemplateApiModuleActionProps) {
    const { applicantPhoneNumber } = getApplicationAnswers(application.answers)

    await this.sharedTemplateAPIService.sendEmail(
      generateOtherParentRejected,
      application,
    )

    if (applicantPhoneNumber) {
      const clientLocationOrigin = getConfigValue(
        this.configService,
        'clientLocationOrigin',
      ) as string

      const link = `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`

      await this.sharedTemplateAPIService.sendSms(
        () => generateOtherParentRejectedApplicationSms(application, link),
        application,
      )
    }
  }

  async notifyApplicantOfRejectionFromEmployer({
    application,
  }: TemplateApiModuleActionProps) {
    const { applicantPhoneNumber } = getApplicationAnswers(application.answers)

    await this.sharedTemplateAPIService.sendEmail(
      generateEmployerRejected,
      application,
    )

    if (applicantPhoneNumber) {
      const clientLocationOrigin = getConfigValue(
        this.configService,
        'clientLocationOrigin',
      ) as string

      const link = `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`

      await this.sharedTemplateAPIService.sendSms(
        () => generateEmployerRejectedApplicationSms(application, link),
        application,
      )
    }
  }

  async assignEmployer({ application }: TemplateApiModuleActionProps) {
    const { employerPhoneNumber } = getApplicationAnswers(application.answers)

    const token = await this.sharedTemplateAPIService.createAssignToken(
      application,
      SIX_MONTHS_IN_SECONDS_EXPIRES,
    )

    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignEmployerApplicationEmail,
      application,
      token,
    )

    // send confirmation sms to employer
    if (employerPhoneNumber) {
      await this.sharedTemplateAPIService.assignApplicationThroughSms(
        generateAssignEmployerApplicationSms,
        application,
        token,
      )
    }
  }

  async getPdf(application: Application, index = 0, fileUpload: string) {
    try {
      const filename = getValueViaPath(
        application.answers,
        fileUpload + `[${index}].key`,
      )

      const Key = `${application.id}/${filename}`
      const file = await this.s3
        .getObject({ Bucket: this.attachmentBucket, Key })
        .promise()
      const fileContent = file.Body as Buffer

      if (!fileContent) {
        throw new Error('File content was undefined')
      }

      return fileContent.toString('base64')
    } catch (e) {
      this.logger.error('Cannot get ' + fileUpload + ' attachment', { e })
      throw new Error('Failed to get the ' + fileUpload + ' attachment')
    }
  }

  async getAttachments(application: Application): Promise<Attachment[]> {
    const attachments: Attachment[] = []
    const {
      isSelfEmployed,
      applicationType,
      otherParent,
    } = getApplicationAnswers(application.answers)

    if (isSelfEmployed === YES && applicationType === PARENTAL_LEAVE) {
      const selfEmployedPdfs = (await getValueViaPath(
        application.answers,
        'fileUpload.selfEmployedFile',
      )) as unknown[]

      if (selfEmployedPdfs?.length) {
        for (let i = 0; i <= selfEmployedPdfs.length - 1; i++) {
          const pdf = await this.getPdf(
            application,
            i,
            'fileUpload.selfEmployedFile',
          )

          attachments.push({
            attachmentType: apiConstants.attachments.selfEmployed,
            attachmentBytes: pdf,
          })
        }
      } else {
        const oldSelfEmployedPdfs = (await getValueViaPath(
          application.answers,
          'employer.selfEmployed.file',
        )) as unknown[]

        if (oldSelfEmployedPdfs?.length) {
          for (let i = 0; i <= oldSelfEmployedPdfs.length - 1; i++) {
            const pdf = await this.getPdf(
              application,
              i,
              'employer.selfEmployed.file',
            )

            attachments.push({
              attachmentType: apiConstants.attachments.selfEmployed,
              attachmentBytes: pdf,
            })
          }
        }
      }
    } else if (applicationType === PARENTAL_GRANT_STUDENTS) {
      const stuydentPdfs = (await getValueViaPath(
        application.answers,
        'fileUpload.studentFile',
      )) as unknown[]

      if (stuydentPdfs?.length) {
        for (let i = 0; i <= stuydentPdfs.length - 1; i++) {
          const pdf = await this.getPdf(
            application,
            i,
            'fileUpload.studentFile',
          )

          attachments.push({
            attachmentType: apiConstants.attachments.student,
            attachmentBytes: pdf,
          })
        }
      }
    }

    if (otherParent === SINGLE) {
      const singleParentPdfs = (await getValueViaPath(
        application.answers,
        'fileUpload.singleParent',
      )) as unknown[]

      if (singleParentPdfs?.length) {
        for (let i = 0; i <= singleParentPdfs.length - 1; i++) {
          const pdf = await this.getPdf(
            application,
            i,
            'fileUpload.singleParent',
          )

          attachments.push({
            attachmentType: apiConstants.attachments.artificialInsemination,
            attachmentBytes: pdf,
          })
        }
      }
    }

    const {
      isRecivingUnemploymentBenefits,
      unemploymentBenefits,
    } = getApplicationAnswers(application.answers)
    if (
      isRecivingUnemploymentBenefits === YES &&
      (unemploymentBenefits === UnEmployedBenefitTypes.union ||
        unemploymentBenefits == UnEmployedBenefitTypes.healthInsurance)
    ) {
      const benefitsPdfs = (await getValueViaPath(
        application.answers,
        'fileUpload.benefitsFile',
      )) as unknown[]

      if (benefitsPdfs?.length) {
        for (let i = 0; i <= benefitsPdfs.length - 1; i++) {
          const pdf = await this.getPdf(
            application,
            i,
            'fileUpload.benefitsFile',
          )

          attachments.push({
            attachmentType: apiConstants.attachments.unEmploymentBenefits,
            attachmentBytes: pdf,
          })
        }
      }
    }

    const genericPdfs = (await getValueViaPath(
      application.answers,
      'fileUpload.file',
    )) as unknown[]

    if (genericPdfs?.length) {
      for (let i = 0; i <= genericPdfs.length - 1; i++) {
        const pdf = await this.getPdf(application, i, 'fileUpload.file')

        attachments.push({
          attachmentType: apiConstants.attachments.other,
          attachmentBytes: pdf,
        })
      }
    }

    return attachments
  }

  async getCalculatedPeriod(
    nationalRegistryId: string,
    startDate: Date,
    startDateString: string | undefined,
    periodLength: number,
    period: AnswerPeriod,
    rightsCodePeriod: string,
  ): Promise<Period> {
    const isUsingNumberOfDays = period.daysToUse !== undefined
    const getPeriodEndDate = await this.parentalLeaveApi.parentalLeaveGetPeriodEndDate(
      {
        nationalRegistryId,
        startDate: startDate,
        length: String(periodLength),
        percentage: period.ratio,
      },
    )

    if (getPeriodEndDate.periodEndDate === undefined) {
      throw new Error(
        `Could not calculate end date of period starting ${period.startDate} and using ${periodLength} days of rights`,
      )
    }

    // Add the period rights
    return {
      from: startDateString ?? format(startDate, df),
      to: format(getPeriodEndDate.periodEndDate, df),
      ratio: getRatio(
        period.ratio,
        periodLength.toString(),
        isUsingNumberOfDays,
      ),
      approved: false,
      paid: false,
      rightsCodePeriod: rightsCodePeriod,
    }
  }

  async createPeriodsDTO(
    application: Application,
    nationalRegistryId: string,
  ): Promise<Period[]> {
    const {
      periods: originalPeriods,
      firstPeriodStart,
      applicationType,
      otherParent,
    } = getApplicationAnswers(application.answers)

    const { applicationFundId } = getApplicationExternalData(
      application.externalData,
    )

    const answers = cloneDeep(originalPeriods).sort((a, b) => {
      const dateA = new Date(a.startDate)
      const dateB = new Date(b.startDate)

      return dateA.getTime() - dateB.getTime()
    })

    let vmstRightCodePeriod = null
    if (applicationFundId) {
      try {
        const VMSTperiods = await this.applicationInformationAPI.applicationGetApplicationInformation(
          {
            applicationId: application.id,
          },
        )

        if (VMSTperiods?.periods) {
          vmstRightCodePeriod = VMSTperiods.periods[0].rightsCodePeriod
        }
      } catch (e) {
        this.logger.warn(
          `Could not fetch applicationInformation on applicationId: {applicationId} with error: {error}`
            .replace(`{${'applicationId'}}`, application.id)
            .replace(`{${'error'}}`, e),
        )
      }
    }

    const periods: Period[] = []
    const maximumDaysToSpend = getAvailableRightsInDays(application)
    const maximumPersonalDaysToSpend = getAvailablePersonalRightsInDays(
      application,
    )
    const maximumMultipleBirthsDaysToSpend = getMultipleBirthsDays(application)
    const maximumAdditionalSingleParentDaysToSpend = getAdditionalSingleParentRightsInDays(
      application,
    )
    const maximumDaysBeforeUsingTransferRights =
      maximumPersonalDaysToSpend + maximumMultipleBirthsDaysToSpend
    const maximumSingleParentDaysBeforeUsingMultipleBirthsRights =
      maximumPersonalDaysToSpend + maximumAdditionalSingleParentDaysToSpend

    const mulitpleBirthsRights =
      applicationType === PARENTAL_LEAVE
        ? apiConstants.rights.multipleBirthsOrlofRightsId
        : apiConstants.rights.multipleBirthsGrantRightsId

    const isActualDateOfBirth =
      firstPeriodStart === StartDateOptions.ACTUAL_DATE_OF_BIRTH
    let numberOfDaysAlreadySpent = 0
    const basicRightCodePeriod =
      vmstRightCodePeriod ?? getRightsCode(application)

    for (const [index, period] of answers.entries()) {
      const isFirstPeriod = index === 0
      const isUsingNumberOfDays = period.daysToUse !== undefined

      // If a period doesn't have both startDate or endDate we skip it
      if (!isFirstPeriod && (!period.startDate || !period.endDate)) {
        continue
      }

      const startDate = new Date(period.startDate)
      const endDate = new Date(period.endDate)
      const useLength = period.useLength

      let periodLength = 0

      if (isUsingNumberOfDays) {
        periodLength = Number(period.daysToUse)
      } else {
        const getPeriodLength = await this.parentalLeaveApi.parentalLeaveGetPeriodLength(
          { nationalRegistryId, startDate, endDate, percentage: period.ratio },
        )

        if (getPeriodLength.periodLength === undefined) {
          throw new Error(
            `Could not calculate length of period from ${period.startDate} to ${period.endDate}`,
          )
        }

        periodLength = Number(getPeriodLength.periodLength ?? 0)
      }

      const numberOfDaysSpentAfterPeriod =
        numberOfDaysAlreadySpent + periodLength

      if (numberOfDaysSpentAfterPeriod > maximumDaysToSpend) {
        throw new Error(
          `Period from ${period.startDate} to ${period.endDate} will exceed rights (${numberOfDaysSpentAfterPeriod} > ${maximumDaysToSpend})`,
        )
      }

      const isUsingAdditionalRights =
        numberOfDaysAlreadySpent >=
        maximumDaysToSpend - maximumAdditionalSingleParentDaysToSpend
      const willSingleParentStartToUseAdditionalRightsWithPeriod =
        numberOfDaysSpentAfterPeriod >
        maximumDaysToSpend - maximumAdditionalSingleParentDaysToSpend
      const isSingleParentUsingMultipleBirthsRights =
        numberOfDaysAlreadySpent >=
        maximumSingleParentDaysBeforeUsingMultipleBirthsRights
      const isSingleParentUsingPersonalRights =
        numberOfDaysAlreadySpent < maximumPersonalDaysToSpend
      const willSingleParentStartUsingMultipleBirthsRight =
        numberOfDaysSpentAfterPeriod >
        maximumPersonalDaysToSpend + maximumAdditionalSingleParentDaysToSpend

      const isUsingMultipleBirthsRights =
        numberOfDaysAlreadySpent >= maximumPersonalDaysToSpend
      const willStartToUseMultipleBirthsRightsWithPeriod =
        numberOfDaysSpentAfterPeriod > maximumPersonalDaysToSpend
      const isUsingTransferredRights =
        numberOfDaysAlreadySpent >= maximumDaysBeforeUsingTransferRights
      const willStartToUseTransferredRightsWithPeriod =
        numberOfDaysSpentAfterPeriod > maximumDaysBeforeUsingTransferRights

      /*
        ** Priority rights:
        ** 1. personal rights
        ** 2. single parent rights
        ** 3. common rights ( from multiple births)
        ** 4. transfer rights ( from other parent)
        We have to finished first one before go to next and so on
        */
      if (
        !isUsingTransferredRights &&
        !willStartToUseTransferredRightsWithPeriod &&
        !isUsingMultipleBirthsRights &&
        !willStartToUseMultipleBirthsRightsWithPeriod &&
        !isUsingAdditionalRights &&
        !willSingleParentStartToUseAdditionalRightsWithPeriod
      ) {
        // We know its a normal period and it will not exceed personal rights
        periods.push({
          from:
            isFirstPeriod && isActualDateOfBirth && useLength === YES
              ? apiConstants.actualDateOfBirthMonths
              : isFirstPeriod && isActualDateOfBirth
              ? apiConstants.actualDateOfBirth
              : period.startDate,
          to: period.endDate,
          ratio: getRatio(
            period.ratio,
            periodLength.toString(),
            isUsingNumberOfDays,
          ),
          approved: false,
          paid: false,
          rightsCodePeriod: basicRightCodePeriod,
        })
      } else if (otherParent === SINGLE) {
        // single parent
        // Only using multiple births right
        if (isSingleParentUsingMultipleBirthsRights) {
          periods.push({
            from: period.startDate,
            to: period.endDate,
            ratio: getRatio(
              period.ratio,
              periodLength.toString(),
              isUsingNumberOfDays,
            ),
            approved: false,
            paid: false,
            rightsCodePeriod: mulitpleBirthsRights,
          })
        } else {
          /*
           ** If we reach here, we have a period that will have:
           ** 1: Personal rights and additional rights
           ** 2: Personal, additional and multiplebirths rights
           ** 3: Additional rights and multipleBirths rights
           ** 4: Addtitonal rights
           */
          if (maximumMultipleBirthsDaysToSpend === 0) {
            if (isSingleParentUsingPersonalRights) {
              // 1. Personal rights and additional rights
              // Personal rights
              const daysLeftOfPersonalRights =
                maximumPersonalDaysToSpend - numberOfDaysAlreadySpent
              const fromDate =
                isFirstPeriod && isActualDateOfBirth && useLength === YES
                  ? apiConstants.actualDateOfBirthMonths
                  : isFirstPeriod && isActualDateOfBirth
                  ? apiConstants.actualDateOfBirth
                  : period.startDate

              const personalPeriod = await this.getCalculatedPeriod(
                nationalRegistryId,
                startDate,
                fromDate,
                daysLeftOfPersonalRights,
                period,
                basicRightCodePeriod,
              )

              periods.push(personalPeriod)

              // Additional rights
              const additionalSingleParentPeriodStartDate = addDays(
                new Date(personalPeriod.to),
                1,
              )
              const lengthOfPeriodUsingAdditionalSingleParentDays =
                periodLength - daysLeftOfPersonalRights

              const additionalPeriod = await this.getCalculatedPeriod(
                nationalRegistryId,
                additionalSingleParentPeriodStartDate,
                undefined,
                lengthOfPeriodUsingAdditionalSingleParentDays,
                period,
                apiConstants.rights.artificialInseminationRightsId,
              )

              periods.push(additionalPeriod)
            } else {
              // 4. Additional rights
              periods.push({
                from: period.startDate,
                to: period.endDate,
                ratio: getRatio(
                  period.ratio,
                  periodLength.toString(),
                  isUsingNumberOfDays,
                ),
                approved: false,
                paid: false,
                rightsCodePeriod:
                  apiConstants.rights.artificialInseminationRightsId,
              })
            }
          } else {
            if (isSingleParentUsingPersonalRights) {
              // 2. Personal, additional and multipleBirths rights
              // Personal rights
              const daysLeftOfPersonalRights =
                maximumPersonalDaysToSpend - numberOfDaysAlreadySpent
              const fromDate =
                isFirstPeriod && isActualDateOfBirth && useLength === YES
                  ? apiConstants.actualDateOfBirthMonths
                  : isFirstPeriod && isActualDateOfBirth
                  ? apiConstants.actualDateOfBirth
                  : period.startDate

              const personalPeriod = await this.getCalculatedPeriod(
                nationalRegistryId,
                startDate,
                fromDate,
                daysLeftOfPersonalRights,
                period,
                basicRightCodePeriod,
              )

              periods.push(personalPeriod)

              const additionalSingleParentPeriodStartDate = addDays(
                new Date(personalPeriod.to),
                1,
              )

              // Additional rights
              if (willSingleParentStartUsingMultipleBirthsRight) {
                const additionalPeriod = await this.getCalculatedPeriod(
                  nationalRegistryId,
                  additionalSingleParentPeriodStartDate,
                  undefined,
                  maximumAdditionalSingleParentDaysToSpend,
                  period,
                  apiConstants.rights.artificialInseminationRightsId,
                )

                periods.push(additionalPeriod)

                // Common rights (multiple births)
                const commonPeriodStartDate = addDays(
                  new Date(additionalPeriod.to),
                  1,
                )
                const lengthOfPeriodUsingCommonDays =
                  periodLength -
                  daysLeftOfPersonalRights -
                  maximumAdditionalSingleParentDaysToSpend
                const commonPeriod = await this.getCalculatedPeriod(
                  nationalRegistryId,
                  commonPeriodStartDate,
                  undefined,
                  lengthOfPeriodUsingCommonDays,
                  period,
                  mulitpleBirthsRights,
                )

                periods.push(commonPeriod)
              } else {
                // Additional rights
                const lengthOfPeriodUsingAdditionalDays =
                  periodLength - daysLeftOfPersonalRights
                const additionalPeriod = await this.getCalculatedPeriod(
                  nationalRegistryId,
                  additionalSingleParentPeriodStartDate,
                  undefined,
                  lengthOfPeriodUsingAdditionalDays,
                  period,
                  apiConstants.rights.artificialInseminationRightsId,
                )
                periods.push(additionalPeriod)
              }
            } else {
              // 3. Additional rights and multipleBirths rights
              if (willSingleParentStartUsingMultipleBirthsRight) {
                // Additional rights
                const lengthOfPeriodUsingAdditionalSingleParentDays =
                  maximumPersonalDaysToSpend +
                  maximumAdditionalSingleParentDaysToSpend -
                  numberOfDaysAlreadySpent

                const additionalPeriod = await this.getCalculatedPeriod(
                  nationalRegistryId,
                  startDate,
                  undefined,
                  lengthOfPeriodUsingAdditionalSingleParentDays,
                  period,
                  apiConstants.rights.artificialInseminationRightsId,
                )

                periods.push(additionalPeriod)

                // Common rights (multiple births)
                const commonPeriodStartDate = addDays(
                  new Date(additionalPeriod.to),
                  1,
                )
                const lengthOfPeriodUsingCommonDays =
                  periodLength - lengthOfPeriodUsingAdditionalSingleParentDays
                const commonPeriod = await this.getCalculatedPeriod(
                  nationalRegistryId,
                  commonPeriodStartDate,
                  undefined,
                  lengthOfPeriodUsingCommonDays,
                  period,
                  mulitpleBirthsRights,
                )

                periods.push(commonPeriod)
              } else {
                // Only additional rights
                periods.push({
                  from: period.startDate,
                  to: period.endDate,
                  ratio: getRatio(
                    period.ratio,
                    periodLength.toString(),
                    isUsingNumberOfDays,
                  ),
                  approved: false,
                  paid: false,
                  rightsCodePeriod:
                    apiConstants.rights.artificialInseminationRightsId,
                })
              }
            }
          }
        }
      } else {
        // has other parent
        // We know all of the period will be using transferred rights
        if (isUsingTransferredRights) {
          periods.push({
            from: period.startDate,
            to: period.endDate,
            ratio: getRatio(
              period.ratio,
              periodLength.toString(),
              isUsingNumberOfDays,
            ),
            approved: false,
            paid: false,
            rightsCodePeriod: apiConstants.rights.receivingRightsId,
          })
        } else if (willStartToUseTransferredRightsWithPeriod) {
          /*
           ** If we reach here, we have a period that will have to be split into
           ** two, a part of it will be using personal/personal rights and the other part
           ** will be using transferred rights
           ** Case:
           ** 1. Period includes personal rights and transfer rights
           ** 2. Period includes common rights and transfer rights
           ** 3. Period includes personal rights, common rights and transfer rights
           */

          // 1. Period includes personal and transfer rights
          if (maximumMultipleBirthsDaysToSpend === 0) {
            // Personal
            const daysLeftOfPersonalRights =
              maximumPersonalDaysToSpend - numberOfDaysAlreadySpent
            const personalPeriod = await this.getCalculatedPeriod(
              nationalRegistryId,
              startDate,
              undefined,
              daysLeftOfPersonalRights,
              period,
              basicRightCodePeriod,
            )

            periods.push(personalPeriod)

            // Transferred
            const transferredPeriodStartDate = addDays(
              new Date(personalPeriod.to),
              1,
            )
            const lengthOfPeriodUsingTransferredDays =
              periodLength - daysLeftOfPersonalRights
            const transferredPeriod = await this.getCalculatedPeriod(
              nationalRegistryId,
              transferredPeriodStartDate,
              undefined,
              lengthOfPeriodUsingTransferredDays,
              period,
              apiConstants.rights.receivingRightsId,
            )

            periods.push(transferredPeriod)
          }
          // 2. Period includes common and transfer rights
          else if (maximumPersonalDaysToSpend < numberOfDaysAlreadySpent) {
            // Common (multiple births)
            const daysLeftOfCommonRights =
              maximumDaysBeforeUsingTransferRights - numberOfDaysAlreadySpent
            const commonPeriod = await this.getCalculatedPeriod(
              nationalRegistryId,
              startDate,
              undefined,
              daysLeftOfCommonRights,
              period,
              mulitpleBirthsRights,
            )

            periods.push(commonPeriod)

            // Transferred
            const transferredPeriodStartDate = addDays(
              new Date(commonPeriod.to),
              1,
            )
            const lengthOfPeriodUsingTransferredDays =
              periodLength - daysLeftOfCommonRights
            const transferredPeriod = await this.getCalculatedPeriod(
              nationalRegistryId,
              transferredPeriodStartDate,
              undefined,
              lengthOfPeriodUsingTransferredDays,
              period,
              apiConstants.rights.receivingRightsId,
            )

            periods.push(transferredPeriod)
          }
          // 3. Period includes personal, common and transfer rights
          else {
            // Personal
            const daysLeftOfPersonalRights =
              maximumPersonalDaysToSpend - numberOfDaysAlreadySpent
            const fromDate =
              isFirstPeriod && isActualDateOfBirth && useLength === YES
                ? apiConstants.actualDateOfBirthMonths
                : isFirstPeriod && isActualDateOfBirth
                ? apiConstants.actualDateOfBirth
                : period.startDate
            const personalPeriod = await this.getCalculatedPeriod(
              nationalRegistryId,
              startDate,
              fromDate,
              daysLeftOfPersonalRights,
              period,
              basicRightCodePeriod,
            )

            periods.push(personalPeriod)

            // Common
            const commonPeriodStartDate = addDays(
              new Date(personalPeriod.to),
              1,
            )
            const commonPeriod = await this.getCalculatedPeriod(
              nationalRegistryId,
              commonPeriodStartDate,
              undefined,
              maximumMultipleBirthsDaysToSpend,
              period,
              mulitpleBirthsRights,
            )

            periods.push(commonPeriod)

            // Transferred
            const transferredPeriodStartDate = addDays(
              new Date(commonPeriod.to),
              1,
            )
            const lengthOfPeriodUsingTransferredDays =
              periodLength -
              daysLeftOfPersonalRights -
              maximumMultipleBirthsDaysToSpend
            const transferredPeriod = await this.getCalculatedPeriod(
              nationalRegistryId,
              transferredPeriodStartDate,
              undefined,
              lengthOfPeriodUsingTransferredDays,
              period,
              apiConstants.rights.receivingRightsId,
            )

            periods.push(transferredPeriod)
          }
        } else if (isUsingMultipleBirthsRights) {
          // Applicant used upp his/her basic rights and started to use 'common' rights
          // and has not reach transfer rights
          periods.push({
            from: period.startDate,
            to: period.endDate,
            ratio: getRatio(
              period.ratio,
              periodLength.toString(),
              isUsingNumberOfDays,
            ),
            approved: false,
            paid: false,
            rightsCodePeriod: mulitpleBirthsRights,
          })
        } else {
          // If we reach here then there is personal rights mix with common rights
          // Personal
          const daysLeftOfPersonalRights =
            maximumPersonalDaysToSpend - numberOfDaysAlreadySpent
          const fromDate =
            isFirstPeriod && isActualDateOfBirth && useLength === YES
              ? apiConstants.actualDateOfBirthMonths
              : isFirstPeriod && isActualDateOfBirth
              ? apiConstants.actualDateOfBirth
              : period.startDate
          const personalPeriod = await this.getCalculatedPeriod(
            nationalRegistryId,
            startDate,
            fromDate,
            daysLeftOfPersonalRights,
            period,
            basicRightCodePeriod,
          )

          periods.push(personalPeriod)

          // Common (multiple births)
          const commonPeriodStartDate = addDays(new Date(personalPeriod.to), 1)
          const lengthOfPeriodUsingCommonDays =
            periodLength - daysLeftOfPersonalRights
          const commonPeriod = await this.getCalculatedPeriod(
            nationalRegistryId,
            commonPeriodStartDate,
            undefined,
            lengthOfPeriodUsingCommonDays,
            period,
            mulitpleBirthsRights,
          )

          periods.push(commonPeriod)
        }
      }

      // Add each period to the total number of days spent when an iteration is finished
      numberOfDaysAlreadySpent += periodLength
    }

    return periods
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const {
      isSelfEmployed,
      isRecivingUnemploymentBenefits,
      applicationType,
    } = getApplicationAnswers(application.answers)
    const nationalRegistryId = application.applicant
    const attachments = await this.getAttachments(application)

    try {
      const periods = await this.createPeriodsDTO(
        application,
        nationalRegistryId,
      )

      const parentalLeaveDTO = transformApplicationToParentalLeaveDTO(
        application,
        periods,
        attachments,
        false, // put false in testData as this is not dummy request
      )

      const response = await this.parentalLeaveApi.parentalLeaveSetParentalLeave(
        {
          nationalRegistryId,
          parentalLeave: parentalLeaveDTO,
        },
      )

      if (!response.id) {
        throw new Error(
          `Failed to send the parental leave application, no response.id from VMST API: ${response}`,
        )
      }

      // There has been case when island.is got Access Denied from AWS when sending out emails
      // This try/catch keeps application in correct state
      try {
        const selfEmployed =
          applicationType === PARENTAL_LEAVE ? isSelfEmployed === YES : true
        const recivingUnemploymentBenefits =
          isRecivingUnemploymentBenefits === YES

        if (!selfEmployed && !recivingUnemploymentBenefits) {
          // Only needs to send an email if being approved by employer
          // Self employed applicant was aware of the approval
          await this.sharedTemplateAPIService.sendEmail(
            generateApplicationApprovedByEmployerEmail,
            application,
          )

          // Also send confirmation to employer
          await this.sharedTemplateAPIService.sendEmail(
            generateApplicationApprovedByEmployerToEmployerEmail,
            application,
          )
        }
      } catch (e) {
        this.logger.error(
          'Failed to send confirmation emails to applicant and employer in parental leave application',
          e,
        )
      }

      return response
    } catch (e) {
      this.logger.error('Failed to send the parental leave application', e)
      throw this.parseErrors(e)
    }
  }

  async validateApplication({ application }: TemplateApiModuleActionProps) {
    const nationalRegistryId = application.applicant
    const attachments = await this.getAttachments(application)
    try {
      const periods = await this.createPeriodsDTO(
        application,
        nationalRegistryId,
      )

      const parentalLeaveDTO = transformApplicationToParentalLeaveDTO(
        application,
        periods,
        attachments,
        true,
      )

      // call SetParentalLeave API with testData: TRUE as this is a dummy request
      // for validation purposes
      await this.parentalLeaveApi.parentalLeaveSetParentalLeave({
        nationalRegistryId,
        parentalLeave: parentalLeaveDTO,
      })

      return
    } catch (e) {
      this.logger.error('Failed to validate the parental leave application', e)
      throw this.parseErrors(e as VMSTError)
    }
  }
}
