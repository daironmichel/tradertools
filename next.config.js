const withSass = require("@zeit/next-sass");
module.exports = withSass({
  /* config options here */
  webpack: function(config) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000,
          name: "[name].[ext]"
        }
      }
    });
    // config.module.rules.push({
    //   test: /\.graphql.ts$/,
    //   loader: "ignore-loader"
    // });
    return config;
  }
});
