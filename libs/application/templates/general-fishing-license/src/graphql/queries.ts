import { gql } from '@apollo/client'

export const queryShips = `
  query ShipQuery {
    fishingLicenseShips {
      name
      registrationNumber
      grossTons
      length
      homePort
      seaworthiness {
        validTo
      }
      deprivations {
        validFrom
        invalidFrom
        explanation
      }
      features
      fishingLicenses {
        code
        name
        chargeType
      }
      doesNotFulfillFishingLicenses
      unfulfilledLicenses {
        fishingLicense {
          code
          name
          chargeType
        }
        reasons {
          description
          directions
        }
      }
    }
  }
`

export const queryFishingLicense = gql`
  query FishingLicenseQuery($registrationNumber: Float!) {
    fishingLicenses(registrationNumber: $registrationNumber) {
      fishingLicenseInfo {
        code
        name
        chargeType
      }
      answer
      reasons {
        description
        directions
      }
    }
  }
`
