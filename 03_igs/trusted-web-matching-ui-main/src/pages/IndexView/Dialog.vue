<script setup lang="ts">
import { ref } from 'vue';
import { Enums, CONST, ICandidateDetail } from '@/models';
import { StringUtils, t } from '@/utils';
import Offer from './Offer.vue';
import BarChart from './BarChart.vue';
import { candidateModule, offerModule } from '@/stores/modules';
import TWBtn from '@/components/TWBtn.vue';

const dialog = ref<boolean>(false);
const id = ref<number>(0);
const tabIndex = ref<number>(1);
const done = ref<boolean>(false);
const snackbar = ref<boolean>(false);

const candidateDetail = ref<ICandidateDetail>({
  id: 0,
  age: 0,
  gender: '',
  residence: '',
  ability: 0,
  hardSkill: 0,
  softSkill: 0,
  desiredSalary: 0,
  offerCount: 0,
  likeCount: 0,
  offerAmount: 0,
  escoRank: '',
  escoRankDescription: '',
  selfIntroduction: '',
  knowledge: 0,
  isKnowledge: false,
  experience: 0,
  isExperience: false,
  cognition: 0,
  isCognition: false,
  community: 0,
  isCommunity: false,
  attitude: 0,
  isAttitude: false,
  manner: 0,
  isManner: false,
  engaged: 0,
  isEngaged: false,
});

// TODO: api繋ぎ込み
const addLike = async () => {
  try {
    await offerModule.sendLike(id.value);
    done.value = true;
    snackbar.value = true;
    await fetchCandidateDetailById();
  } catch (error) {}
};

const fetchCandidateDetailById = async () => {
  candidateDetail.value = await candidateModule.fetchCandidateDetailById(id.value);
};
const closeDialog = () => (dialog.value = false);

const showDialog = async (_id: number, _tabIndex: number) => {
  id.value = _id;
  tabIndex.value = _tabIndex;
  await fetchCandidateDetailById();
  dialog.value = true;
  done.value = false;
  snackbar.value = false;
};

