import React, { Component } from "react";
import { Flex, Box } from "rebass";
import { createFragmentContainer, graphql } from "react-relay";
import { OrderListItem_order } from "./__generated__/OrderListItem_order.graphql";
import { Button, Intent, Card } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

interface Props {
  order: OrderListItem_order;
}

class OrderListItem extends Component<Props> {
  render() {
    const { order } = this.props;
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
            <Button large minimal icon={IconNames.CROSS} intent={Intent.DANGER} />
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
  `
});
