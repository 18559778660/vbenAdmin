<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { hours24, successRateTrend } from './mock-data';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

onMounted(() => {
  renderEcharts({
    grid: {
      bottom: 0,
      containLabel: true,
      left: '1%',
      right: '2%',
      top: '8%',
    },
    series: [
      {
        data: successRateTrend,
        itemStyle: { color: '#52c41a' },
        name: '成功率',
        smooth: true,
        type: 'line',
      },
    ],
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => `${value}%`,
    },
    xAxis: {
      boundaryGap: false,
      data: hours24,
      type: 'category',
    },
    yAxis: {
      max: 100,
      min: 60,
      splitNumber: 4,
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
      },
    },
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
