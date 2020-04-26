const basicConfig = {
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
    ...basicConfig,
    connection: {
      user: 'tradertools',
      password: 'zaqwsx12',
      database: 'tradertools',
      host: 'localhost',
      port: 5433,
    },
  },

  production: {
    ...basicConfig,
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export const { development, production } = config;
