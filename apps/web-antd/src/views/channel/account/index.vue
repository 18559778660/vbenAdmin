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
  Tooltip,
} from 'ant-design-vue';

import {
  getCardTypeList,
  getCountryOptions,
  getCurrencyOptions,
} from '#/api/basic-config';

import {
  CARD_BRAND_LABELS,
  INTERCEPT_MODE_LABELS,
  SUCCESS_MODE_LABELS,
  toOptions,
} from '../shared';
import {
  ACCOUNT_LIMIT_MODE_LABELS,
  CHANNEL_OPTIONS,
  GROUP_OPTIONS,
  groupLabel,
  mockAccountList,
  money,
  nextAccountIdValue,
  nowText,
  PAYMENT_METHOD_LABELS,
  RESET_HOUR_OPTIONS,
  SITE_B_OPTIONS,
  STATUS_OPTIONS,
  USER_OPTIONS,
} from './shared';

defineOptions({ name: 'ChannelAccount' });

type ViewMode = 'create-step1' | 'create-step2' | 'list';

const { RangePicker } = DatePicker;

const viewMode = ref<ViewMode>('list');
const saving = ref(false);
const editOpen = ref(false);
const limitOpen = ref(false);
const editingId = ref<null | number>(null);

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

const step1Form = reactive({
  channel: undefined as string | undefined,
});

const step2Form = reactive({
  accountNo: '',
  alias: '',
  status: 1,
  resetHour: undefined as number | undefined,
  dailyAmountLimit: 0,
  tradeCurrency: undefined as string | undefined,
  sort: 0,
  publicKey: '',
  webSecret: '',
  siteB: undefined as string | undefined,
  dailyOrderLimit: 0,
  disableCountries: [] as string[],
  preferCountries: [] as string[],
  remark: '',
  privateKey: '',
});

const editForm = reactive({
  accountNo: '',
  alias: '',
  status: 1,
  sort: 0,
  appId: '',
  merchantId: '',
  webSecret: '',
  siteB: undefined as string | undefined,
  remark: '',
  privateKey: '',
  environment: 'live',
});

const limitForm = reactive({
  resetHour: 0,
  dailyAmountLimit: 0,
  currencies: [] as string[],
  successCountLimit: 0,
  allowCountries: [] as string[],
  amountLimitMode: 'reset',
  interceptMax: 0,
  allowCardTypes: [] as string[],
  disableCardBrands: [] as string[],
  dailyOrderLimit: 0,
  maxSuccessCount: 0,
  payFrequency: 0,
  preferCountries: [] as string[],
  disableCountries: [] as string[],
  calcCurrency: 'USD',
  interceptMin: 0,
  disableCardTypes: [] as string[],
});

const currencyOptions = ref<{ label: string; value: string }[]>([]);
const countryOptions = ref<{ label: string; value: string }[]>([]);
const cardTypeOptions = ref<{ label: string; value: string }[]>([]);

const limitModeOptions = Object.entries(ACCOUNT_LIMIT_MODE_LABELS).map(
  ([value, label]) => ({ label, value }),
);

const paymentMethodOptions = Object.entries(PAYMENT_METHOD_LABELS).map(
  ([value, label]) => ({ label, value }),
);

const paymentFilterOptions = [
  { label: '全部', value: '' },
  ...paymentMethodOptions,
];

const selectedChannelLabel = computed(
  () =>
    CHANNEL_OPTIONS.find((item) => item.value === step1Form.channel)?.label ||
    step1Form.channel ||
    '',
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
    width: 140,
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
    const [currencies, countries, cardTypes] = await Promise.all([
      getCurrencyOptions(),
      getCountryOptions(),
      getCardTypeList(),
    ]);
    currencyOptions.value = currencies;
    countryOptions.value = countries;
    cardTypeOptions.value = cardTypes.map((item) => ({
      value: item.code,
      label: `${item.nameLabel || item.name}（${item.code}）`,
    }));
  } catch {
    currencyOptions.value = [];
    countryOptions.value = [];
    cardTypeOptions.value = [];
  }
}

