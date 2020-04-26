import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('user', function (table) {
      table.increments('id');
      table.string('username', 255).notNullable();
      table.string('password', 255).notNullable();
      table.string('first_name', 255).notNullable();
      table.string('last_name', 255).notNullable();
    })
    .createTable('broker', function (table) {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.string('slug', 255).notNullable();
      table.integer('user_id').unsigned().notNullable().references('user.id').onDelete('CASCADE').index();

      table.unique(['user_id', 'slug']);
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('broker').dropTable('user');
}
