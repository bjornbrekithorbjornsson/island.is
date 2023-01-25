import {
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { externalData } from '../../lib/messages'
import {
  NationalRegistryUserApi,
  SamgongustofaPaymentCatalogApi,
  CurrentVehiclesApi,
} from '../../dataProviders'

export const prerequisitesSection = buildSection({
  id: 'externalData',
  title: externalData.dataProvider.sectionTitle,
  children: [
    buildExternalDataProvider({
      title: externalData.dataProvider.pageTitle,
      id: 'approveExternalData',
      subTitle: externalData.dataProvider.subTitle,
      checkboxLabel: externalData.dataProvider.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: externalData.nationalRegistry.title,
          subTitle: externalData.nationalRegistry.subTitle,
        }),
        buildDataProviderItem({
          provider: CurrentVehiclesApi,
          title: externalData.currentVehicles.title,
          subTitle: externalData.currentVehicles.subTitle,
        }),
        buildDataProviderItem({
          provider: SamgongustofaPaymentCatalogApi,
          title: '',
        }),
      ],
    }),
  ],
})