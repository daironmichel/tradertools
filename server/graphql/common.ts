import { Loaders, User } from '../db';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Maybe } from 'graphql/jsutils/Maybe';
import { GraphQLEnumValueConfigMap } from 'graphql';

export type Context = {
  request: FastifyRequest;
  reply: FastifyReply;
  loaders: Loaders;
  user: Maybe<Partial<User>>;
};

export type IntIdArg = {
  id: number;
};

export type NodeIdArg = {
  id: string;
};

export type ClientCredentials = {
  id: number;
};

export type ServerCredentials = {
  user: Maybe<User>;
};

export type VerifiedToken = {
  decodedJWT: ClientCredentials | null;
  token: string | null;
};

export function createGraphQLEnumValues(numericEnum: any): GraphQLEnumValueConfigMap {
  const enumKeys = Object.keys(numericEnum);
  const props = enumKeys.slice(enumKeys.length / 2);
  const graphqlFields: GraphQLEnumValueConfigMap = {};
  props.forEach((prop) => (graphqlFields[prop] = { value: numericEnum[prop] }));
  return graphqlFields;
}
