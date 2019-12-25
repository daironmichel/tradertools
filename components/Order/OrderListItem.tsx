import React, { Component } from 'react';
import { Flex, Box } from 'rebass';
import { createFragmentContainer, graphql } from 'react-relay';
import { OrderListItem_order as Order } from '../../__generated__/OrderListItem_order.graphql';
import { Button, Intent, Card, Text, Colors, Tooltip } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import CancelOrderMutation from '../../mutations/Order/CancelOrderMutation';
import toaster from '../toaster';

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

  cancelAllowed = (status: string): boolean => {
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
    const priceToShow = order.status === 'EXECUTED' ? order.executionPrice : order.limitPrice;
    const cancelDisabled = !this.cancelAllowed(order.status);
    return (
      <Card css={{ padding: 0 }}>
        <Flex alignItems="center">
          <Box flex="1" m={2}>
            {order.symbol}
          </Box>
          <Flex m={2} justifyContent="flex-end">
            <Text>
              <span css={{ color: actionColor }}>{order.action}</span> {order.quantity}@{priceToShow}
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
      executionPrice
      status
      action
    }
  `,
});
