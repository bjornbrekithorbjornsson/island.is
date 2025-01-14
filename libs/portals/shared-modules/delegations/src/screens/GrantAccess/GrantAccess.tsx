import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { FormProvider, useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { defineMessage } from 'react-intl'
import * as kennitala from 'kennitala'

import {
  Box,
  Input,
  Icon,
  toast,
  Text,
  SkeletonLoader,
  useBreakpoint,
} from '@island.is/island-ui/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import {
  IntroHeader,
  ServicePortalModuleComponent,
  formatNationalId,
  m,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { DelegationsFormFooter } from '../../components/delegations/DelegationsFormFooter'
import { IdentityCard } from '../../components/IdentityCard/IdentityCard'
import * as styles from './GrantAccess.css'
import {
  useCreateAuthDelegationMutation,
  useIdentityLazyQuery,
} from '@island.is/service-portal/graphql'
import { DomainOption, useDomains } from '../../hooks/useDomains'
import { ALL_DOMAINS } from '../../constants/domain'
import { DelegationPaths } from '../../lib/paths'

const GrantAccess: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()
  const [name, setName] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const history = useHistory()
  const { md } = useBreakpoint()
  const {
    options,
    selectedOption,
    loading: domainLoading,
    updateDomain,
  } = useDomains(false)

  const [
    createAuthDelegation,
    { loading: mutationLoading },
  ] = useCreateAuthDelegationMutation()

  const noUserFoundToast = () => {
    toast.error(
      formatMessage({
        id: 'sp.settings-access-control:grant-identity-error',
        defaultMessage: 'Enginn notandi fannst með þessa kennitölu.',
      }),
    )
  }

  const [getIdentity, { data, loading: queryLoading }] = useIdentityLazyQuery({
    onError: noUserFoundToast,
    onCompleted: (data) => {
      if (!data.identity) {
        noUserFoundToast()
      }
    },
  })

  const { identity } = data || {}

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      toNationalId: '',
      domainName: selectedOption?.value ?? null,
    },
  })
  const { handleSubmit, control, errors, watch, reset } = methods

  useEffect(() => {
    reset({ domainName: selectedOption?.value ?? null })
  }, [selectedOption?.value, reset])

  const watchToNationalId = watch('toNationalId')
  const domainNameWatcher = watch('domainName')
  const loading = queryLoading || mutationLoading

  const requestDelegation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value.replace('-', '').trim()
    if (value.length === 10 && kennitala.isValid(value)) {
      if (kennitala.isCompany(value)) {
        setName(value)
      } else {
        getIdentity({ variables: { input: { nationalId: value } } })
      }
    } else {
      setName('')
    }
  }

  useEffect(() => {
    if (identity && identity.nationalId === watchToNationalId) {
      setName(identity.name)
    }
  }, [identity, setName, watchToNationalId])

  const onSubmit = handleSubmit(async ({ toNationalId, domainName }) => {
    try {
      const { data } = await createAuthDelegation({
        variables: {
          input: {
            toNationalId,
            domainName: domainName === ALL_DOMAINS ? null : domainName,
          },
        },
      })
      if (data) {
        history.push(
          `${DelegationPaths.Delegations}/${data.createAuthDelegation.id}`,
        )
      }
    } catch (error) {
      toast.error(
        formatMessage({
          id: 'sp.settings-access-control:grant-create-error',
          defaultMessage: 'Ekki tókst að búa til aðgang fyrir þennan notanda.',
        }),
      )
    }
  })

  const clearPersonState = () => {
    setName('')
    reset({
      toNationalId: '',
    })

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  return (
    <>
      <IntroHeader
        title={formatMessage({
          id: 'sp.access-control-delegations:grant-title',
          defaultMessage: 'Veita aðgang',
        })}
        intro={defineMessage({
          id: 'sp.access-control-delegations:grant-intro',
          defaultMessage:
            'Hér getur þú gefið öðrum aðgang til að sýsla með þín gögn hjá island.is',
        })}
        marginBottom={1}
      />
      <div className={styles.container}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Box display="flex" flexDirection="column" rowGap={[5, 6]}>
              <IdentityCard
                label={formatMessage({
                  id: 'sp.access-control-delegations:delegation-to',
                  defaultMessage: 'Aðgangsveitandi',
                })}
                title={userInfo.profile.name}
                description={formatNationalId(userInfo.profile.nationalId)}
                color="blue"
              />
              <div className={styles.inputWrapper}>
                {name && (
                  <Input
                    name="name"
                    defaultValue={name}
                    aria-live="assertive"
                    label={formatMessage({
                      id:
                        'sp.access-control-delegations:grant-form-access-holder',
                      defaultMessage: 'Kennitala aðgangshafa',
                    })}
                    backgroundColor="blue"
                    size="md"
                  />
                )}
                <Box display={name ? 'none' : 'block'} aria-live="assertive">
                  <InputController
                    control={control}
                    id="toNationalId"
                    icon={name || queryLoading ? undefined : 'search'}
                    ref={inputRef}
                    rules={{
                      required: {
                        value: true,
                        message: formatMessage({
                          id: 'sp.settings-access-control:grant-required-ssn',
                          defaultMessage: 'Þú þarft að setja inn kennitölu',
                        }),
                      },
                      validate: {
                        value: (value: number) => {
                          if (
                            value.toString().length === 10 &&
                            !kennitala.isValid(value)
                          ) {
                            return formatMessage({
                              id:
                                'sp.settings-access-control:grant-invalid-ssn',
                              defaultMessage:
                                'Kennitalan er ekki gild kennitala',
                            })
                          }
                        },
                      },
                    }}
                    type="tel"
                    format="######-####"
                    label={formatMessage({
                      id:
                        'sp.access-control-delegations:grant-form-access-holder',
                      defaultMessage: 'Kennitala aðgangshafa',
                    })}
                    placeholder={'000000-0000'}
                    error={errors.toNationalId?.message}
                    onChange={(value) => {
                      requestDelegation(value)
                    }}
                    size="md"
                  />
                </Box>
                {queryLoading ? (
                  <span
                    className={cn(styles.icon, styles.loadingIcon)}
                    aria-label="Loading"
                  >
                    <Icon icon="reload" size="large" color="blue400" />
                  </span>
                ) : name ? (
                  <button
                    disabled={loading}
                    onClick={clearPersonState}
                    className={styles.icon}
                    aria-label={formatMessage(m.clearSelected)}
                  >
                    <Icon icon="close" size="large" color="blue400" />
                  </button>
                ) : null}
              </div>
              <div>
                {domainLoading ? (
                  <SkeletonLoader height={md ? 77 : 72} />
                ) : (
                  <SelectController
                    id="domainName"
                    name="domainName"
                    label={formatMessage(m.accessControl)}
                    placeholder={formatMessage({
                      id: 'sp.access-control-delegations:choose-domain',
                      defaultMessage: 'Veldu kerfi',
                    })}
                    error={errors.domainName?.message}
                    options={options}
                    onSelect={(option) => {
                      const opt = option as DomainOption

                      if (opt) {
                        updateDomain(opt)
                      }
                    }}
                    rules={{
                      required: {
                        value: true,
                        message: formatMessage({
                          id:
                            'sp.access-control-delegations:grant-required-domain',
                          defaultMessage: 'Skylda er að velja aðgangsstýringu',
                        }),
                      },
                    }}
                  />
                )}
              </div>
            </Box>
            <Box display="flex" flexDirection="column" rowGap={5} marginTop={5}>
              <Text variant="small">
                {formatMessage({
                  id: 'sp.access-control-delegations:next-step-description',
                  defaultMessage:
                    'Í næsta skrefi velurðu hvaða gögn viðkomandi getur skoðað eða sýslað með.',
                })}
              </Text>
              <Box marginBottom={7}>
                <DelegationsFormFooter
                  disabled={!name || !domainNameWatcher}
                  loading={mutationLoading}
                  onCancel={() => history.push(DelegationPaths.Delegations)}
                  showShadow={false}
                  confirmLabel={formatMessage({
                    id: 'sp.access-control-delegations:choose-access-rights',
                    defaultMessage: 'Velja réttindi',
                  })}
                  confirmIcon="arrowForward"
                />
              </Box>
            </Box>
          </form>
        </FormProvider>
      </div>
    </>
  )
}

export default GrantAccess
