import type { Table } from '@directus/schema';
import type { Field } from '@directus/types';

export type CollectionMeta = {
	collection: string;
	note: string | null;
	hidden: boolean;
	singleton: boolean;
	icon: string | null;
	translations: Record<string, string>;
	item_duplication_fields: string[] | null;
	accountability: 'all' | 'accountability' | null;
	group: string | null;
	system?: boolean;
	tags?: string[] | null | string;
	schema?: string | null;
	versioning: boolean;
};

export type Collection = {
	collection: string;
	fields?: Field[];
	meta: CollectionMeta | null;
	schema: Table | null;
};
