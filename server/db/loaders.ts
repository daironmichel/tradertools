import db, { User } from './db';
import DataLoader from 'dataloader';
import { Maybe } from 'graphql/jsutils/Maybe';

export type Loaders = {
  user: DataLoader<number, Maybe<User>>;
};

function userLoader(ids: readonly number[]) {
  return db<User>('User')
    .whereIn('id', ids)
    .select(['id', 'username', 'firstName', 'lastName'])
    .then((rows: User[]) => ids.map((id) => rows.find((x) => x.id === id)));
}

export function getLoaders(): Loaders {
  return {
    user: new DataLoader(userLoader),
  };
}
