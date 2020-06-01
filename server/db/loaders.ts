import db, { MaybeUserRecord, User, UserRecord } from './db';
import DataLoader from 'dataloader';

export type Loaders = {
  user: DataLoader<number, MaybeUserRecord>;
};

function userLoader(ids: readonly number[]) {
  return db<User>('User')
    .whereIn('id', ids)
    .select(['id', 'username', 'firstName', 'lastName'])
    .then((rows: UserRecord[]) => ids.map((id) => rows.find((x) => x.id === id)));
}

export function getLoaders(): Loaders {
  return {
    user: new DataLoader(userLoader),
  };
}
