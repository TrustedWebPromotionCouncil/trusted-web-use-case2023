<script setup lang="ts">
import { ICandidate } from '@/models';
import { StringUtils, t } from '@/utils';
import { ref, watch } from 'vue';
import { PropType } from 'vue';
import { CONST } from '@/models';
import { Enums } from '@/models/enums';
import TWBtn from '@/components/TWBtn.vue';
import { candidateModule } from '@/stores/modules';

defineProps({
  candidateList: {
    type: Array as PropType<ICandidate[]>,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});
const emits = defineEmits(['fetchCandidateList', 'click']);

const sort = ref<CONST.SORT_TYPE>('ability');

watch(sort, () => {
  candidateModule.setSortType(sort.value);
  emits('fetchCandidateList');
});
</script>
<template>
  <v-card class="my-5">
    <v-card-text>
      <p class="text-subtitle-1 font-weight-bold">
        {{ t('SUBTITLE.CANDIDATE_LIST') }}
        {{ t('SUBTITLE.CANDIDATE_LIST_SUPPLEMENT_VALUE', { total }) }}
      </p>
      <v-col cols="3" class="pl-0 d-flex align-center">
        <span class="mr-2">{{ t('CANDIDATE_LIST.SORT') }}: </span>
        <v-select v-model="sort" :items="CONST.SORT_TYPE_OPTIONS" item-title="label" item-value="value" variant="outlined" density="compact" hide-details>
        </v-select>
      </v-col>
      <v-table>
        <thead>
          <tr>
            <th class="text-center" width="6%">{{ t('TABLE_HEADER.AGE') }}</th>
            <th class="text-center" width="6%">{{ t('TABLE_HEADER.GENDER') }}</th>
            <th class="text-center" width="10%">{{ t('TABLE_HEADER.RESIDENCE') }}</th>
            <th class="text-center" width="10%">{{ t('CANDIDATE_LIST.SORT_TYPE.ABILITY') }}</th>
            <th class="text-center" width="10%">{{ t('CANDIDATE_LIST.SORT_TYPE.HARDSKILL') }}</th>
            <th class="text-center" width="10%">{{ t('CANDIDATE_LIST.SORT_TYPE.SOFTSKILL') }}</th>
            <th class="text-center" width="10%">{{ t('CANDIDATE_LIST.SORT_TYPE.DESIRED_SALARY') }}</th>
            <th class="text-center" width="10%">{{ t('CANDIDATE_LIST.SORT_TYPE.OFFER_COUNT') }}</th>
            <th class="text-center" width="15%">{{ t('TABLE_HEADER.OPERATION') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="candidate in candidateList">
            <td class="text-center">{{ candidate.age }}</td>
            <td class="text-center">{{ StringUtils.parseGender(candidate.gender) }}</td>
            <td class="text-center">{{ candidate.residence }}</td>
            <td class="text-center">{{ candidate.ability }}</td>
            <td class="text-center">{{ candidate.hardSkill }}</td>
            <td class="text-center">{{ candidate.softSkill }}</td>
            <td class="text-center">{{ candidate.desiredSalary ? t('UNIT_VALUE', { value: candidate.desiredSalary }) : candidate.desiredSalary }}</td>
            <td class="text-center">{{ candidate.offerCount }}</td>
            <td class="text-center">
              <div class="my-2">
                <TWBtn @click="emits('click', candidate.id, Enums.DialogIndex.Detail)">
                  {{ t('BUTTON.DETAIL') }}
                </TWBtn>
              </div>
              <div class="my-2">
                <TWBtn @click="emits('click', candidate.id, Enums.DialogIndex.Offer)">
                  {{ t('BUTTON.OFFER') }}
                </TWBtn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped></style>
