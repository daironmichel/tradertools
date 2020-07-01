import { Loaders, MaybeUserRecord } from '../db';
import { FastifyReply, FastifyRequest } from 'fastify';

export type Context = {
  request: FastifyRequest,
  reply: FastifyReply<unknown>,
  loaders: Loaders;
  user: MaybeUserRecord;
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
  user: MaybeUserRecord;
};

export type VerifiedToken = {
  decodedJWT: ClientCredentials | null;
  token: string | null;
};
