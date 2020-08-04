export const Brokers = {
  ETrade: 'ETrade',
  TDAmeritrade: 'TDAmeritrade',
  InteractiveBrokers: 'InteractiveBrokers',
};

export interface IBroker {
  getAuthorizeURL: () => string;
}
