import {
  Employment,
  HomeCircumstances,
  KeyMapping,
  FamilyStatus,
} from '@island.is/financial-aid/shared/lib'

import { MessageDescriptor } from 'react-intl'

import * as m from './messages'
import { Routes } from './constants'
import {
  Applicant,
  ApproveOptions,
  ExternalData,
  OverrideAnswerSchema,
} from './types'
import { findFamilyStatus } from './utils'

export const getMessageHomeCircumstances: KeyMapping<
  HomeCircumstances,
  MessageDescriptor
> = {
  WithParents: m.homeCircumstancesForm.circumstances.withParents,
  Other: m.homeCircumstancesForm.circumstances.other,
  Unknown: m.homeCircumstancesForm.circumstances.other,
  OwnPlace: m.homeCircumstancesForm.circumstances.ownPlace,
  RegisteredLease: m.homeCircumstancesForm.circumstances.registeredLease,
  UnregisteredLease: m.homeCircumstancesForm.circumstances.unregisteredLease,
  WithOthers: m.homeCircumstancesForm.circumstances.withOthers,
}

export const getMessageEmploymentStatus: KeyMapping<
  Employment,
  MessageDescriptor
> = {
  Working: m.employmentForm.employment.working,
  Unemployed: m.employmentForm.employment.unemployed,
  CannotWork: m.employmentForm.employment.cannotWork,
  Other: m.employmentForm.employment.other,
}

export const getMessageFamilyStatus: KeyMapping<
  FamilyStatus,
  MessageDescriptor
> = {
  Cohabitation: m.familystatus.cohabitation,
  Married: m.familystatus.married,
  MarriedNotLivingTogether: m.familystatus.marriedNotLivingTogether,
  UnregisteredCohabitation: m.familystatus.unregisteredCohabitation,
  NotCohabitation: m.familystatus.notCohabitation,
}

export const getMessageApproveOptions: KeyMapping<
  ApproveOptions,
  MessageDescriptor
> = {
  Yes: m.approveOptions.yes,
  No: m.approveOptions.no,
}

export const getMessageApproveOptionsForIncome: KeyMapping<
  ApproveOptions,
  MessageDescriptor
> = {
  Yes: m.incomeForm.summary.yes,
  No: m.incomeForm.summary.no,
}

export const formatAddress = (applicant?: Applicant) =>
  applicant
    ? `${applicant.address.streetName}, ${applicant.address.postalCode} ${applicant.address.city}`
    : undefined

export const formatBankInfo = (bankInfo: {
  bankNumber?: string
  ledger?: string
  accountNumber?: string
}) =>
  bankInfo?.bankNumber && bankInfo?.ledger && bankInfo?.accountNumber
    ? bankInfo?.bankNumber +
      '-' +
      bankInfo?.ledger +
      '-' +
      bankInfo?.accountNumber
    : ''

export const formItems = (
  answers: OverrideAnswerSchema,
  externalData: ExternalData,
) => [
  {
    route: Routes.INRELATIONSHIP,
    label: m.inRelationship.general.sectionTitle,
    info: getMessageFamilyStatus[findFamilyStatus(answers, externalData)],
  },
  {
    route: Routes.HOMECIRCUMSTANCES,
    label: m.homeCircumstancesForm.general.sectionTitle,
    info:
      answers?.homeCircumstances?.type === HomeCircumstances.OTHER
        ? answers?.homeCircumstances?.custom
        : getMessageHomeCircumstances[answers?.homeCircumstances?.type],
  },
  {
    route: Routes.STUDENT,
    label: m.studentForm.general.sectionTitle,
    info: getMessageApproveOptions[answers?.student?.isStudent],
    comment:
      answers?.student?.isStudent === ApproveOptions.Yes
        ? answers?.student?.custom
        : undefined,
  },
  {
    route: Routes.EMPLOYMENT,
    label: m.employmentForm.general.sectionTitle,
    info:
      answers?.employment?.type === Employment.OTHER
        ? answers?.employment.custom
        : getMessageEmploymentStatus[answers?.employment?.type],
  },
  {
    route: Routes.INCOME,
    label: m.incomeForm.general.sectionTitle,
    info: getMessageApproveOptionsForIncome[answers?.income],
  },
  {
    route: Routes.PERSONALTAXCREDIT,
    label: m.summaryForm.formInfo.personalTaxCreditTitle,
    info: getMessageApproveOptions[answers?.personalTaxCredit],
  },
  {
    route: Routes.BANKINFO,
    label: m.bankInfoForm.general.sectionTitle,
    info: formatBankInfo(answers?.bankInfo),
  },
]

export const spouseFormItems = (answers: OverrideAnswerSchema) => [
  {
    route: Routes.SPOUSEINCOME,
    label: m.incomeForm.general.sectionTitle,
    info: getMessageApproveOptionsForIncome[answers?.spouseIncome],
  },
]