/**
 * @param { import("knex").Knex } knex
 */

const tableName = "friend_requests";
exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table
      .integer("sender_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .integer("receiver_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.primary(["sender_id", "receiver_id"]);
  });
};
/**
 * @param { import("knex").Knex } knex
 */
exports.down = async (knex) => {
  await knex.schema.dropTable(tableName);
};
