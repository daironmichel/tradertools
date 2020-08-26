import { BrokerAuth, BrokerAuths, User, Users } from './db';
import DataLoader from 'dataloader';
import { Maybe } from 'graphql/jsutils/Maybe';

type UserRecord = Pick<User, 'id' | 'username' | 'firstName' | 'lastName'>;

export type Loaders = {
  user: DataLoader<number, Maybe<UserRecord>>;
  brokerAuth: DataLoader<number, Maybe<BrokerAuth>>;
};

function userLoader(ids: readonly number[]) {
  return Users<UserRecord[]>()
    .whereIn('id', ids)
    .select(['id', 'username', 'firstName', 'lastName'])
    .then((rows: UserRecord[]) => ids.map((id) => rows.find((x) => x.id === id)));
}

function brokerAuthLoader(ids: readonly number[]) {
  return BrokerAuths()
    .whereIn('id', ids)
    .select('*')
    .then((rows: BrokerAuth[]) => ids.map((id) => rows.find((x) => x.id === id)));
}

export function getLoaders(): Loaders {
  return {
    user: new DataLoader(userLoader),
    brokerAuth: new DataLoader(brokerAuthLoader),
  };
}