function resetStep2Form() {
  step2Form.accountNo = '';
  step2Form.alias = '';
  step2Form.status = 1;
  step2Form.resetHour = undefined;
  step2Form.dailyAmountLimit = 0;
  step2Form.tradeCurrency = currencyOptions.value[0]?.value;
  step2Form.sort = 0;
  step2Form.publicKey = '';
  step2Form.webSecret = '';
  step2Form.siteB = undefined;
  step2Form.dailyOrderLimit = 0;
  step2Form.disableCountries = [];
  step2Form.preferCountries = [];
  step2Form.remark = '';
  step2Form.privateKey = '';
}

function openCreate() {
  step1Form.channel = undefined;
  resetStep2Form();
  viewMode.value = 'create-step1';
}

function backToList() {
  viewMode.value = 'list';
}

function submitStep1() {
  if (!step1Form.channel) {
    message.warning('请选择通道');
    return;
  }
  resetStep2Form();
  viewMode.value = 'create-step2';
}

function backToStep1() {
  viewMode.value = 'create-step1';
}

function submitStep2() {
  if (!step2Form.accountNo.trim()) {
    message.warning('请输入通道账号');
    return;
  }
  if (!step1Form.channel) {
    message.warning('请先选择通道');
    viewMode.value = 'create-step1';
    return;
  }

  saving.value = true;
  mockAccountList.value.unshift({
    id: nextAccountIdValue(),
    channel: step1Form.channel,
    accountNo: step2Form.accountNo.trim(),
    alias: step2Form.alias.trim(),
    remark: step2Form.remark.trim(),
    paymentMethod: 'card',
    groupName: 'default',
    assignedUser: 'none',
    totalReceived: 0,
    status: step2Form.status === 1,
    resetTimezone: '北京时间',
    resetHour: step2Form.resetHour ?? 0,
    dailyOrderLimit: step2Form.dailyOrderLimit,
    dailyAmountLimit: step2Form.dailyAmountLimit,
    dailyRecvCount: 0,
    dailyRecvAmount: 0,
    interceptMode: 'reset',
    interceptCurrency: step2Form.tradeCurrency || 'USD',
    interceptMax: 0,
    interceptMin: 0,
    amountLimitMode: 'reset',
    calcCurrency: step2Form.tradeCurrency || 'USD',
    currencies: step2Form.tradeCurrency ? [step2Form.tradeCurrency] : [],
    allowCountries: [],
    allowCardTypes: [],
    disableCardTypes: [],
    disableCardBrands: [],
    payFrequency: 0,
    successCountLimit: 0,
    maxSuccessCount: 0,
    successMode: 'unlimited',
    disableCountries: [...step2Form.disableCountries],
    preferCountries: [...step2Form.preferCountries],
    sort: step2Form.sort,
    appId: step2Form.publicKey,
    merchantId: '',
    webSecret: step2Form.webSecret,
    privateKey: step2Form.privateKey,
    environment: 'live',
    siteB: step2Form.siteB || '',
    unpaidClosed: false,
    restrictedClosed: false,
    cannotOpenAt8: step2Form.siteB === 'none',
    createdAt: nowText(),
  });
  saving.value = false;
  message.success('已新增（静态，未接后端）');
  backToList();
}

function onEdit(row: ChannelAccountRow) {
  editingId.value = row.id;
  editForm.accountNo = row.accountNo;
  editForm.alias = row.alias;
  editForm.status = row.status ? 1 : 0;
  editForm.sort = row.sort;
  editForm.appId = row.appId;
  editForm.merchantId = row.merchantId;
  editForm.webSecret = row.webSecret;
  editForm.siteB = row.siteB || undefined;
  editForm.remark = row.remark;
  editForm.privateKey = row.privateKey;
  editForm.environment = row.environment;
  editOpen.value = true;
}

