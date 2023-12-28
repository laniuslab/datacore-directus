import type { Aggregate, Filter, NestedDeepQuery } from '@directus/types';

export type Query = {
	fields?: string[] | null;
	sort?: string[] | null;
	filter?: Filter | null;
	limit?: number | null;
	offset?: number | null;
	page?: number | null;
	search?: string | null;
	version?: string | null;
	export?: 'json' | 'csv' | 'xml' | null;
	group?: string[] | null;
	aggregate?: Aggregate | null;
	deep?: NestedDeepQuery | null;
	alias?: Record<string, string> | null;
	forceDelete?: boolean | null;
	showSoftDelete?: boolean | null;
};
