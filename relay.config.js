module.exports = {
  // ...
  // Configuration options accepted by the `relay-compiler` command-line tool and `babel-plugin-relay`.
  src: "./",
  schema: "./server/schema.graphql",
  exclude: [
    "**/.next/**",
    "**/server/**",
    "**/node_modules/**",
    "**/test/**",
    "**/__mocks__/**",
    "**/__generated__/**"
  ],
  extensions: ["js", "jsx"]
};
