import { Context } from './common';
import { User } from '../db';
import { hashPassword, login, logout, register, SignedInUser } from '../auth';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
} from 'graphql';
import { UserNode, BrokerEnum } from './types';
import { Broker, getBrokerInstance } from '../providers';

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
  user?: SignedInUser;
  accessToken?: string;
  refreshToken?: string;
}

export const RegisterInput = new GraphQLNonNull(
  new GraphQLInputObjectType({
    name: 'RegisterInput',
    fields: () => ({
      username: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
    }),
  })
);

export const RegisterArgs: GraphQLFieldConfigArgumentMap = {
  input: {
    type: RegisterInput,
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

    const userData: Partial<User> = {
      username,
      firstName,
      lastName,
      password: await hashPassword(password),
      tokenVersion: 0,
    };

    const { accessInfo, error } = await register(userData, context.reply);

    if (error) return { error };
    if (!accessInfo) return { error: 'Unable to register user.' };

    return accessInfo;
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
  user?: SignedInUser;
  accessToken?: string;
  refreshToken?: string;
}

export const LoginInput = new GraphQLNonNull(
  new GraphQLInputObjectType({
    name: 'LoginInput',
    fields: () => ({
      username: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    }),
  })
);

export const LoginArgs: GraphQLFieldConfigArgumentMap = {
  input: {
    type: LoginInput,
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
    const accessInfo = await login(username, password, context.reply);
    if (!accessInfo) return { error: 'Incorrect username or password' };
    return accessInfo;
  },
};

// ----------------------------------------------------------------------------
//
//  LogoutMutation
//
// ----------------------------------------------------------------------------

interface ILogoutArgs {
  // input: {
  //   foo: string;
  // };
}

interface ILogoutPayload {
  error?: string;
}

// export const LogoutInput = new GraphQLInputObjectType({
//   name: 'LogoutInput',
//   fields: () => ({
//     foo: { type: new GraphQLNonNull(GraphQLString) },
//   }),
// });

export const LogoutArgs: GraphQLFieldConfigArgumentMap = {
  // input: {
  //   type: LogoutInput,
  // },
};

export const LogoutPayload = new GraphQLObjectType({
  name: 'LogoutPayload',
  fields: () => ({
    error: { type: GraphQLString },
  }),
});

const LogoutMutation: GraphQLFieldConfig<Object, Context, ILogoutArgs> = {
  args: LogoutArgs,
  type: LogoutPayload,
  resolve: async (_source, _args, context): Promise<ILogoutPayload> => {
    logout(context.reply);
    return {};
  },
};

// ----------------------------------------------------------------------------
//
//  GetAuthorizeURLMutation
//
// ----------------------------------------------------------------------------

interface IGetAuthorizeURLArgs {
  input: {
    broker: Broker;
  };
}

interface IGetAuthorizeURLPayload {
  error?: string;
  url?: string;
}

export const GetAuthorizeURLInput = new GraphQLNonNull(
  new GraphQLInputObjectType({
    name: 'GetAuthorizeURLInput',
    fields: () => ({
      broker: { type: new GraphQLNonNull(BrokerEnum) },
    }),
  })
);

export const GetAuthorizeURLArgs: GraphQLFieldConfigArgumentMap = {
  input: {
    type: GetAuthorizeURLInput,
  },
};

export const GetAuthorizeURLPayload = new GraphQLObjectType({
  name: 'GetAuthorizeURLPayload',
  fields: () => ({
    error: { type: GraphQLString },
    url: { type: GraphQLString },
  }),
});

const GetAuthorizeURLMutation: GraphQLFieldConfig<Object, Context, IGetAuthorizeURLArgs> = {
  args: GetAuthorizeURLArgs,
  type: GetAuthorizeURLPayload,
  resolve: async (_source, args, context): Promise<IGetAuthorizeURLPayload> => {
    const broker = getBrokerInstance(args.input.broker);
    const authorizeURL = await broker.getAuthorizeURL(context.user.id);
    return { url: authorizeURL };
  },
};

// ----------------------------------------------------------------------------
//
//  Public Mutations
//
// ----------------------------------------------------------------------------

export const PublicMutation: GraphQLFieldConfig<Object, Context> = {
  type: new GraphQLNonNull(
    new GraphQLObjectType({
      name: 'PublicMutation',
      fields: (): any => ({
        login: LoginMutation,
        register: RegisterMutation,
      }),
    })
  ),
  resolve() {
    return {};
  },
};

// ----------------------------------------------------------------------------
//
//  Private Mutations
//
// ----------------------------------------------------------------------------

export const PrivateMutation: GraphQLFieldConfig<Object, Context> = {
  type: new GraphQLObjectType({
    name: 'PrivateMutation',
    fields: (): any => ({
      logout: LogoutMutation,
      getAuthorizeURL: GetAuthorizeURLMutation,
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

// ----------------------------------------------------------------------------
//
//  Root Mutations
//
// ----------------------------------------------------------------------------

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    public: PublicMutation,
    private: PrivateMutation,
  }),
});