function onLimit(row: ChannelAccountRow) {
  editingId.value = row.id;
  void loadConfigOptions();
  limitForm.resetHour = row.resetHour;
  limitForm.dailyAmountLimit = row.dailyAmountLimit;
  limitForm.currencies = [...row.currencies];
  limitForm.successCountLimit = row.successCountLimit;
  limitForm.allowCountries = [...row.allowCountries];
  limitForm.amountLimitMode = row.amountLimitMode;
  limitForm.interceptMax = row.interceptMax;
  limitForm.allowCardTypes = [...row.allowCardTypes];
  limitForm.disableCardBrands = [...row.disableCardBrands];
  limitForm.dailyOrderLimit = row.dailyOrderLimit;
  limitForm.maxSuccessCount = row.maxSuccessCount;
  limitForm.payFrequency = row.payFrequency;
  limitForm.preferCountries = [...row.preferCountries];
  limitForm.disableCountries = [...row.disableCountries];
  limitForm.calcCurrency = row.calcCurrency || row.interceptCurrency;
  limitForm.interceptMin = row.interceptMin;
  limitForm.disableCardTypes = [...row.disableCardTypes];
  limitOpen.value = true;
}

function handleEditSave() {
  if (!editForm.accountNo.trim()) {
    message.warning('请输入通道账号');
    return;
  }
  const row = mockAccountList.value.find((item) => item.id === editingId.value);
  if (!row) {
    message.warning('账号不存在');
    return;
  }
  saving.value = true;
  Object.assign(row, {
    accountNo: editForm.accountNo.trim(),
    alias: editForm.alias.trim(),
    status: editForm.status === 1,
    sort: editForm.sort,
    appId: editForm.appId.trim(),
    merchantId: editForm.merchantId.trim(),
    webSecret: editForm.webSecret.trim(),
    siteB: editForm.siteB || '',
    remark: editForm.remark.trim(),
    privateKey: editForm.privateKey.trim(),
    environment: editForm.environment.trim(),
    cannotOpenAt8: editForm.siteB === 'none',
  });
  saving.value = false;
  editOpen.value = false;
  message.success('已保存（静态，未接后端）');
}

