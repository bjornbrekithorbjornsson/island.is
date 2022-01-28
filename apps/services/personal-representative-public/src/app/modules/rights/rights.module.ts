import { Module } from '@nestjs/common'
import {
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
} from '@island.is/auth-api-lib/personal-representative'
import { SequelizeModule } from '@nestjs/sequelize'
import { RightsController } from './rights.controller'

@Module({
  imports: [SequelizeModule.forFeature([PersonalRepresentativeRightType])],
  controllers: [RightsController],
  providers: [PersonalRepresentativeRightTypeService],
})
export class RightsModule {}