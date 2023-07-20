<template>
	<v-list-item-icon>
		<v-icon :name="icon ?? 'label'" :color="color" />
	</v-list-item-icon>
	<v-list-item-content>
		<v-text-overflow :text="name" :highlight="search"></v-text-overflow>
		<div>
			<v-chip
				v-for="(tag, i) in tags"
				:key="i"
				style="color: white; font-size: 9pt; background-color: var(--primary)"
				dense
				small
			>
				{{ tag }}
			</v-chip>
		</div>
	</v-list-item-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		icon: {
			type: String,
			default: 'label',
		},
		color: {
			type: String,
			default: 'var(--foreground-normal)',
		},
		name: {
			type: String,
			required: true,
		},
		search: {
			type: String,
			default: null,
		},
		tags: {
			type: Array,
			default: () => [],
		},
	},
});
</script>
