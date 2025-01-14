// All operators
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { information } from '../../../lib/messages'
import { ReviewScreenProps } from '../../../types'
import { ReviewGroup } from '../../ReviewGroup'

export const OperatorSection: FC<FieldBaseProps & ReviewScreenProps> = ({
  coOwnersAndOperators = [],
}) => {
  const { formatMessage } = useLocale()

  const operators = coOwnersAndOperators.filter((x) => x.type === 'operator')

  return operators.length > 0 ? (
    <ReviewGroup isLast>
      <GridRow>
        {operators?.map(({ name, nationalId, email, phone }, index: number) => {
          if (name.length === 0) return null
          return (
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              key={`operator-${index}`}
            >
              <Box marginBottom={operators.length === index + 1 ? 0 : 2}>
                <Text variant="h4">
                  {formatMessage(information.labels.operator.title)}{' '}
                  {operators.length > 1 ? index + 1 : ''}{' '}
                  {operators.length > 1 && index === 0
                    ? `(${formatMessage(information.labels.operator.main)})`
                    : ''}
                </Text>
                <Text>{name}</Text>
                <Text>{nationalId}</Text>
                <Text>{email}</Text>
                <Text>{phone}</Text>
              </Box>
            </GridColumn>
          )
        })}
      </GridRow>
    </ReviewGroup>
  ) : null
}
