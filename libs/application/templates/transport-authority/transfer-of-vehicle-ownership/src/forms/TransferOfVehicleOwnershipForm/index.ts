import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { conclusionSection } from './conclusionSection'
import { paymentSection } from './paymentSection'
import { prerequisitesSection } from './prerequisitesSection'

export const TransferOfVehicleOwnershipForm: Form = buildForm({
  id: 'TransferOfVehicleOwnershipFormDraft',
  title: '',
  mode: FormModes.DRAFT,
  children: [
    prerequisitesSection,
    informationSection,
    paymentSection,
    conclusionSection,
  ],
})
