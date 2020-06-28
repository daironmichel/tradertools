import { GraphQLSchema } from 'graphql';
import { QueryType } from './types';
import { MutationType } from './mutations';

export * from './types';
export * from './mutations';
export * from './common';

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
