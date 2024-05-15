<script setup lang="ts">
import Dialog from './Dialog.vue';
import List from './List.vue';
import ScatterChart from './ScatterChart.vue';
import { candidateModule } from '@/stores/modules';
import { ICandidate } from '@/models';
import { ref, onMounted } from 'vue';

const candidateList = ref<ICandidate[]>([]);
const dialogRef = ref();

const showDialog = (id: number, tabIndex: number) => {
  dialogRef.value.showDialog(id, tabIndex);
};

const fetchCandidateList = async () => {
  await candidateModule.fetchCandidateList();
  candidateList.value = candidateModule.candidateList;
};

onMounted(() => {
  fetchCandidateList();
});
</script>
<template>
  <v-card class="mx-auto" max-width="1280">
    <v-card-text>
      <ScatterChart v-if="candidateList.length" :candidateList="candidateList" @fetchCandidateList="fetchCandidateList" @click="showDialog" />
      <List :candidateList="candidateList" :total="candidateList.length" @fetchCandidateList="fetchCandidateList" @click="showDialog" />
    </v-card-text>
  </v-card>
  <Dialog ref="dialogRef" />
</template>
<style lang="scss" scoped></style>
