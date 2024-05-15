<script setup lang="ts">
import { CONST } from '@/models';

defineProps({
  width: {
    type: Number,
    default: CONST.SIZE.BUTTON.width,
  },
  height: {
    type: Number,
    default: CONST.SIZE.BUTTON.height,
  },
  disabled: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['click']);
</script>
<template>
  <v-btn
    @click.stop="emits('click')"
    :disabled="!disabled"
    :color="!disabled ? 'gray-darken-1' : 'orange-lighten-3'"
    density="compact"
    :width="CONST.SIZE.BUTTON.width"
    :height="CONST.SIZE.BUTTON.height"
    :prepend-icon="icon"
  >
    <slot></slot>
  </v-btn>
</template>
<style lang="scss" scoped></style>
