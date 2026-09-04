<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { OrderLogRow } from './shared';

import { reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  Button,
  Card,
  DatePicker,
  Form,
  FormItem,
  Input,
  message,
  Select,
  Space,
  Table,
  Tooltip,
} from 'ant-design-vue';

import { LOG_TYPE_LABELS, MERCHANT_OPTIONS, MOCK_ORDER_LOGS } from './shared';

defineOptions({ name: 'TradeOrderLog' });

const { RangePicker } = DatePicker;

const searchForm = reactive({
  merchant: undefined as string | undefined,
  orderNo: '',
  createdRange: undefined as [Dayjs, Dayjs] | undefined,
});

const list = ref<OrderLogRow[]>([...MOCK_ORDER_LOGS]);
const selectedRowKeys = ref<number[]>([]);

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 110,
  },
  {
    title: '操作',
    key: 'actions',
    width: 80,
  },
  {
    title: '订单ID',
    dataIndex: 'orderId',
    key: 'orderId',
    width: 100,
  },
  {
    title: '商户',
    dataIndex: 'merchantName',
    key: 'merchantName',
    width: 100,
  },
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 240,
  },
  {
    title: '类型',
    key: 'type',
    width: 110,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true,
  },
  {
    title: '时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 170,
  },
];

function onSelectionChange(keys: (number | string)[]) {
  selectedRowKeys.value = keys.map(Number);
}

function handleSearch() {
  message.success('搜索（静态页，暂未接入接口）');
}

function resetSearch() {
  searchForm.merchant = undefined;
  searchForm.orderNo = '';
  searchForm.createdRange = undefined;
  list.value = [...MOCK_ORDER_LOGS];
  message.success('已重置');
}

function onViewDetail(row: OrderLogRow) {
  message.info(`查看日志详情：${row.id}`);
}
</script>

<template>
  <Page auto-content-height>
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="gap-y-3">
        <FormItem label="商户">
          <Select
            v-model:value="searchForm.merchant"
            :options="MERCHANT_OPTIONS"
            allow-clear
            class="w-40"
            option-filter-prop="label"
            placeholder="商户"
            show-search
          />
        </FormItem>
        <FormItem label="订单号">
          <Input
            v-model:value="searchForm.orderNo"
            allow-clear
            class="w-56"
            placeholder="订单号"
          />
        </FormItem>
        <FormItem label="下单时间">
          <RangePicker
            v-model:value="searchForm.createdRange"
            class="w-72"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
          />
        </FormItem>
        <FormItem>
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

    <Card :bordered="false" title="订单日志">
      <Table
        :columns="columns"
        :data-source="list"
        :pagination="{ pageSize: 20, showSizeChanger: true }"
        :row-selection="{
          selectedRowKeys,
          onChange: onSelectionChange,
        }"
        :scroll="{ x: 1200 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <Tooltip title="查看详情">
              <Button
                class="!flex !h-7 !w-7 !items-center !justify-center !p-0"
                size="small"
                type="primary"
                @click="onViewDetail(record as OrderLogRow)"
              >
                <IconifyIcon class="size-3.5" icon="lucide:info" />
              </Button>
            </Tooltip>
          </template>
          <template v-else-if="column.key === 'orderNo'">
            <span class="break-all font-mono text-xs">
              {{ (record as OrderLogRow).orderNo }}
            </span>
          </template>
          <template v-else-if="column.key === 'type'">
            {{ LOG_TYPE_LABELS[(record as OrderLogRow).type] }}
          </template>
          <template v-else-if="column.key === 'remark'">
            <Tooltip :title="(record as OrderLogRow).remark">
              <span class="block max-w-[480px] truncate">
                {{ (record as OrderLogRow).remark }}
              </span>
            </Tooltip>
          </template>
        </template>
      </Table>
    </Card>
  </Page>
</template>
