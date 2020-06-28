import { MaybeUserRecord } from '../db';
import { Context } from './common';
import { fromGlobalId, toGlobalId } from 'graphql-relay';
import {
  GraphQLResolveInfo,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInterfaceType,
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';

interface INode {
  id: string | number;
}

const NodeId: GraphQLFieldConfig<INode, Context> = {
  type: new GraphQLNonNull(GraphQLID),
  resolve: async (source: INode, _args: Object, _context: Context, info: GraphQLResolveInfo) => {
    return toGlobalId(info.parentType.name, source.id.toString());
  },
};

export const Node = new GraphQLInterfaceType({
  name: 'Node',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export const UserNode = new GraphQLObjectType({
  name: 'UserNode',
  interfaces: [Node],
  isTypeOf: () => true,
  fields: {
    id: NodeId,
    username: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  },
});

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: {
      type: Node,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_source: Object, args: { [argName: string]: any }, context: Context, _info): Promise<unknown> => {
        const itemInfo = fromGlobalId(args.id);
        const itemId = parseInt(itemInfo.id) || 0;

        if (itemInfo.type === 'UserNode') {
          return await context.loaders.user.load(itemId);
        }
        return null;
      },
    },

    user: {
      type: UserNode,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (
        _source: Object,
        args: { [argName: string]: any },
        context: Context,
        _info
      ): Promise<MaybeUserRecord> => {
        return await context.loaders.user.load(args.id);
      },
    },
  },
});
