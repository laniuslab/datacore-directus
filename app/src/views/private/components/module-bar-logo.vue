<template>
	<component
		:is="url ? 'a' : 'div'"
		v-tooltip.right="urlTooltip"
		:href="url"
		:target="url ? '_blank' : undefined"
		:rel="url ? 'noopener noreferrer' : undefined"
		class="module-bar-logo"
		:class="{ loading: showLoader }"
	>
		<!-- MV-DATACORE -->
		<template v-if="customLogoPath">
			<img class="custom-logo" :src="customLogoPath" alt="Project Logo" />
		</template>
		<img v-else class="custom-logo" :src="initialLogoPath" alt="Project Logo" />
		<!-- MV-DATACORE [END] -->
	</component>
</template>

<script setup lang="ts">
import { useRequestsStore } from '@/stores/requests';
import { useSettingsStore } from '@/stores/settings';
import { getRootPath } from '@/utils/get-root-path';
import { computed, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const requestsStore = useRequestsStore();
const settingsStore = useSettingsStore();

const customLogoPath = computed<string | null>(() => {
	if (settingsStore.settings === null) return null;
	if (!settingsStore.settings?.project_logo) return null;
	return `${getRootPath()}assets/${settingsStore.settings.project_logo}`;
});

// MV-DATACORE
const initialLogoPath = computed(() => {
	return `${getRootPath()}admin/mv.ico`;
});
// MV-DATACORE [END]

const showLoader = ref(false);

const { queueHasItems } = toRefs(requestsStore);

watch(
	() => queueHasItems.value,
	(hasItems) => {
		if (hasItems) showLoader.value = true;
	}
);

const url = computed(() => settingsStore.settings?.project_url);

const urlTooltip = computed(() => {
	return settingsStore.settings?.project_url ? t('view_project') : false;
});
</script>

<style lang="scss" scoped>
.module-bar-logo {
	--v-progress-linear-height: 2px;
	--v-progress-linear-color: var(--white);
	--v-progress-linear-background-color: rgb(255 255 255 / 0.5);

	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 60px;
	height: 60px;
	padding: 12px;
	background-color: var(--brand);

	.custom-logo {
		display: block;
		width: 40px;
		height: 40px;
		object-fit: contain;
	}
}
</style>
