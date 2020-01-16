import React, { Component } from 'react';
import { Flex, Box } from 'rebass';
import { createFragmentContainer, graphql } from 'react-relay';
import { OrderListItem_order as Order } from '../../__generated__/OrderListItem_order.graphql';
import { Button, Intent, Card, Text, Colors, Tooltip } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import CancelOrderMutation from '../../mutations/Order/CancelOrderMutation';
import toaster from '../toaster';
import styled from '@emotion/styled';
import At from 'components/generic/At';

type OrderStatus = 'EXECUTED' | 'CANCELLED' | 'OPEN' | 'REJECTED' | 'PARTIAL' | 'INDIVIDUAL_FILLS';

const Small = styled.small`
  display: block;
  margin: 0;
  font-size: 10px;
  line-height: 11px;
`;

const OrderPrice = (props: {
  status: OrderStatus;
  limitPrice: string;
  stopPrice: string;
  stopLimitPrice: string;
  executionPrice: string;
}): JSX.Element | null => {
  const { stopPrice = '0', stopLimitPrice = '0', executionPrice = '0', limitPrice = '0', status } = props;
  if (['EXECUTED', 'PARTIAL', 'INDIVIDUAL_FILLS'].includes(status)) return <span>{executionPrice}</span>;
  if (stopPrice === '0' && stopLimitPrice === '0') return <span>{limitPrice}</span>;
  return (
    <div css={{ margin: 0 }}>
      <Small>{stopPrice !== '0' ? stopPrice : stopLimitPrice} stop</Small>
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
    const actionColor = order.action.startsWith('BUY') ? Colors.GREEN3 : Colors.RED3;
    const priceToShow = (
      <OrderPrice
        status={order.status as OrderStatus}
        limitPrice={(order.limitPrice as string) || ''}
        stopPrice={(order.stopPrice as string) || ''}
        stopLimitPrice={(order.stopLimitPrice as string) || ''}
        executionPrice={(order.executionPrice as string) || ''}
      />
    );
    const cancelDisabled = !this.cancelAllowed(order.status as OrderStatus);
    return (
      <Card css={{ padding: 0 }}>
        <Flex alignItems="center" css={{ opacity: order.status === 'CANCELLED' ? 0.5 : 1 }}>
          <Box flex="1" m={2}>
            {order.symbol}
          </Box>
          <Flex m={2} justifyContent="flex-end">
            <Text>
              <span css={{ color: actionColor }}>{order.action}</span>{' '}
              <div css={{ display: 'inline-block' }}>
                <Flex alignItems="center">
                  <span>{order.quantity}</span>
                  <At />
                  {priceToShow}
                </Flex>
              </div>
            </Text>
          </Flex>
          <Box m={2}>
            <Tooltip content={order.status}>
              <span>{order.status.substring(0, 2)}</span>
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
      quantity
      limitPrice
      stopPrice
      stopLimitPrice
      executionPrice
      status
      action
    }
  `,
});
