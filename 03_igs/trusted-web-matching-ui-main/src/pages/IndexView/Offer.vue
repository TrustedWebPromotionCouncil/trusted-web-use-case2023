<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { t, Validate } from '@/utils';
import { CONST, IOffer } from '@/models';
import { candidateModule, offerModule } from '@/stores/modules';
import TWConfirmDialog from '@/components/TWConfirmDialog.vue';
import TWBtn from '@/components/TWBtn.vue';

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
});
const emits = defineEmits(['close']);

const textareaLimit = 1000;
const confirmDialogRef = ref();
const formValid = ref<boolean>(false);
const formRef = ref();
const offer = reactive<IOffer>({
  id: 0,
  mail: '',
  message: '',
});

const sendMail = async () => {
  try {
    await offerModule.sendMail();
    confirmDialogRef.value.toggleConfirmDialog();
    confirmDialogRef.value.toggleCompleteDialog();
    await candidateModule.fetchCandidateList();
  } catch (error) {}
};

const showConfirmDialog = () => {
  offerModule.setOffer(offer);
  confirmDialogRef.value.toggleConfirmDialog();
};
onMounted(() => {
  offerModule.init();
  offer.id = props.id;
});
</script>
<template>
  <v-form v-model="formValid" ref="formRef">
    <v-row>
      <v-col>
        <v-text-field
          v-model="offer.mail"
          variant="outlined"
          density="compact"
          :label="t('PLACEHOLDER.EMAIL')"
          :rules="[(v: string) => Validate.required(v, t('PLACEHOLDER.EMAIL')), (v: string) => Validate.email(v)]"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea
          :counter="textareaLimit"
          v-model="offer.message"
          variant="outlined"
          density="compact"
          :label="t('PLACEHOLDER.MESSAGE')"
          :rules="[(v: string) => Validate.required(v, t('PLACEHOLDER.MESSAGE')), (v: string) => Validate.limit(v, textareaLimit)]"
        />
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col>
        <TWBtn @click="showConfirmDialog" :disabled="formValid">
          {{ t('BUTTON.SEND') }}
        </TWBtn>
      </v-col>
    </v-row>
  </v-form>
  <TWConfirmDialog ref="confirmDialogRef" @yes="sendMail" @close="emits('close')">
    <template #title>{{ t('MESSAGE.OFFER_CONFIRM') }}</template>
    <template #content>
      <v-row>
        <v-col>
          <v-text-field readonly v-model="offer.mail" variant="outlined" density="compact" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea readonly focused :counter="textareaLimit" v-model="offer.message" variant="outlined" density="compact" />
        </v-col>
      </v-row>
    </template>
  </TWConfirmDialog>
</template>
<style lang="scss" scoped></style>
