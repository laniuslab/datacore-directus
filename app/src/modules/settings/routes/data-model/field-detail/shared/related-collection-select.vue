<template>
	<v-input
		key="related-collection-select"
		:model-value="modelValue"
		:class="{ matches: collectionExists }"
		db-safe
		:nullable="false"
		:disabled="disabled"
		:placeholder="t('collection') + '...'"
		@update:model-value="$emit('update:modelValue', $event)"
	>
		<template v-if="!disabled" #append>
			<v-menu show-arrow placement="bottom-end">
				<template #activator="{ toggle }">
					<v-icon v-tooltip="t('select_existing')" name="list_alt" clickable :disabled="disabled" @click="toggle" />
				</template>
				<!-- MV-DATACORE -->
				<v-list>
					<v-list-item>
						<v-input
							v-model="searchCollectionName"
							:autofocus="true"
							class="search-collection"
							placeholder="Search Collection"
						/>
					</v-list-item>
				</v-list>
				<!-- MV-DATACORE [END] -->
				<v-list class="monospace">
					<v-list-item
						v-for="availableCollection in availableCollections"
						:key="availableCollection.collection"
						:active="modelValue === availableCollection.collection"
						:disabled="availableCollection.meta?.singleton"
						clickable
						@click="$emit('update:modelValue', availableCollection.collection)"
					>
						<v-list-item-content>
							{{ availableCollection.collection }}
						</v-list-item-content>
					</v-list-item>

					<v-divider />

					<v-list-group>
						<template #activator>{{ t('system') }}</template>
						<v-list-item
							v-for="systemCollection in systemCollections"
							:key="systemCollection.collection"
							:active="modelValue === systemCollection.collection"
							clickable
							@click="$emit('update:modelValue', systemCollection.collection)"
						>
							<v-list-item-content>
								{{ systemCollection.collection }}
							</v-list-item-content>
						</v-list-item>
					</v-list-group>
				</v-list>
			</v-menu>
		</template>

		<template v-if="disabled" #input>
			<v-text-overflow :text="modelValue" />
		</template>
	</v-input>
</template>

<script setup lang="ts">
import { useCollectionsStore } from '@/stores/collections';
import { orderBy } from 'lodash';
import { useI18n } from 'vue-i18n';

// MV-DATACORE
import { COLLECTIONS_DENY_LIST } from '@/constants';
import { computed, ref } from 'vue';

const searchCollectionName = ref<string | null>(null);
// MV-DATACORE [END]

const props = defineProps<{
	modelValue?: string;
	disabled?: boolean;
}>();

defineEmits(['update:modelValue']);

const { t } = useI18n();
const collectionsStore = useCollectionsStore();

const collectionExists = computed(() => {
	return !!collectionsStore.getCollection(props.modelValue as string);
});

// MV-DATACORE
const availableCollections = computed(() => {
	if (searchCollectionName.value) {
		return orderBy(
			collectionsStore.allCollections.filter(
				(collection) =>
					collection.schema &&
					collection.collection.toLowerCase().includes((searchCollectionName.value as string).toLowerCase())
			),
			['sort', 'collection'],
			['asc']
		);
	} else {
		return orderBy(collectionsStore.databaseCollections, ['sort', 'collection'], ['asc']);
	}
});

const systemCollections = computed(() => {
	if (searchCollectionName.value) {
		return orderBy(
			collectionsStore.collections.filter((collection) => {
				return (
					collection.collection.toLowerCase().includes((searchCollectionName.value as string).toLowerCase()) &&
					collection.collection.startsWith('directus_') === true
				);
			}),
			['collection'],
			['asc']
		).filter((collection) => COLLECTIONS_DENY_LIST.includes(collection.collection) === false);
	} else {
		return collectionsStore.crudSafeSystemCollections;
	}
});
</script>

<style lang="scss" scoped>
.search-collection {
	padding-top: 1rem;
}
</style>

<!-- MV-DATACORE [END] -->
