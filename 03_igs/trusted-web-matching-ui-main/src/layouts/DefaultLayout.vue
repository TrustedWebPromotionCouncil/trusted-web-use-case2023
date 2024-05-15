<script setup lang="ts">
import TWHeader from '@/components/TWHeader.vue';
import TWFooter from '@/components/TWFooter.vue';
</script>
<template>
  <v-app>
    <v-app-bar>
      <TWHeader />
    </v-app-bar>
    <v-main>
      <v-container class="align-center">
        <router-view />
      </v-container>
    </v-main>
    <v-footer>
      <TWFooter />
    </v-footer>
  </v-app>
</template>
<style lang="scss" scoped></style>
