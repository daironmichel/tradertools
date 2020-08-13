import { IBroker } from './common';
import ETrade from './etrade';

export enum Broker {
  ETrade,
  TDAmeritrade,
  InteractiveBrokers,
}

export type BrokerName = keyof typeof Broker;

export function getBrokerInstance(broker: Broker): IBroker {
  switch (broker) {
    case Broker.ETrade:
      return new ETrade();
    default:
      throw 'Invalid broker';
  }
}
