<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import type { RankItem } from './mock-data';

import { onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const props = withDefaults(
  defineProps<{
    data: RankItem[];
    unit?: string;
  }>(),
  {
    unit: '%',
  },
);

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

function render() {
  const names = [...props.data].map((item) => item.name).toReversed();
  const values = [...props.data].map((item) => item.value).toReversed();

  renderEcharts({
    grid: {
      bottom: 0,
      containLabel: true,
      left: '2%',
      right: '6%',
      top: '4%',
    },
    series: [
      {
        data: values,
        itemStyle: { color: '#1677ff' },
        type: 'bar',
        barWidth: 14,
        label: {
          formatter: `{c}${props.unit}`,
          position: 'right',
          show: true,
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => `${value}${props.unit}`,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      data: names,
      type: 'category',
    },
  });
}

onMounted(render);
watch(() => props.data, render, { deep: true });
</script>

<template>
  <EchartsUI ref="chartRef" height="280px" />
</template>
