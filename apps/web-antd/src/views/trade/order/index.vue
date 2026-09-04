<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { TradeOrderRow } from './shared';

import { reactive, ref } from 'vue';

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
  Tooltip,
} from 'ant-design-vue';

import {
  ACCOUNT_OPTIONS,
  CARD_TYPE_OPTIONS,
  CUSTOMER_TYPE_OPTIONS,
  MERCHANT_OPTIONS,
  MOCK_ORDERS,
  MOCK_SUMMARY,
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

const summary = ref({ ...MOCK_SUMMARY });

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

const list = ref<TradeOrderRow[]>([...MOCK_ORDERS]);
const selectedRowKeys = ref<string[]>([]);

const columns = [
  {
    title: '操作',
    key: 'actions',
    width: 88,
    fixed: 'left' as const,
  },
  {
    title: '商家',
    dataIndex: 'merchantName',
    key: 'merchantName',
    width: 120,
  },
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 220,
  },
  {
    title: '交易号',
    dataIndex: 'transactionNo',
    key: 'transactionNo',
    width: 180,
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
    width: 110,
  },
  {
    title: '支付账号',
    dataIndex: 'accountName',
    key: 'accountName',
    width: 260,
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
    title: '交易状态',
    key: 'status',
    width: 100,
    fixed: 'right' as const,
  },
];

function onSelectionChange(keys: (number | string)[]) {
  selectedRowKeys.value = keys.map(String);
}

function handleSearch() {
  message.success('搜索（静态页，暂未接入接口）');
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
  list.value = [...MOCK_ORDERS];
  message.success('已重置');
}

function onViewDetail(row: TradeOrderRow) {
  message.info(`查看详细：${row.orderNo}`);
}

function onViewLog(row: TradeOrderRow) {
  message.info(`订单日志：${row.orderNo}`);
}

function onToolbarAction(label: string) {
  message.info(`${label}（静态页，暂未接入）`);
}
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
        :pagination="{ pageSize: 20, showSizeChanger: true }"
        :row-selection="{
          selectedRowKeys,
          onChange: onSelectionChange,
        }"
        :scroll="{ x: 1700 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <Space :size="4">
              <Tooltip title="查看详细">
                <Button
                  class="!flex !h-7 !w-7 !items-center !justify-center !p-0"
                  size="small"
                  type="primary"
                  @click="onViewDetail(record as TradeOrderRow)"
                >
                  <IconifyIcon class="size-3.5" icon="lucide:eye" />
                </Button>
              </Tooltip>
              <Tooltip title="日志">
                <Button
                  class="!flex !h-7 !w-7 !items-center !justify-center !p-0"
                  size="small"
                  type="primary"
                  @click="onViewLog(record as TradeOrderRow)"
                >
                  <IconifyIcon class="size-3.5" icon="lucide:file-text" />
                </Button>
              </Tooltip>
            </Space>
          </template>
          <template v-else-if="column.key === 'orderNo'">
            <span class="break-all font-mono text-xs">
              {{ (record as TradeOrderRow).orderNo }}
            </span>
          </template>
          <template v-else-if="column.key === 'transactionNo'">
            <span class="break-all font-mono text-xs">
              {{ (record as TradeOrderRow).transactionNo || '-' }}
            </span>
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="STATUS_COLORS[(record as TradeOrderRow).status]">
              {{ STATUS_LABELS[(record as TradeOrderRow).status] }}
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
