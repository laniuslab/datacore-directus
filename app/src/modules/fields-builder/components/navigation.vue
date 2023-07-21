<template>
	<div class="content-navigation-wrapper">
		<div v-if="showSearch" class="search-input">
			<v-input v-model="search" type="search" :placeholder="t('search_collection')" />
		</div>

		<v-list
			v-model="activeGroups"
			v-context-menu="'contextMenu'"
			class="content-navigation"
			tabindex="-1"
			nav
			:mandatory="false"
			:dense="dense"
		>
			<v-list-group v-for="(rootItem, schemaName) in rootItems" :key="schemaName" no-action>
				<template #activator>
					<v-list-item-content>
						<span>{{ schemaName.toString().toUpperCase() }}</span>
					</v-list-item-content>
				</template>

				<navigation-item
					v-for="collection in rootItem"
					:key="collection.collection"
					:show-hidden="showHidden"
					:collection="collection"
					:search="search"
				/>
				<v-menu v-if="hasHiddenCollections" ref="contextMenu" show-arrow placement="bottom-start">
					<v-list-item clickable @click="showHidden = !showHidden">
						<v-list-item-icon>
							<v-icon :name="showHidden ? 'visibility_off' : 'visibility'" />
						</v-list-item-icon>
						<v-list-item-content>
							<v-text-overflow :text="showHidden ? t('hide_hidden_collections') : t('show_hidden_collections')" />
						</v-list-item-content>
					</v-list-item>
				</v-menu>
			</v-list-group>
		</v-list>
	</div>
</template>

<script setup lang="ts">
import { useCollectionsStore } from '@/stores/collections';
import { isNil, orderBy } from 'lodash';
import { computed, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNavigation } from '../composables/use-navigation';
import NavigationItem from './navigation-item.vue';

interface Props {
	currentCollection: string | null;
}

const props = defineProps<Props>();

const { t } = useI18n();
const { currentCollection } = toRefs(props);
const { activeGroups, showHidden } = useNavigation(currentCollection);

const search = ref('');

const collectionsStore = useCollectionsStore();

const rootItems = computed(() => {
	const shownCollections = showHidden.value ? collectionsStore.allCollections : collectionsStore.visibleCollections;
	const mappedCollections: { [schemaName: string]: any } = {};

	for (const collection of shownCollections) {
		const schemaName = collection?.meta?.schema || 'public';
		if (!mappedCollections[schemaName]) mappedCollections[schemaName] = [];
		if (isNil(collection?.meta?.group)) mappedCollections[schemaName].push(collection);
	}

	for (const schemaName in mappedCollections) {
		mappedCollections[schemaName] = orderBy(mappedCollections[schemaName], ['meta.sort', 'collection']);
	}

	return mappedCollections;
});

const dense = computed(() => collectionsStore.visibleCollections.length > 5);
const showSearch = computed(() => collectionsStore.visibleCollections.length > 20);

const hasHiddenCollections = computed(
	() => collectionsStore.allCollections.length > collectionsStore.visibleCollections.length
);
</script>

<style lang="scss" scoped>
.group-name {
	padding-left: 8px;
	font-weight: 600;
}

.empty {
	.v-button {
		--v-button-color: var(--foreground-subdued);
		--v-button-background-color: var(--foreground-subdued);
		--v-button-background-color-hover: var(--primary);
	}
}

.content-navigation-wrapper {
	display: flex;
	flex-direction: column;
	min-height: 100%;
}

.content-navigation {
	--v-list-min-height: calc(100% - 64px);

	flex-grow: 1;

	.v-detail {
		:deep(.v-divider) {
			margin: 0px;
		}

		&:not(:first-child) :deep(.v-divider) {
			margin-top: 8px;
		}

		&.empty :deep(.v-divider) {
			margin-bottom: 8px;
		}
	}
}

.hidden-collection {
	--v-list-item-color: var(--foreground-subdued);
}

.search-input {
	--input-height: 40px;

	position: sticky;
	top: 0;
	z-index: 2;
	padding: 12px;
	padding-bottom: 0;
	background-color: var(--background-normal);
}
</style>
