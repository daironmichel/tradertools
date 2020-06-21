import { gql, IResolverObject, IResolvers } from 'apollo-server-hapi';
import { Context } from './common';
import { MaybeUserRecord } from '../db';
import db, { User } from '../db/db';
import { compare } from '../utils';
import jwt from 'jsonwebtoken';

export const mutationDefinitions = gql`
  input LoginInput {
    username: String!
    password: String!
  }

  type LoginPayload {
    user: UserNode
    token: String
    error: String
  }

  type PublicMutations {
    login(input: LoginInput!): LoginPayload!
  }

  type Mutation {
    public: PublicMutations!
  }
`;

const Mutation: IResolverObject<{}, Context> = {
  public: () => ({}),
};

type LoginInput = {
  username: string;
  password: string;
};

type LoginPayload = {
  user?: MaybeUserRecord;
  token?: string;
  error?: string;
};

type LoginArgs = { input: LoginInput };

const PublicMutations: IResolverObject<{}, Context> = {
  login: async (_source, args: LoginArgs, context: Context): Promise<LoginPayload> => {
    if (context.user) return { error: "You're already logged in" };
    const { username, password } = args.input;
    const user: MaybeUserRecord = await db<User>('User')
      .where({ username: username })
      .select(['id', 'username', 'firstName', 'lastName', 'password'])
      .first();

    if (!user || !user.password) return { error: 'Incorrect username or password' };
    if (!compare(password, user.password)) return { error: 'Incorrect username or password' };

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) throw 'SECRET_KEY environment variables required.';

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1m' });
    delete user['password'];
    return { user, token };
  },
};

export const mutationResolvers: IResolvers<{}, Context> = {
  Mutation,
  PublicMutations,
};
