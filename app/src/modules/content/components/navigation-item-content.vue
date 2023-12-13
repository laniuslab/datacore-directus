<script setup lang="ts">
withDefaults(
	defineProps<{
		name: string;
		icon: string;
		search?: string;
		color?: string;
		tags?: string[]; // MV-DATACORE
	}>(),
	{
		color: 'var(--theme--foreground)',
	},
);
</script>

<template>
	<v-list-item-icon>
		<v-icon :name="icon" :color="color" />
	</v-list-item-icon>
	<v-list-item-content>
		<v-text-overflow :text="name" :highlight="search" />
		<div v-if="tags">
			<span v-if="tags.length > 0">
				<v-chip
					v-for="(tag, i) in tags"
					:key="i"
					style="margin-top: 2.5px; color: white; font-size: 8pt; padding: 6px; background-color: var(--theme--primary)"
					dense
					small
				>
					{{ tag }}
				</v-chip>
			</span>
		</div>
	</v-list-item-content>
</template>
