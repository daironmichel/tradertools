import next from 'next';
// import Hapi from 'hapi';
import Hapi from '@hapi/hapi';
import { nextPathHandler, nextDefaultHandler, nextRouteHandler } from './next-wrapper';
import { ApolloServer } from 'apollo-server-hapi';
import { typeDefinitions, typeResolvers, Context } from './graphql';
import { getLoaders } from './db';

const port = parseInt(process.env.PORT || '3000', 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const apolloServer = new ApolloServer({
  typeDefs: [typeDefinitions],
  resolvers: [typeResolvers],
  // schema,
  debug: dev,
  context: async (): Promise<Context> => {
    // async ({ request, h }) => {
    // we can get credentials from request and set current user here
    return {
      loaders: getLoaders(),
      user: undefined,
    };
  },
});

const hapiServer = new Hapi.Server({
  port,
});

const nextApp = next({ dev });

nextApp.prepare().then(async () => {
  await apolloServer.applyMiddleware({ app: hapiServer, path: '/api/graphql' });
  await apolloServer.installSubscriptionHandlers(hapiServer.listener);

  hapiServer.route({
    method: 'GET',
    path: '/a',
    handler: nextPathHandler(nextApp, '/a'),
  });

  hapiServer.route({
    method: 'GET',
    path: '/b',
    handler: nextPathHandler(nextApp, '/b'),
  });

  hapiServer.route({
    method: 'GET',
    path: '/_next/{p*}' /* next specific routes */,
    handler: nextRouteHandler(nextApp),
  });

  hapiServer.route({
    method: 'GET',
    path: '/static/{p*}' /* use next to handle static files */,
    handler: nextRouteHandler(nextApp),
  });

  hapiServer.route({
    method: '*',
    path: '/{p*}' /* catch all route */,
    handler: nextDefaultHandler(nextApp),
  });

  try {
    await hapiServer.start();
    console.log(`> Ready on http://localhost:${port}`);
  } catch (error) {
    console.log('Error starting server');
    console.log(error);
  }
});