function handleLimitSave() {
  const row = mockAccountList.value.find((item) => item.id === editingId.value);
  if (!row) {
    message.warning('账号不存在');
    return;
  }
  saving.value = true;
  Object.assign(row, {
    resetHour: limitForm.resetHour,
    resetTimezone: '北京时间',
    dailyAmountLimit: limitForm.dailyAmountLimit,
    currencies: [...limitForm.currencies],
    successCountLimit: limitForm.successCountLimit,
    allowCountries: [...limitForm.allowCountries],
    amountLimitMode: limitForm.amountLimitMode,
    interceptMode: limitForm.amountLimitMode,
    interceptMax: limitForm.interceptMax,
    allowCardTypes: [...limitForm.allowCardTypes],
    disableCardBrands: [...limitForm.disableCardBrands],
    dailyOrderLimit: limitForm.dailyOrderLimit,
    maxSuccessCount: limitForm.maxSuccessCount,
    payFrequency: limitForm.payFrequency,
    preferCountries: [...limitForm.preferCountries],
    disableCountries: [...limitForm.disableCountries],
    calcCurrency: limitForm.calcCurrency,
    interceptCurrency: limitForm.calcCurrency,
    interceptMin: limitForm.interceptMin,
    disableCardTypes: [...limitForm.disableCardTypes],
  });
  saving.value = false;
  limitOpen.value = false;
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
    <template v-if="viewMode === 'list'">
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
            <Button
              danger
              type="primary"
              @click="applyListFilter('restricted')"
            >
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
              <Space>
                <Tooltip title="编辑">
                  <Button
                    size="small"
                    type="link"
                    @click="onEdit(record as ChannelAccountRow)"
                  >
                    <IconifyIcon class="size-4" icon="lucide:pencil" />
                  </Button>
                </Tooltip>
                <Tooltip title="限制">
                  <Button
                    size="small"
                    type="link"
                    @click="onLimit(record as ChannelAccountRow)"
                  >
                    <IconifyIcon
                      class="size-4"
                      icon="lucide:sliders-horizontal"
                    />
                  </Button>
                </Tooltip>
                <Tooltip title="收款信息（暂未开放）">
                  <Button disabled size="small" type="link">
                    <IconifyIcon class="size-4" icon="lucide:receipt" />
                  </Button>
                </Tooltip>
              </Space>
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
                  <span class="text-green-600">
                    {{ record.dailyOrderLimit }}
                  </span>
                  <span class="mx-1">|</span>
                  日限金额:
                  <span class="text-orange-500">
                    {{ money(record.dailyAmountLimit) }}
                  </span>
                  USD
                </div>
                <div>
                  日收笔数:
                  <span class="text-green-600">
                    {{ record.dailyRecvCount }}
                  </span>
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
                    {{
                      ACCOUNT_LIMIT_MODE_LABELS[record.interceptMode] ||
                      INTERCEPT_MODE_LABELS[record.interceptMode] ||
                      record.interceptMode
                    }}
                  </span>
                  <span class="mx-1">|</span>
                  货币
                  <span class="text-red-500">
                    {{ record.interceptCurrency }}
                  </span>
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
    </template>

    <Card v-else-if="viewMode === 'create-step1'" :bordered="false">
      <div class="mb-6 text-lg font-medium">新增</div>
      <Form layout="vertical" class="max-w-md">
        <FormItem label="通道" required>
          <Select
            v-model:value="step1Form.channel"
            :options="CHANNEL_OPTIONS"
            placeholder="请选择一项"
            show-search
            option-filter-prop="label"
          />
        </FormItem>
        <FormItem>
          <Space>
            <Button type="primary" @click="submitStep1">提交</Button>
            <Button @click="backToList">返回</Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <Card v-else :bordered="false">
      <div class="mb-6 text-lg font-medium">新增</div>
      <Form layout="vertical">
        <div class="mb-4 max-w-md">
          <FormItem label="通道">
            <Input :value="selectedChannelLabel" disabled />
          </FormItem>
        </div>

        <div class="grid max-w-5xl grid-cols-1 gap-x-8 md:grid-cols-2">
          <FormItem label="通道账号" required>
            <Input
              v-model:value="step2Form.accountNo"
              placeholder="请输入通道账号"
            />
          </FormItem>
          <FormItem label="别名">
            <Input v-model:value="step2Form.alias" placeholder="请输入别名" />
          </FormItem>

          <FormItem label="状态">
            <Select
              v-model:value="step2Form.status"
              :options="STATUS_OPTIONS"
            />
          </FormItem>
          <FormItem label="B站">
            <Select
              v-model:value="step2Form.siteB"
              :options="SITE_B_OPTIONS"
              placeholder="请选择一个"
            />
          </FormItem>

          <FormItem label="重置时间">
            <Select
              v-model:value="step2Form.resetHour"
              :options="RESET_HOUR_OPTIONS"
              allow-clear
              placeholder="请选择一项"
            />
            <div class="text-muted-foreground mt-1 text-xs">
              每日限额重置的北京时间
            </div>
          </FormItem>
          <FormItem label="日限单数">
            <InputNumber
              v-model:value="step2Form.dailyOrderLimit"
              :min="0"
              class="w-full"
            />
            <div class="text-muted-foreground mt-1 text-xs">
              每日最大成功单数
            </div>
          </FormItem>

          <FormItem label="日限金额(美元)">
            <InputNumber
              v-model:value="step2Form.dailyAmountLimit"
              :min="0"
              class="w-full"
            />
          </FormItem>
          <FormItem label="限制国家">
            <Select
              v-model:value="step2Form.disableCountries"
              :options="countryOptions"
              allow-clear
              mode="multiple"
              option-filter-prop="label"
              placeholder="请选择限制国家"
              show-search
            />
          </FormItem>

          <FormItem label="交易货币">
            <Select
              v-model:value="step2Form.tradeCurrency"
              :options="currencyOptions"
              option-filter-prop="label"
              placeholder="请选择交易货币"
              show-search
            />
          </FormItem>
          <FormItem label="仅支持国家">
            <Select
              v-model:value="step2Form.preferCountries"
              :options="countryOptions"
              allow-clear
              mode="multiple"
              option-filter-prop="label"
              placeholder="请选择仅支持国家"
              show-search
            />
          </FormItem>

          <FormItem label="排序">
            <InputNumber
              v-model:value="step2Form.sort"
              :min="0"
              class="w-full"
            />
          </FormItem>
          <FormItem label="备注">
            <Input v-model:value="step2Form.remark" placeholder="请输入备注" />
          </FormItem>

          <FormItem label="公钥">
            <Input
              v-model:value="step2Form.publicKey"
              placeholder="请输入公钥"
            />
          </FormItem>
          <FormItem label="私钥">
            <Input
              v-model:value="step2Form.privateKey"
              placeholder="请输入私钥"
            />
          </FormItem>

          <FormItem label="web秘钥">
            <Input
              v-model:value="step2Form.webSecret"
              placeholder="请输入web秘钥"
            />
          </FormItem>
        </div>

        <FormItem class="mt-2">
          <Space>
            <Button :loading="saving" type="primary" @click="submitStep2">
              提交
            </Button>
            <Button @click="backToStep1">返回</Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <Modal
      v-model:open="editOpen"
      :confirm-loading="saving"
      destroy-on-close
      title="编辑"
      width="880px"
      @ok="handleEditSave"
    >
      <Form class="mt-2" layout="vertical">
        <div class="grid grid-cols-1 gap-x-10 md:grid-cols-2">
          <FormItem label="通道账号" required>
            <Input
              v-model:value="editForm.accountNo"
              placeholder="请输入通道账号"
            />
          </FormItem>
          <FormItem label="别名">
            <Input v-model:value="editForm.alias" placeholder="请输入别名" />
          </FormItem>
          <FormItem label="状态">
            <Select v-model:value="editForm.status" :options="STATUS_OPTIONS" />
          </FormItem>
          <FormItem label="B站">
            <Select
              v-model:value="editForm.siteB"
              :options="SITE_B_OPTIONS"
              allow-clear
              placeholder="请选择一个"
            />
          </FormItem>
          <FormItem label="排序">
            <InputNumber
              v-model:value="editForm.sort"
              :min="0"
              class="w-full"
            />
          </FormItem>
          <FormItem label="备注">
            <Input v-model:value="editForm.remark" placeholder="请输入备注" />
          </FormItem>
          <FormItem label="应用ID">
            <Input v-model:value="editForm.appId" placeholder="请输入应用ID" />
          </FormItem>
          <FormItem label="秘钥">
            <Input
              v-model:value="editForm.privateKey"
              placeholder="请输入秘钥"
            />
          </FormItem>
          <FormItem label="商户ID">
            <Input
              v-model:value="editForm.merchantId"
              placeholder="请输入商户ID"
            />
          </FormItem>
          <FormItem label="环境">
            <Input
              v-model:value="editForm.environment"
              placeholder="请输入环境"
            />
          </FormItem>
          <FormItem label="web秘钥(填1)">
            <Input
              v-model:value="editForm.webSecret"
              placeholder="请输入web秘钥"
            />
          </FormItem>
        </div>
      </Form>
    </Modal>

    <Modal
      v-model:open="limitOpen"
      :confirm-loading="saving"
      destroy-on-close
      title="限制"
      width="880px"
      @ok="handleLimitSave"
    >
      <Form class="mt-2" layout="vertical">
        <div class="grid grid-cols-1 gap-x-10 md:grid-cols-2">
          <div>
            <FormItem label="重置时间">
              <Select
                v-model:value="limitForm.resetHour"
                :options="RESET_HOUR_OPTIONS"
                placeholder="请选择一个"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                每日限制重置的北京时间
              </div>
            </FormItem>
            <FormItem label="日限金额(USD)">
              <InputNumber
                v-model:value="limitForm.dailyAmountLimit"
                :min="0"
                :precision="2"
                class="w-full"
              />
            </FormItem>
            <FormItem label="支付货币">
              <Select
                v-model:value="limitForm.currencies"
                :options="currencyOptions"
                allow-clear
                mode="multiple"
                option-filter-prop="label"
                placeholder="请选择支付货币"
                show-search
              />
              <div class="text-muted-foreground mt-1 text-xs">
                某些支付方式仅支持一种货币
              </div>
            </FormItem>
            <FormItem label="指定时间内限制成功次数">
              <InputNumber
                v-model:value="limitForm.successCountLimit"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                配合"支付频率(day)"使用
              </div>
            </FormItem>
            <FormItem label="仅支持国家">
              <Select
                v-model:value="limitForm.allowCountries"
                :options="countryOptions"
                allow-clear
                mode="multiple"
                option-filter-prop="label"
                placeholder="请选择仅支持国家"
                show-search
              />
              <div class="text-muted-foreground mt-1 text-xs">
                填写后其他国家会被拦截
              </div>
            </FormItem>
            <FormItem label="金额限制模式">
              <Select
                v-model:value="limitForm.amountLimitMode"
                :options="limitModeOptions"
                placeholder="请选择"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                重置:超过120只收120,拦截:超过120不收
              </div>
            </FormItem>
            <FormItem label="限制最大金额">
              <InputNumber
                v-model:value="limitForm.interceptMax"
                :min="0"
                :precision="2"
                class="w-full"
              />
            </FormItem>
            <FormItem label="仅支持卡类型">
              <Select
                v-model:value="limitForm.allowCardTypes"
                :options="cardTypeOptions"
                allow-clear
                mode="multiple"
                option-filter-prop="label"
                placeholder="请选择一项或多项"
                show-search
              />
            </FormItem>
            <FormItem label="禁用卡头">
              <Select
                v-model:value="limitForm.disableCardBrands"
                :options="toOptions(CARD_BRAND_LABELS)"
                allow-clear
                disabled
                mode="multiple"
                placeholder="暂未开放"
              />
            </FormItem>
          </div>
          <div>
            <FormItem label="日限单数">
              <InputNumber
                v-model:value="limitForm.dailyOrderLimit"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                每日最大成功单数
              </div>
            </FormItem>
            <FormItem label="最多收款笔数">
              <InputNumber
                v-model:value="limitForm.maxSuccessCount"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                该账号最多成功笔数
              </div>
            </FormItem>
            <FormItem label="支付频率(day)">
              <InputNumber
                v-model:value="limitForm.payFrequency"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                配合"指定时间内限制成功次数"使用
              </div>
            </FormItem>
            <FormItem label="优先国家">
              <Select
                v-model:value="limitForm.preferCountries"
                :options="countryOptions"
                allow-clear
                mode="multiple"
                option-filter-prop="label"
                placeholder="请选择优先国家"
                show-search
              />
              <div class="text-muted-foreground mt-1 text-xs">账号优先收单</div>
            </FormItem>
            <FormItem label="禁用国家">
              <Select
                v-model:value="limitForm.disableCountries"
                :options="countryOptions"
                allow-clear
                mode="multiple"
                option-filter-prop="label"
                placeholder="请选择禁用国家"
                show-search
              />
              <div class="text-muted-foreground mt-1 text-xs">
                填写后国家会被拦截
              </div>
            </FormItem>
            <FormItem label="计算货币">
              <Select
                v-model:value="limitForm.calcCurrency"
                :options="currencyOptions"
                option-filter-prop="label"
                placeholder="请选择计算货币"
                show-search
              />
              <div class="text-muted-foreground mt-1 text-xs">
                限制金额时使用
              </div>
            </FormItem>
            <FormItem label="限制最小金额">
              <InputNumber
                v-model:value="limitForm.interceptMin"
                :min="0"
                :precision="2"
                class="w-full"
              />
            </FormItem>
            <FormItem label="禁用卡类型">
              <Select
                v-model:value="limitForm.disableCardTypes"
                :options="cardTypeOptions"
                allow-clear
                mode="multiple"
                option-filter-prop="label"
                placeholder="请选择一项或多项"
                show-search
              />
            </FormItem>
          </div>
        </div>
      </Form>
    </Modal>
  </Page>
</template>
