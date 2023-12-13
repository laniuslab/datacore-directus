import { type Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('directus_verifications', (table) => {
		table.uuid('id').primary().notNullable();
		table.uuid('user').references('id').inTable('directus_users').onDelete('SET NULL');
		table.string('ip').notNullable();
		table.string('type');
		table.string('token');
		table.string('recipient');
		table.string('subject');
		table.timestamp('used_at').nullable();
		table.timestamp('expires').nullable();
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('directus_verifications');
}
