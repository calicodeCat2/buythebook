exports.up = function(knex, Promise) {
  return knex.schema.createTable("admin_messages", table => {
    table.increments();
    table.string("message_title");
    table.text("message_content");
    table.boolean("unread").defaultTo(true);
    table
      .integer("admin_id")
      .notNullable()
      .references("id")
      .inTable("bloggers")
      .onDelete("CASCADE")
      .index();
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
  return knex.schema.dropTable("admin_messages");
};
