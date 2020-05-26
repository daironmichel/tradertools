import { gql, IResolverObject, IResolvers } from 'apollo-server-hapi';
import type { Loaders } from '../db/loaders';
import { IUser } from '../db/tables';

type Context = {
  loaders: Loaders;
};

export default gql`
  type Query {
    user(id: Int!): User
  }

  type User {
    username: String!
    firstName: String
    lastName: String
  }
`;

type NumericIdArgs = {
  id: number;
};

type QueryUserArgs = {} & NumericIdArgs;

const Query: IResolverObject<{}, Context> = {
  user: async (_source, args: QueryUserArgs, context: Context, _info): Promise<IUser | undefined> => {
    return await context.loaders.user.load(args.id);
  },
};

export const resolvers: IResolvers<{}, Context> = {
  Query,
};
