import { Args, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { Inject, UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { VehiclesService } from './api-domains-vehicles.service'
import { VehiclesHistory, VehiclesList } from '../models/usersVehicles.model'
import { Audit } from '@island.is/nest/audit'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { GetVehicleDetailInput } from '../dto/getVehicleDetailInput'
import { VehiclesDetail } from '../models/getVehicleDetail.model'
import { VehiclesVehicleSearch } from '../models/getVehicleSearch.model'
import {
  VehicleDebtStatusByPermno,
  VehiclesCurrentVehicle,
  VehiclesCurrentVehicleWithDebtStatus,
} from '../models/getCurrentVehicles.model'
import { GetVehicleSearchInput } from '../dto/getVehicleSearchInput'
import { GetCurrentVehiclesInput } from '../dto/getCurrentVehiclesInput'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/vehicles' })
export class VehiclesResolver {
  constructor(
    private readonly vehiclesService: VehiclesService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Scopes(ApiScope.vehicles)
  @Query(() => VehiclesList, { name: 'vehiclesList', nullable: true })
  @Audit()
  async getVehicleList(@CurrentUser() user: User) {
    const data = await this.vehiclesService.getVehiclesForUser(
      user,
      false,
      false,
    )
    const downloadServiceURL = `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/ownership/${user.nationalId}`

    return { ...data, downloadServiceURL }
  }

  @Scopes(ApiScope.vehicles)
  @Query(() => VehiclesHistory, { name: 'vehiclesHistoryList', nullable: true })
  @Audit()
  async getVehicleHistory(@CurrentUser() user: User) {
    return await this.vehiclesService.getVehiclesForUser(user, true, true)
  }

  @Scopes(ApiScope.vehicles, ApiScope.internal)
  @Query(() => VehiclesDetail, { name: 'vehiclesDetail', nullable: true })
  @Audit()
  async getVehicleDetail(
    @Args('input') input: GetVehicleDetailInput,
    @CurrentUser() user: User,
  ) {
    const data = await this.vehiclesService.getVehicleDetail(user, {
      clientPersidno: user.nationalId,
      permno: input.permno,
      regno: input.regno,
      vin: input.vin,
    })
    const downloadServiceURL = `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/history/${input.permno}`
    return { ...data, downloadServiceURL }
  }

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => Number, {
    name: 'vehiclesSearchLimit',
    nullable: true,
  })
  @Audit()
  async getVehiclesSearchLimit(@CurrentUser() user: User) {
    return await this.vehiclesService.getSearchLimit(user)
  }

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => VehiclesVehicleSearch, {
    name: 'vehiclesSearch',
    nullable: true,
  })
  @Audit()
  async getVehicleSearch(
    @Args('input') input: GetVehicleSearchInput,
    @CurrentUser() user: User,
  ) {
    return await this.vehiclesService.getVehiclesSearch(user, input.search)
  }

  @Scopes(ApiScope.internal)
  @Query(() => [VehiclesCurrentVehicle], {
    name: 'currentVehicles',
    nullable: true,
  })
  @Audit()
  async getCurrentVehicles(
    @Args('input') input: GetCurrentVehiclesInput,
    @CurrentUser() user: User,
  ) {
    return await this.vehiclesService.getCurrentVehicles(
      user,
      input.showOwned,
      input.showCoowned,
      input.showOperated,
    )
  }

  @Scopes(ApiScope.internal)
  @Query(() => [VehiclesCurrentVehicleWithDebtStatus], {
    name: 'currentVehiclesWithDebtStatus',
    nullable: true,
  })
  @Audit()
  async getCurrentVehiclesWithDebtStatus(
    @Args('input') input: GetCurrentVehiclesInput,
    @CurrentUser() user: User,
  ) {
    return await this.vehiclesService.getCurrentVehiclesWithDebtStatus(
      user,
      input.showOwned,
      input.showCoowned,
      input.showOperated,
    )
  }

  @Scopes(ApiScope.internal)
  @Query(() => VehicleDebtStatusByPermno, {
    name: 'vehicleDebtStatusByPermno',
    nullable: true,
  })
  @Audit()
  async getVehicleDebtStatusByPermno(
    @Args('permno', { type: () => String }) permno: string,
    @CurrentUser() user: User,
  ) {
    return await this.vehiclesService.getVehicleDebtStatusByPermno(user, permno)
  }
}
