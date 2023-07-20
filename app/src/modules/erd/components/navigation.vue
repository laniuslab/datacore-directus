<template>
	<div v-if="showSearch" class="search-input">
		<v-input v-model="search" type="search" :placeholder="t('search_collection')" />
	</div>
	<v-list nav>
		<v-button v-if="matchesSearch?.length === 0" full-width outlined dashed>Empty</v-button>

		<v-list-item v-for="navItem in matchesSearch" v-else :key="navItem" :to="`/erd-viewer/${navItem.name}`">
			<v-list-item-icon><v-icon :name="navItem.icon" :color="navItem.color" /></v-list-item-icon>
			<v-list-item-content>
				<v-text-overflow :text="navItem.label" />
			</v-list-item-content>
		</v-list-item>
	</v-list>
</template>

<script setup lang="ts">
import { useCollectionsStore } from '@/stores/collections';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface ICollection {
	icon?: string;
	name: string;
	label: string;
	color?: string | null;
}

interface Props {
	collections?: ICollection[];
}

const { visibleCollections } = useCollectionsStore();

const { t } = useI18n();
const props = defineProps<Props>();
const search = ref<string>('');
const showSearch = computed(() => visibleCollections.length > 5);

const matchesSearch = computed(() => {
	if (search.value === '' || search.value === undefined || search.value == null) return props.collections;

	return props.collections?.filter(
		(collection) => collection.name.includes(search.value) || collection.name.toLowerCase().includes(search.value)
	);
});
</script>

<style lang="scss" scoped>
.search-input {
	--input-height: 40px;

	position: sticky;
	top: 0;
	z-index: 2;
	padding: 10px;
	padding-bottom: 0;
	background-color: var(--background-normal);
}
</style>
