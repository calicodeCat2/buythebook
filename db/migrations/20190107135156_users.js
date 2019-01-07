exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", table => {
    table.increments();
    table.string("user_name");
    table.string("user_email").unique();
    table.string("user_password");
    table.string("screen_name");
    table.boolean("banned").defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
