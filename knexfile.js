require('dotenv').config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "buybookdata",
      host: "127.0.0.1",
      user: "postgres",
      password: "12345"
    },
    migrations: {
      directory: __dirname + "/db/migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds"
    }
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + "/db/migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds"
    }
  }
};
