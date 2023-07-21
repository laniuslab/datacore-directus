<template>
	<v-list-item-icon>
		<v-icon :name="icon ?? 'label'" :color="color" />
	</v-list-item-icon>

	<!-- MV-DATACORE -->
	<v-list-item-content>
		<v-text-overflow :text="name" :highlight="search" />
		<div v-if="tags">
			<span v-if="tags.length > 0">
				<v-chip v-for="(tag, i) in tags" :key="i" class="tag" small label>
					{{ tag }}
				</v-chip>
			</span>
		</div>
	</v-list-item-content>
	<!-- MV-DATACORE[END] -->
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		name: string;
		search?: string;

		// MV-DATACORE
		icon?: string | null;
		color?: string | null;
		// MV-DATACORE [END]

		tags?: string[];
	}>(),
	{
		icon: 'label',
		color: 'var(--foreground-normal)',
	}
);
</script>

<!-- MV-DATACORE -->
<style lang="scss" scoped>
.tag {
	color: white !important;
	font-size: 9pt !important;
	background-color: var(--primary) !important;
}
</style>
<!-- MV-DATACORE [END] -->
