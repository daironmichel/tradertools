import next from 'next';
// import Hapi from 'hapi';
import Hapi from '@hapi/hapi';
import { pathWrapper, defaultHandlerWrapper, nextHandlerWrapper } from './next-wrapper';
import { ApolloServer } from 'apollo-server-hapi';
import loaders from './db/loaders';
import typeDefs, { resolvers } from './graphql/types';

const port = parseInt(process.env.PORT || '3000', 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: resolvers,
  // schema,
  debug: dev,
  context: async () => {
    // async ({ request, h }) => {
    return {
      loaders,
    };
  },
  playground: true,
});

const hapiServer = new Hapi.Server({
  port,
});

const nextServer = next({ dev });

nextServer.prepare().then(async () => {
  await apolloServer.applyMiddleware({ app: hapiServer, path: '/api/graphql' });
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
