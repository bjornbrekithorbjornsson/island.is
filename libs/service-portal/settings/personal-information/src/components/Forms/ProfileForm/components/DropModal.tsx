import React, { FC, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Modal } from '@island.is/service-portal/core'
import {
  Text,
  Button,
  Box,
  GridColumn,
  GridRow,
  Hidden,
} from '@island.is/island-ui/core'
import { msg } from '../../../../lib/messages'

interface Props {
  onClose: () => void
  onDrop: () => void
  type: 'tel' | 'mail' | 'all'
}

export const DropModal: FC<Props> = ({ onClose, onDrop, type }) => {
  const [closeModal, setCloseModal] = useState(false)
  const { formatMessage } = useLocale()
  useNamespaces('sp.settings')

  const onCloseSideEffect = () => {
    onClose()
    setCloseModal(true)
  }

  return (
    <Modal
      id="drop-onboarding-modal"
      onCloseModal={onClose}
      toggleClose={closeModal}
    >
      <GridRow align="flexStart" alignItems="flexStart">
        <GridColumn span={['7/8', '5/8']}>
          <Text variant="h4" as="h2" marginBottom={1}>
            {type === 'mail' && formatMessage(msg.dropModalTelTitle)}
            {type === 'tel' && formatMessage(msg.dropModalEmailTitle)}
            {type === 'all' && formatMessage(msg.dropModalAllTitle)}
          </Text>
          <Text>
            {type === 'mail' && formatMessage(msg.dropModalTelText)}
            {type === 'tel' && formatMessage(msg.dropModalEmailText)}
            {type === 'all' && formatMessage(msg.dropModalAllText)}
          </Text>
        </GridColumn>
        <GridColumn span={['1/8', '3/8']}>
          {type === 'tel' ? (
            <Hidden below="sm">
              <img
                src="assets/images/retirement.svg"
                alt="Skrautmynd"
                style={{ float: 'right' }}
                width="80%"
              />
            </Hidden>
          ) : (
            <Hidden below="sm">
              <img
                src="assets/images/jobsGrid.svg"
                alt="Skrautmynd"
                width="80%"
                style={{ float: 'right' }}
              />
            </Hidden>
          )}
        </GridColumn>
        <GridColumn span="7/8">
          <Box marginTop={4} display="flex" flexDirection="row">
            <Box paddingRight={2}>
              <Button onClick={onCloseSideEffect} size="small">
                {formatMessage(msg.dropModalContinue)}
              </Button>
            </Box>
            <Box>
              <Button onClick={onDrop} variant="ghost" size="small">
                {formatMessage(msg.dropModalDrop)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
    </Modal>
  )
}