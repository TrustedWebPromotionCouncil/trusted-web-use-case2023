<script setup lang="ts">
import { CONST } from '@/models';
import { t } from '@/utils';
import { onMounted } from 'vue';
import { ref } from 'vue';

const notifications = ref<string[]>([]);

onMounted(() => {
  notifications.value = [];
});
</script>
<template>
  <h1 class="mx-5">Trusted Web</h1>
  <v-spacer />
  <div class="mx-5 d-flex align-center justify-center">
    <v-icon icon="mdi-home-outline" class="mr-2" :size="CONST.SIZE.ICON" />
    <span>
      {{ t('HEADER.HOME') }}
    </span>
  </div>
  <div class="mx-5 d-flex align-center justify-center">
    <v-icon icon="mdi-message-outline" class="mr-2" :size="CONST.SIZE.ICON" />
    <span>{{ t('HEADER.MESSAGE') }}</span>
  </div>
  <v-spacer />
  <div class="mx-5 d-flex align-center justify-center">
    <template v-if="notifications.length">
      <v-badge :content="notifications.length" color="red">
        <v-icon icon="mdi-bell-outline" class="mr-2" :size="CONST.SIZE.ICON" />
      </v-badge>
    </template>
    <template v-else>
      <v-icon icon="mdi-bell-outline" class="mr-2" :size="CONST.SIZE.ICON" />
    </template>
    <v-icon icon="mdi-cog-outline" :size="CONST.SIZE.ICON" />
  </div>
</template>
<style lang="scss" scoped></style>
