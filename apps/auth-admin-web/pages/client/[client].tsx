import ClientDTO from './../../entities/dtos/client-dto'
import ClientForm from '../../components/Client/form/ClientForm'
import ClientRedirectUriForm from '../../components/Client/form/ClientRedirectUriForm'
import ClientIdpRestrictionsForm from '../../components/Client/form/ClientIdpRestrictionsForm'
import ClientPostLogoutRedirectUriForm from '../../components/Client/form/ClientPostLogoutRedirectUriForm'
import ClientStepNav from '../../components/Client/nav/ClientStepNav'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

import { ClientStep } from './../../entities/common/ClientStep'
import { Client } from './../../entities/models/client.model'
import ClientAllowedCorsOriginsForm from '../../components/Client/form/ClientAllowedCorsOriginsForm'
import ClientAllowedScopes from '../../components/Client/form/ClientAllowedScopesForm'
import ClientSecretForm from '../../components/Client/form/ClientSecretForm'
import ClientClaimForm from '../../components/Client/form/ClientClaimForm'
import ClientGrantTypesForm from '../../components/Client/form/ClientGrantTypesForm'
import ContentWrapper from './../../components/Layout/ContentWrapper'
import StepEnd from './../../components/common/StepEnd'
import { ClientService } from './../../services/ClientService'
import { GetServerSideProps, NextPageContext } from 'next'
import { withAuthentication } from './../../utils/auth.utils'

const Index: React.FC = () => {
  const { query } = useRouter()
  const clientId = query.client
  const stepQuery = query.step

  const [step, setStep] = useState(1)
  const [client, setClient] = useState<Client>(new Client())
  const router = useRouter()

  /** Load the client and set the step from query if there is one */
  useEffect(() => {
    async function loadClient() {
      if (clientId) {
        const decoded = decodeURIComponent(clientId as string)
        await getClient(decoded)
      }
      if (stepQuery) {
        setStep(+stepQuery)
      }
    }
    loadClient()
    setStep(1)
  }, [clientId])

  const getClient = async (clientId: string) => {
    const response = await ClientService.findClientById(clientId)
    if (response) {
      setClient(response)
    }
  }

  const changesMade = () => {
    getClient(clientId as string)
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleStepChange = (step: ClientStep) => {
    setStep(step)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleCancel = () => {
    router.push('/client')
  }

  const handleClientSaved = (clientSaved: ClientDTO) => {
    if (clientSaved) {
      getClient(clientSaved.clientId)
      handleNext()
    }
  }

  switch (step) {
    case ClientStep.Client:
      return (
        <ContentWrapper>
          <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
            <ClientForm
              handleCancel={handleCancel}
              client={client as ClientDTO}
              onNextButtonClick={handleClientSaved}
            />
          </ClientStepNav>
        </ContentWrapper>
      )
    case ClientStep.ClientRedirectUri: {
      return (
        <ContentWrapper>
          <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
            <ClientRedirectUriForm
              clientId={client.clientId}
              defaultUrl={client.clientUri}
              uris={client.redirectUris?.map((r) => r.redirectUri)}
              handleNext={handleNext}
              handleBack={handleBack}
              handleChanges={changesMade}
            />
          </ClientStepNav>
        </ContentWrapper>
      )
    }
    case ClientStep.ClientIdpRestrictions: {
      return (
        <ContentWrapper>
          <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
            <ClientIdpRestrictionsForm
              clientId={client.clientId}
              restrictions={client.identityProviderRestrictions?.map(
                (r) => r.name,
              )}
              handleNext={handleNext}
              handleBack={handleBack}
              handleChanges={changesMade}
            />
          </ClientStepNav>
        </ContentWrapper>
      )
    }
    case ClientStep.ClientPostLogoutRedirectUri: {
      return (
        <ContentWrapper>
          <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
            <ClientPostLogoutRedirectUriForm
              clientId={client.clientId}
              defaultUrl={client.clientUri}
              uris={client.postLogoutRedirectUris?.map((p) => p.redirectUri)}
              handleNext={handleNext}
              handleBack={handleBack}
              handleChanges={changesMade}
            />
          </ClientStepNav>
        </ContentWrapper>
      )
    }
    case ClientStep.ClientAllowedCorsOrigin: {
      return (
        <ContentWrapper>
          <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
            <ClientAllowedCorsOriginsForm
              clientId={client.clientId}
              defaultOrigin={client.clientUri}
              origins={client.allowedCorsOrigins?.map((a) => a.origin)}
              handleNext={handleNext}
              handleBack={handleBack}
              handleChanges={changesMade}
            />
          </ClientStepNav>
        </ContentWrapper>
      )
    }
    case ClientStep.ClientGrantTypes: {
      return (
        <ContentWrapper>
          <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
            <ClientGrantTypesForm
              clientId={client.clientId}
              grantTypes={client.allowedGrantTypes?.map((a) => a.grantType)}
              handleBack={handleBack}
              handleChanges={changesMade}
              handleNext={handleNext}
            />
          </ClientStepNav>
        </ContentWrapper>
      )
    }
    case ClientStep.ClientAllowedScopes: {
      return (
        <ContentWrapper>
          <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
            <ClientAllowedScopes
              clientId={client.clientId}
              scopes={client.allowedScopes?.map((s) => s.scopeName)}
              handleChanges={changesMade}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          </ClientStepNav>
        </ContentWrapper>
      )
    }
    case ClientStep.ClientClaims: {
      return (
        <ContentWrapper>
          <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
            <ClientClaimForm
              clientId={client.clientId}
              claims={client.claims}
              handleNext={handleNext}
              handleBack={handleBack}
              handleChanges={changesMade}
            ></ClientClaimForm>
          </ClientStepNav>
        </ContentWrapper>
      )
    }
    case ClientStep.ClientSecret: {
      return (
        <ContentWrapper>
          <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
            <ClientSecretForm
              secrets={client.clientSecrets}
              clientId={client.clientId}
              handleBack={handleBack}
              handleNext={handleNext}
              handleChanges={changesMade}
            />
          </ClientStepNav>
        </ContentWrapper>
      )
    }
    default: {
      return (
        <ContentWrapper>
          <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
            <StepEnd
              buttonText="Go back"
              title="Steps completed"
              handleButtonFinishedClick={() => setStep(1)}
            >
              The steps needed, to create a client, have been completed
            </StepEnd>
          </ClientStepNav>
        </ContentWrapper>
      )
    }
  }
}

export const getServerSideProps = withAuthentication(
  async (context: NextPageContext) => {
    return {
      props: {},
    }
  },
)

export default Index
