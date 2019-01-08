module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "buybookdata",
      host: "127.0.0.1",
<<<<<<< HEAD
      //user: "postgres",
      //password: "**********"
=======
      user: "postgres",
      password: "**********"
>>>>>>> 8317f05dd6c959c267997cc2956379f16d530065
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
      directory: __dirname + "/db/seeds/production"
    }
  }
};
