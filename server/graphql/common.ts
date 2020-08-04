import { Loaders, User } from '../db';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Maybe } from 'graphql/jsutils/Maybe';

export type Context = {
  request: FastifyRequest;
  reply: FastifyReply<unknown>;
  loaders: Loaders;
  user: Maybe<User>;
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
