const baseConfig = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: './server/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './server/seeds',
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
