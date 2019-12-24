/* eslint-disable @typescript-eslint/camelcase */
import React, { Component } from 'react';
import { Flex, Box } from 'rebass';
import { createFragmentContainer, graphql } from 'react-relay';
import { PositionListItem_position } from '../../__generated__/PositionListItem_position.graphql';
import { Button, Intent, Card } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import SellStockMutation from '../../mutations/Order/SellStockMutation';
import toaster from '../toaster';

interface Props {
  position: PositionListItem_position;
  providerId: string;
}

interface State {
  loading: boolean;
}

class PositionListItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  handleSellOnClick = (): void => {
    const { position, providerId } = this.props;
    this.sellStock(providerId, position.symbol);
  };

  sellStock = (providerId: string, symbol: string): void => {
    this.setState({ loading: true });
    const sell = new SellStockMutation();
    sell.commit({ providerId, symbol }, this.sellStockCompleted, this.sellStockError);
  };

  sellStockCompleted = (): void => {
    this.setState({ loading: false });
    toaster.showSuccess('Sell order placed.');
  };

  sellStockError = (): void => {
    this.setState({ loading: false });
  };

  render(): JSX.Element {
    const { position } = this.props;
    const { loading } = this.state;
    return (
      <Card css={{ padding: 0 }}>
        <Flex alignItems="center">
          <Box flex="1" m={2}>
            {position.symbol}
          </Box>
          <Flex m={2} justifyContent="flex-end">
            {position.quantity}@{position.pricePaid}
          </Flex>
          <Flex m={2} justifyContent="flex-end">
            {new String(position.totalGain)}
          </Flex>
          <Box ml={2}>
            <Button
              large
              intent={Intent.DANGER}
              icon={IconNames.DOLLAR}
              loading={loading}
              onClick={this.handleSellOnClick}
              css={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, margin: -1 }}
            />
          </Box>
        </Flex>
      </Card>
    );
  }
}

export default createFragmentContainer(PositionListItem, {
  position: graphql`
    fragment PositionListItem_position on PositionType {
      symbol
      quantity
      pricePaid
      totalGain
    }
  `,
});
