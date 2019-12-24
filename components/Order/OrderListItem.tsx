import React, { Component } from 'react';
import { Flex, Box } from 'rebass';
import { createFragmentContainer, graphql } from 'react-relay';
import { OrderListItem_order as Order } from '../../__generated__/OrderListItem_order.graphql';
import { Button, Intent, Card } from '@blueprintjs/core';
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
    toaster.showSuccess('Order cancelled.');
  };

  cancelOrderError = (): void => {
    this.setState({ loading: false });
  };

  render(): JSX.Element {
    const { order } = this.props;
    const { loading } = this.state;
    return (
      <Card css={{ padding: 0 }}>
        <Flex alignItems="center">
          <Box flex="1" m={2}>
            {order.symbol}
          </Box>
          <Flex m={2} justifyContent="flex-end">
            {order.quantity}@{order.limitPrice}
          </Flex>
          <Box m={2}>{order.status}</Box>
          <Box ml={2}>
            <Button
              large
              icon={IconNames.CROSS}
              intent={Intent.DANGER}
              loading={loading}
              disabled={order.status === 'EXECUTED' || order.status === 'REJECTED'}
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
      status
    }
  `,
});
