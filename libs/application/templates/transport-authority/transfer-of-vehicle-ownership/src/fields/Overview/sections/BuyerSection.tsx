// Buyer and buyers coowner + button for buyer to add more coowners or operators
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { information, overview } from '../../../lib/messages'
import { ReviewGroup } from '../../ReviewGroup'
import { ReviewScreenProps } from '../../../types'
import { hasReviewerApproved } from '../../../utils'

export const BuyerSection: FC<FieldBaseProps & ReviewScreenProps> = ({
  application,
  setStep,
  reviewerNationalId = '',
}) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const onButtonClick = () => {
    setStep && setStep('addPeople')
  }

  const isBuyer =
    (getValueViaPath(answers, 'buyer.nationalId', '') as string) ===
    reviewerNationalId

  return (
    <ReviewGroup
      editMessage={
        isBuyer && !hasReviewerApproved(reviewerNationalId, answers)
          ? formatMessage(overview.labels.addCoOwnerAndOperatorButton)
          : undefined
      }
      isLast
      handleClick={onButtonClick}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text variant="h4">
            {formatMessage(information.labels.buyer.title)}
          </Text>
          <Text>{getValueViaPath(answers, 'buyer.name', '') as string}</Text>
          <Text>
            {getValueViaPath(answers, 'buyer.nationalId', '') as string}
          </Text>
          <Text>{getValueViaPath(answers, 'buyer.email', '') as string}</Text>
          <Text>{getValueViaPath(answers, 'buyer.phone', '') as string}</Text>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
