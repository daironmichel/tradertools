export enum Broker {
  ETrade,
  TDAmeritrade,
  InteractiveBrokers,
}

export type BrokerName = keyof typeof Broker;

export interface IBroker {
  getAuthorizeURL: () => string;
}
