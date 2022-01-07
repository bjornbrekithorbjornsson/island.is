import { EmailService } from '@island.is/email-service'
import {
  ApplicationEventType,
  ApplicationState,
  Employment,
  FamilyStatus,
  HomeCircumstances,
  Municipality,
  RolesRule,
  User,
} from '@island.is/financial-aid/shared/lib'
import { NotFoundException } from '@nestjs/common'
import { uuid } from 'uuidv4'
import { AmountService } from '../../amount'
import { ApplicationEventService } from '../../applicationEvent/applicationEvent.service'
import { FileService } from '../../file/file.service'
import { MunicipalityService } from '../../municipality'
import { StaffService } from '../../staff/staff.service'
import { UpdateApplicationDto } from '../dto'
import { ApplicationModel } from '../models/application.model'
import { createTestingApplicationModule } from './createTestingApplicationModule'

interface Then {
  result: ApplicationModel
  error: Error
}

type GivenWhenThen = (
  id: string,
  applicationToUpdate: UpdateApplicationDto,
  user: User,
) => Promise<Then>

describe.only('ApplicationController - Update', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationModel: typeof ApplicationModel
  let mockStaffService: StaffService
  let mockFileService: FileService
  let mockAmountService: AmountService
  let mockApplicationEventService: ApplicationEventService
  let mockMunicipalityService: MunicipalityService
  let mockEmailService: EmailService

  beforeEach(async () => {
    const {
      applicationController,
      applicationModel,
      staffService,
      fileService,
      amountService,
      applicationEventService,
      municipalityService,
      emailService,
    } = await createTestingApplicationModule()

    mockApplicationModel = applicationModel
    mockStaffService = staffService
    mockFileService = fileService
    mockAmountService = amountService
    mockApplicationEventService = applicationEventService
    mockMunicipalityService = municipalityService
    mockEmailService = emailService

    givenWhenThen = async (
      id: string,
      applicationToUpdate: UpdateApplicationDto,
      user: User,
    ): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .update(id, applicationToUpdate, user)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    let mockUpdate: jest.Mock

    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.NEW,
      event: ApplicationEventType.NEW,
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
      folder: uuid(),
      service: RolesRule.OSK,
    }

    beforeEach(async () => {
      mockUpdate = mockApplicationModel.update as jest.Mock
      const eventFindById = mockApplicationEventService.findById as jest.Mock
      eventFindById.mockReturnValueOnce(new Promise(() => []))
      const getApplicationFiles = mockFileService.getAllApplicationFiles as jest.Mock
      getApplicationFiles.mockReturnValueOnce(new Promise(() => []))

      await givenWhenThen(id, applicationUpdate, user)
    })

    it('should request staff by national id from the database', () => {
      expect(mockUpdate).toHaveBeenCalledWith(applicationUpdate, {
        where: { id },
        returning: true,
      })
    })
  })

  describe('applicant update', () => {
    let then: Then

    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.NEW,
      event: ApplicationEventType.NEW,
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
      folder: uuid(),
      service: RolesRule.OSK,
    }
    const application = {
      id,
      nationalId: user.nationalId,
      name: user.name,
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      student: false,
      usePersonalTaxCredit: false,
      hasIncome: false,
      state: applicationUpdate.state,
      files: [],
      familyStatus: FamilyStatus.COHABITATION,
      municipalityCode: '1',
      setDataValue: jest.fn,
    }

    beforeEach(async () => {
      const mockUpdate = mockApplicationModel.update as jest.Mock
      mockUpdate.mockReturnValueOnce([1, [application]])
      const eventFindById = mockApplicationEventService.findById as jest.Mock
      eventFindById.mockReturnValueOnce(Promise.resolve([]))
      const getApplicationFiles = mockFileService.getAllApplicationFiles as jest.Mock
      getApplicationFiles.mockReturnValueOnce(Promise.resolve([]))

      then = await givenWhenThen(id, applicationUpdate, user)
    })

    it('should not call staffService', () => {
      expect(mockStaffService.findByNationalId).not.toHaveBeenCalled()
    })

    it('should not call amountService', () => {
      expect(mockAmountService.create).not.toHaveBeenCalled()
    })

    it('should call applicationEventService with correct values', () => {
      expect(mockApplicationEventService.create).toHaveBeenCalledWith({
        applicationId: id,
        eventType: applicationUpdate.event,
        comment: undefined,
        staffName: undefined,
        staffNationalId: undefined,
      })
    })

    it('should have updated application staff as undefined', () => {
      expect(then.result.staff).toBeUndefined()
    })

    it('should return updated application', () => {
      expect(then.result).toEqual(application)
    })

    it('should call file service with id', () => {
      expect(mockFileService.getAllApplicationFiles).toHaveBeenCalledWith(id)
    })

    it('should not call municipality service because application event type is NEW', () => {
      expect(
        mockMunicipalityService.findByMunicipalityId,
      ).not.toHaveBeenCalled()
    })

    it('should not call email service because application event type is NEW', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
    })
  })

  describe('No row updated', () => {
    let then: Then
    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.NEW,
      event: ApplicationEventType.NEW,
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
      folder: uuid(),
      service: RolesRule.OSK,
    }

    beforeEach(async () => {
      const mockUpdate = mockApplicationModel.update as jest.Mock
      mockUpdate.mockReturnValueOnce([0, [undefined]])

      then = await givenWhenThen(id, applicationUpdate, user)
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
    })

    it('should have correct error message', () => {
      expect(then.error.message).toEqual(`Application ${id} does not exist`)
    })
  })

  describe.only('staff update', () => {
    let then: Then

    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.DATANEEDED,
      event: ApplicationEventType.DATANEEDED,
      comment: 'comment',
    }
    const staff: User = {
      nationalId: '0000000000',
      name: 'The Staff',
      folder: undefined,
      service: RolesRule.VEITA,
    }
    const application = {
      id,
      nationalId: '0000000001',
      name: 'The user',
      created: new Date(),
      email: 'some email',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      student: false,
      usePersonalTaxCredit: false,
      hasIncome: false,
      state: applicationUpdate.state,
      files: [],
      familyStatus: FamilyStatus.COHABITATION,
      municipalityCode: '1',
      setDataValue: jest.fn,
    }
    const municipality: Municipality = {
      id: '',
      name: 'Sveitarfélag',
      homepage: 'homepage',
      rulesHomepage: 'rulesHomepage',
      active: false,
      municipalityId: '',
      individualAid: undefined,
      cohabitationAid: undefined,
    }

    beforeEach(async () => {
      const mockUpdate = mockApplicationModel.update as jest.Mock
      mockUpdate.mockReturnValueOnce([1, [application]])
      const eventFindById = mockApplicationEventService.findById as jest.Mock
      eventFindById.mockReturnValueOnce(Promise.resolve([]))
      const getApplicationFiles = mockFileService.getAllApplicationFiles as jest.Mock
      getApplicationFiles.mockReturnValueOnce(Promise.resolve([]))
      const findStaffByNationalId = mockStaffService.findByNationalId as jest.Mock
      findStaffByNationalId.mockReturnValueOnce(Promise.resolve(staff))
      const findByMunicipalityId = mockMunicipalityService.findByMunicipalityId as jest.Mock
      findByMunicipalityId.mockReturnValueOnce(Promise.resolve(municipality))
      const sendEmail = mockEmailService.sendEmail as jest.Mock
      sendEmail.mockReturnValueOnce(Promise.resolve())

      then = await givenWhenThen(id, applicationUpdate, staff)
    })

    it('should call staffService with correct values', () => {
      expect(mockStaffService.findByNationalId).toHaveBeenCalledWith(
        staff.nationalId,
      )
    })

    it('should call applicationEventService with correct values', () => {
      expect(mockApplicationEventService.create).toHaveBeenCalledWith({
        applicationId: id,
        eventType: applicationUpdate.event,
        comment: applicationUpdate.comment,
        staffName: staff.name,
        staffNationalId: staff.nationalId,
      })
    })

    it('should call file service with id', () => {
      expect(mockFileService.getAllApplicationFiles).toHaveBeenCalledWith(id)
    })

    it('should not call amountService', () => {
      expect(mockAmountService.create).not.toHaveBeenCalled()
    })

    it('should call municipality service with correct value', () => {
      expect(mockMunicipalityService.findByMunicipalityId).toHaveBeenCalledWith(
        application.municipalityCode,
      )
    })

    it.only('should call email service with correct value', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        from: {
          name: 'Samband íslenskra sveitarfélaga',
          address: undefined,
        },
        replyTo: {
          name: 'Samband íslenskra sveitarfélaga',
          address: undefined,
        },
        to: { name: application.name, address: application.email },
        subject: expect.any(String),
        html: expect.any(String),
      })
    })

    it('should return updated application', () => {
      expect(then.result).toEqual(application)
    })
  })

  describe('database query fails', () => {
    let then: Then

    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.NEW,
      event: ApplicationEventType.NEW,
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
      folder: uuid(),
      service: RolesRule.OSK,
    }

    beforeEach(async () => {
      const mockUpdate = mockApplicationModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(id, applicationUpdate, user)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})