<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const props = withDefaults(
  defineProps<{
    data: Array<{ name: string; value: number }>;
    seriesName?: string;
  }>(),
  {
    seriesName: '交易额',
  },
);

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

function render() {
  renderEcharts({
    legend: {
      bottom: 0,
      type: 'scroll',
    },
    series: [
      {
        center: ['50%', '46%'],
        data: props.data,
        name: props.seriesName,
        radius: ['42%', '68%'],
        type: 'pie',
        label: {
          formatter: '{b}\n{d}%',
        },
      },
    ],
    tooltip: {
      trigger: 'item',
      valueFormatter: (value) => `¥${Number(value).toLocaleString()}`,
    },
  });
}

onMounted(render);
watch(() => props.data, render, { deep: true });
</script>

<template>
  <EchartsUI ref="chartRef" height="280px" />
</template>
