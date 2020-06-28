import { Context } from './common';
import { MaybeUserRecord } from '../db';
import db, { User } from '../db/db';
import { compare } from '../utils';
import jwt from 'jsonwebtoken';
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInputObjectType } from 'graphql';
import { UserNode } from './types';

interface ILoginPayload {
  user?: MaybeUserRecord;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export const LoginPayload = new GraphQLObjectType({
  name: 'LoginPayload',
  fields: {
    user: { type: UserNode },
    accessToken: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
    error: { type: GraphQLString },
  },
});

export const LoginInput = new GraphQLInputObjectType({
  name: 'LoginInput',
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const PublicMutation = new GraphQLObjectType({
  name: 'PublicMutation',
  fields: {
    login: {
      type: LoginPayload,
      args: {
        input: { type: LoginInput },
      },
      resolve: async (_source, args, context, _info): Promise<ILoginPayload> => {
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

        const accessToken = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1m' });
        delete user['password'];
        return { user, accessToken };
      },
    },
  },
});

export const PrivateMutation = new GraphQLObjectType({
  name: 'PrivateMutation',
  fields: {
    dosomething: { type: GraphQLString },
  },
});

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    public: {
      type: PublicMutation,
      resolve() {
        return {};
      },
    },
    private: {
      type: PrivateMutation,
      resolve: (_source, _args, _context: Context) => {
        throw 'Not Authorized';
      },
    },
  }),
});

// export const mutationDefinitions = gql`
//   input LoginInput {
//     username: String!
//     password: String!
//   }
//
//   type LoginPayload {
//     user: UserNode
//     token: String
//     error: String
//   }
//
//   type PublicMutations {
//     login(input: LoginInput!): LoginPayload!
//   }
//
//   type Mutation {
//     public: PublicMutations!
//   }
// `;
//
// const Mutation: IResolverObject<{}, Context> = {
//   public: () => ({}),
// };
//
// type LoginInput = {
//   username: string;
//   password: string;
// };
//
// type LoginPayload = {
//   user?: MaybeUserRecord;
//   token?: string;
//   error?: string;
// };
//
// type LoginArgs = { input: LoginInput };
//
// const PublicMutations: IResolverObject<{}, Context> = {
//   login: async (_source, args: LoginArgs, context: Context): Promise<LoginPayload> => {
//     if (context.user) return { error: "You're already logged in" };
//     const { username, password } = args.input;
//     const user: MaybeUserRecord = await db<User>('User')
//       .where({ username: username })
//       .select(['id', 'username', 'firstName', 'lastName', 'password'])
//       .first();
//
//     if (!user || !user.password) return { error: 'Incorrect username or password' };
//     if (!compare(password, user.password)) return { error: 'Incorrect username or password' };
//
//     const secretKey = process.env.SECRET_KEY;
//     if (!secretKey) throw 'SECRET_KEY environment variables required.';
//
//     const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1m' });
//     delete user['password'];
//     return { user, token };
//   },
// };
//
// export const mutationResolvers: IResolvers<{}, Context> = {
//   Mutation,
//   PublicMutations,
// };
