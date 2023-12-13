<script lang="ts">
import api from '@/api';
import { useCollectionsStore } from '@/stores/collections';
import { useUserStore } from '@/stores/user';
import { Collection } from '@/types/collections';
import { getRootPath } from '@/utils/get-root-path';
import { md } from '@/utils/md';
import { User } from '@directus/types';
import { Ref, computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ERDNavigation from '../components/navigation.vue';

export default defineComponent({
	name: 'CollectionOverview',
	components: { ERDNavigation },
	props: {
		collectionName: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const { currentUser } = useUserStore();
		const theme = (currentUser as User).theme || 'auto';
		const { allCollections } = useCollectionsStore();

		const relatedCollections: Ref<
			{
				icon: string;
				name: string;
				label: string;
				color: string;
			}[]
		> = ref([]);

		const lineColor = theme == 'light' ? 'black' : 'white';

		const { t } = useI18n();

		const url = computed(() => {
			return `${getRootPath()}datacore/entities/mermaid-erd/collection/${props.collectionName}?line_color=${lineColor}`;
		});

		const getRelatedCollections = async () => {
			api
				.get(`/datacore/entities/${props.collectionName}/related`)
				.then((data) => {
					const collections = data.data.data;
					const collectionMap: { [key: string]: Collection } = {};

					for (const collection of allCollections) {
						collectionMap[`${collection.collection}`] = collection;
					}

					const result = [];

					for (const collectionName of collections) {
						const collectionMeta = collectionMap[collectionName];

						if (collectionMeta) {
							result.push({
								icon: collectionMeta.meta?.icon || 'box',
								label: collectionMeta.name,
								name: collectionName,
								color: collectionMeta.meta?.color || 'var(--foreground-normal)',
							});
						} else {
							result.push({
								icon: 'box',
								label: collectionName,
								name: collectionName,
								color: 'var(--foreground-normal)',
							});
						}
					}

					relatedCollections.value = result;
				})
				.catch((_e) => {
					relatedCollections.value = [];
				});
		};

		getRelatedCollections();

		return {
			t,
			md,
			url,
			relatedCollections,
			getRelatedCollections,
		};
	},
	updated() {
		this.getRelatedCollections();
	},
});
</script>

<template>
	<private-view :title="t('erd_viewer') + ' - ' + collectionName">
		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="insights" />
			</v-button>
		</template>

		<template #navigation>
			<ERDNavigation :collections="relatedCollections" />
		</template>

		<template #actions></template>

		<template #sidebar>
			<sidebar-detail icon="info" :title="t('information')" close>
				<div v-md="t('page_help_insights_overview')" class="page-description" />
			</sidebar-detail>
		</template>
		<div v-viewer class="images">
			<img v-for="src in [url]" :key="src" :src="src" style="max-height: 700px" />
		</div>
	</private-view>
</template>

<style scoped>
.v-table {
	padding: var(--content-padding);
	padding-top: 0;
}

.ctx-toggle {
	--v-icon-color: var(--foreground-subdued);
	--v-icon-color-hover: var(--foreground-normal);
}

.v-list-item.danger {
	--v-list-item-color: var(--danger);
	--v-list-item-color-hover: var(--danger);
	--v-list-item-icon-color: var(--danger);
}

.header-icon {
	--v-button-color-disabled: var(--foreground-normal);
}

.images {
	display: flex;
	justify-content: center;
}
</style>
