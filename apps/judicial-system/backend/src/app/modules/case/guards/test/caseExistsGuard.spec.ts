import { uuid } from 'uuidv4'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { createTestingCaseModule } from '../../test/createTestingCaseModule'
import { Institution } from '../../../institution'
import { User } from '../../../user'
import { Case } from '../../models'
import { CaseExistsGuard } from '../caseExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Case Exists Guard', () => {
  const mockRequest = jest.fn()
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseModel, caseService } = await createTestingCaseModule()

    mockCaseModel = caseModel

    givenWhenThen = async (): Promise<Then> => {
      const guard = new CaseExistsGuard(caseService)
      const then = {} as Then

      try {
        then.result = await guard.canActivate(({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown) as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('database lookup', () => {
    const caseId = uuid()

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: { caseId } }))

      await givenWhenThen()
    })

    it('should query the database', () => {
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        where: { id: caseId },
        include: [
          {
            model: Institution,
            as: 'court',
          },
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
        ],
      })
    })
  })

  describe('case exists', () => {
    const caseId = uuid()
    const theCase = { id: caseId }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: { caseId } }))
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe('case does not exist', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: { caseId } }))

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`Case ${caseId} does not exist`)
    })
  })

  describe('missing case id', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: {} }))

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing case id')
    })
  })
})