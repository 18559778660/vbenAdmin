<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table';

import type { ExceptionOrderItem, MetricItem } from './mock-data';

import { useRouter } from 'vue-router';

import { AnalysisChartCard } from '@vben/common-ui';

import { Button, Card, Col, Row, Space, Table, Tag } from 'ant-design-vue';

import ChartAmountTrend from './chart-amount-trend.vue';
import ChartPie from './chart-pie.vue';
import ChartRankBar from './chart-rank-bar.vue';
import ChartSuccessRate from './chart-success-rate.vue';
import {
  channelFailRank,
  channelSuccessRank,
  countryDistribution,
  currencyDistribution,
  exceptionOrders,
  merchantAmountRank,
  overviewMetrics,
  quickActions,
} from './mock-data';

defineOptions({ name: 'PaymentAnalytics' });

const router = useRouter();

const toneClassMap: Record<NonNullable<MetricItem['tone']>, string> = {
  danger: 'text-red-500',
  default: 'text-foreground',
  success: 'text-green-600',
  warning: 'text-amber-500',
};

const exceptionColumns: ColumnsType<ExceptionOrderItem> = [
  { dataIndex: 'id', key: 'id', title: '订单号', width: 140 },
  { dataIndex: 'merchant', key: 'merchant', title: '商户', width: 110 },
  { dataIndex: 'channel', key: 'channel', title: '通道', width: 120 },
  { dataIndex: 'amount', key: 'amount', title: '金额', width: 100 },
  { dataIndex: 'reason', key: 'reason', title: '异常原因' },
  { dataIndex: 'time', key: 'time', title: '时间', width: 90 },
];

function go(path: string) {
  router.push(path);
}
</script>

<template>
  <div class="p-5">
    <!-- 核心指标 -->
    <Row :gutter="[16, 16]">
      <Col
        v-for="item in overviewMetrics"
        :key="item.key"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="4"
      >
        <Card size="small" class="h-full">
          <div class="text-muted-foreground text-sm">{{ item.title }}</div>
          <div
            class="mt-2 text-2xl font-semibold tracking-tight"
            :class="toneClassMap[item.tone ?? 'default']"
          >
            {{ item.value }}
          </div>
          <div class="text-muted-foreground mt-2 text-xs">{{ item.hint }}</div>
        </Card>
      </Col>
    </Row>

    <!-- 趋势图 -->
    <Row :gutter="[16, 16]" class="mt-4">
      <Col :xs="24" :lg="12">
        <AnalysisChartCard title="近 24 小时交易金额趋势">
          <ChartAmountTrend />
        </AnalysisChartCard>
      </Col>
      <Col :xs="24" :lg="12">
        <AnalysisChartCard title="近 24 小时支付成功率趋势">
          <ChartSuccessRate />
        </AnalysisChartCard>
      </Col>
    </Row>

    <!-- 运营监控 -->
    <Row :gutter="[16, 16]" class="mt-4">
      <Col :xs="24" :lg="8">
        <AnalysisChartCard title="通道成功率排行">
          <ChartRankBar :data="channelSuccessRank" unit="%" />
        </AnalysisChartCard>
      </Col>
      <Col :xs="24" :lg="8">
        <AnalysisChartCard title="通道失败率排行">
          <ChartRankBar :data="channelFailRank" unit="%" />
        </AnalysisChartCard>
      </Col>
      <Col :xs="24" :lg="8">
        <Card size="small" title="待处理扣单">
          <template #extra>
            <Button type="link" size="small" @click="go('/trade/hold')">
              全部
            </Button>
          </template>
          <Table
            :columns="exceptionColumns"
            :data-source="exceptionOrders"
            :pagination="false"
            :scroll="{ x: 560 }"
            row-key="id"
            size="small"
          >
            <template #bodyCell="{ column, text }">
              <Tag v-if="column.key === 'reason'" color="error">
                {{ text }}
              </Tag>
              <template v-else>
                {{ text }}
              </template>
            </template>
          </Table>
        </Card>
      </Col>
    </Row>

    <!-- 业务分布 -->
    <Row :gutter="[16, 16]" class="mt-4">
      <Col :xs="24" :md="12" :xl="6">
        <AnalysisChartCard title="国家/地区交易分布">
          <ChartPie :data="countryDistribution" series-name="交易额" />
        </AnalysisChartCard>
      </Col>
      <Col :xs="24" :md="12" :xl="6">
        <AnalysisChartCard title="币种交易分布">
          <ChartPie :data="currencyDistribution" series-name="交易额" />
        </AnalysisChartCard>
      </Col>
      <Col :xs="24" :md="12" :xl="6">
        <AnalysisChartCard title="商户交易额排行">
          <ChartRankBar :data="merchantAmountRank" unit="" />
        </AnalysisChartCard>
      </Col>
      <Col :xs="24" :md="12" :xl="6">
        <Card size="small" title="快捷操作入口" class="h-full">
          <Space direction="vertical" class="w-full" :size="12">
            <Button
              v-for="action in quickActions"
              :key="action.path"
              block
              @click="go(action.path)"
            >
              {{ action.title }}
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  </div>
</template>
