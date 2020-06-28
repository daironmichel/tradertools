import NextApp from 'next';
import Fastify from 'fastify';
import fastifyGQL from 'fastify-gql';
import { getLoaders } from './db';
import { Context, schema } from './graphql';

const port = parseInt(process.env.PORT || '3000', 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const fastifyServer = Fastify();
fastifyServer.register(fastifyGQL, {
  schema: schema,
  path: '/api/graphql',
  graphiql: 'playground',
  context: async (): Promise<Context> => {
    // const { req } = context;
    // const auth = (req as express.Request).auth;
    // const currentUser = auth.isAuthenticated ? auth.credentials.user : undefined;

    return {
      loaders: getLoaders(),
      user: null, //currentUser,
    };
  },
});

// const apolloServer = new ApolloServer({
//   typeDefs: [typeDefinitions, mutationDefinitions],
//   resolvers: [typeResolvers, mutationResolvers],
//   // schema,
//   debug: dev,
//   context: async (_context: ExpressContext): Promise<Context> => {
//     // const { req } = context;
//     // const auth = (req as express.Request).auth;
//     // const currentUser = auth.isAuthenticated ? auth.credentials.user : undefined;
//
//     return {
//       loaders: getLoaders(),
//       user: null, //currentUser,
//     };
//   },
// });

fastifyServer.register((fastify, _opts, next) => {
  const nextApp = NextApp({ dev });
  const handle = nextApp.getRequestHandler();

  nextApp
    .prepare()
    .then(async () => {
      if (dev) {
        fastify.get('/_next/*', (req, reply) => {
          return handle(req.req, reply.res).then(() => {
            reply.sent = true;
          });
        });
      }

      fastify.get('/a', (req, reply) => {
        return nextApp.render(req.req, reply.res, '/a', req.query).then(() => {
          reply.sent = true;
        });
      });

      fastify.get('/b', (req, reply) => {
        return nextApp.render(req.req, reply.res, '/b', req.query).then(() => {
          reply.sent = true;
        });
      });

      fastify.all('/*', (req, reply) => {
        return handle(req.req, reply.res).then(() => {
          reply.sent = true;
        });
      });

      fastify.setNotFoundHandler((request, reply) => {
        return nextApp.render404(request.req, reply.res).then(() => {
          reply.sent = true;
        });
      });

      next();
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

fastifyServer.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});

// nextApp.prepare().then(async () => {
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

// await apolloServer.applyMiddleware({ app: expressServer, path: '/api/graphql' });

//   expressServer.get('/a', (req, res) => {
//     return nextApp.render(req, res, '/a', req.query as ParsedUrlQuery | undefined);
//   });
//
//   expressServer.get('/b', (req, res) => {
//     return nextApp.render(req, res, '/b', req.query as ParsedUrlQuery | undefined);
//   });
//
//   expressServer.all('*', (req, res) => {
//     return handle(req, res);
//   });
//
//   expressServer.listen(port, (err) => {
//     if (err) throw err;
//     console.log(`> Ready on http://localhost:${port}`);
//   });
// });
