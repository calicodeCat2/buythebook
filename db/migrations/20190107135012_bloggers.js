exports.up = function(knex, Promise) {
  return knex.schema.createTable("bloggers", table => {
    table.increments();
    table.string("blogger_name");
    table.string("blogger_email").unique();
    table.string("blogger_password");
    table.integer("years_blogging");
    table.string("genre");
    table.string("link");
    table.string("sample", 500), table.text("image_url");
    table.boolean("approved").defaultTo(false);
    table.string("role").defaultTo("blogger");
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("bloggers");
};
