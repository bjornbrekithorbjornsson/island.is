import { Select, SkeletonLoader } from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { useDomains, DomainOption } from '../../hooks/useDomains'

interface DelegationsHeaderProps {
  onDomainChange(domainOption: DomainOption): void
}

export const DelegationsDomainSelect = ({
  onDomainChange,
}: DelegationsHeaderProps) => {
  const { formatMessage } = useLocale()
  const { options, selectedOption, loading, updateDomain } = useDomains()

  return loading ? (
    <SkeletonLoader height={71} />
  ) : (
    <Select
      label={formatMessage(m.accessControl)}
      size="xs"
      name="domain"
      backgroundColor="blue"
      id="domain"
      noOptionsMessage="Enginn valmöguleiki"
      options={options}
      value={selectedOption}
      defaultValue={selectedOption}
      onChange={(option) => {
        const opt = option as DomainOption

        if (opt) {
          updateDomain(opt)
          onDomainChange(opt)
        }
      }}
      placeholder={formatMessage({
        id: 'sp.access-control-delegations:choose-domain',
        defaultMessage: 'Veldu kerfi',
      })}
    />
  )
}
