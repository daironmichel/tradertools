import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('User', function (table) {
      table.integer('tokenVersion').defaultTo(0);
    });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('User', function (table) {
      table.dropColumn('tokenVersion');
    });
}

