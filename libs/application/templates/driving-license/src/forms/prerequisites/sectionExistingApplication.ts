import {
  Application,
  buildCustomField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const sectionExistingApplication = buildSubSection({
  id: 'applicationFor',
  title: m.existingApplicationTitle,
  condition: (_answers, externalData) => {
    const existing =
      getValueViaPath<Application[]>(
        externalData,
        'existingApplication.data',
        [],
      ) ?? []

    return existing.length > 0
  },
  children: [
    buildMultiField({
      id: 'existingInfo',
      title: m.existingApplicationTitle,
      children: [
        buildCustomField({
          id: 'existingApplicationLink',
          title: '',
          description: m.existingApplicationExists,
          component: 'LinkExistingApplication',
        }),
      ],
    }),
  ],
})