module.exports = {
  // ...
  // Configuration options accepted by the `relay-compiler` command-line tool and `babel-plugin-relay`.
  src: "./",
  schema: "./relay/schema.graphql",
  artifactDirectory: "./__generated__",
  exclude: [
    "**/.next/**",
    "**/server/**",
    "**/node_modules/**",
    "**/test/**",
    "**/__mocks__/**",
    "**/__generated__/**"
  ],
  extensions: ["js", "jsx", "ts", "tsx"],
  language: "typescript"
};
