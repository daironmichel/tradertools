import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('User', function (table) {
      table.increments('id');
      table.string('username', 150).notNullable().unique();
      table.string('password', 198).notNullable();
      table.string('firstName', 50).notNullable().defaultTo('');
      table.string('lastName', 150).notNullable().defaultTo('');
    })
    .createTable('Broker', function (table) {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.string('slug', 255).notNullable();
      table.integer('userId').unsigned().notNullable().references('User.id').onDelete('CASCADE').index();

      table
        .unique(['userId', 'slug'])
        .index(['slug'])
        .index([knex.raw('slug varchar_pattern_ops')]);
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('Broker').dropTable('User');
}
