import knex from 'knex';
import { production, development } from '../knexfile';

const db = process.env.NODE_ENV === 'production' ? knex(production) : knex(development);

export default db;
