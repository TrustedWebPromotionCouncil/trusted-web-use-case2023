<script setup lang="ts">
import { CONST, ICandidateDetail } from '@/models';
import { t } from '@/utils';
import { PropType, ref, Ref } from 'vue';
import Chart from 'chart.js/auto';
import { onMounted } from 'vue';

const props = defineProps({
  candidateDetail: {
    type: Object as PropType<ICandidateDetail>,
    required: true,
  },
});

const hardSkillChartRef = ref<HTMLCanvasElement>();
const softSkillChartRef = ref<HTMLCanvasElement>();

// 非表示処理プラグイン登録
Chart.register({
  id: 'na_display_plugin',
  // グラフ非表示
  beforeUpdate: (chart: any) => {
    const { options, data } = chart;
    const conditions = options.plugins.na_display_plugin?.conditions || [];
    if (!conditions) return
    const dataset = data.datasets[0];
    dataset.data = dataset.data.map((value: any, index: any) => (conditions[index] ? value : null));
  },
  // N/Aを表示
  afterDraw: (chart: any, args: any) => {
    const { ctx, scales, options, data } = chart;
    const conditions = options.plugins.na_display_plugin?.conditions || [];
    if (!conditions) return

    const barThickness = data.datasets[0].barThickness;

    // フォント設定
    ctx.fillStyle = Chart.defaults.color;
    ctx.font = `${Chart.defaults.font.size}px ${Chart.defaults.font.family}`;

    conditions.forEach((condition: any, index: any) => {
      if (!condition) {
        const x = scales.x.left;
        const y = scales.y.getPixelForValue(index) + barThickness / 2;
        ctx.fillText(t('NOT_AVAILABLE'), x + 18, y);
      }
    });
  },
});

const drawSkiillChart = (canvasRef: Ref<HTMLCanvasElement | undefined>, color: string, labels: string[], data: number[], conditions: boolean[]) => {
  if(!canvasRef.value) return;

  const canvas = canvasRef.value as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            data,
            backgroundColor: color,
            barThickness: 10,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          na_display_plugin: {
            conditions,
          },
        },
      },
    });
  }
}

const drawHardSkillChart = () => {
  const labels = [t('GRAPH_LABEL.HARDSKILL1'), t('GRAPH_LABEL.HARDSKILL2')];
  const data = [props.candidateDetail?.knowledge, props.candidateDetail?.experience];
  const conditions = [props.candidateDetail?.isKnowledge, props.candidateDetail?.isExperience];
  drawSkiillChart(hardSkillChartRef, 'royalblue', labels, data, conditions);
};

const drawSoftSkillChart = () => {
  const labels = [
    t('GRAPH_LABEL.SOFTSKILL1'),
    t('GRAPH_LABEL.SOFTSKILL2'),
    t('GRAPH_LABEL.SOFTSKILL3'),
    t('GRAPH_LABEL.SOFTSKILL4'),
    t('GRAPH_LABEL.SOFTSKILL5'),
  ];
  const data = [
    props.candidateDetail?.cognition,
    props.candidateDetail?.community,
    props.candidateDetail?.attitude,
    props.candidateDetail?.manner,
    props.candidateDetail?.engaged,
  ];
  const conditions = [
    props.candidateDetail?.isCognition,
    props.candidateDetail?.isCommunity,
    props.candidateDetail?.isAttitude,
    props.candidateDetail?.isManner,
    props.candidateDetail?.isEngaged,
  ];
  drawSkiillChart(softSkillChartRef, 'aquamarine', labels, data, conditions);
};

onMounted(() => {
  drawHardSkillChart();
  drawSoftSkillChart();
});
</script>
<template>
  <v-row>
    <v-col>
      <p class="text-subtitle-1 font-weight-bold">
        {{ t('SUBTITLE.HARDSKILL') }}
      </p>
      <canvas ref="hardSkillChartRef" :height="CONST.SIZE.BAR_CHART.HARD"></canvas>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <p class="text-subtitle-1 font-weight-bold">
        {{ t('SUBTITLE.SOFTSKILL') }}
      </p>
      <canvas ref="softSkillChartRef" :height="CONST.SIZE.BAR_CHART.SOFT"></canvas>
    </v-col>
  </v-row>
</template>
<style lang="scss" scoped></style>
