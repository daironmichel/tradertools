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
  Tooltip,
  Classes,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import SellStockMutation from 'mutations/Order/SellStockMutation';
import StopLossMutation from 'mutations/Order/StopLossMutation';
import toaster from '../toaster';
import At from 'components/generic/At';
import Small from 'components/generic/Small';
import AutoPilotONMutation from 'mutations/Position/AutoPilotON';
import AutoPilotOFFMutation from 'mutations/Position/AutoPilotOFF';
import { AutoPilotONMutationResponse } from 'gen/AutoPilotONMutation.graphql';
import { AutoPilotOFFMutationResponse } from 'gen/AutoPilotOFFMutation.graphql';

interface Props {
  position: Position;
  providerId: string;
  selectedStrategyId?: number;
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

  handleAutoPilotOnClick = (): void => {
    const { position, providerId, selectedStrategyId } = this.props;
    if (!selectedStrategyId) return;
    this.autoPilotON(providerId, selectedStrategyId.toString(), position.symbol);
  };

  autoPilotON = (providerId: string, strategyId: string, symbol: string): void => {
    this.setState({ loading: true });
    const apON = new AutoPilotONMutation();
    apON.commit({ providerId, strategyId, symbol }, this.autoPilotONCompleted, this.autoPilotONError);
  };

  autoPilotONCompleted = (response: AutoPilotONMutationResponse): void => {
    this.setState({ loading: false });
    if (!response.autoPilotOn.error) {
      toaster.showSuccess('Auto Pilot Engaged.');
    }
  };

  autoPilotONError = (): void => {
    this.setState({ loading: false });
  };

  handleAutoPilotOffClick = (): void => {
    const { position } = this.props;
    this.autoPilotOFF(position.symbol);
  };

  autoPilotOFF = (symbol: string): void => {
    this.setState({ loading: true });
    const apOFF = new AutoPilotOFFMutation();
    apOFF.commit({ symbol }, this.autoPilotOFFCompleted, this.autoPilotOFFError);
  };

  autoPilotOFFCompleted = (response: AutoPilotOFFMutationResponse): void => {
    this.setState({ loading: false });
    if (!response.autoPilotOff.error) {
      toaster.showSuccess('Auto Pilot Disengaged.');
    }
  };

  autoPilotOFFError = (): void => {
    this.setState({ loading: false });
  };

  render(): JSX.Element {
    const { position, selectedStrategyId } = this.props;
    const { loading } = this.state;
    const totalGain = position.totalGain as string;
    const totalGainPct = position.totalGainPct as string;
    const loss = parseFloat(totalGain) < 0;
    const gainDisplay = totalGain.replace('-', '');
    const gainPercentDisplay = totalGainPct.replace('-', '');
    const autopilot = position.autopilot;
    return (
      <Card css={{ padding: 0 }}>
        <Flex alignItems="center">
          <Box flex="1" m={2}>
            <Flex alignItems="center">
              <Box>{position.symbol}</Box>
              {autopilot && (
                <Box css={{ '> *': { marginLeft: 5 } }}>
                  {autopilot.status === 'READY' && <Icon icon={IconNames.DRIVE_TIME} />}
                  {autopilot.status === 'RUNNING' && (
                    <>
                      <Icon icon={IconNames.TAXI} intent={Intent.SUCCESS} />
                      {autopilot.state === 'WATCHING' && <Icon icon={IconNames.EYE_OPEN} />}
                      {autopilot.state === 'BUYING' && <Icon icon={IconNames.ADD} />}
                      {autopilot.state === 'SELLING' && <Icon icon={IconNames.REMOVE} />}
                    </>
                  )}
                  {autopilot.status === 'PAUSED' && (
                    <>
                      <Icon icon={IconNames.DRIVE_TIME} className={Classes.TEXT_DISABLED} />
                      <Tooltip content={autopilot.errorMessage} intent={Intent.WARNING}>
                        <Icon icon={IconNames.WARNING_SIGN} intent={Intent.WARNING} />
                      </Tooltip>
                    </>
                  )}
                </Box>
              )}
            </Flex>
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
                  <Menu.Divider />
                  <Menu.Item
                    icon={<Icon icon={IconNames.POWER} intent={Intent.SUCCESS} />}
                    text="Auto Pilot ON"
                    disabled={!selectedStrategyId}
                    onClick={this.handleAutoPilotOnClick}
                  />
                  <Menu.Item
                    icon={<Icon icon={IconNames.POWER} intent={Intent.DANGER} />}
                    text="Auto Pilot OFF"
                    disabled={!autopilot}
                    onClick={this.handleAutoPilotOffClick}
                  />
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
      autopilot {
        status
        state
        errorMessage
      }
    }
  `,
});
