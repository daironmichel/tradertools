import knex from 'knex';
import { production, development } from '../../knexfile';

export default process.env.NODE_ENV === 'production' ? knex(production) : knex(development);

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  tokenVersion: number;
}

export type UserRecord = Partial<User>;
export type MaybeUserRecord = UserRecord | null | undefined;

export interface Broker {
  id: number;
  name: string;
  userId: number;
  oauth1RequestToken: string;
  oauth1RequestTokenSecret: string;
  oauth1AccessToken: string;
  oauth1AccessTokenSecret: string;
  oauth1RefreshToken: string;
  oauth1AccessTokenExpiresAt: Date;
  oauth1RefreshTokenExpiresAt: Date;
  user?: MaybeUserRecord;
}

export type BrokerRecord = Partial<Broker>;
export type MaybeBrokerRecord = BrokerRecord | null | undefined;
