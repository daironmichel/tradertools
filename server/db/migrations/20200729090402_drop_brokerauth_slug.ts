import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('BrokerAuth', async function (table) {
    table.dropUnique(['userId', 'slug']).dropIndex('slug').dropIndex('slug varchar_pattern_ops');

    table.dropColumns('name', 'slug');
    table.integer('broker').notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('BrokerAuth', async function (table) {
    table.dropColumn('broker');
    table.string('name', 255).notNullable().defaultTo('');
    table.string('slug', 255).notNullable().defaultTo('');

    table
      .unique(['userId', 'slug'])
      .index(['slug'])
      .index([knex.raw('slug varchar_pattern_ops')]);
  });
}
