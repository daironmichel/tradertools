import next from 'next';
import express from 'express';
// import Hapi from 'hapi';
// import Hapi from '@hapi/hapi';
// import HapiNowAuth from '@now-ims/hapi-now-auth';
// import { nextPathHandler, nextDefaultHandler, nextRouteHandler } from './next-wrapper';
import { ApolloServer } from 'apollo-server-express';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { getLoaders } from './db';
import {
  typeDefinitions,
  typeResolvers,
  Context,
  // VerifiedToken,
  mutationDefinitions,
  mutationResolvers,
} from './graphql';
import { ParsedUrlQuery } from 'querystring';

const port = parseInt(process.env.PORT || '3000', 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const apolloServer = new ApolloServer({
  typeDefs: [typeDefinitions, mutationDefinitions],
  resolvers: [typeResolvers, mutationResolvers],
  // schema,
  debug: dev,
  context: async (_context: ExpressContext): Promise<Context> => {
    // const { req } = context;
    // const auth = (req as express.Request).auth;
    // const currentUser = auth.isAuthenticated ? auth.credentials.user : undefined;

    return {
      loaders: getLoaders(),
      user: null, //currentUser,
    };
  },
});

// const hapiServer = new Hapi.Server({
//   port,
// });

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const expressServer = express();
  // register hapi-now-auth plugin
  // try {
  //   await hapiServer.register(HapiNowAuth);
  // } catch (error) {
  //   console.error(error);
  //   process.exit(1);
  // }
  //
  // hapiServer.auth.strategy('jwt-strategy', 'hapi-now-auth', {
  //   verifyJWT: true,
  //   keychain: [process.env.SECRET_KEY],
  //   validate: async (_request: Hapi.Request, token: VerifiedToken, _h: Hapi.ResponseToolkit) => {
  //     const { decodedJWT } = token;
  //     const { id: userId } = decodedJWT || {};
  //
  //     if (!userId) return { isValid: false, credentials: null, artifacts: decodedJWT };
  //
  //     const loaders = getLoaders();
  //     const user = await loaders.user.load(userId);
  //
  //     if (!user) return { isValid: false, credentials: null, artifacts: decodedJWT };
  //
  //     return { isValid: true, credentials: { user }, artifacts: decodedJWT };
  //   },
  // });
  //
  // hapiServer.auth.default('jwt-strategy');
  //
  // await apolloServer.applyMiddleware({ app: hapiServer, path: '/api/graphql', route: { auth: { mode: 'try' } } });
  // await apolloServer.installSubscriptionHandlers(hapiServer.listener);
  await apolloServer.applyMiddleware({ app: expressServer, path: '/api/graphql' });

  expressServer.get('/a', (req, res) => {
    return nextApp.render(req, res, '/a', req.query as ParsedUrlQuery | undefined);
  });

  expressServer.get('/b', (req, res) => {
    return nextApp.render(req, res, '/b', req.query as ParsedUrlQuery | undefined);
  });

  expressServer.all('*', (req, res) => {
    return handle(req, res);
  });

  // hapiServer.route({
  //   method: 'GET',
  //   path: '/_next/{p*}' /* next specific routes */,
  //   handler: nextRouteHandler(nextApp),
  // });
  //
  // hapiServer.route({
  //   method: 'GET',
  //   path: '/static/{p*}' /* use next to handle static files */,
  //   handler: nextRouteHandler(nextApp),
  // });
  //
  // hapiServer.route({
  //   method: '*',
  //   path: '/{p*}' /* catch all route */,
  //   handler: nextDefaultHandler(nextApp),
  // });

  expressServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });

  // try {
  //   await hapiServer.start();
  //   console.log(`> Ready on http://localhost:${port}`);
  // } catch (error) {
  //   console.log('Error starting expressServer');
  //   console.log(error);
  // }
});
