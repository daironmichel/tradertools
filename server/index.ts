import NextApp from 'next';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyGQL from 'fastify-gql';
import fastifyCookie from 'fastify-cookie';
import 'dotenv/config';
import { getLoaders } from './db';
import { Context, schema } from './graphql';
import {
  getAccessToken,
  getRefreshToken,
  MaybeRefreshTokenPayload,
  sendRefreshToken,
  verifyAccessHeader,
  verifyRefreshCookie,
} from './auth';

const port = parseInt(process.env.PORT || '3000', 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const fastifyServer = Fastify();

fastifyServer.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET_KEY,
});

fastifyServer.register(fastifyGQL, {
  schema: schema,
  path: '/api/graphql',
  graphiql: 'playground',
  context: async (request: FastifyRequest, reply: FastifyReply<unknown>): Promise<Context> => {
    const payload = await verifyAccessHeader(request);
    const { userId } = payload || {};
    const user = typeof userId === 'number' ? { id: userId } : undefined;

    return {
      request,
      reply,
      user,
      loaders: getLoaders(),
    };
  },
});

fastifyServer.register((fastify, _opts, next) => {
  const nextApp = NextApp({ dev });
  const handle = nextApp.getRequestHandler();

  nextApp
    .prepare()
    .then(async () => {
      if (dev) {
        fastify.get('/_next/*', async (req, reply) => {
          await handle(req.req, reply.res);
          reply.sent = true;
        });
      }

      fastify.get('/token', async (req, reply) => {
        const payload: MaybeRefreshTokenPayload = await verifyRefreshCookie(req, reply);
        if (!payload) {
          reply.status(401);
          reply.header('WWW-Authenticate', 'https://trader.dleyva.com/login');
          reply.send();
        } else {
          const token = await getAccessToken({ id: payload.userId });
          const refreshToken = await getRefreshToken({ id: payload.userId, tokenVersion: payload.tokenVersion });
          sendRefreshToken(reply, refreshToken);
          reply.send({ token });
        }
      });

      fastify.get('/a', async (req, reply) => {
        await nextApp.render(req.req, reply.res, '/a', req.query);
        reply.sent = true;
      });

      fastify.get('/b', async (req, reply) => {
        await nextApp.render(req.req, reply.res, '/b', req.query);
        reply.sent = true;
      });

      fastify.all('/*', async (req, reply) => {
        await handle(req.req, reply.res);
        reply.sent = true;
      });

      fastify.setNotFoundHandler(async (request, reply) => {
        await nextApp.render404(request.req, reply.res);
        reply.sent = true;
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
