const baseConfig = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: './server/db/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './server/db/seeds',
  },
  pool: {
    afterCreate: function (connection: any, callback: any) {
      connection.query("SET TIME ZONE 'UTC';", function (err: Error) {
        callback(err, connection);
      });
    },
  },
};

const config = {
  development: {
    ...baseConfig,
    debug: process.env.DATABASE_DEBUG === 'true',
  },

  production: {
    ...baseConfig,
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export const { development, production } = config;
