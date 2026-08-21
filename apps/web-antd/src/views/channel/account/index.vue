<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { ChannelAccountRow } from './shared';

import { computed, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  Button,
  Card,
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
} from 'ant-design-vue';

import { getCountryOptions, getCurrencyOptions } from '#/api/basic-config';

import { INTERCEPT_MODE_LABELS, SUCCESS_MODE_LABELS } from '../shared';
import {
  CHANNEL_OPTIONS,
  GROUP_OPTIONS,
  groupLabel,
  mockAccountList,
  money,
  nextAccountIdValue,
  nowText,
  PAYMENT_METHOD_LABELS,
  USER_OPTIONS,
} from './shared';

defineOptions({ name: 'ChannelAccount' });

const { RangePicker } = DatePicker;

const searchForm = reactive({
  id: undefined as number | undefined,
  name: '',
  alias: '',
  remark: '',
  paymentMethod: '',
  createdRange: undefined as [Dayjs, Dayjs] | undefined,
  groupName: '',
  assignedUser: '',
});

const applied = reactive({
  id: undefined as number | undefined,
  name: '',
  alias: '',
  remark: '',
  paymentMethod: '',
  createdRange: undefined as [Dayjs, Dayjs] | undefined,
  groupName: '',
  assignedUser: '',
  listFilter: '' as '' | 'closed8' | 'restricted' | 'unpaid',
});

const loading = ref(false);
const modalOpen = ref(false);
const saving = ref(false);
const editingId = ref<null | number>(null);

const form = reactive({
  channel: 'PRO_card',
  accountNo: '',
  alias: '',
  remark: '',
  paymentMethod: 'card',
  groupName: 'default',
  assignedUser: 'none',
  dailyOrderLimit: 0,
  dailyAmountLimit: 0,
  interceptMode: 'reset',
  interceptCurrency: 'USD',
  interceptMax: 0,
  interceptMin: 0,
  successMode: 'unlimited',
  disableCountries: [] as string[],
  preferCountries: [] as string[],
});

const currencyOptions = ref<{ label: string; value: string }[]>([]);
const countryOptions = ref<{ label: string; value: string }[]>([]);

const paymentMethodOptions = Object.entries(PAYMENT_METHOD_LABELS).map(
  ([value, label]) => ({ label, value }),
);

const paymentFilterOptions = [
  { label: '全部', value: '' },
  ...paymentMethodOptions,
];

const formGroupOptions = GROUP_OPTIONS.filter((item) => item.value);
const formUserOptions = USER_OPTIONS.filter((item) => item.value);

const interceptModeOptions = Object.entries(INTERCEPT_MODE_LABELS).map(
  ([value, label]) => ({ label, value }),
);

const successModeOptions = Object.entries(SUCCESS_MODE_LABELS).map(
  ([value, label]) => ({ label, value }),
);

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 70,
    fixed: 'left' as const,
  },
  {
    title: '操作',
    key: 'actions',
    width: 80,
    fixed: 'left' as const,
  },
  { title: '通道', dataIndex: 'channel', key: 'channel', width: 120 },
  { title: '账号名称', dataIndex: 'accountNo', key: 'accountNo', width: 140 },
  { title: '别名', dataIndex: 'alias', key: 'alias', width: 200 },
  { title: '账号分组', key: 'groupName', width: 120 },
  { title: '总收款(USD)', key: 'totalReceived', width: 130 },
  { title: '状态', key: 'status', width: 80 },
  { title: '金额设置', key: 'amountSetting', width: 240 },
  { title: '拦截设置', key: 'intercept', width: 200 },
  { title: '成功设置', key: 'successMode', width: 100 },
  { title: '禁用国家', key: 'disableCountries', width: 120 },
  { title: '优先国家', key: 'preferCountries', width: 120 },
];

const unpaidCount = computed(
  () => mockAccountList.value.filter((row) => row.unpaidClosed).length,
);
const restrictedCount = computed(
  () => mockAccountList.value.filter((row) => row.restrictedClosed).length,
);
const closed8Count = computed(
  () => mockAccountList.value.filter((row) => row.cannotOpenAt8).length,
);

const filteredList = computed(() => {
  return mockAccountList.value.filter((row) => {
    if (applied.id && row.id !== applied.id) return false;
    if (applied.name && !row.channel.includes(applied.name.trim()))
      return false;
    if (applied.alias && !row.alias.includes(applied.alias.trim()))
      return false;
    if (applied.remark && !row.remark.includes(applied.remark.trim()))
      return false;
    if (applied.paymentMethod && row.paymentMethod !== applied.paymentMethod)
      return false;
    if (applied.groupName && row.groupName !== applied.groupName) return false;
    if (applied.assignedUser && row.assignedUser !== applied.assignedUser)
      return false;
    if (applied.createdRange) {
      const start = applied.createdRange[0].format('YYYY-MM-DD');
      const end = applied.createdRange[1].format('YYYY-MM-DD');
      const day = row.createdAt.slice(0, 10);
      if (day < start || day > end) return false;
    }
    if (applied.listFilter === 'unpaid' && !row.unpaidClosed) return false;
    if (applied.listFilter === 'restricted' && !row.restrictedClosed)
      return false;
    if (applied.listFilter === 'closed8' && !row.cannotOpenAt8) return false;
    return true;
  });
});

