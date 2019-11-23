const next = require("next");
const Hapi = require("@hapi/hapi");
const H2o2 = require("@hapi/h2o2");
const CookieAuth = require("@hapi/cookie");
const Bell = require("@hapi/bell");
const { nextHandlerWrapper } = require("./next-wrapper");
const BackboneAPI = require("../api/backbone-api");
const dev = process.env.NODE_ENV !== "production";

if (dev) require("dotenv").config();

const backboneApi = new BackboneAPI(process.env.BACKBONE_API);
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev });
const server = new Hapi.Server({
  port,
  debug: {
    log: ["*"],
    request: ["*"]
  }
});

app.prepare().then(async () => {
  await server.register(H2o2);
  await server.register(CookieAuth);
  await server.register(Bell);

  // --------------------------------------------------------------------------
  //
  //  Auth Strategies
  //
  // --------------------------------------------------------------------------

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: "sid",
      // Don't forget to change it to your own secret password!
      password: process.env.COOKIE_ENCRYPTION_KEY,
      // For working via HTTP in localhost
      isSecure: !dev,
      isHttpOnly: !dev
    },
    appendNext: true,
    redirectTo: "/login",
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
    }
  });

  server.auth.strategy("etrade", "bell", {
    provider: {
      protocol: "oauth",
      temporary: "https://api.etrade.com/oauth/request_token",
      auth: "https://us.etrade.com/e/t/etws/authorize",
      token: "https://api.etrade.com/oauth/access_token"
    },
    cookie: "bell-etrade",
    password: process.env.COOKIE_ENCRYPTION_KEY,
    clientId: process.env.ETRADE_CONSUMER_KEY,
    clientSecret: process.env.ETRADE_SECRET_KEY,
    providerParams: req => {
      const params = { key: process.env.ETRADE_CONSUMER_KEY };
      const bellState = req._states["bell-etrade"];
      if (bellState) {
        params.token = bellState.value.token;
      }
      return params;
    },
    location: () => "oob",
    skipProfile: true,
    isSecure: !dev, // Terrible idea but required if not using HTTPS especially if developing locally
    isHttpOnly: !dev // Terrible idea also
  });

  server.auth.default("session");

  // --------------------------------------------------------------------------
  //
  //  Auth Routes
  //
  // --------------------------------------------------------------------------

  server.route({
    method: "GET",
    path: "/login",
    options: {
      auth: false /* use next to handle static files */,
      handler: nextHandlerWrapper(app)
    }
  });

  server.route({
    method: "POST",
    path: "/login",
    options: {
      auth: false,
      handler: async (request, h) => {
        const { username, password } = request.payload;
        if (!username || !password) {
          return h.redirect("/login"); // "missing username or pass"
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
          return h.redirect(`/login${next ? "?next=" + next : ""}`);
        }

        request.cookieAuth.set({ accessToken });
        return h.redirect(request.query.next || "/");
      }
    }
  });

  server.route({
    method: "GET",
    path: "/logout",
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

      return h.redirect("/login");
    }
  });

  server.route({
    method: ["GET", "POST"], // Must handle both GET and POST
    path: "/api/etrade/oauth", // The callback endpoint registered with the provider
    options: {
      auth: "etrade",
      handler: function(request, h) {
        if (!request.auth.isAuthenticated) {
          return `Authentication failed due to: ${request.auth.error.message}`;
        }

        // Perform any account lookup or registration, setup local session,
        // and redirect to the application. The third-party credentials are
        // stored in request.auth.credentials. Any query parameters from
        // the initial request are passed back via request.auth.credentials.query.

        return h.redirect("/");
      }
    }
  });

  server.ext("onPreAuth", (request, h) => {
    if (request.method === "post" && request.path === "/api/etrade/oauth" && !request.query.oauth_token) {
      request.query.oauth_token = request.state["bell-etrade"].token;
    }
    return h.continue;
  });

  // --------------------------------------------------------------------------
  //
  //  Api Routes
  //
  // --------------------------------------------------------------------------

  server.route({
    method: "*",
    path: "/api/gql/",
    options: {
      auth: false,
      payload: { output: "data" },
      handler: {
        proxy: {
          mapUri: request => {
            const { sid: session } = request.state;
            const uri = `${process.env.BACKBONE_API}/api/gql/`;
            const headers = { authorization: `Token ${session.accessToken}` };
            return { uri, headers };
          }
          // uri: `${process.env.BACKBONE_API}/api/{endpoint}`
        }
      }
    }
  });

  server.route({
    method: "*",
    path: "/api/etrade/{endpoint*}",
    options: {
      auth: "etrade",
      payload: { output: "data" },
      handler: {
        proxy: {
          // mapUri: request => {
          //   const { sid: session } = request.state;
          //   const endpoint = "endpoint"; // TODO: Get endpoint from request
          //   const uri = `${process.env.ETRADE_API}/${endpoint}/`;
          //   const headers = { authorization: `Token ${session.accessToken}` };
          //   return { uri, headers };
          // }
          uri: `${process.env.ETRADE_API}/api/{endpoint}`
        }
      }
    }
  });

  // --------------------------------------------------------------------------
  //
  //  Other Routes
  //
  // --------------------------------------------------------------------------

  server.route({
    method: "GET",
    path: "/_next/{p*}" /* next specific routes */,
    options: {
      auth: false,
      handler: nextHandlerWrapper(app)
    }
  });

  server.route({
    method: "GET",
    path: "/static/{p*}" /* use next to handle static files */,
    options: {
      auth: false,
      handler: nextHandlerWrapper(app)
    }
  });

  server.route({
    method: "*",
    path: "/{p*}" /* use next to handle any other route */,
    handler: nextHandlerWrapper(app)
  });

  try {
    await server.start();
    console.log(`> Ready on http://localhost:${port}`);
  } catch (error) {
    console.log("Error starting server");
    console.log(error);
  }
});
