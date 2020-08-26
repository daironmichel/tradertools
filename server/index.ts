import NextApp from 'next';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyGQL from 'fastify-gql';
import fastifyCookie from 'fastify-cookie';
import 'dotenv/config';
import { BrokerAuths, getLoaders } from './db';
import { Context, schema } from './graphql';
import {
  generateAccessToken,
  generateRefreshToken,
  MaybeRefreshTokenPayload,
  sendRefreshToken,
  verifyAccessHeader,
  verifyRefreshCookie,
} from './auth';
import { ParsedUrlQuery } from 'querystring';
import { getBrokerInstance } from './providers';

interface VerifyQuery {
  oauth_verifier: string;
  oauth_token: string;
}

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
  context: async (request: FastifyRequest, reply: FastifyReply): Promise<Context> => {
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
          await handle(req.raw, reply.raw);
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
          const token = await generateAccessToken(payload);
          const refreshToken = await generateRefreshToken(payload);
          sendRefreshToken(reply, refreshToken);
          reply.send({ token });
        }
      });

      fastify.route({
        method: 'GET',
        url: '/verify',
        schema: {
          querystring: {
            oauth_verifier: { type: 'string' },
            oauth_token: { type: 'string' },
          },
        },
        handler: async (req, reply) => {
          const { oauth_verifier: oauthVerifier = '', oauth_token: oauthToken = '' } = req.query as VerifyQuery;

          if (!oauthVerifier) {
            reply.status(400);
            reply.send({ error: 'required url query param missing: oauth_verifier' });
          }

          if (!oauthToken) {
            reply.status(400);
            reply.send({ error: 'required url query param missing: oauth_token' });
          }

          const brokerAuth = await BrokerAuths().where({ oauth1RequestToken: oauthToken }).select().first();

          if (!brokerAuth) {
            reply.status(404);
            reply.send({ error: 'oauth_token not found!' });
            return;
          }

          const broker = getBrokerInstance(brokerAuth.broker);
          const authorized = await broker.getAccess(oauthVerifier, brokerAuth);

          if (!authorized) {
            reply.status(401);
            reply.send({ error: 'requesting access to provider failed!' });
            return;
          }

          reply.send({ message: 'access granted!' });
        },
      });

      fastify.get('/a', async (req, reply) => {
        await nextApp.render(req.raw, reply.raw, '/a', req.query as ParsedUrlQuery);
        reply.sent = true;
      });

      fastify.get('/b', async (req, reply) => {
        await nextApp.render(req.raw, reply.raw, '/b', req.query as ParsedUrlQuery);
        reply.sent = true;
      });

      fastify.all('/*', async (req, reply) => {
        await handle(req.raw, reply.raw);
        reply.sent = true;
      });

      fastify.setNotFoundHandler(async (request, reply) => {
        await nextApp.render404(request.raw, reply.raw);
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