const modalTitle = computed(() => (editingId.value ? '编辑账号' : '新增账号'));

function handleSearch() {
  applied.id = searchForm.id;
  applied.name = searchForm.name;
  applied.alias = searchForm.alias;
  applied.remark = searchForm.remark;
  applied.paymentMethod = searchForm.paymentMethod;
  applied.createdRange = searchForm.createdRange;
  applied.groupName = searchForm.groupName;
  applied.assignedUser = searchForm.assignedUser;
  applied.listFilter = '';
}

function resetSearch() {
  searchForm.id = undefined;
  searchForm.name = '';
  searchForm.alias = '';
  searchForm.remark = '';
  searchForm.paymentMethod = '';
  searchForm.createdRange = undefined;
  searchForm.groupName = '';
  searchForm.assignedUser = '';
  handleSearch();
}

function handleRefresh() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
    message.success('已刷新（静态数据）');
  }, 200);
}

function applyListFilter(filter: typeof applied.listFilter) {
  applied.listFilter = applied.listFilter === filter ? '' : filter;
}

async function loadConfigOptions() {
  try {
    const [currencies, countries] = await Promise.all([
      getCurrencyOptions(),
      getCountryOptions(),
    ]);
    currencyOptions.value = currencies;
    countryOptions.value = countries;
  } catch {
    currencyOptions.value = [];
    countryOptions.value = [];
  }
}

