import knex from 'knex';
import { production, development } from '../../knexfile';

const db = process.env.NODE_ENV === 'production' ? knex(production) : knex(development);

export interface User {
  id: number;
  username: string;
  password: string;
  firstName: string; // default: ''
  lastName: string; // default: ''
  tokenVersion: number; // default: 0
}

export const Users = <TResult = User[]>() => db<User, TResult>('User');
export function isUser(obj: any): obj is User {
  const user = obj as User;
  return user.username !== undefined;
}

export interface BrokerAuth {
  id: number;
  broker: number; // enum server/providers/index.ts:Broker
  userId: number;
  oauth1RequestToken: string; // default: ''
  oauth1RequestTokenSecret: string; // default: ''
  oauth1AccessToken: string; // default: ''
  oauth1AccessTokenSecret: string; // default: ''
  oauth1RefreshToken: string; // default: ''
  oauth1AccessTokenExpiresAt: Date; // default: current timestamp
  oauth1RefreshTokenExpiresAt: Date; // default: current timestamp

  // other props
  user?: Partial<User>;
}

export const BrokerAuths = <TResult = BrokerAuth[]>() => db<BrokerAuth, TResult>('BrokerAuth');
export function isBrokerAuth(obj: any): obj is BrokerAuth {
  const brokerAuth = obj as BrokerAuth;
  return brokerAuth.broker !== undefined && brokerAuth.oauth1AccessTokenExpiresAt !== undefined;
}

export default db;
