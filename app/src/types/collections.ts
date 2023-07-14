import { CollectionMeta } from '@/__mv/types';
import { Collection as CollectionRaw, CollectionType } from '@directus/types';
import { TranslateResult } from 'vue-i18n';

export interface Collection extends CollectionRaw {
	name: string | TranslateResult;
	icon: string;
	type: CollectionType;
	meta: CollectionMeta | null; // MV-DATACORE
	color?: string | null;
}
