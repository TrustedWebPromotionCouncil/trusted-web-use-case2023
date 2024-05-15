<script setup lang="ts">
import { t } from '@/utils';
import { PropType, ref, watch } from 'vue';
import { CONST, ICandidate } from '@/models';
import { onMounted } from 'vue';
import Chart, { InteractionOptions } from 'chart.js/auto';
import { Enums } from '@/models/enums';
import { candidateModule } from '@/stores/modules';

interface Plot {
  id: number;
  x: number;
  y: number;
}

const props = defineProps({
  candidateList: {
    type: Array as PropType<ICandidate[]>,
    required: true,
  },
});
const emits = defineEmits(['click', 'fetchCandidateList']);

const scatterChartRef = ref();
const chartInstance = ref();
let handleOnclick: (event: MouseEvent) => void;

const abilityType = ref<Enums.AbilityType>(Enums.AbilityType.Balanced);
const isAbilityTypeUpdated = ref(false);

watch(abilityType, (v: Enums.AbilityType) => {
  candidateModule.setAbilityType(v);
  isAbilityTypeUpdated.value = true;
  emits('fetchCandidateList');
});

watch(
  () => props.candidateList,
  () => {
    // ソートタイプが変わったことによりcandidateListが変化した場合、中身は変わらないので再描画しない。
    if (isAbilityTypeUpdated.value) {
      drawChart();
      isAbilityTypeUpdated.value = false;
    }
  },
  { deep: true }
);

const drawChart = () => {
  if (chartInstance.value) {
    // 再描画時
    chartInstance.value.destroy();
  }

  const canvas = scatterChartRef.value as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    if (typeof handleOnclick === 'function') {
      // 再描画時
      ctx.canvas.removeEventListener('click', handleOnclick);
    }

    const data: Plot[] = props.candidateList.map((candidate: ICandidate) => {
      return {
        id: candidate.id,
        x: candidate.ability,
        y: candidate.desiredSalary,
      } as Plot;
    });

    chartInstance.value = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            data,
            backgroundColor: 'steelblue',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: t('CANDIDATE_SCATTER_PLOT.COMPREHENSIVE_ABILITY_SCORE'),
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: t('CANDIDATE_SCATTER_PLOT.LOWEST_DESIRED_ANNUAL_INCOME'),
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const data = context.dataset.data[context.dataIndex];
                return `${data.x}, ${data.y}`;
              },
            },
          },
          legend: {
            display: false,
          },
        },
      },
    });
    // add clickEvent for scatter point
    handleOnclick = (event: MouseEvent) => {
      const activePoints = chartInstance.value.getElementsAtEventForMode(event, 'point', chartInstance.value.options as InteractionOptions, false);
      if (activePoints && activePoints.length) {
        const index = activePoints[0].index;
        const id = data[index].id;
        emits('click', id, Enums.DialogIndex.Detail);
      }
    };
    ctx.canvas.addEventListener('click', handleOnclick);
  }
};

onMounted(() => {
  drawChart();
});
</script>
<template>
  <v-card class="my-5">
    <v-card-text>
      <p class="text-subtitle-1 font-weight-bold">
        {{ t('SUBTITLE.CANDIDATE_SCATTER_PLOT') }}
      </p>
      <v-col xs="12" sm="7" md="5" class="pl-0 d-flex align-center">
        <span class="mr-2">能力スコア評価軸:</span>
        <v-select
          v-model="abilityType"
          :items="CONST.ABILITY_TYPE_OPTIONS"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          hide-details
        ></v-select>
      </v-col>
      <canvas ref="scatterChartRef"></canvas>
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped></style>
