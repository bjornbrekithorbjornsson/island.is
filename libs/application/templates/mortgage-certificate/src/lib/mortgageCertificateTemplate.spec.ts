import {
  Application,
  ApplicationTemplateHelper,
  ApplicationTypes,
  DefaultEvents,
  ApplicationStatus,
} from '@island.is/application/core'
import { States } from './constants'
import MortgageCertificateTemplate from './mortgageCertificateTemplate'

const MOCK_APPLICANT_NATIONAL_ID = '0101010101'

function buildApplication(
  data: {
    state?: string
  } = {},
): Application {
  const { state = States.DRAFT } = data

  return {
    id: '12345',
    assignees: [],
    applicant: MOCK_APPLICANT_NATIONAL_ID,
    typeId: ApplicationTypes.MORTGAGE_CERTIFICATE,
    created: new Date(),
    modified: new Date(),
    answers: {},
    state,
    externalData: {},
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('Mortgage certificate Application Template', () => {
  describe('state transitions', () => {
    it('should transition from draft to payment info', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication(),
        MortgageCertificateTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.PAYMENT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.PAYMENT_INFO)
    })

    it('should transition from payment info to payment', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: States.PAYMENT_INFO,
        }),
        MortgageCertificateTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.PAYMENT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.PAYMENT)
    })

    it('should transition from payment to completed', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: States.PAYMENT,
        }),
        MortgageCertificateTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.COMPLETED)
    })
  })
})