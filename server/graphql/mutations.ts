import { Context } from './common';
import { MaybeUserRecord, UserRecord } from '../db';
import db, { User } from '../db/db';
import { getAccessToken, compare, getRefreshToken, hashPassword } from '../auth';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
} from 'graphql';
import { UserNode } from './types';

// ----------------------------------------------------------------------------
//
//  RegisterMutation
//
// ----------------------------------------------------------------------------

interface IRegisterArgs {
  input: {
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  };
}

interface IRegisterPayload {
  error?: string;
  user?: UserRecord;
  accessToken?: string;
  refreshToken?: string;
}

export const RegisterArgs: GraphQLFieldConfigArgumentMap = {
  input: {
    type: new GraphQLInputObjectType({
      name: 'RegisterInput',
      fields: () => ({
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
      }),
    }),
  },
};

export const RegisterPayload = new GraphQLObjectType({
  name: 'RegisterPayload',
  fields: () => ({
    error: { type: GraphQLString },
    user: { type: UserNode },
    accessToken: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
  }),
});

const RegisterMutation: GraphQLFieldConfig<Object, Context, IRegisterArgs> = {
  args: RegisterArgs,
  type: RegisterPayload,
  resolve: async (_source, args, context, _info): Promise<IRegisterPayload> => {
    const { username, password, firstName, lastName } = args.input;

    // TODO: validate password

    const record: UserRecord = {
      username,
      firstName,
      lastName,
      password: await hashPassword(password),
      tokenVersion: 0,
    };

    let user: MaybeUserRecord = null;
    try {
      const result: UserRecord[] = await db<User>('User')
        .insert(record)
        .returning(['id', 'username', 'firstName', 'lastName', 'tokenVersion']);
      user = result[0];
    } catch (e) {
      if (e.message.toLowerCase().includes('violates unique constraint')) {
        return { error: 'username taken.' };
      } else console.error(e);
    }

    if (!user) return { error: 'Unable to register new user.' };

    const accessToken = await getAccessToken(user);
    const refreshToken = await getRefreshToken(user);

    context.reply.setCookie('jid', refreshToken, {
      httpOnly: true,
      signed: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
    });

    delete user['password'];
    return { user, accessToken, refreshToken };
  },
};

// ----------------------------------------------------------------------------
//
//  LoginMutation
//
// ----------------------------------------------------------------------------

interface ILoginArgs {
  input: {
    username: string;
    password: string;
  };
}

interface ILoginPayload {
  error?: string;
  user?: UserRecord;
  accessToken?: string;
  refreshToken?: string;
}

export const LoginArgs: GraphQLFieldConfigArgumentMap = {
  input: {
    type: new GraphQLInputObjectType({
      name: 'LoginInput',
      fields: () => ({
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      }),
    }),
  },
};

export const LoginPayload = new GraphQLObjectType({
  name: 'LoginPayload',
  fields: () => ({
    error: { type: GraphQLString },
    user: { type: UserNode },
    accessToken: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
  }),
});

const LoginMutation: GraphQLFieldConfig<Object, Context, ILoginArgs> = {
  args: LoginArgs,
  type: LoginPayload,
  resolve: async (_source, args, context, _info): Promise<ILoginPayload> => {
    if (context.user) return { error: "You're already logged in" };

    const { username, password } = args.input;
    const user: MaybeUserRecord = await db<User>('User').where({ username: username }).select().first();

    if (!user) return { error: 'Incorrect username or password' };

    const { password: storedPass = '' } = user;
    const valid = await compare(password, storedPass);
    if (!valid) return { error: 'Incorrect username or password' };

    const accessToken = await getAccessToken(user);
    const refreshToken = await getRefreshToken(user);

    context.reply.setCookie('jid', refreshToken, {
      httpOnly: true,
      signed: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
    });

    delete user['password'];
    return { user, accessToken, refreshToken };
  },
};

export const PublicMutation: GraphQLFieldConfig<Object, Context> = {
  type: new GraphQLObjectType({
    name: 'PublicMutation',
    fields: (): any => ({
      login: LoginMutation,
      register: RegisterMutation,
    }),
  }),
  resolve() {
    return {};
  },
};

export const PrivateMutation: GraphQLFieldConfig<Object, Context> = {
  type: new GraphQLObjectType({
    name: 'PrivateMutation',
    fields: (): any => ({
      todo: { type: GraphQLString },
    }),
  }),
  resolve: (_source, _args, context: Context) => {
    if (!context.user) {
      context.reply.status(401); // unauthorized;
      context.reply.header('WWW-Authenticate', 'https://trader.dleyva.com/login');
      return null;
    }

    return {};
  },
};

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    public: PublicMutation,
    private: PrivateMutation,
  }),
});
