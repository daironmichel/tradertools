import { BrokerAuth } from '../db';

export interface IBroker {
  getAuthorizeURL: (userId?: number) => Promise<string>;
  getAccess: (oathVerifier: string, brokerAuth: BrokerAuth) => Promise<boolean>;
  refreshAccess: (brokerAuth: BrokerAuth) => Promise<boolean>;
  revokeAccess: (brokerAuth: BrokerAuth) => Promise<boolean>;
}
