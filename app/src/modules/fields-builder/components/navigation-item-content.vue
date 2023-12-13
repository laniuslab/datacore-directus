<script setup lang="ts">
interface Props {
	icon?: string | null;
	name: string;
	search: string;
	color?: string | null;
	tags?: string[];
}

const props = defineProps<Props>();
</script>

<template>
	<v-list-item-icon>
		<v-icon :name="props.icon ?? 'label'" :color="props.color" />
	</v-list-item-icon>
	<v-list-item-content>
		<v-text-overflow :text="props.name" :highlight="props.search"></v-text-overflow>
		<div>
			<v-chip
				v-for="(tag, i) in props.tags"
				:key="i"
				style="margin-top: 2.5px; color: white; font-size: 8pt; padding: 6px; background-color: var(--theme--primary)"
				dense
				small
			>
				{{ tag }}
			</v-chip>
		</div>
	</v-list-item-content>
</template>
