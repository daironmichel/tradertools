import React, { Component } from 'react';
import { Flex, Box } from 'rebass';
import { createFragmentContainer, graphql } from 'react-relay';
import { PositionListItem_position as Position } from 'gen/PositionListItem_position.graphql';
import { Button, Intent, Card, Text, Colors, Icon, ButtonGroup } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import SellStockMutation from 'mutations/Order/SellStockMutation';
import PlaceStopLossMutation from 'mutations/Order/PlaceStopLossMutation';
import toaster from '../toaster';
import At from 'components/generic/At';

interface Props {
  position: Position;
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

  handleStopLossOnClick = (): void => {
    const { position, providerId } = this.props;
    this.placeStopLoss(providerId, position.symbol);
  };

  placeStopLoss = (providerId: string, symbol: string): void => {
    this.setState({ loading: true });
    const sell = new PlaceStopLossMutation();
    sell.commit({ providerId, symbol }, this.placeStopLossCompleted, this.placeStopLossError);
  };

  placeStopLossCompleted = (): void => {
    this.setState({ loading: false });
    toaster.showSuccess('Sell order placed.');
  };

  placeStopLossError = (): void => {
    this.setState({ loading: false });
  };

  render(): JSX.Element {
    const { position } = this.props;
    const { loading } = this.state;
    const totalGain = position.totalGain as string;
    const totalGainPct = position.totalGainPct as string;
    const loss = parseFloat(totalGain) < 0;
    const gainDisplay = totalGain.replace('-', '');
    const gainPercentDisplay = totalGainPct.replace('-', '');
    return (
      <Card css={{ padding: 0 }}>
        <Flex alignItems="center">
          <Box flex="1" m={2}>
            {position.symbol}
          </Box>
          <Flex m={2} justifyContent="flex-end">
            {position.quantity}
            <At />
            {position.pricePaid}
          </Flex>
          <Flex m={2} justifyContent="flex-end">
            {loss ? '-' : ''}${gainDisplay}
          </Flex>
          <Flex m={2} justifyContent="flex-end">
            <Text css={{ color: loss ? Colors.RED3 : Colors.GREEN3 }}>
              <Icon icon={loss ? IconNames.ARROW_DOWN : IconNames.ARROW_UP} iconSize={12} css={{ paddingBottom: 2 }} />{' '}
              <span>{gainPercentDisplay} %</span>
            </Text>
          </Flex>
          <ButtonGroup css={{ margin: '-1px -1px -1px 2px' }}>
            <Button
              large
              intent={Intent.WARNING}
              text="Stop"
              loading={loading}
              onClick={this.handleStopLossOnClick}
              css={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            />
            <Button large intent={Intent.DANGER} text="Sell" loading={loading} onClick={this.handleSellOnClick} />
          </ButtonGroup>
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
      totalGainPct
    }
  `,
});