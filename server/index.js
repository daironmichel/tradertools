const dev = process.env.NODE_ENV !== 'production';
const next = require('next');
const Hapi = require('@hapi/hapi');
const H2o2 = require('@hapi/h2o2');
const Boom = require('@hapi/boom');
const CookieAuth = require('@hapi/cookie');
const { nextHandlerWrapper } = require('./next-wrapper');
const BackboneAPI = require('../api/backbone-api');

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
      auth: false,
      handler: nextHandlerWrapper(app) /* use next to handle static files */,
    },
  });

  server.route({
    method: 'POST',
    path: '/login',
    options: {
      auth: false,
      handler: async (request, h) => {
        const { username, password, next } = request.payload;
        if (!username || !password) {
          return h.redirect(`/login${next ? '?next=' + next : ''}`); // "missing username or pass"
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
        return h.redirect(next || '/');
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

  server.route({
    method: 'GET',
    path: '/oauth/redirect',
    handler: async (request, h) => {
      const { to } = request.query;
      if (!to) throw Boom.badData('Missing URL param: to');

      return h.redirect(to);
    },
  });

  server.route({
    method: 'GET',
    path: '/verify',
    options: {
      auth: { mode: 'optional' },
      handler: async (request, h) => {
        // const { sid: session } = request.state;
        const { oauth_token: oauthToken, oauth_verifier: oauthVerifier } = request.query;
        let responseData = null;
        try {
          console.log("calling verify endpoint");
          responseData = await backboneApi.verify(oauthToken, oauthVerifier);
        } catch (e) {
          console.error(e);
          throw e;
        }

        const { accessToken, brokerSlug, providerSlug, error } = responseData || {};
        if (error) {
          console.log("res error:", error);
          if (process.env.REDIRECT_TO_APP_ON_VERIFY_ERROR === "1" && process.env.APP_URLSCHEME) {
            console.log("toke:", oauthToken);
            h.redirect(`${process.env.APP_URLSCHEME}://verify?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`);
          } else {
            throw Boom.badData(error);
          }
        }
        
        if (!accessToken) {
          console.warn('Unable to authenticate. Redirecting to login.');
          return h.redirect('/login');
        }

        request.cookieAuth.set({ accessToken });

        if (!brokerSlug || !providerSlug) {
          console.warn(`Unable to redirect. Broker: ${brokerSlug}, Provider: ${providerSlug}. Redirecting to home.`);
          return h.redirect('/');
        }
        return h.redirect(`/brokers/${brokerSlug}/${providerSlug}/`);
      },
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
