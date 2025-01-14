import gql from 'graphql-tag'
import {
  EndorsementList,
  ExistsEndorsementResponse,
  PaginatedEndorsementResponse,
  PaginatedEndorsementListResponse,
} from '../types/schema'

import { useQuery } from '@apollo/client'

interface UserSignedLists {
  endorsementSystemUserEndorsements: PaginatedEndorsementResponse
}
interface UserOwnsLists {
  endorsementSystemUserEndorsementLists: PaginatedEndorsementListResponse
}
interface PetitionLists {
  endorsementSystemFindEndorsementLists: PaginatedEndorsementListResponse
}
interface SinglePetition {
  endorsementSystemGetSingleEndorsementList?: EndorsementList
}
interface SinglePetitionEndorsements {
  endorsementSystemGetEndorsements?: PaginatedEndorsementResponse
}
interface SingleEndorsement {
  endorsementSystemGetSingleEndorsement?: ExistsEndorsementResponse
}

const GetSingleEndorsement = gql`
  query endorsementSystemGetSingleEndorsement(
    $input: FindEndorsementListInput!
  ) {
    endorsementSystemGetSingleEndorsement(input: $input) {
      hasEndorsed
    }
  }
`

const GetListsUserSigned = gql`
  query endorsementSystemUserEndorsements($input: EndorsementPaginationInput!) {
    endorsementSystemUserEndorsements(input: $input) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      data {
        id
        endorser
        endorsementList {
          id
          title
          description
          tags
          closedDate
          openedDate
        }
        meta {
          fullName
        }
        created
        modified
      }
    }
  }
`

const GetAllEndorsementsLists = gql`
  query endorsementSystemFindEndorsementLists(
    $input: PaginatedEndorsementListInput!
  ) {
    endorsementSystemFindEndorsementLists(input: $input) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      data {
        id
        title
        description
        closedDate
        openedDate
        adminLock
      }
    }
  }
`

export const GetSinglePetitionList = gql`
  query endorsementSystemGetSingleEndorsementList(
    $input: FindEndorsementListInput!
  ) {
    endorsementSystemGetSingleEndorsementList(input: $input) {
      meta
      title
      description
      ownerName
      closedDate
      openedDate
      adminLock
    }
  }
`

const GetEndorsements = gql`
  query endorsementSystemGetEndorsements($input: PaginatedEndorsementInput!) {
    endorsementSystemGetEndorsements(input: $input) {
      totalCount
      data {
        id
        endorser
        created
        meta {
          fullName
        }
      }
    }
  }
`

export const UnendorseList = gql`
  mutation unendorseList($input: FindEndorsementListInput!) {
    endorsementSystemUnendorseList(input: $input)
  }
`

export const EndorseList = gql`
  mutation endorsementSystemEndorseList($input: FindEndorsementListInput!) {
    endorsementSystemEndorseList(input: $input) {
      id
      endorser
      endorsementListId
      meta {
        fullName
      }
      created
      modified
    }
  }
`

export const SendEmailPdf = gql`
  mutation Mutants($input: sendPdfEmailInput!) {
    endorsementSystemsendPdfEmail(input: $input) {
      success
    }
  }
`

export const EndorsementListsUserOwns = gql`
  query endorsementSystemUserEndorsementLists(
    $input: PaginatedEndorsementListInput!
  ) {
    endorsementSystemUserEndorsementLists(input: $input) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      data {
        id
        title
        description
        closedDate
        openedDate
      }
    }
  }
`

export const CloseList = gql`
  mutation Mutants($input: FindEndorsementListInput!) {
    endorsementSystemCloseEndorsementList(input: $input) {
      id
      title
      modified
      closedDate
      openedDate
    }
  }
`

export const OpenList = gql`
  mutation Mutants($input: OpenListInput!) {
    endorsementSystemOpenEndorsementList(input: $input) {
      id
    }
  }
`

export const LockList = gql`
  mutation Mutants($input: FindEndorsementListInput!) {
    endorsementSystemLockEndorsementList(input: $input) {
      id
    }
  }
`

export const UnlockList = gql`
  mutation Mutants($input: FindEndorsementListInput!) {
    endorsementSystemUnlockEndorsementList(input: $input) {
      id
    }
  }
`

export const UpdateList = gql`
  mutation Mutants($input: UpdateEndorsementListInput!) {
    endorsementSystemUpdateEndorsementList(input: $input) {
      id
    }
  }
`

export const useGetAllPetitionLists = () => {
  const { data: endorsementListsResponse } = useQuery<PetitionLists>(
    GetAllEndorsementsLists,
    {
      variables: {
        input: {
          tags: 'generalPetition',
          limit: 1000,
        },
      },
      pollInterval: 20000,
    },
  )

  return endorsementListsResponse?.endorsementSystemFindEndorsementLists ?? []
}

export const useGetListsUserSigned = () => {
  const { data: endorsementResponse } = useQuery<UserSignedLists>(
    GetListsUserSigned,
    {
      variables: {
        input: {
          limit: 1000,
        },
      },
      pollInterval: 20000,
    },
  )
  return endorsementResponse?.endorsementSystemUserEndorsements ?? []
}

export const useListsUserOwns = () => {
  const { data: endorsementResponse } = useQuery<UserOwnsLists>(
    EndorsementListsUserOwns,
    {
      variables: {
        input: {
          tags: 'generalPetition',
          limit: 1000,
        },
      },
      pollInterval: 20000,
    },
  )
  return endorsementResponse?.endorsementSystemUserEndorsementLists ?? []
}

export const useGetSinglePetition = (listId: string) => {
  const {
    data: petition,
    refetch: refetchSinglePetition,
  } = useQuery<SinglePetition>(GetSinglePetitionList, {
    variables: {
      input: {
        listId: listId,
      },
    },
  })

  const petitionData = petition?.endorsementSystemGetSingleEndorsementList ?? {}
  return { petitionData, refetchSinglePetition }
}

export const useGetSingleEndorsement = (listId: string) => {
  const { data: endorsement } = useQuery<SingleEndorsement>(
    GetSingleEndorsement,
    {
      variables: {
        input: {
          listId: listId,
        },
      },
      pollInterval: 20000,
    },
  )
  return endorsement?.endorsementSystemGetSingleEndorsement?.hasEndorsed
}

export const useGetSinglePetitionEndorsements = (listId: string) => {
  const {
    data: endorsements,
    refetch: refetchSinglePetitionEndorsements,
  } = useQuery<SinglePetitionEndorsements>(GetEndorsements, {
    variables: {
      input: {
        listId: listId,
        limit: 1000,
      },
    },
    pollInterval: 20000,
  })

  const petitionEndorsements =
    endorsements?.endorsementSystemGetEndorsements ?? []
  return { petitionEndorsements, refetchSinglePetitionEndorsements }
}
