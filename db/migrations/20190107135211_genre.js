exports.up = function(knex, Promise) {
  knex.schema.createTable("genre", table => {
    table.increments();
    table.string("genre_name");
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("bus");
};
