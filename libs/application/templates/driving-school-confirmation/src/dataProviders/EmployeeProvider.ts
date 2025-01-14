import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { DrivingLicenseBookSchool } from '@island.is/api/schema'
import { m } from '../lib/messages'

export class EmployeeProvider extends BasicDataProvider {
  type = 'EmployeeProvider'

  async provide(): Promise<DrivingLicenseBookSchool> {
    const query = `
    query drivingLicenseBookSchoolForEmployee {
      drivingLicenseBookSchoolForEmployee {
        nationalId
        name
        address
        zipCode
        phoneNumber
        email
        website
        allowedDrivingSchoolTypes {
          schoolTypeId
          schoolTypeName
          schoolTypeCode
        }
      }
    }
    `

    return this.useGraphqlGateway(query).then(async (res: Response) => {
      const response = await res.json()

      if (response.errors) {
        console.error(
          `graphql error in ${this.type}: ${response.errors[0].message}`,
        )
        return Promise.reject({})
      }

      return Promise.resolve(response.data.drivingLicenseBookSchoolForEmployee)
    })
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.dataCollectionNoRightsError,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(
    result: Record<string, unknown>,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
