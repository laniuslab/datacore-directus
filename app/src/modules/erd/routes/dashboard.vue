<template>
	<private-view :title="schema ? `${t('erd_viewer')} - ${schema}` : `${t('erd_viewer')}`">
		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="device_hub" />
			</v-button>
		</template>

		<template #navigation>
			<ERDNavigation :collections="collections" />
		</template>

		<template #actions></template>

		<template #sidebar>
			<sidebar-detail icon="info_outline" :title="t('information')" close>
				<div v-md="t('page_help_insights_overview')" class="page-description" />
			</sidebar-detail>
		</template>
		<div></div>
		<v-card class="ml-3">
			<v-select
				v-model="schema"
				:items="schemas"
				:full-width="true"
				:placeholder="t('interfaces.system-display-template.select_a_schema')"
				@click="changeSchema"
			/>
		</v-card>
		<div v-if="schema" v-viewer class="images">
			<img v-for="src in [url]" :key="src" :src="src" style="max-height: 700px" />
		</div>
	</private-view>
</template>

<script setup lang="ts">
import { usePreset } from '@/composables/use-preset';
import { useCollectionsStore } from '@/stores/collections';
import { useUserStore } from '@/stores/user';
import { getRootPath } from '@/utils/get-root-path';
import { User } from '@directus/types';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ERDNavigation from '../components/navigation.vue';

const schema = ref<string>('');
const { currentUser } = useUserStore();
const theme = (currentUser as User).theme || 'auto';
const { t } = useI18n();

const { allCollections } = useCollectionsStore();
const { savePreset } = usePreset(ref('erd_viewer'));
const lineColor = theme == 'light' ? 'black' : 'white';

const url = computed(() => {
	return `${getRootPath()}datacore/entities/mermaid-erd/schema/${schema.value}?lineColor=${lineColor}`;
});

const schemas = computed(() => {
	const resultSchema = allCollections.map((x) => x.meta?.schema).filter((x) => x);
	const schemaList = [...new Set(resultSchema)].map((x) => ({ text: x, value: x }));
	return schemaList;
});

const collections = computed(() => {
	return allCollections
		.filter((x) => x.meta?.schema == schema.value)
		.map((x) => ({ icon: x.meta?.icon || 'box', color: x.meta?.color, label: x.name, name: x.collection }));
});

async function changeSchema() {
	await savePreset({
		collection: 'erd-viewer',
		layout_options: {
			schema: schema.value,
		},
	});
}
</script>

<style scoped lang="scss">
.ml-3 {
	margin-left: 2.25rem;
}
</style>
