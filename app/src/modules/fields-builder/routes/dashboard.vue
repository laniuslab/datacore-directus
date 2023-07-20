<template>
	<private-view
		title="
			Query Builder
		"
	>
		<div>Query</div>
	</private-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'FieldsBuilder',
	components: {},
	props: {
		collection: {
			type: String,
			default: '',
		},
	},
	emits: ['update:modelValue'],
	setup() {
		return {};
	},
});
</script>

<style lang="scss" scoped>
.ml-3 {
	margin-left: 3px;
}

.ml-6 {
	margin-left: 6px;
}

.ml-9 {
	margin-left: 9px;
}

.ml-12 {
	margin-left: 12px;
}

.ml-15 {
	margin-left: 15px;
}

.mt-3 {
	margin-top: 3px;
}

.mt-6 {
	margin-top: 6px;
}

.mt-9 {
	margin-top: 9px;
}

.mt-12 {
	margin-top: 12px;
}

.mt-15 {
	margin-top: 15px;
}

.mb-3 {
	margin-bottom: 3px;
}

.mb-6 {
	margin-bottom: 6px;
}

.mb-9 {
	margin-bottom: 9px;
}

.mb-12 {
	margin-bottom: 12px;
}

.mb-15 {
	margin-bottom: 15px;
}

.mr-3 {
	margin-right: 3px;
}

.mr-6 {
	margin-right: 6px;
}

.mr-9 {
	margin-right: 9px;
}

.mr-12 {
	margin-right: 12px;
}

.mr-15 {
	margin-right: 15px;
}

.v-table {
	--v-table-sticky-offset-top: var(--layout-offset-top);

	display: contents;
}

.delete-field {
	--v-icon-color: var(--foreground-subdued);
	--v-icon-color-hover: var(--danger);

	.delete,
	&:hover {
		opacity: 1;
	}
}

.field-list {
	max-height: 45vh;
	overflow-x: hidden;
}

.table {
	max-height: 30vh;
	overflow-x: hidden;
	min-height: 40vh;
}

.flex-container {
	display: flex;
}

.col-1 {
	flex-grow: 1;
}

.col-2 {
	flex-grow: 2;
}

.col-3 {
	flex-grow: 3;
}

.col-4 {
	flex-grow: 4;
}

.col-5 {
	flex-grow: 5;
}

.col-6 {
	flex-grow: 6;
}

.col-7 {
	flex-grow: 7;
}

.col-8 {
	flex-grow: 8;
}

.col-9 {
	flex-grow: 9;
}

.col-10 {
	flex-grow: 10;
}

.footer {
	position: sticky;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 32px var(--content-padding);
	align-content: center;

	.pagination {
		display: inline-block;
	}
}

.label {
	color: var(--foreground-normal);
}
</style>
