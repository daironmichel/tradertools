import { Loaders, MaybeUserRecord } from '../db';

export type Context = {
  loaders: Loaders;
  user: MaybeUserRecord;
};

export type IntIdArg = {
  id: number;
};

export type NodeIdArg = {
  id: string;
};
