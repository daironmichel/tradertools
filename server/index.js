require('newrelic');
const next = require('next');
const Hapi = require('@hapi/hapi');
const H2o2 = require('@hapi/h2o2');
const CookieAuth = require('@hapi/cookie');
const { nextHandlerWrapper } = require('./next-wrapper');
const BackboneAPI = require('../api/backbone-api');
const dev = process.env.NODE_ENV !== 'production';

if (dev) require('dotenv').config();

const backboneApi = new BackboneAPI(process.env.BACKBONE_API);
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev });
const server = new Hapi.Server({
  port,
  debug: {
    log: ['*'],
    request: ['*'],
  },
});

app.prepare().then(async () => {
  await server.register(H2o2);
  await server.register(CookieAuth);

  // --------------------------------------------------------------------------
  //
  //  Auth Strategies
  //
  // --------------------------------------------------------------------------

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'sid',
      // Don't forget to change it to your own secret password!
      password: process.env.COOKIE_ENCRYPTION_KEY,
      // For working via HTTP in localhost
      isSecure: !dev,
      isHttpOnly: !dev,
    },
    appendNext: true,
    redirectTo: '/login',
    validateFunc: async (request, session) => {
      let credentials = {};
      try {
        const response = await backboneApi.getCredentials(session.accessToken);
        credentials = response;
      } catch (e) {
        console.error(e);
        return { valid: false };
      }

      return { valid: true, credentials };
    },
  });

  server.auth.default('session');

  // --------------------------------------------------------------------------
  //
  //  Auth Routes
  //
  // --------------------------------------------------------------------------

  server.route({
    method: 'GET',
    path: '/login',
    options: {
      auth: false /* use next to handle static files */,
      handler: nextHandlerWrapper(app),
    },
  });

  server.route({
    method: 'POST',
    path: '/login',
    options: {
      auth: false,
      handler: async (request, h) => {
        const { username, password } = request.payload;
        if (!username || !password) {
          return h.redirect('/login'); // "missing username or pass"
        }

        let accessToken = null;
        try {
          // Try to find user with given credentials
          accessToken = await backboneApi.login(username, password);
        } catch (e) {
          console.log(e);
        }
        if (!accessToken) {
          const next = request.query.next;
          return h.redirect(`/login${next ? '?next=' + next : ''}`);
        }

        request.cookieAuth.set({ accessToken });
        return h.redirect(request.query.next || '/');
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/logout',
    handler: async (request, h) => {
      const { sid: session } = request.state;
      try {
        await backboneApi.logout(session.accessToken);
      } catch (e) {
        console.error(e);
        return h.response(e);
      }
      request.cookieAuth.clear();

      // TODO: revoke access token to etrade if present

      return h.redirect('/login');
    },
  });

  // --------------------------------------------------------------------------
  //
  //  Api Routes
  //
  // --------------------------------------------------------------------------

  server.route({
    method: '*',
    path: '/api/gql/',
    options: {
      auth: false,
      payload: { output: 'data' },
      handler: {
        proxy: {
          mapUri: request => {
            const { sid: session } = request.state;
            const uri = `${process.env.BACKBONE_API}/api/gql/`;
            const headers = { authorization: `Token ${session.accessToken}` };
            return { uri, headers };
          },
          // uri: `${process.env.BACKBONE_API}/api/{endpoint}`
        },
      },
    },
  });

  // --------------------------------------------------------------------------
  //
  //  Other Routes
  //
  // --------------------------------------------------------------------------

  server.route({
    method: 'GET',
    path: '/_next/{p*}' /* next specific routes */,
    options: {
      auth: false,
      handler: nextHandlerWrapper(app),
    },
  });

  server.route({
    method: 'GET',
    path: '/static/{p*}' /* use next to handle static files */,
    options: {
      auth: false,
      handler: nextHandlerWrapper(app),
    },
  });

  server.route({
    method: '*',
    path: '/{p*}' /* use next to handle any other route */,
    handler: nextHandlerWrapper(app),
  });

  try {
    await server.start();
    console.log(`> Ready on http://localhost:${port}`);
  } catch (error) {
    console.log('Error starting server');
    console.log(error);
  }
});