function resetForm() {
  form.channel = 'PRO_card';
  form.accountNo = '';
  form.alias = '';
  form.remark = '';
  form.paymentMethod = 'card';
  form.groupName = 'default';
  form.assignedUser = 'none';
  form.dailyOrderLimit = 0;
  form.dailyAmountLimit = 0;
  form.interceptMode = 'reset';
  form.interceptCurrency = 'USD';
  form.interceptMax = 0;
  form.interceptMin = 0;
  form.successMode = 'unlimited';
  form.disableCountries = [];
  form.preferCountries = [];
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function openEdit(row: ChannelAccountRow) {
  editingId.value = row.id;
  form.channel = row.channel;
  form.accountNo = row.accountNo;
  form.alias = row.alias;
  form.remark = row.remark;
  form.paymentMethod = row.paymentMethod;
  form.groupName = row.groupName;
  form.assignedUser = row.assignedUser;
  form.dailyOrderLimit = row.dailyOrderLimit;
  form.dailyAmountLimit = row.dailyAmountLimit;
  form.interceptMode = row.interceptMode;
  form.interceptCurrency = row.interceptCurrency;
  form.interceptMax = row.interceptMax;
  form.interceptMin = row.interceptMin;
  form.successMode = row.successMode;
  form.disableCountries = [...row.disableCountries];
  form.preferCountries = [...row.preferCountries];
  modalOpen.value = true;
}

function handleSave() {
  if (!form.channel.trim() || !form.accountNo.trim()) {
    message.warning('请填写通道和账号名称');
    return;
  }
  saving.value = true;
  if (editingId.value) {
    const row = mockAccountList.value.find(
      (item) => item.id === editingId.value,
    );
    if (row) {
      Object.assign(row, {
        channel: form.channel,
        accountNo: form.accountNo,
        alias: form.alias,
        remark: form.remark,
        paymentMethod: form.paymentMethod,
        groupName: form.groupName,
        assignedUser: form.assignedUser,
        dailyOrderLimit: form.dailyOrderLimit,
        dailyAmountLimit: form.dailyAmountLimit,
        interceptMode: form.interceptMode,
        interceptCurrency: form.interceptCurrency,
        interceptMax: form.interceptMax,
        interceptMin: form.interceptMin,
        successMode: form.successMode,
        disableCountries: [...form.disableCountries],
        preferCountries: [...form.preferCountries],
      });
    }
  } else {
    mockAccountList.value.unshift({
      id: nextAccountIdValue(),
      channel: form.channel,
      accountNo: form.accountNo,
      alias: form.alias,
      remark: form.remark,
      paymentMethod: form.paymentMethod,
      groupName: form.groupName,
      assignedUser: form.assignedUser,
      totalReceived: 0,
      status: true,
      resetTimezone: '北京时间',
      resetHour: 0,
      dailyOrderLimit: form.dailyOrderLimit,
      dailyAmountLimit: form.dailyAmountLimit,
      dailyRecvCount: 0,
      dailyRecvAmount: 0,
      interceptMode: form.interceptMode,
      interceptCurrency: form.interceptCurrency,
      interceptMax: form.interceptMax,
      interceptMin: form.interceptMin,
      successMode: form.successMode,
      disableCountries: [...form.disableCountries],
      preferCountries: [...form.preferCountries],
      unpaidClosed: false,
      restrictedClosed: false,
      cannotOpenAt8: false,
      createdAt: nowText(),
    });
  }
  saving.value = false;
  modalOpen.value = false;
  message.success('已保存（静态，未接后端）');
}

function onToggleStatus(
  row: ChannelAccountRow,
  checked: boolean | number | string,
) {
  row.status = Boolean(checked);
}

function onBatchEdit() {
  message.info('批量修改暂未接入（静态页）');
}

onMounted(() => {
  void loadConfigOptions();
});
</script>

<template>
  <Page auto-content-height description="当前为静态预览，数据未接后端">
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="gap-y-3">
        <FormItem label="ID">
          <InputNumber
            v-model:value="searchForm.id"
            :controls="false"
            :min="1"
            class="w-28"
            placeholder="ID"
          />
        </FormItem>
        <FormItem label="名称">
          <Input
            v-model:value="searchForm.name"
            allow-clear
            class="w-36"
            placeholder="通道名称"
          />
        </FormItem>
        <FormItem label="别名">
          <Input
            v-model:value="searchForm.alias"
            allow-clear
            class="w-36"
            placeholder="别名"
          />
        </FormItem>
        <FormItem label="备注">
          <Input
            v-model:value="searchForm.remark"
            allow-clear
            class="w-36"
            placeholder="备注"
          />
        </FormItem>
        <FormItem label="支付方式">
          <Select
            v-model:value="searchForm.paymentMethod"
            :options="paymentFilterOptions"
            class="w-36"
            placeholder="支付方式"
          />
        </FormItem>
        <FormItem label="添加时间">
          <RangePicker v-model:value="searchForm.createdRange" class="w-60" />
        </FormItem>
        <FormItem label="账号分组">
          <Select
            v-model:value="searchForm.groupName"
            :options="GROUP_OPTIONS"
            class="w-36"
            placeholder="账号分组"
          />
        </FormItem>
        <FormItem label="分配用户">
          <Select
            v-model:value="searchForm.assignedUser"
            :options="USER_OPTIONS"
            class="w-36"
            placeholder="分配用户"
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

    <Card :bordered="false">
      <div class="mb-4 flex flex-wrap justify-between gap-2">
        <Space wrap>
          <Button type="primary" @click="openCreate">
            <template #icon>
              <IconifyIcon icon="lucide:plus" />
            </template>
            新增
          </Button>
          <Button @click="onBatchEdit">批量修改</Button>
          <Button danger type="primary" @click="applyListFilter('unpaid')">
            <template #icon>
              <IconifyIcon icon="lucide:clock" />
            </template>
            跳转未付关闭列表({{ unpaidCount }})
          </Button>
          <Button danger type="primary" @click="applyListFilter('restricted')">
            <template #icon>
              <IconifyIcon icon="lucide:clock" />
            </template>
            账号受限关闭列表({{ restrictedCount }})
          </Button>
          <Button danger type="primary" @click="applyListFilter('closed8')">
            <template #icon>
              <IconifyIcon icon="lucide:clock" />
            </template>
            B站打不开({{ closed8Count }})
          </Button>
        </Space>
        <Button @click="handleRefresh">
          <template #icon>
            <IconifyIcon icon="lucide:refresh-cw" />
          </template>
          刷新
        </Button>
      </div>

      <Table
        :columns="columns"
        :data-source="filteredList"
        :loading="loading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :scroll="{ x: 1800 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <Button
              type="link"
              size="small"
              @click="openEdit(record as ChannelAccountRow)"
            >
              <IconifyIcon icon="lucide:pencil" />
            </Button>
          </template>
          <template v-else-if="column.key === 'groupName'">
            {{ groupLabel(record.groupName) }}
          </template>
          <template v-else-if="column.key === 'totalReceived'">
            {{ money(record.totalReceived) }}
          </template>
          <template v-else-if="column.key === 'status'">
            <Switch
              :checked="record.status"
              size="small"
              @change="
                (checked) =>
                  onToggleStatus(record as ChannelAccountRow, checked)
              "
            />
          </template>
          <template v-else-if="column.key === 'amountSetting'">
            <div class="text-xs leading-5">
              <div>
                {{ record.resetTimezone }}:
                <span class="text-green-600">{{ record.resetHour }}点</span>
              </div>
              <div>
                日限单数:
                <span class="text-green-600">{{ record.dailyOrderLimit }}</span>
                <span class="mx-1">|</span>
                日限金额:
                <span class="text-orange-500">
                  {{ money(record.dailyAmountLimit) }}
                </span>
                USD
              </div>
              <div>
                日收笔数:
                <span class="text-green-600">{{ record.dailyRecvCount }}</span>
                <span class="mx-1">|</span>
                日收金额:
                <span class="text-orange-500">
                  {{ money(record.dailyRecvAmount) }}
                </span>
                USD
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'intercept'">
            <div class="text-xs leading-5">
              <div>
                模式
                <span class="text-red-500">
                  {{ INTERCEPT_MODE_LABELS[record.interceptMode] }}
                </span>
                <span class="mx-1">|</span>
                货币
                <span class="text-red-500">{{ record.interceptCurrency }}</span>
              </div>
              <div>
                最高
                <span class="text-orange-500">
                  {{ money(record.interceptMax) }}
                </span>
                <span class="mx-1">|</span>
                最低
                <span class="text-orange-500">
                  {{ money(record.interceptMin) }}
                </span>
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'successMode'">
            <span
              :class="
                record.successMode === 'unlimited'
                  ? 'text-green-600'
                  : 'text-orange-500'
              "
            >
              {{ SUCCESS_MODE_LABELS[record.successMode] }}
            </span>
          </template>
          <template v-else-if="column.key === 'disableCountries'">
            <Space wrap size="small">
              <Tag v-for="code in record.disableCountries" :key="code">
                {{ code }}
              </Tag>
            </Space>
          </template>
          <template v-else-if="column.key === 'preferCountries'">
            <Space wrap size="small">
              <Tag
                v-for="code in record.preferCountries"
                :key="code"
                color="blue"
              >
                {{ code }}
              </Tag>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <Modal
      v-model:open="modalOpen"
      :confirm-loading="saving"
      :title="modalTitle"
      destroy-on-close
      width="640px"
      @ok="handleSave"
    >
      <Form layout="vertical" class="pt-2">
        <div class="grid grid-cols-2 gap-x-4">
          <FormItem label="通道" required>
            <Select v-model:value="form.channel" :options="CHANNEL_OPTIONS" />
          </FormItem>
          <FormItem label="账号名称" required>
            <Input v-model:value="form.accountNo" placeholder="账号名称" />
          </FormItem>
          <FormItem label="别名">
            <Input v-model:value="form.alias" placeholder="别名" />
          </FormItem>
          <FormItem label="支付方式">
            <Select
              v-model:value="form.paymentMethod"
              :options="paymentMethodOptions"
            />
          </FormItem>
          <FormItem label="账号分组">
            <Select
              v-model:value="form.groupName"
              :options="formGroupOptions"
            />
          </FormItem>
          <FormItem label="分配用户">
            <Select
              v-model:value="form.assignedUser"
              :options="formUserOptions"
            />
          </FormItem>
          <FormItem label="日限单数">
            <InputNumber
              v-model:value="form.dailyOrderLimit"
              :min="0"
              class="w-full"
            />
          </FormItem>
          <FormItem label="日限金额">
            <InputNumber
              v-model:value="form.dailyAmountLimit"
              :min="0"
              class="w-full"
            />
          </FormItem>
          <FormItem label="拦截模式">
            <Select
              v-model:value="form.interceptMode"
              :options="interceptModeOptions"
            />
          </FormItem>
          <FormItem label="拦截货币">
            <Select
              v-model:value="form.interceptCurrency"
              :options="currencyOptions"
              option-filter-prop="label"
              placeholder="请选择货币"
              show-search
            />
          </FormItem>
          <FormItem label="拦截最高">
            <InputNumber
              v-model:value="form.interceptMax"
              :min="0"
              class="w-full"
            />
          </FormItem>
          <FormItem label="拦截最低">
            <InputNumber
              v-model:value="form.interceptMin"
              :min="0"
              class="w-full"
            />
          </FormItem>
          <FormItem label="成功设置">
            <Select
              v-model:value="form.successMode"
              :options="successModeOptions"
            />
          </FormItem>
        </div>
        <FormItem label="备注">
          <Input v-model:value="form.remark" placeholder="备注" />
        </FormItem>
        <FormItem label="禁用国家">
          <Select
            v-model:value="form.disableCountries"
            :options="countryOptions"
            allow-clear
            mode="multiple"
            option-filter-prop="label"
            placeholder="请选择禁用国家"
            show-search
          />
        </FormItem>
        <FormItem label="优先国家">
          <Select
            v-model:value="form.preferCountries"
            :options="countryOptions"
            allow-clear
            mode="multiple"
            option-filter-prop="label"
            placeholder="请选择优先国家"
            show-search
          />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
