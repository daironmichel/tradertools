import { gql, IResolverObject, IResolvers, MergeInfo } from 'apollo-server-hapi';
import { MaybeUserRecord } from '../db';
import { Context } from './common';
import { fromGlobalId, toGlobalId } from 'graphql-relay';
import { GraphQLResolveInfo } from 'graphql';

export const typeDefinitions = gql`
  interface Node {
    id: ID!
  }

  type UserNode implements Node {
    id: ID!
    username: String!
    firstName: String
    lastName: String
  }

  type Query {
    node(id: ID!): Node
    user(id: Int!): UserNode
  }
`;

interface INode {
  id: string | number;
}

function nodeResolvers(resolvers?: IResolverObject<INode, Context>): IResolverObject<INode, Context> {
  const nodeFields: IResolverObject<INode, Context> = {
    __isTypeOf() {
      return this.name;
    },
    id: (
      source: INode,
      _args: unknown,
      _context: Context,
      info: GraphQLResolveInfo & { mergeInfo: MergeInfo }
    ): string => {
      return toGlobalId(info.parentType.name, source.id.toString());
    },
  };

  return resolvers ? Object.assign(nodeFields, resolvers) : nodeFields;
}

type NodeResolverArgs = {
  id: string;
};

type UserResolverArgs = {
  id: number;
};

const UserNode: IResolverObject<INode, Context> = nodeResolvers();

const Query: IResolverObject<{}, Context> = {
  node: async (_query, args: NodeResolverArgs, context: Context, _info): Promise<unknown> => {
    const itemInfo = fromGlobalId(args.id);
    const itemId = parseInt(itemInfo.id) || 0;

    if (itemInfo.type === 'UserNode') {
      return await context.loaders.user.load(itemId);
    }
    return null;
  },

  user: async (_query, args: UserResolverArgs, context: Context): Promise<MaybeUserRecord> => {
    return await context.loaders.user.load(args.id);
  },
};

export const typeResolvers: IResolvers<{}, Context> = {
  Query,
  UserNode,
};
