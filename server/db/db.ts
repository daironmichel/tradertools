import knex from 'knex';
import { production, development } from '../../knexfile';

export default process.env.NODE_ENV === 'production' ? knex(production) : knex(development);

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

export type UserRecord = Partial<User>;
export type MaybeUserRecord = UserRecord | null | undefined;
