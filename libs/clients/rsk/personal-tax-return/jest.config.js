module.exports = {
  displayName: 'clients-rsk-personal-tax-return',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/libs/clients/rsk/personal-tax-return',
}
