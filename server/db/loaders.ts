import db from './db';
import DataLoader from 'dataloader';
import { IUser } from './tables';

const userLoader = new DataLoader((ids: readonly number[]) =>
  db<IUser>('User')
    .whereIn('id', ids)
    .select(['id', 'username', 'firstName', 'lastName'])
    .then((rows) => ids.map((id) => rows.find((x) => x.id === id)))
);

const loaders = {
  user: userLoader,
};

export type Loaders = typeof loaders;

export default loaders;
