<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { OrderApi } from '#/api';

import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  FormItem,
  Input,
  message,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';

import { getOrderList, getOrderSummary } from '#/api';

import {
  ACCOUNT_OPTIONS,
  CARD_TYPE_OPTIONS,
  CUSTOMER_TYPE_OPTIONS,
  EMPTY_SUMMARY,
  MERCHANT_OPTIONS,
  PAY_METHOD_OPTIONS,
  SHIP_STATUS_OPTIONS,
  SITE_B_OPTIONS,
  STATUS_COLORS,
  STATUS_FILTER_OPTIONS,
  STATUS_LABELS,
  TOOLBAR_ACTIONS,
} from './shared';

defineOptions({ name: 'TradeOrderList' });

const { RangePicker } = DatePicker;

const loading = ref(false);
const list = ref<OrderApi.Order[]>([]);
const selectedRowKeys = ref<string[]>([]);
const summary = ref({ ...EMPTY_SUMMARY });

const pagination = reactive({
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条`,
});

/** 搜索表单：静态预留，暂不参与接口筛选 */
const searchForm = reactive({
  merchant: undefined as string | undefined,
  email: '',
  phone: '',
  ip: '',
  orderNo: '',
  siteA: '',
  status: '' as '' | string,
  customerType: '' as '' | string,
  originPayMethod: undefined as string | undefined,
  payMethod: undefined as string | undefined,
  accountId: undefined as string | undefined,
  siteB: undefined as string | undefined,
  paidRange: undefined as [Dayjs, Dayjs] | undefined,
  createdRange: undefined as [Dayjs, Dayjs] | undefined,
  shipStatus: '' as '' | string,
  country: '',
  currency: '',
  minAmount: '',
  maxAmount: '',
  cardBin: '',
  cardType: '' as '' | string,
  billNo: '',
  logisticsNo: '',
  transactionNo: '',
});

const summaryColumns = [
  {
    title: '交易笔数',
    dataIndex: 'totalCount',
    key: 'totalCount',
    align: 'center' as const,
  },
  {
    title: '未付笔数',
    dataIndex: 'unpaidCount',
    key: 'unpaidCount',
    align: 'center' as const,
  },
  {
    title: '失败笔数',
    dataIndex: 'failedCount',
    key: 'failedCount',
    align: 'center' as const,
  },
  {
    title: '成功笔数',
    dataIndex: 'successCount',
    key: 'successCount',
    align: 'center' as const,
  },
  {
    title: '支付率',
    dataIndex: 'payRate',
    key: 'payRate',
    align: 'center' as const,
  },
  {
    title: '成功率',
    dataIndex: 'successRate',
    key: 'successRate',
    align: 'center' as const,
  },
  {
    title: '总计',
    dataIndex: 'totalRate',
    key: 'totalRate',
    align: 'center' as const,
  },
  {
    title: '收款金额(USD)',
    dataIndex: 'amountUsd',
    key: 'amountUsd',
    align: 'center' as const,
  },
];

const columns = [
  {
    title: '商家',
    dataIndex: 'merchantName',
    key: 'merchantName',
    width: 120,
  },
  {
    title: '订单号',
    dataIndex: 'merchantOrder',
    key: 'merchantOrder',
    width: 220,
  },
  {
    title: '交易号',
    dataIndex: 'providerRef',
    key: 'providerRef',
    width: 200,
  },
  {
    title: 'B站',
    dataIndex: 'siteB',
    key: 'siteB',
    width: 160,
  },
  {
    title: '支付通道',
    dataIndex: 'channel',
    key: 'channel',
    width: 120,
  },
  {
    title: '支付账号',
    dataIndex: 'accountName',
    key: 'accountName',
    width: 220,
  },
  {
    title: '网站金额',
    dataIndex: 'siteAmount',
    key: 'siteAmount',
    width: 110,
  },
  {
    title: '交易金额',
    dataIndex: 'tradeAmount',
    key: 'tradeAmount',
    width: 110,
  },
  {
    title: '手续费',
    dataIndex: 'fee',
    key: 'fee',
    width: 90,
  },
  {
    title: '美元偏差',
    dataIndex: 'usdDiff',
    key: 'usdDiff',
    width: 100,
  },
  {
    title: '下单站点',
    dataIndex: 'merchantSite',
    key: 'merchantSite',
    width: 180,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 170,
  },
  {
    title: '交易状态',
    key: 'status',
    width: 100,
    fixed: 'right' as const,
  },
];

function onSelectionChange(keys: (number | string)[]) {
  selectedRowKeys.value = keys.map(String);
}

function onTableChange(pag: { current?: number; pageSize?: number }) {
  if (pag.pageSize && pag.pageSize !== pagination.pageSize) {
    pagination.pageSize = pag.pageSize;
    pagination.current = 1;
    return;
  }
  if (pag.current) {
    pagination.current = pag.current;
  }
}

function handleSearch() {
  message.info('搜索暂未接入，当前仅展示全部订单');
  void loadList();
}

function resetSearch() {
  searchForm.merchant = undefined;
  searchForm.email = '';
  searchForm.phone = '';
  searchForm.ip = '';
  searchForm.orderNo = '';
  searchForm.siteA = '';
  searchForm.status = '';
  searchForm.customerType = '';
  searchForm.originPayMethod = undefined;
  searchForm.payMethod = undefined;
  searchForm.accountId = undefined;
  searchForm.siteB = undefined;
  searchForm.paidRange = undefined;
  searchForm.createdRange = undefined;
  searchForm.shipStatus = '';
  searchForm.country = '';
  searchForm.currency = '';
  searchForm.minAmount = '';
  searchForm.maxAmount = '';
  searchForm.cardBin = '';
  searchForm.cardType = '';
  searchForm.billNo = '';
  searchForm.logisticsNo = '';
  searchForm.transactionNo = '';
  void loadList();
}

function onToolbarAction(label: string) {
  message.info(`${label}（暂未接入）`);
}

async function loadList() {
  loading.value = true;
  try {
    const [orders, orderSummary] = await Promise.all([
      getOrderList(),
      getOrderSummary(),
    ]);
    list.value = orders;
    summary.value = {
      totalCount: orderSummary.totalCount ?? 0,
      unpaidCount: orderSummary.unpaidCount ?? 0,
      failedCount: orderSummary.failedCount ?? 0,
      successCount: orderSummary.successCount ?? 0,
      payRate: orderSummary.payRate || '0%',
      successRate: orderSummary.successRate || '0%',
      totalRate: orderSummary.totalRate || '0%',
      amountUsd: orderSummary.amountUsd || '0.00',
    };
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadList();
});
</script>

<template>
  <Page auto-content-height>
    <Card class="mb-4" :bordered="false">
      <Form
        :label-col="{ flex: '0 0 88px' }"
        :wrapper-col="{ flex: '1 1 0' }"
        class="trade-order-search"
      >
        <Row :gutter="[16, 8]">
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="商户">
              <Select
                v-model:value="searchForm.merchant"
                :options="MERCHANT_OPTIONS"
                allow-clear
                class="w-full"
                option-filter-prop="label"
                placeholder="请选择"
                show-search
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="邮箱">
              <Input
                v-model:value="searchForm.email"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="电话">
              <Input
                v-model:value="searchForm.phone"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="IP">
              <Input
                v-model:value="searchForm.ip"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>

          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="订单号">
              <Input
                v-model:value="searchForm.orderNo"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="下单站点">
              <Input
                v-model:value="searchForm.siteA"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="状态">
              <Select
                v-model:value="searchForm.status"
                :options="STATUS_FILTER_OPTIONS"
                allow-clear
                class="w-full"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="顾客类型">
              <Select
                v-model:value="searchForm.customerType"
                :options="CUSTOMER_TYPE_OPTIONS"
                allow-clear
                class="w-full"
                placeholder="请选择"
              />
            </FormItem>
          </Col>

          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="原支付方式">
              <Select
                v-model:value="searchForm.originPayMethod"
                :options="PAY_METHOD_OPTIONS"
                allow-clear
                class="w-full"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="支付方式">
              <Select
                v-model:value="searchForm.payMethod"
                :options="PAY_METHOD_OPTIONS"
                allow-clear
                class="w-full"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="账号">
              <Select
                v-model:value="searchForm.accountId"
                :options="ACCOUNT_OPTIONS"
                allow-clear
                class="w-full"
                option-filter-prop="label"
                placeholder="请选择"
                show-search
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="支付B站">
              <Select
                v-model:value="searchForm.siteB"
                :options="SITE_B_OPTIONS"
                allow-clear
                class="w-full"
                option-filter-prop="label"
                placeholder="请选择"
                show-search
              />
            </FormItem>
          </Col>

          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="支付时间">
              <RangePicker
                v-model:value="searchForm.paidRange"
                class="w-full"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="添加时间">
              <RangePicker
                v-model:value="searchForm.createdRange"
                class="w-full"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="发货状态">
              <Select
                v-model:value="searchForm.shipStatus"
                :options="SHIP_STATUS_OPTIONS"
                allow-clear
                class="w-full"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="国家">
              <Input
                v-model:value="searchForm.country"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>

          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="货币">
              <Input
                v-model:value="searchForm.currency"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="最小金额">
              <Input
                v-model:value="searchForm.minAmount"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="最大金额">
              <Input
                v-model:value="searchForm.maxAmount"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="卡头">
              <Input
                v-model:value="searchForm.cardBin"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>

          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="卡类型">
              <Select
                v-model:value="searchForm.cardType"
                :options="CARD_TYPE_OPTIONS"
                allow-clear
                class="w-full"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="账单号">
              <Input
                v-model:value="searchForm.billNo"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="物流单号">
              <Input
                v-model:value="searchForm.logisticsNo"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :xl="6">
            <FormItem label="交易号">
              <Input
                v-model:value="searchForm.transactionNo"
                allow-clear
                placeholder="请输入"
              />
            </FormItem>
          </Col>
        </Row>

        <FormItem :wrapper-col="{ flex: '1 1 0' }" class="!mb-0">
          <Space>
            <Button type="primary" @click="handleSearch">
              <template #icon>
                <IconifyIcon icon="lucide:search" />
              </template>
              搜索
            </Button>
            <Button @click="resetSearch">
              <template #icon>
                <IconifyIcon icon="lucide:rotate-ccw" />
              </template>
              重置
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <Card class="mb-4" :bordered="false">
      <Table
        :columns="summaryColumns"
        :data-source="[summary]"
        :pagination="false"
        bordered
        class="mb-4"
        row-key="totalCount"
        size="small"
      />
      <Space wrap :size="[8, 8]">
        <Button
          v-for="action in TOOLBAR_ACTIONS"
          :key="action.key"
          :type="action.tone === 'primary' ? 'primary' : 'default'"
          :class="
            action.tone === 'danger'
              ? '!border-[#fa8c16] !bg-[#fa8c16] !text-white hover:!border-[#ffa940] hover:!bg-[#ffa940] hover:!text-white'
              : ''
          "
          size="small"
          @click="onToolbarAction(action.label)"
        >
          <template v-if="action.icon" #icon>
            <IconifyIcon :icon="action.icon" />
          </template>
          {{ action.label
          }}{{ action.count !== undefined ? `(${action.count})` : '' }}
        </Button>
      </Space>
    </Card>

    <Card :bordered="false" title="订单列表">
      <Table
        :columns="columns"
        :data-source="list"
        :loading="loading"
        :pagination="pagination"
        :row-selection="{
          selectedRowKeys,
          onChange: onSelectionChange,
        }"
        :scroll="{ x: 1900 }"
        row-key="id"
        size="small"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'merchantOrder'">
            <span class="break-all font-mono text-xs">
              {{ (record as OrderApi.Order).merchantOrder || '-' }}
            </span>
          </template>
          <template v-else-if="column.key === 'providerRef'">
            <span class="break-all font-mono text-xs">
              {{ (record as OrderApi.Order).providerRef || '-' }}
            </span>
          </template>
          <template v-else-if="column.key === 'siteB'">
            {{ (record as OrderApi.Order).siteB || '-' }}
          </template>
          <template v-else-if="column.key === 'accountName'">
            {{ (record as OrderApi.Order).accountName || '-' }}
          </template>
          <template v-else-if="column.key === 'merchantName'">
            {{ (record as OrderApi.Order).merchantName || '-' }}
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="STATUS_COLORS[(record as OrderApi.Order).status]">
              {{ STATUS_LABELS[(record as OrderApi.Order).status] }}
            </Tag>
          </template>
        </template>
      </Table>
    </Card>
  </Page>
</template>

<style scoped>
.trade-order-search :deep(.ant-form-item) {
  margin-bottom: 8px;
}
</style>
