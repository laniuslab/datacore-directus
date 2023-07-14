<template>
	<v-list nav>
		<v-list-item v-for="item in navItems" :key="item.to" :to="item.to">
			<v-list-item-icon><v-icon :name="item.icon" /></v-list-item-icon>
			<v-list-item-content>
				<v-text-overflow :text="item.name" />
			</v-list-item-content>
		</v-list-item>

		<v-divider />

		<!-- MV-DATACORE -->
		<v-list-item href="https://github.com/directus/directus/releases" class="version">
			<v-list-item-content>
				<v-text-overflow class="version" :text="`Datacore ${version}`" />
			</v-list-item-content>
		</v-list-item>
		<!-- MV-DATACORE [END] -->
	</v-list>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const version = __DIRECTUS_VERSION__;

const { t } = useI18n();

const navItems = [
	{
		icon: 'public',
		name: t('settings_project'),
		to: `/settings/project`,
	},
	{
		icon: 'list_alt',
		name: t('settings_data_model'),
		to: `/settings/data-model`,
	},
	{
		icon: 'admin_panel_settings',
		name: t('settings_permissions'),
		to: `/settings/roles`,
	},
	{
		icon: 'bookmark',
		name: t('settings_presets'),
		to: `/settings/presets`,
	},
	{
		icon: 'translate',
		name: t('settings_translations'),
		to: `/settings/translations`,
	},
	{
		icon: 'anchor',
		name: t('settings_webhooks'),
		to: `/settings/webhooks`,
	},
	{
		icon: 'bolt',
		name: t('settings_flows'),
		to: `/settings/flows`,
	},
];
</script>
