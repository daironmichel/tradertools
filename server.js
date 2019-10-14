const next = require("next");
const Hapi = require("@hapi/hapi");
const H2o2 = require("@hapi/h2o2");
const CookieAuth = require("@hapi/cookie");
const { nextHandlerWrapper } = require("./next-wrapper");
const { BackboneAPI } = require("./api/backbone-server-api");
const dev = process.env.NODE_ENV !== "production";

if (dev) require("dotenv").config();

const backboneApi = new BackboneAPI(process.env.BACKBONE_API);
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev });
const server = new Hapi.Server({
  port
});

app.prepare().then(async () => {
  await server.register(H2o2);
  await server.register(CookieAuth);

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: "sid",
      // Don't forget to change it to your own secret password!
      password: process.env.COOKIE_AUTH_PASSWORD,
      // For working via HTTP in localhost
      isSecure: !dev
    },
    appendNext: true,
    redirectTo: "/login",
    validateFunc: async (request, session) => {
      const query = `
      {
        viewer { 
          credentials {
            databaseId
            fullName            
          }
        }
      }
      `;

      let credentials = {};
      try {
        const response = await backboneApi.graphQL(query, {}, { Authorization: `Token ${session.accessToken}` });
        credentials = response.data.data.viewer.credentials;
      } catch (e) {
        console.log(e);
        return { valid: false };
      }

      return { valid: true, credentials };
    }
  });

  server.auth.default("session");

  server.route({
    method: "POST",
    path: "/login",
    options: {
      auth: false,
      handler: async (request, h) => {
        const { username, password } = request.payload;
        if (!username || !password) {
          return h.redirect("/login"); // "missing username and pass"
        }

        let accessToken = null;
        try {
          // Try to find user with given credentials
          accessToken = await backboneApi.login(username, password);
        } catch (e) {
          console.log(e);
        }
        if (!accessToken) {
          return h.redirect("/login"); //return internals.renderHtml.login("Invalid username or password");
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
      const { accessToken } = request.state;
      await backboneApi.logout(accessToken);
      request.cookieAuth.clear();
      return h.redirect("/login");
    }
  });

  // server.route({
  //   method: "*",
  //   path: "/api/backbone/{endpoint*}",
  //   config: { payload: { output: "data" } },
  //   handler: {
  //     proxy: {
  //       mapUri: req => {
  //         const uri = `${process.env.BACKBONE_API}/api/${req.params.endpoint}`;
  //         const headers = { authorization: `Bearer ${req.state.accessToken}` };
  //         return { uri, headers };
  //       }
  //       // uri: `${process.env.BACKBONE_API}/api/{endpoint}`
  //     }
  //   }
  // });

  server.route({
    method: "GET",
    path: "/_next/{p*}" /* next specific routes */,
    options: {
      handler: nextHandlerWrapper(app),
      auth: false
    }
  });

  server.route({
    method: "GET",
    path: "/static/{p*}" /* use next to handle static files */,
    options: {
      handler: nextHandlerWrapper(app),
      auth: false
    }
  });

  server.route({
    method: "GET",
    path: "/login",
    options: {
      auth: false /* use next to handle static files */,
      handler: nextHandlerWrapper(app)
    }
  });

  server.route({
    method: "*",
    path: "/{p*}" /* catch all route */,
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
