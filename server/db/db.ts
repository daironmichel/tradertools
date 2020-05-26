import knex from 'knex';
import { production, development } from '../../knexfile';

export default process.env.NODE_ENV === 'production' ? knex(production) : knex(development);
