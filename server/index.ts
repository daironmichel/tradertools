import next from 'next';
// import Hapi from 'hapi';
import Hapi from '@hapi/hapi';
import HapiNowAuth from '@now-ims/hapi-now-auth';
import { pathWrapper, defaultHandlerWrapper, nextHandlerWrapper } from './next-wrapper';
import { ApolloServer } from 'apollo-server-hapi';
import { getLoaders } from './db';
import {
  typeDefinitions,
  typeResolvers,
  Context,
  VerifiedToken,
  mutationDefinitions,
  mutationResolvers,
} from './graphql';

const port = parseInt(process.env.PORT || '3000', 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const apolloServer = new ApolloServer({
  typeDefs: [typeDefinitions, mutationDefinitions],
  resolvers: [typeResolvers, mutationResolvers],
  // schema,
  debug: dev,
  context: async ({ request /*, h */ }): Promise<Context> => {
    const auth = (request as Hapi.Request).auth;
    const currentUser = auth.isAuthenticated ? auth.credentials.user : undefined;

    return {
      loaders: getLoaders(),
      user: currentUser,
    };
  },
});

const hapiServer = new Hapi.Server({
  port,
});

const nextServer = next({ dev });

nextServer.prepare().then(async () => {
  // register hapi-now-auth plugin
  try {
    await hapiServer.register(HapiNowAuth);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  hapiServer.auth.strategy('jwt-strategy', 'hapi-now-auth', {
    verifyJWT: true,
    keychain: [process.env.SECRET_KEY],
    validate: async (_request: Hapi.Request, token: VerifiedToken, _h: Hapi.ResponseToolkit) => {
      const { decodedJWT } = token;
      const { id: userId } = decodedJWT || {};

      if (!userId) return { isValid: false, credentials: null, artifacts: decodedJWT };

      const loaders = getLoaders();
      const user = await loaders.user.load(userId);

      if (!user) return { isValid: false, credentials: null, artifacts: decodedJWT };

      return { isValid: true, credentials: { user }, artifacts: decodedJWT };
    },
  });

  hapiServer.auth.default('jwt-strategy');

  await apolloServer.applyMiddleware({ app: hapiServer, path: '/api/graphql', route: { auth: { mode: 'try' } } });
  await apolloServer.installSubscriptionHandlers(hapiServer.listener);

  hapiServer.route({
    method: 'GET',
    path: '/a',
    handler: pathWrapper(nextServer, '/a'),
  });

  hapiServer.route({
    method: 'GET',
    path: '/b',
    handler: pathWrapper(nextServer, '/b'),
  });

  hapiServer.route({
    method: 'GET',
    path: '/_next/{p*}' /* next specific routes */,
    handler: nextHandlerWrapper(nextServer),
  });

  hapiServer.route({
    method: 'GET',
    path: '/static/{p*}' /* use next to handle static files */,
    handler: nextHandlerWrapper(nextServer),
  });

  hapiServer.route({
    method: '*',
    path: '/{p*}' /* catch all route */,
    handler: defaultHandlerWrapper(nextServer),
  });

  try {
    await hapiServer.start();
    console.log(`> Ready on http://localhost:${port}`);
  } catch (error) {
    console.log('Error starting server');
    console.log(error);
  }
});
