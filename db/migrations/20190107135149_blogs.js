exports.up = function(knex, Promise) {
  return knex.schema.createTable("blogs", table => {
    table.increments();
    table.string("blog_title");
    table.text("blog_content");
    table
      .integer("blogger_id")
      .notNullable()
      .references("id")
      .inTable("bloggers")
      .onDelete("CASCADE")
      .index();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("blogs");
};
