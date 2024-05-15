<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const defaultLayout = defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue'));
</script>

<template>
  <component :is="defaultLayout" />
</template>

<style lang="scss" scoped></style>
