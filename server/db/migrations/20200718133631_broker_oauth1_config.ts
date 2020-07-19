import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('Broker', function (table) {
    table.string('oauth1RequestToken', 255).defaultTo('');
    table.string('oauth1RequestTokenSecret', 255).defaultTo('');
    table.string('oauth1AccessToken', 255).defaultTo('');
    table.string('oauth1AccessTokenSecret', 255).defaultTo('');
    table.string('oauth1RefreshToken', 255).defaultTo('');
    table.dateTime('oauth1AccessTokenExpiresAt').notNullable().defaultTo(knex.fn.now());
    table.dateTime('oauth1RefreshTokenExpiresAt', { useTz: false }).notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('Broker', function (table) {
    table.dropColumn('oauth1RequestToken');
    table.dropColumn('oauth1RequestTokenSecret');
    table.dropColumn('oauth1AccessToken');
    table.dropColumn('oauth1AccessTokenSecret');
    table.dropColumn('oauth1RefreshToken');
    table.dropColumn('oauth1AccessTokenExpiresAt');
    table.dropColumn('oauth1RefreshTokenExpiresAt');
  });
}
