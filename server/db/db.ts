import knex from 'knex';
import { production, development } from '../../knexfile';
import { Maybe } from 'graphql/jsutils/Maybe';

export default process.env.NODE_ENV === 'production' ? knex(production) : knex(development);

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  tokenVersion?: number;
}

export interface BrokerAuth {
  id?: number;
  name?: string;
  userId?: number;
  oauth1RequestToken?: string;
  oauth1RequestTokenSecret?: string;
  oauth1AccessToken?: string;
  oauth1AccessTokenSecret?: string;
  oauth1RefreshToken?: string;
  oauth1AccessTokenExpiresAt?: Date;
  oauth1RefreshTokenExpiresAt?: Date;
  user?: Maybe<User>;
}
