export const identityServerId = 'identity-server'

export const identityServerConfig = {
  id: identityServerId,
  name: 'Loftbru',
  scope:
    'openid profile @vegagerdin.is/air-discount-scheme-scope offline_access @skra.is/individuals',
  clientId: '@vegagerdin.is/air-discount-scheme',
}

export const signOutUrl = (window: Window, idToken: string) =>
  `${window.location.origin}/api/auth/logout?id_token=${idToken}`
