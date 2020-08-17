import knex from 'knex';
import { production, development } from '../../knexfile';

export default process.env.NODE_ENV === 'production' ? knex(production) : knex(development);

export interface User {
  id: number;
  firstName: string; // default: ''
  lastName: string; // default: ''
  username: string;
  password: string;
  tokenVersion: number; // default: 0
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
