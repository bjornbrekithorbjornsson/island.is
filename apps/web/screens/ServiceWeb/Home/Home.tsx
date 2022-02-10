import React from 'react'
import { useRouter } from 'next/router'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Organization,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationArgs,
  QueryGetSupportCategoriesInOrganizationArgs,
  QueryGetSupportQnAsArgs,
  SupportCategory,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_SERVICE_WEB_ORGANIZATION,
  GET_SUPPORT_CATEGORIES,
  GET_SUPPORT_CATEGORIES_IN_ORGANIZATION,
} from '../../queries'
import { Screen } from '../../../types'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'

import { CustomNextError } from '@island.is/web/units/errors'
import {
  Card,
  SimpleStackedSlider,
  ServiceWebWrapper,
  ServiceWebContext,
} from '@island.is/web/components'
import { useNamespace, LinkResolverResponse } from '@island.is/web/hooks'
import ContactBanner from '../ContactBanner/ContactBanner'
import { getSlugPart } from '../utils'
import sortAlpha from '@island.is/web/utils/sortAlpha'

import * as styles from './Home.css'

interface HomeProps {
  organization?: Organization
  namespace: Query['getNamespace']
  supportCategories:
    | Query['getSupportCategories']
    | Query['getSupportCategoriesInOrganization']
}

const Home: Screen<HomeProps> = ({
  organization,
  supportCategories,
  namespace,
}) => {
  const Router = useRouter()
  const n = useNamespace(namespace)
  const institutionSlug = getSlugPart(Router.asPath, 2)

  const headerTitle = n('assistanceForIslandIs', 'Aðstoð fyrir Ísland.is')
  const organizationTitle = (organization && organization.title) || 'Ísland.is'
  const logoUrl = organization?.logo?.url ?? ''
  const searchTitle = n('canWeAssist', 'Getum við aðstoðað?')
  const pageTitle = `${
    institutionSlug && organization && organization.title
      ? organization.title + ' | '
      : ''
  }${headerTitle}`

  const hasContent = !!supportCategories?.length

  const sortedSupportCategories = sortSupportCategories(supportCategories)

  return (
    <ServiceWebWrapper
      pageTitle={pageTitle}
      headerTitle={headerTitle}
      institutionSlug={institutionSlug}
      logoUrl={logoUrl}
      organization={organization}
      organizationTitle={organizationTitle}
      searchTitle={searchTitle}
    >
      {hasContent && (
        <ServiceWebContext.Consumer>
          {({ textMode }) => (
            <>
              <Box className={styles.categories}>
                <GridContainer>
                  <GridRow>
                    <GridColumn span="12/12" paddingBottom={[2, 2, 3]}>
                      <Text
                        variant="h3"
                        {...(textMode === 'dark' ? {} : { color: 'white' })}
                      >
                        {n('answersByCategory', 'Svör eftir flokkum')}
                      </Text>
                    </GridColumn>
                  </GridRow>
                </GridContainer>
                <SimpleStackedSlider
                  itemWidth={280}
                  span={['12/12', '6/12', '6/12', '4/12']}
                >
                  {sortedSupportCategories.map(
                    ({ title, slug, description, organization }, index) => {
                      return (
                        <Card
                          key={index}
                          title={title}
                          description={description}
                          link={
                            {
                              href: `/adstod/${organization.slug}/${slug}`,
                            } as LinkResolverResponse
                          }
                        />
                      )
                    },
                  )}
                </SimpleStackedSlider>
              </Box>
              <Box marginY={[7, 10, 10]}>
                <GridContainer>
                  <GridRow>
                    <GridColumn
                      offset={[null, null, null, '1/12']}
                      span={['12/12', '12/12', '12/12', '10/12']}
                    >
                      <Box marginY={[10, 10, 20]}>
                        <ContactBanner slug={institutionSlug} />
                      </Box>
                    </GridColumn>
                  </GridRow>
                </GridContainer>
              </Box>
            </>
          )}
        </ServiceWebContext.Consumer>
      )}
    </ServiceWebWrapper>
  )
}

Home.getInitialProps = async ({ apolloClient, locale, query }) => {
  const slug = query.slug ? (query.slug as string) : 'stafraent-island'

  const [organization, namespace, supportCategories] = await Promise.all([
    !!slug &&
      apolloClient.query<Query, QueryGetOrganizationArgs>({
        query: GET_SERVICE_WEB_ORGANIZATION,
        variables: {
          input: {
            slug,
            lang: locale as ContentLanguage,
          },
        },
      }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Global',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
    slug
      ? apolloClient.query<Query, QueryGetSupportCategoriesInOrganizationArgs>({
          query: GET_SUPPORT_CATEGORIES_IN_ORGANIZATION,
          variables: {
            input: {
              lang: locale,
              slug: slug,
            },
          },
        })
      : apolloClient.query<Query, QueryGetSupportQnAsArgs>({
          query: GET_SUPPORT_CATEGORIES,
          variables: {
            input: {
              lang: locale,
            },
          },
        }),
  ])

  let processedCategories = slug
    ? supportCategories?.data?.getSupportCategoriesInOrganization
    : supportCategories?.data?.getSupportCategories

  // filter out categories that don't belong to an organization
  processedCategories = processedCategories.filter(
    (item) => !!item.organization,
  )

  if (
    !organization ||
    !organization?.data?.getOrganization?.serviceWebEnabled
  ) {
    throw new CustomNextError(
      404,
      'Service web not active for this organization',
    )
  }

  return {
    organization: organization?.data?.getOrganization,
    namespace,
    supportCategories: processedCategories,
  }
}

const sortSupportCategories = (items: SupportCategory[]) =>
  items
    .sort(sortAlpha('title'))
    .sort((a, b) =>
      a.importance > b.importance ? -1 : a.importance === b.importance ? 0 : 1,
    )

export default withMainLayout(Home, {
  showHeader: false,
  showFooter: false,
})