defineExpose({
  showDialog,
});
</script>
<template>
  <v-dialog v-model="dialog" :width="CONST.SIZE.MAIN_DIALOG.width" :height="CONST.SIZE.MAIN_DIALOG.height">
    <v-card :width="CONST.SIZE.MAIN_DIALOG.width" :height="CONST.SIZE.MAIN_DIALOG.height">
      <v-card-text>
        <v-tabs v-model="tabIndex" align-tabs="center">
          <v-tab :value="1">{{ t('TABS.PROFILE') }}</v-tab>
          <v-tab :value="2">{{ t('TABS.OFFER') }}</v-tab>
        </v-tabs>
        <v-card class="mx-auto my-2" :width="CONST.SIZE.MAIN_DIALOG_INNER.width">
          <v-card-text class="px-10">
            <v-table>
              <thead>
                <tr>
                  <th class="text-center" width="20%">{{ t('TABLE_HEADER.AGE') }}</th>
                  <th class="text-center" width="20%">{{ t('TABLE_HEADER.GENDER') }}</th>
                  <th class="text-center" width="20%">{{ t('TABLE_HEADER.RESIDENCE') }}</th>
                  <th class="text-center" width="20%">{{ t('CANDIDATE_LIST.SORT_TYPE.ABILITY') }}</th>
                  <th class="text-center" width="20%">{{ t('CANDIDATE_LIST.SORT_TYPE.DESIRED_SALARY') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">{{ candidateDetail.age }}</td>
                  <td class="text-center">{{ StringUtils.parseGender(candidateDetail.gender) }}</td>
                  <td class="text-center">{{ candidateDetail.residence }}</td>
                  <td class="text-center">{{ candidateDetail.ability }}</td>
                  <td class="text-center">
                    {{ candidateDetail.desiredSalary ? t('UNIT_VALUE', { value: candidateDetail.desiredSalary }) : candidateDetail.desiredSalary }}
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-table>
              <thead>
                <tr>
                  <th class="text-center" width="20%">{{ t('CANDIDATE_LIST.SORT_TYPE.HARDSKILL') }}</th>
                  <th class="text-center" width="20%">{{ t('CANDIDATE_LIST.SORT_TYPE.SOFTSKILL') }}</th>
                  <th class="text-center" width="20%">{{ t('TABLE_HEADER.OFFER_COUNT') }}</th>
                  <th class="text-center" width="20%">{{ t('TABLE_HEADER.LIKE_COUNT') }}</th>
                  <th class="text-center" width="20%">{{ t('TABLE_HEADER.OFFER_AMOUNT') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">{{ candidateDetail.hardSkill }}</td>
                  <td class="text-center">{{ candidateDetail.softSkill }}</td>
                  <td class="text-center">{{ candidateDetail.offerCount }}</td>
                  <td class="text-center">{{ candidateDetail.likeCount }}</td>
                  <td class="text-center">{{ candidateDetail.offerAmount ? t('UNIT_VALUE', { value: candidateDetail.offerAmount }) : t('NOT_AVAILABLE') }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
        <v-window v-model="tabIndex">
          <!-- profile -->
          <v-window-item :value="Enums.DialogIndex.Detail" class="my-2">
            <v-card class="mx-auto my-2" :width="CONST.SIZE.MAIN_DIALOG_INNER.width" flat>
              <v-card-text class="px-10">
                <p class="text-subtitle-1 font-weight-bold my-2">
                  {{ t('SUBTITLE.ABILITY_LEVEL') }}
                </p>
                <p class="bordered_paragraph d-flex align-center">
                  <span class="pr-2 text-subtitle-2">LV.{{ candidateDetail.escoRank }}</span>
                  <v-divider vertical />
                  <span class="pl-2">{{ candidateDetail.escoRankDescription }}</span>
                </p>
              </v-card-text>
            </v-card>
            <v-card class="mx-auto mb-4" :width="CONST.SIZE.MAIN_DIALOG_INNER.width" flat>
              <v-card-text class="px-10">
                <p class="text-subtitle-1 font-weight-bold my-2">
                  {{ t('SUBTITLE.SELF_INTRODUCTION') }}
                </p>
                <p class="bordered_paragraph">{{ candidateDetail.selfIntroduction }}</p>
              </v-card-text>
            </v-card>
            <div class="d-flex align-center justify-center mb-4">
              <v-snackbar v-model="snackbar" location="center" color="amber-lighten-3" :timeout="CONST.SNACKBAR_DELAY">
                <p class="text-center">
                  <v-icon icon="mdi-thumb-up-outline"></v-icon>
                  {{ t('MESSAGE.SEND_LIKE') }}
                </p>
              </v-snackbar>
              <TWBtn class="mx-2" @click="addLike" :disabled="!done" icon="mdi-thumb-up-outline">
                {{ t('BUTTON.LIKE') }}
              </TWBtn>
              <TWBtn class="mx-2" @click="tabIndex = Enums.DialogIndex.Offer" icon="mdi-email-fast-outline">
                {{ t('TABS.OFFER') }}
              </TWBtn>
            </div>
            <v-card class="mx-auto" :width="CONST.SIZE.MAIN_DIALOG_INNER.width" flat>
              <v-card-text>
                <BarChart :candidateDetail="candidateDetail" />
              </v-card-text>
            </v-card>
          </v-window-item>
          <!-- offer -->
          <v-window-item :value="Enums.DialogIndex.Offer" class="my-4">
            <v-card class="mx-auto" :width="CONST.SIZE.MAIN_DIALOG_INNER.width" flat>
              <v-card-text>
                <Offer :id="candidateDetail.id" @close="closeDialog" />
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style lang="scss" scoped>
.bordered_paragraph {
  border: 1px solid black;
  padding: 10px;
}
</style>
