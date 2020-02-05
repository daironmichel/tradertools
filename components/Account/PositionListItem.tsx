import React, { Component } from 'react';
import { Flex, Box } from 'rebass';
import { createFragmentContainer, graphql } from 'react-relay';
import { PositionListItem_position as Position } from 'gen/PositionListItem_position.graphql';
import {
  Button,
  Intent,
  Card,
  Colors,
  Icon,
  ButtonGroup,
  Popover,
  Menu,
  Position as MenuPosition,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import SellStockMutation from 'mutations/Order/SellStockMutation';
import StopLossMutation from 'mutations/Order/StopLossMutation';
import StopProfitMutation from 'mutations/Order/StopProfitMutation';
import toaster from '../toaster';
import At from 'components/generic/At';
import Small from 'components/generic/Small';

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
    this.stopLoss(providerId, position.symbol);
  };

  stopLoss = (providerId: string, symbol: string): void => {
    this.setState({ loading: true });
    const sell = new StopLossMutation();
    sell.commit({ providerId, symbol }, this.stopLossCompleted, this.stopLossError);
  };

  stopLossCompleted = (): void => {
    this.setState({ loading: false });
    toaster.showSuccess('Sell order placed.');
  };

  stopLossError = (): void => {
    this.setState({ loading: false });
  };

  handleStopProfitOnClick = (): void => {
    const { position, providerId } = this.props;
    this.stopProfit(providerId, position.symbol);
  };

  stopProfit = (providerId: string, symbol: string): void => {
    this.setState({ loading: true });
    const sell = new StopProfitMutation();
    sell.commit({ providerId, symbol }, this.stopProfitCompleted, this.stopProfitError);
  };

  stopProfitCompleted = (): void => {
    this.setState({ loading: false });
    toaster.showSuccess('Sell order placed.');
  };

  stopProfitError = (): void => {
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
          <Flex m={2} justifyContent="center" flexDirection="column" alignItems="flex-end" minWidth={64}>
            <Small css={{ color: loss ? Colors.RED3 : Colors.GREEN3 }}>
              <Icon icon={loss ? IconNames.ARROW_DOWN : IconNames.ARROW_UP} iconSize={8} css={{ paddingBottom: 2 }} />{' '}
              <span>{gainPercentDisplay} %</span>
            </Small>
            <Small>{loss ? `($${gainDisplay})` : `$${gainDisplay}`}</Small>
          </Flex>
          <ButtonGroup
            css={{
              margin: '-1px -1px -1px 2px',
              '> *:first-child': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
            }}
          >
            <Button large intent={Intent.DANGER} text="Sell" loading={loading} onClick={this.handleSellOnClick} />
            <Popover
              position={MenuPosition.TOP_LEFT}
              content={
                <Menu>
                  <Menu.Item icon={IconNames.BAN_CIRCLE} text="Stop Loss" onClick={this.handleStopLossOnClick} />
                  <Menu.Item icon={IconNames.BAN_CIRCLE} text="Stop Profit" onClick={this.handleStopProfitOnClick} />
                  <Menu.Item icon={IconNames.TAXI} text="Auto Pilot" />
                </Menu>
              }
            >
              <Button large intent={Intent.DANGER} icon={IconNames.CARET_DOWN} disabled={loading} />
            </Popover>
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
