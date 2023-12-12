<template>
	<form @submit.prevent="onSubmit">
		<v-input v-model="identifier" autofocus autocomplete="username" placeholder="identifier" />
	</form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const identifier = ref<string | null>(null);

async function onSubmit() {
	return;
}
</script>
