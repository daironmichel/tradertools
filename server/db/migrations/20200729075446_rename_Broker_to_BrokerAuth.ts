import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.transaction(async function (trx) {
    await trx.schema.raw('alter table "Broker" rename constraint "Broker_pkey" to "BrokerAuth_pkey";');
    await trx.schema.raw(
      'alter table "Broker" rename constraint broker_userid_slug_unique to brokerauth_userid_slug_unique;'
    );
    await trx.schema.raw('alter table "Broker" rename constraint broker_userid_foreign to brokerauth_userid_foreign;');
    // this index is tied to constraint "Broker_pkey"
    // await trx.schema.raw('alter index "Broker_pkey" rename to "BrokerAuth_pkey";');
    await trx.schema.raw(
      'alter index "broker_slug varchar_pattern_ops_index" rename to "brokerauth_slug varchar_pattern_ops_index";'
    );
    await trx.schema.raw('alter index broker_slug_index rename to brokerauth_slug_index;');
    await trx.schema.raw('alter index broker_userid_index rename to brokerauth_userid_index;');
    // this index is tied to constraint broker_userid_slug_unique
    // await trx.schema.raw('alter index broker_userid_slug_unique rename to brokerauth_userid_slug_unique;');
    await trx.schema.renameTable('Broker', 'BrokerAuth');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.transaction(async function (trx) {
    await trx.schema.raw('alter table "BrokerAuth" rename constraint "BrokerAuth_pkey" to "Broker_pkey";');
    await trx.schema.raw(
      'alter table "BrokerAuth" rename constraint brokerauth_userid_slug_unique to broker_userid_slug_unique;'
    );
    await trx.schema.raw(
      'alter table "BrokerAuth" rename constraint brokerauth_userid_foreign to broker_userid_foreign;'
    );
    await trx.schema.raw(
      'alter index "brokerauth_slug varchar_pattern_ops_index" rename to "broker_slug varchar_pattern_ops_index";'
    );
    await trx.schema.raw('alter index brokerauth_slug_index rename to broker_slug_index;');
    await trx.schema.raw('alter index brokerauth_userid_index rename to broker_userid_index;');
    await trx.schema.renameTable('BrokerAuth', 'Broker');
  });
}
