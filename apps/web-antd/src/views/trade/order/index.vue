<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { OrderDetailPreview } from './shared';

import type { OrderApi, OrderLogApi } from '#/api';

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
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'ant-design-vue';

import { getOrderList, getOrderLogList, getOrderSummary } from '#/api';

import { LOG_TYPE_LABELS } from '../order-log/shared';
import {
  ACCOUNT_OPTIONS,
  buildOrderDetailPreview,
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

const logModalOpen = ref(false);
const logModalTitle = ref('订单日志');
const logLoading = ref(false);
const logList = ref<OrderLogApi.OrderLog[]>([]);

const detailModalOpen = ref(false);
const detail = ref<null | OrderDetailPreview>(null);

const paymentColumns = [
  { title: '所属支付', dataIndex: 'provider', key: 'provider', width: 100 },
  { title: '交易状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '支付信息', dataIndex: 'payInfo', key: 'payInfo', ellipsis: true },
  { title: '添加时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
  {
    title: '所属账号',
    dataIndex: 'accountName',
    key: 'accountName',
    width: 180,
  },
  { title: '所属壳站', dataIndex: 'siteB', key: 'siteB', width: 160 },
];

const goodsColumns = [
  { title: '商品名', dataIndex: 'name', key: 'name' },
  { title: 'SKU', dataIndex: 'sku', key: 'sku', width: 120 },
  { title: '价格', dataIndex: 'price', key: 'price', width: 100 },
  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
  { title: '总价', dataIndex: 'total', key: 'total', width: 100 },
  { title: '尺寸', dataIndex: 'size', key: 'size', width: 100 },
];

const logColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 90 },
  { title: '订单ID', dataIndex: 'orderId', key: 'orderId', width: 200 },
  { title: '类型', key: 'type', width: 100 },
  { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
  { title: '时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
];

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
    title: '操作',
    key: 'actions',
    width: 72,
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

function onViewDetail(row: OrderApi.Order) {
  detail.value = buildOrderDetailPreview(row);
  detailModalOpen.value = true;
}

async function onViewLogs(row: OrderApi.Order) {
  const orderNo = (row.merchantOrder || '').trim();
  if (!orderNo) {
    message.warning('该订单没有订单号，无法查询日志');
    return;
  }
  logModalTitle.value = `订单日志 - ${orderNo}`;
  logModalOpen.value = true;
  logLoading.value = true;
  logList.value = [];
  try {
    logList.value = await getOrderLogList({ orderNo });
  } catch {
    message.error('加载订单日志失败');
  } finally {
    logLoading.value = false;
  }
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
        :scroll="{ x: 2040 }"
        row-key="id"
        size="small"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <div class="flex flex-col items-center gap-1 py-0.5">
              <Tooltip title="查看详情">
                <Button
                  class="!flex !h-7 !w-7 !items-center !justify-center !p-0"
                  size="small"
                  type="primary"
                  @click="onViewDetail(record as OrderApi.Order)"
                >
                  <IconifyIcon class="size-3.5" icon="lucide:eye" />
                </Button>
              </Tooltip>
              <Tooltip title="日志">
                <Button
                  class="!flex !h-7 !w-7 !items-center !justify-center !p-0"
                  size="small"
                  type="primary"
                  @click="onViewLogs(record as OrderApi.Order)"
                >
                  <IconifyIcon class="size-3.5" icon="lucide:file-text" />
                </Button>
              </Tooltip>
            </div>
          </template>
          <template v-else-if="column.key === 'merchantOrder'">
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

    <Modal
      v-model:open="detailModalOpen"
      :footer="null"
      destroy-on-close
      title="查看详情"
      width="1100px"
    >
      <div v-if="detail" class="space-y-4">
        <Card :bordered="false" class="bg-gray-50" size="small">
          <div class="mb-3 rounded bg-gray-100 px-3 py-2 font-mono text-sm">
            #{{ detail.orderNo }}
          </div>
          <div
            class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm md:grid-cols-3 xl:grid-cols-6"
          >
            <div>
              <div class="text-gray-400">客户姓名</div>
              <div>{{ detail.customerName }}</div>
            </div>
            <div>
              <div class="text-gray-400">邮箱</div>
              <div class="break-all">{{ detail.email }}</div>
            </div>
            <div>
              <div class="text-gray-400">电话</div>
              <div>{{ detail.phone }}</div>
            </div>
            <div>
              <div class="text-gray-400">订单状态</div>
              <div>{{ detail.orderStatus || '-' }}</div>
            </div>
            <div class="xl:col-span-2">
              <div class="text-gray-400">返回信息</div>
              <div>{{ detail.returnMessage || '-' }}</div>
            </div>

            <div>
              <div class="text-gray-400">账单国家</div>
              <div>{{ detail.billCountry }}</div>
            </div>
            <div>
              <div class="text-gray-400">账单省/州</div>
              <div>{{ detail.billState }}</div>
            </div>
            <div>
              <div class="text-gray-400">账单城市</div>
              <div>{{ detail.billCity }}</div>
            </div>
            <div>
              <div class="text-gray-400">账单邮编</div>
              <div>{{ detail.billZip }}</div>
            </div>
            <div>
              <div class="text-gray-400">账单地址</div>
              <div>{{ detail.billAddress }}</div>
            </div>
            <div>
              <div class="text-gray-400">金额</div>
              <div>{{ detail.amountText }}</div>
            </div>

            <div>
              <div class="text-gray-400">配送国家</div>
              <div>{{ detail.shipCountry }}</div>
            </div>
            <div>
              <div class="text-gray-400">配送省/州</div>
              <div>{{ detail.shipState }}</div>
            </div>
            <div>
              <div class="text-gray-400">配送城市</div>
              <div>{{ detail.shipCity }}</div>
            </div>
            <div>
              <div class="text-gray-400">配送邮编</div>
              <div>{{ detail.shipZip }}</div>
            </div>
            <div>
              <div class="text-gray-400">配送地址</div>
              <div>{{ detail.shipAddress }}</div>
            </div>
            <div>
              <div class="text-gray-400">IP</div>
              <div class="break-all">{{ detail.ip }}</div>
            </div>
          </div>
        </Card>

        <Card :bordered="false" size="small" title="支付记录">
          <Table
            :columns="paymentColumns"
            :data-source="detail.payments"
            :pagination="false"
            row-key="key"
            size="small"
          />
        </Card>

        <Card :bordered="false" size="small" title="商品信息">
          <Table
            :columns="goodsColumns"
            :data-source="detail.goods"
            :pagination="false"
            row-key="key"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <a class="text-blue-500">{{ record.name }}</a>
              </template>
            </template>
          </Table>
        </Card>
      </div>
    </Modal>

    <Modal
      v-model:open="logModalOpen"
      :footer="null"
      :title="logModalTitle"
      destroy-on-close
      width="900px"
    >
      <Table
        :columns="logColumns"
        :data-source="logList"
        :loading="logLoading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :scroll="{ x: 800 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'orderId'">
            <span class="break-all font-mono text-xs">
              {{ (record as OrderLogApi.OrderLog).orderId || '-' }}
            </span>
          </template>
          <template v-else-if="column.key === 'type'">
            {{
              LOG_TYPE_LABELS[(record as OrderLogApi.OrderLog).type] ||
              (record as OrderLogApi.OrderLog).type
            }}
          </template>
          <template v-else-if="column.key === 'remark'">
            <Tooltip :title="(record as OrderLogApi.OrderLog).remark">
              <span class="block max-w-[420px] truncate">
                {{ (record as OrderLogApi.OrderLog).remark }}
              </span>
            </Tooltip>
          </template>
        </template>
      </Table>
    </Modal>
  </Page>
</template>

<style scoped>
.trade-order-search :deep(.ant-form-item) {
  margin-bottom: 8px;
}
</style>
