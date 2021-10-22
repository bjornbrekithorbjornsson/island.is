import { useMutation } from '@apollo/client'
import { Application, DefaultEvents } from '@island.is/application/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { Box, Button, Icon, ModalBase, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as Sentry from '@sentry/react'
import React, { FC } from 'react'
import { inReview } from '../../lib/messages'
import * as styles from './ConfirmationModal.treat'

type ConfirmationModalProps = {
  visibility: boolean
  setVisibility: (visibility: boolean) => void
  title: string
  text: string
  buttonText: string
  buttonColorScheme?: 'default' | 'destructive'
  defaultEvent: DefaultEvents
  application: Application
  refetch?: () => void
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  visibility,
  setVisibility,
  title,
  text,
  buttonText,
  buttonColorScheme = 'default',
  defaultEvent,
  application,
  refetch,
}) => {
  const { formatMessage } = useLocale()
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => {
        return Sentry.captureException(e.message)
      },
    },
  )

  const submitAndMoveToFinalReview = async () => {
    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event: defaultEvent,
          answers: application.answers,
        },
      },
    })

    if (res?.data) {
      // Takes them to the next state (which loads the relevant form)
      refetch?.()
    }
  }

  const closeModal = () => {
    setVisibility(false)
  }
  return (
    <ModalBase
      baseId="confirmationModal"
      isVisible={visibility}
      className={`${styles.dialog} ${styles.background} ${styles.center}`}
      onVisibilityChange={(visibility) => setVisibility(visibility)}
    >
      <Box background="white" padding={10}>
        <Box
          className={styles.close}
          onClick={closeModal}
          role="button"
          aria-label="close button"
        >
          <Icon icon="close" size="large" />
        </Box>
        <Text variant="h1" marginBottom={2}>
          {title}
        </Text>
        <Text variant="intro" marginBottom={7}>
          {text}
        </Text>
        <Box display="flex" justifyContent="spaceBetween">
          <Button variant="ghost" onClick={closeModal}>
            {formatMessage(inReview.confirmationModal.default.cancelButton)}
          </Button>
          <Button
            colorScheme={buttonColorScheme}
            onClick={submitAndMoveToFinalReview}
            loading={loadingSubmit}
          >
            {buttonText}
          </Button>
        </Box>
      </Box>
    </ModalBase>
  )
}