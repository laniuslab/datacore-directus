type Translations = {
	language: string;
	translation: string;
	singular: string;
	plural: string;
};

export type CollectionMeta = {
	collection: string;
	note: string | null;
	hidden: boolean;
	singleton: boolean;
	icon: string | null;
	color: string | null;
	translations: Translations[] | null;
	display_template: string | null;
	preview_url: string | null;
	sort_field: string | null;
	archive_field: string | null;
	archive_value: string | null;
	unarchive_value: string | null;
	archive_app_filter: boolean;
	item_duplication_fields: string[] | null;
	accountability: 'all' | 'activity' | null;
	versioning: boolean;
	sort: number | null;
	group: string | null;
	collapse: 'open' | 'closed' | 'locked';
	tags: string[];
	schema: 'public' | 'datacore' | 'configuration' | 'advanced';
};
