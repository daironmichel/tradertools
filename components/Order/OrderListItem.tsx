import React, { Component } from 'react';
import { Flex, Box } from 'rebass';
import { createFragmentContainer, graphql } from 'react-relay';
import { OrderListItem_order as Order } from '../../__generated__/OrderListItem_order.graphql';
import { Button, Intent, Card, Text, Colors, Tooltip } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import CancelOrderMutation from '../../mutations/Order/CancelOrderMutation';
import toaster from '../toaster';
import At from 'components/generic/At';
import Small from 'components/generic/Small';

type OrderStatus = 'EXECUTED' | 'CANCELLED' | 'OPEN' | 'REJECTED' | 'PARTIAL' | 'INDIVIDUAL_FILLS';

const OrderQuantity = (props: { filledQuantity: number; orderedQuantity: number }): JSX.Element | null => {
  const { orderedQuantity, filledQuantity } = props;
  const pendingQuantity = orderedQuantity - filledQuantity;

  if (filledQuantity > 0 && filledQuantity < orderedQuantity) {
    return (
      <div css={{ margin: 0, textAlign: 'right' }}>
        <Small>pending {pendingQuantity}</Small>
        <Small>filled {filledQuantity}</Small>
      </div>
    );
  }
  return <span>{orderedQuantity}</span>;
};

const OrderPrice = (props: {
  status: OrderStatus;
  limitPrice: string;
  stopPrice: string;
  stopLimitPrice: string;
  executionPrice: string;
}): JSX.Element | null => {
  const { stopPrice = '0', stopLimitPrice = '0', executionPrice = '0', limitPrice = '0', status } = props;
  if (['EXECUTED', 'PARTIAL', 'INDIVIDUAL_FILLS'].includes(status)) return <span>{executionPrice}</span>;
  const noStopPrice = !stopPrice || stopPrice === '0';
  const noStopLimitPrice = !stopLimitPrice || stopLimitPrice === '0';
  if (noStopPrice && noStopLimitPrice) return <span>{limitPrice}</span>;
  return (
    <div css={{ margin: 0 }}>
      {noStopLimitPrice && <Small>{stopPrice} stop</Small>}
      {noStopPrice && <Small>{stopLimitPrice} slimit</Small>}
      <Small>{limitPrice} limit</Small>
    </div>
  );
};

interface Props {
  order: Order;
  providerId: string;
}

interface State {
  loading: boolean;
}

class OrderListItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  cancelAllowed = (status: OrderStatus): boolean => {
    return ['OPEN', 'INDIVIDUAL_FILLS', 'PARTIAL'].includes(status);
  };

  handleCancelOnClick = (): void => {
    const { order, providerId } = this.props;
    this.cancelOrder(providerId, order.orderId);
  };

  cancelOrder = (providerId: string, orderId: string): void => {
    this.setState({ loading: true });
    const cancel = new CancelOrderMutation();
    cancel.commit({ providerId, orderId }, this.cancelOrderCompleted, this.cancelOrderError);
  };

  cancelOrderCompleted = (): void => {
    this.setState({ loading: false });
    toaster.showSuccess('Cancel requested.');
  };

  cancelOrderError = (): void => {
    this.setState({ loading: false });
  };

  render(): JSX.Element {
    const { order } = this.props;
    const { loading } = this.state;
    const {
      status,
      symbol,
      action,
      limitPrice,
      stopPrice,
      stopLimitPrice,
      executionPrice,
      filledQuantity,
      orderedQuantity,
    } = order;
    const cancelDisabled = !this.cancelAllowed(status as OrderStatus);
    let actionColor = action.startsWith('BUY') ? Colors.GREEN3 : Colors.RED3;
    if (status === 'CANCELLED') actionColor = Colors.DARK_GRAY1;
    return (
      <Card css={{ padding: 0, backgroundColor: status === 'EXECUTED' ? '#d5f5e8' : undefined }}>
        <Flex alignItems="center" css={{ opacity: status === 'CANCELLED' ? 0.3 : 1 }}>
          <Box flex="1" m={2}>
            {symbol}
          </Box>
          <Box m={2}>
            <span css={{ color: actionColor }}>{action}</span>{' '}
          </Box>
          <Flex m={2} justifyContent="flex-end" minWidth={80}>
            <Text>
              <div css={{ display: 'inline-block' }}>
                <Flex alignItems="center">
                  <OrderQuantity orderedQuantity={orderedQuantity} filledQuantity={filledQuantity} />
                  <At />
                  <OrderPrice
                    status={status as OrderStatus}
                    limitPrice={(limitPrice as string) || ''}
                    stopPrice={(stopPrice as string) || ''}
                    stopLimitPrice={(stopLimitPrice as string) || ''}
                    executionPrice={(executionPrice as string) || ''}
                  />
                </Flex>
              </div>
            </Text>
          </Flex>
          <Box m={2}>
            <Tooltip content={status}>
              <span>{status.substring(0, 2)}</span>
            </Tooltip>
          </Box>
          <Box ml={2}>
            <Button
              large
              icon={IconNames.CROSS}
              intent={cancelDisabled ? Intent.NONE : Intent.DANGER}
              loading={loading}
              disabled={cancelDisabled}
              onClick={this.handleCancelOnClick}
              css={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, margin: -1 }}
            />
          </Box>
        </Flex>
      </Card>
    );
  }
}

export default createFragmentContainer(OrderListItem, {
  order: graphql`
    fragment OrderListItem_order on OrderType {
      orderId
      symbol
      filledQuantity
      orderedQuantity
      limitPrice
      stopPrice
      stopLimitPrice
      executionPrice
      status
      action
    }
  `,
});
