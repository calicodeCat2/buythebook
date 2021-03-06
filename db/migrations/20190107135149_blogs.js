exports.up = function(knex, Promise) {
  return knex.schema.createTable("blogs", table => {
    table.increments();
    table.string("blog_title");
    table.text("blog_content");
    table.integer("upvote").defaultTo(0);
    table.integer("downvote").defaultTo(0);
    table
      .integer("blogger_id")
      .notNullable()
      .references("id")
      .inTable("bloggers")
      .onDelete("CASCADE")
      .index();
    table.boolean("approved").defaultTo(false);
    table.boolean("rejected").defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("blogs");
};
