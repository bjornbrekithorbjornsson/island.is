import {
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Type, ValidationPipe } from '@nestjs/common'
import { InfraModule } from './infra/infra.module'
import { Test } from '@nestjs/testing'
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'

export type TestServerOptions = {
  /**
   * Main nest module.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appModule: Type<any>

  /**
   * Hook to override providers.
   */
  override?: (builder: TestingModuleBuilder) => TestingModuleBuilder
}

export const testServer = async ({
  appModule,
  override,
}: TestServerOptions) => {
  let builder = Test.createTestingModule({
    imports: [
      InfraModule.forRoot({
        appModule,
      }),
    ],
  })
  if (override) {
    builder = override(builder)
  }

  const moduleRef = await builder.compile()
  const app = moduleRef.createNestApplication()
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  )

  return app.init()
}

// Sets up a test environment that ignores various Guards on controllers
export const testServerActivateAuthGuards = async ({
  appModule,
}: TestServerOptions) => {
  const moduleFixture = await Test.createTestingModule({
    imports: [
      InfraModule.forRoot({
        appModule,
      }),
    ],
  })
    .overrideGuard(IdsAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(IdsUserGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(ScopesGuard)
    .useValue({ canActivate: () => true })
    .compile()

  const app = moduleFixture.createNestApplication()
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  )

  return app.init()
}
