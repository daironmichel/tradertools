import { Context, createGraphQLEnumValues } from './common';
import { fromGlobalId, toGlobalId } from 'graphql-relay';
import {
  GraphQLResolveInfo,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInterfaceType,
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLEnumType,
} from 'graphql';
import { Broker } from '../providers';
import { Maybe } from 'graphql/jsutils/Maybe';

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
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const NodeField: GraphQLFieldConfig<Object, Context> = {
  type: Node,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_source, args, context, _info): Promise<Maybe<INode>> => {
    if (!context.user) {
      context.reply.status(401); // unauthorized;
      context.reply.header('WWW-Authenticate', 'https://trader.dleyva.com/login');
      return null;
    }

    const itemInfo = fromGlobalId(args.id);
    const itemId = parseInt(itemInfo.id) || 0;

    if (itemInfo.type === UserNode.name) {
      return await context.loaders.user.load(itemId);
    }
    return null;
  },
};

export const UserNode = new GraphQLObjectType({
  name: 'UserNode',
  interfaces: [Node],
  isTypeOf: () => true,
  fields: () => ({
    id: NodeId,
    username: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  }),
});

export const BrokerEnum = new GraphQLEnumType({
  name: 'BrokerEnum',
  values: createGraphQLEnumValues(Broker),
});

export const ViewerType = new GraphQLObjectType({
  name: 'ViewerType',
  fields: () => ({
    foo: { type: new GraphQLNonNull(GraphQLString), resolve: () => 'fuz' },
    bar: { type: GraphQLString, resolve: () => 'bis' },
  }),
});

export const ViewerTypeField: GraphQLFieldConfig<Object, Context> = {
  type: ViewerType,
  resolve: async (_source, _args, context) => {
    if (!context.user) {
      context.reply.status(401); // unauthorized;
      context.reply.header('WWW-Authenticate', 'https://trader.dleyva.com/login');
      return null;
    }

    return {};
  },
};

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: NodeField,
    viewer: ViewerTypeField,
  }),
});
