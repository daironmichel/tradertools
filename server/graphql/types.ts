import { gql, IResolverObject, IResolvers } from 'apollo-server-hapi';
import { MaybeUserRecord } from '../db';
import { Context, IntIdArg } from './common';

export const typeDefinitions = gql`
  type Query {
    user(id: Int!): User
  }

  type User {
    username: String!
    firstName: String
    lastName: String
  }
`;

const Query: IResolverObject<{}, Context> = {
  user: async (_query, args: IntIdArg, context: Context, _info): Promise<MaybeUserRecord> => {
    return await context.loaders.user.load(args.id);
  },
};

export const typeResolvers: IResolvers<{}, Context> = {
  Query,
};
