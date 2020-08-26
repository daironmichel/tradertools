import { Context, createGraphQLEnumValues, GraphQLTimestamp } from './common';
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
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { Broker } from '../providers';
import { Maybe } from 'graphql/jsutils/Maybe';
import { isBrokerAuth, isUser } from '../db';

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

    if (itemInfo.type === BrokerAuthNode.name) {
      return await context.loaders.brokerAuth.load(itemId);
    }
    return null;
  },
};

export const UserNode = new GraphQLObjectType({
  name: 'UserNode',
  interfaces: [Node],
  isTypeOf: isUser,
  fields: () => ({
    id: NodeId,
    username: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    brokerAuths: { type: new GraphQLList(BrokerAuthNode) },
  }),
});

export const BrokerEnum = new GraphQLEnumType({
  name: 'BrokerEnum',
  values: createGraphQLEnumValues(Broker),
});

export const BrokerAuthNode = new GraphQLObjectType({
  name: 'BrokerAuthNode',
  interfaces: [Node],
  isTypeOf: isBrokerAuth,
  fields: () => ({
    id: NodeId,
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    broker: { type: new GraphQLNonNull(BrokerEnum) },
    oauth1AccessTokenExpiresAt: { type: new GraphQLNonNull(GraphQLTimestamp) },
    oauth1RefreshTokenExpiresAt: { type: new GraphQLNonNull(GraphQLTimestamp) },
  }),
});

export const ViewerType = new GraphQLObjectType({
  name: 'ViewerType',
  fields: () => ({
    foo: { type: new GraphQLNonNull(GraphQLString), resolve: () => 'fuz' },
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
