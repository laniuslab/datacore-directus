<template>
	<v-list-item-icon>
		<v-icon :name="icon ?? 'label'" :color="color" />
	</v-list-item-icon>

	<!-- MV-DATACORE -->
	<v-list-item-content>
		<v-text-overflow :text="name" :highlight="search" />
		<div v-if="tags" class="tags">
			<span v-if="tags.length > 0" class="custom tag-container">
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
		icon?: string;
		color?: string;
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
.tags {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-start;
	padding: 4px 0px 0px 0px;

	span.tag-container {
		display: contents;
	}

	.tag {
		margin-right: 8px;
		margin-bottom: 8px;
		font-size: 12px !important;
		color: white !important;
	}

	.custom {
		.v-chip {
			--v-chip-background-color: var(--primary);
			--v-chip-color: var(--foreground-inverted);
			--v-chip-background-color-hover: var(--danger);
			--v-chip-close-color: var(--v-chip-background-color);
			--v-chip-close-color-hover: var(--white);

			transition: all var(--fast) var(--transition);

			&:hover {
				--v-chip-close-color: var(--white);

				:deep(.chip-content .close-outline .close:hover) {
					--v-icon-color: var(--danger);
				}
			}
		}
	}
}
</style>
<!-- MV-DATACORE [END] -->
