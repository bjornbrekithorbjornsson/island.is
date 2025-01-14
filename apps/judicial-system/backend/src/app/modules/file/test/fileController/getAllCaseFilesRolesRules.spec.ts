import {
  assistantRule,
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
} from '../../../../guards'
import { FileController } from '../../file.controller'

describe('FileController - Get all case files rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.getAllCaseFiles,
    )
  })

  it('should give permission to five roles', () => {
    expect(rules).toHaveLength(5)
  })

  it('should give permission to prosecutors, representatives, judges, registrars and assistants', () => {
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(representativeRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
    expect(rules).toContain(assistantRule)
  })
})
