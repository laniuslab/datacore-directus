import { Knex } from 'knex';

export type Verification = {
	id: string;
	user: string;
	ip: string;
	type: string;
	token: string;
	recipient: string;
	subject: string;
	used_at: Knex.Raw<any>;
};
