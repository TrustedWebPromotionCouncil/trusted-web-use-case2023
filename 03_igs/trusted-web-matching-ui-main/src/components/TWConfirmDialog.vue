<script setup lang="ts">
import { CONST } from '@/models';
import { ref } from 'vue';
import TWBtn from './TWBtn.vue';
import { t } from '@/utils';

defineProps({
  width: {
    type: Number,
    default: CONST.SIZE.CONFIRM_DIALOG.width,
  },
  height: {
    type: Number,
    default: CONST.SIZE.CONFIRM_DIALOG.height,
  },
});
const isOpen = ref<boolean>(false);
const isCompleted = ref<boolean>(false);

const emits = defineEmits(['yes', 'close']);
const toggleConfirmDialog = () => (isOpen.value = !isOpen.value);
const toggleCompleteDialog = () => (isCompleted.value = !isCompleted.value);
defineExpose({
  toggleConfirmDialog,
  toggleCompleteDialog,
});
</script>
<template>
  <v-dialog v-model="isOpen" :width="CONST.SIZE.CONFIRM_DIALOG.width" :height="CONST.SIZE.CONFIRM_DIALOG.height">
    <v-card :width="CONST.SIZE.CONFIRM_DIALOG.width" :height="CONST.SIZE.CONFIRM_DIALOG.height">
      <v-card-title class="my-4 text-center">
        <slot name="title"></slot>
      </v-card-title>
      <v-card-text>
        <slot name="content"></slot>
        <div class="mt-4 text-center">
          <TWBtn class="mx-2" @click="toggleConfirmDialog">{{ t('BUTTON.CANCEL') }}</TWBtn>
          <TWBtn class="mx-2" @click="emits('yes')">{{ t('BUTTON.SEND') }}</TWBtn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isCompleted" :width="CONST.SIZE.COMPLETED_DIALOG.width" :height="CONST.SIZE.COMPLETED_DIALOG.height">
    <v-card :width="CONST.SIZE.COMPLETED_DIALOG.width" :height="CONST.SIZE.COMPLETED_DIALOG.height">
      <v-card-text class="mt-8 text-center">
        <v-row>
          <v-col>
            {{ t('MESSAGE.COMPLETED') }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <TWBtn class="mx-2" @click="toggleCompleteDialog, emits('close')">{{ t('BUTTON.CLOSE') }}</TWBtn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style lang="scss" scoped></style>
