const devConfig = {
  audit: {
    defaultNamespace: '@island.is/auth/delegation-api',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@island.is',
  },
  port: 5333,
}

const prodConfig = {
  audit: {
    defaultNamespace: '@island.is/auth/delegation-api',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-auth-public-api',
  },
  auth: {
    audience: '@island.is',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL!,
  },
  port: 3333,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
