<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { amountTrend, hours24 } from './mock-data';

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
        areaStyle: {
          color: {
            colorStops: [
              { color: 'rgba(22, 119, 255, 0.28)', offset: 0 },
              { color: 'rgba(22, 119, 255, 0.02)', offset: 1 },
            ],
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1,
          },
        },
        data: amountTrend,
        itemStyle: { color: '#1677ff' },
        name: '交易金额',
        smooth: true,
        type: 'line',
      },
    ],
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => `¥${Number(value).toLocaleString()}`,
    },
    xAxis: {
      boundaryGap: false,
      data: hours24,
      type: 'category',
    },
    yAxis: {
      splitNumber: 4,
      type: 'value',
    },
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
