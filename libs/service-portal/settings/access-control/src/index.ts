import { AuthScope } from '@island.is/auth/scopes'
import { lazy } from 'react'

import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  m,
} from '@island.is/service-portal/core'
import { Features } from '@island.is/feature-flags'

export const accessControlModule: ServicePortalModule = {
  name: 'Aðgangsstýring',
  featureFlag: Features.outgoingDelegationsV1,
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: m.accessControl,
        path: ServicePortalPath.SettingsAccessControl,
        navHide: !userInfo.scopes.includes(AuthScope.delegations),
        enabled: userInfo.scopes.includes(AuthScope.delegations),
        render: () => lazy(() => import('./screens/AccessControl')),
      },
      {
        name: m.accessControlGrant,
        path: ServicePortalPath.SettingsAccessControlGrant,
        enabled: userInfo.scopes.includes(AuthScope.delegations),
        render: () => lazy(() => import('./screens/GrantAccess')),
      },
      {
        name: m.accessControlAccess,
        path: ServicePortalPath.SettingsAccessControlAccess,
        enabled: userInfo.scopes.includes(AuthScope.delegations),
        render: () => lazy(() => import('./screens/Access')),
      },
    ]

    return routes
  },
}
