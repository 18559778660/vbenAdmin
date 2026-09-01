<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { ChannelAccountApi } from '#/api';

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
  createChannelAccount,
  deleteChannelAccount,
  getAssignUserList,
  getCardTypeList,
  getChannelAccountList,
  getChannelGroupList,
  getChannelList,
  getCountryOptions,
  getCurrencyOptions,
  getSiteBList,
  setChannelAccountStatus,
  updateChannelAccount,
  updateChannelAccountLimits,
} from '#/api';

import {
  CARD_BRAND_LABELS,
  INTERCEPT_MODE_LABELS,
  money,
  SUCCESS_MODE_LABELS,
  toOptions,
  validateInterceptRange,
} from '../shared';
import {
  ACCOUNT_LIMIT_MODE_LABELS,
  ENVIRONMENT_OPTIONS,
  RESET_HOUR_OPTIONS,
  STATUS_OPTIONS,
  validateAccountSuccessSetting,
} from './shared';

defineOptions({ name: 'ChannelAccount' });

type ViewMode = 'create-step1' | 'create-step2' | 'list';
type ChannelAccountRow = ChannelAccountApi.ChannelAccount;

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
  channelId: undefined as number | undefined,
  createdRange: undefined as [Dayjs, Dayjs] | undefined,
  groupId: undefined as number | undefined,
  assignedUserId: undefined as number | undefined,
});

const applied = reactive({
  id: undefined as number | undefined,
  name: '',
  alias: '',
  remark: '',
  channelId: undefined as number | undefined,
  createdRange: undefined as [Dayjs, Dayjs] | undefined,
  groupId: undefined as number | undefined,
  assignedUserId: undefined as number | undefined,
  listFilter: '' as '' | 'closed8' | 'restricted' | 'unpaid',
});

const loading = ref(false);
const accountList = ref<ChannelAccountRow[]>([]);
const channelOptions = ref<{ label: string; value: number }[]>([]);
const siteBOptions = ref<{ label: string; value: number }[]>([]);
const groupFilterOptions = ref<{ label: string; value: number }[]>([]);
const assignUserFilterOptions = ref<
  { label: string; value: number | undefined }[]
>([{ label: '全部', value: undefined }]);

const step1Form = reactive({
  channelId: undefined as number | undefined,
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
  siteBId: undefined as number | undefined,
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
  siteBId: undefined as number | undefined,
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

const channelFilterOptions = computed(() => [
  { label: '全部', value: undefined },
  ...channelOptions.value,
]);

const selectedChannelLabel = computed(
  () =>
    channelOptions.value.find((item) => item.value === step1Form.channelId)
      ?.label ||
    step1Form.channelId ||
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
    width: 168,
    fixed: 'left' as const,
    align: 'center' as const,
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
  { title: '更新', key: 'updated', width: 170 },
  { title: '创建', key: 'created', width: 170 },
];

const unpaidCount = computed(
  () => accountList.value.filter((row) => row.unpaidClosed).length,
);
const restrictedCount = computed(
  () => accountList.value.filter((row) => row.restrictedClosed).length,
);
const closed8Count = computed(
  () => accountList.value.filter((row) => row.cannotOpenAt8).length,
);

async function loadChannelOptions() {
  try {
    const rows = await getChannelList();
    channelOptions.value = rows.map((row) => ({
      label: row.name,
      value: row.id,
    }));
  } catch {
    channelOptions.value = [];
  }
}

async function loadSiteBOptions() {
  try {
    const rows = await getSiteBList();
    siteBOptions.value = rows.map((row) => ({
      label: row.domain,
      value: row.id,
    }));
  } catch {
    siteBOptions.value = [];
  }
}

async function loadAssignUserFilterOptions() {
  try {
    const rows = await getAssignUserList();
    assignUserFilterOptions.value = [
      { label: '全部', value: undefined },
      ...rows.map((row) => ({
        label: row.username,
        value: row.id,
      })),
    ];
  } catch {
    assignUserFilterOptions.value = [{ label: '全部', value: undefined }];
  }
}

async function loadGroupFilterOptions() {
  try {
    const rows = await getChannelGroupList();
    groupFilterOptions.value = rows.map((row) => ({
      label: row.name,
      value: row.id,
    }));
  } catch {
    groupFilterOptions.value = [];
  }
}

async function loadList() {
  loading.value = true;
  try {
    accountList.value = await getChannelAccountList({
      id: applied.id,
      channelId: applied.channelId,
      channelName: applied.name.trim() || undefined,
      alias: applied.alias.trim() || undefined,
      remark: applied.remark.trim() || undefined,
      groupId: applied.groupId,
      assignedUserId: applied.assignedUserId,
      createdFrom: applied.createdRange?.[0]?.format('YYYY-MM-DD'),
      createdTo: applied.createdRange?.[1]?.format('YYYY-MM-DD'),
      listFilter: applied.listFilter || undefined,
    });
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  applied.id = searchForm.id;
  applied.name = searchForm.name;
  applied.alias = searchForm.alias;
  applied.remark = searchForm.remark;
  applied.channelId = searchForm.channelId;
  applied.createdRange = searchForm.createdRange;
  applied.groupId = searchForm.groupId;
  applied.assignedUserId = searchForm.assignedUserId;
  applied.listFilter = '';
  void loadList();
}

function resetSearch() {
  searchForm.id = undefined;
  searchForm.name = '';
  searchForm.alias = '';
  searchForm.remark = '';
  searchForm.channelId = undefined;
  searchForm.createdRange = undefined;
  searchForm.groupId = undefined;
  searchForm.assignedUserId = undefined;
  handleSearch();
}

function handleRefresh() {
  void loadList();
}

function applyListFilter(filter: typeof applied.listFilter) {
  applied.listFilter = applied.listFilter === filter ? '' : filter;
  void loadList();
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
  step2Form.siteBId = undefined;
  step2Form.dailyOrderLimit = 0;
  step2Form.disableCountries = [];
  step2Form.preferCountries = [];
  step2Form.remark = '';
  step2Form.privateKey = '';
}

function openCreate() {
  step1Form.channelId = undefined;
  resetStep2Form();
  viewMode.value = 'create-step1';
}

function backToList() {
  viewMode.value = 'list';
}

function submitStep1() {
  if (!step1Form.channelId) {
    message.warning('请选择通道');
    return;
  }
  resetStep2Form();
  viewMode.value = 'create-step2';
}

function backToStep1() {
  viewMode.value = 'create-step1';
}

async function submitStep2() {
  if (!step2Form.accountNo.trim()) {
    message.warning('请输入通道账号');
    return;
  }
  if (!step2Form.siteBId) {
    message.warning('请选择B站');
    return;
  }
  if (!step1Form.channelId) {
    message.warning('请先选择通道');
    viewMode.value = 'create-step1';
    return;
  }

  saving.value = true;
  try {
    await createChannelAccount({
      channelId: step1Form.channelId,
      siteBId: step2Form.siteBId,
      accountNo: step2Form.accountNo.trim(),
      alias: step2Form.alias.trim(),
      status: step2Form.status === 1,
      resetHour: step2Form.resetHour,
      dailyOrderLimit: step2Form.dailyOrderLimit,
      dailyAmountLimit: step2Form.dailyAmountLimit,
      calcCurrency: step2Form.tradeCurrency,
      currencies: step2Form.tradeCurrency ? [step2Form.tradeCurrency] : [],
      preferCountries: [...step2Form.preferCountries],
      disableCountries: [...step2Form.disableCountries],
      sort: step2Form.sort,
      appId: step2Form.publicKey.trim(),
      webSecret: step2Form.webSecret.trim(),
      privateKey: step2Form.privateKey,
      remark: step2Form.remark.trim(),
    });
    message.success('已新增');
    backToList();
    await loadList();
  } catch {
    // 错误提示由 request 拦截器处理
  } finally {
    saving.value = false;
  }
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
  editForm.siteBId = row.siteBId || undefined;
  editForm.remark = row.remark;
  editForm.privateKey = row.privateKey;
  editForm.environment = row.environment;
  editOpen.value = true;
}

function onDelete(row: ChannelAccountRow) {
  if (row.groupNames?.length) {
    message.warning('该账号已绑定通道分组，无法删除');
    return;
  }
  Modal.confirm({
    title: '删除通道账号',
    content: `确定删除账号「${row.accountNo}」吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      await deleteChannelAccount(row.id);
      message.success('已删除');
      await loadList();
    },
  });
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

async function handleEditSave() {
  if (!editForm.accountNo.trim()) {
    message.warning('请输入通道账号');
    return;
  }
  if (!editForm.siteBId) {
    message.warning('请选择B站');
    return;
  }
  if (!editingId.value) {
    message.warning('账号不存在');
    return;
  }
  saving.value = true;
  try {
    await updateChannelAccount(editingId.value, {
      accountNo: editForm.accountNo.trim(),
      alias: editForm.alias.trim(),
      status: editForm.status === 1,
      siteBId: editForm.siteBId,
      sort: editForm.sort,
      appId: editForm.appId.trim(),
      merchantId: editForm.merchantId.trim(),
      webSecret: editForm.webSecret.trim(),
      privateKey: editForm.privateKey.trim(),
      environment: editForm.environment.trim(),
      remark: editForm.remark.trim(),
    });
    editOpen.value = false;
    message.success('已保存');
    await loadList();
  } catch {
    // 错误提示由 request 拦截器处理
  } finally {
    saving.value = false;
  }
}

async function handleLimitSave() {
  if (!editingId.value) {
    message.warning('账号不存在');
    return;
  }
  const interceptError = validateInterceptRange(
    limitForm.interceptMin,
    limitForm.interceptMax,
  );
  if (interceptError) {
    message.warning(interceptError);
    return;
  }
  const successError = validateAccountSuccessSetting(
    limitForm.payFrequency,
    limitForm.successCountLimit,
  );
  if (successError) {
    message.warning(successError);
    return;
  }
  saving.value = true;
  try {
    await updateChannelAccountLimits(editingId.value, {
      resetHour: limitForm.resetHour,
      dailyAmountLimit: limitForm.dailyAmountLimit,
      currencies: [...limitForm.currencies],
      successCountLimit: limitForm.successCountLimit,
      allowCountries: [...limitForm.allowCountries],
      amountLimitMode: limitForm.amountLimitMode,
      interceptMax: limitForm.interceptMax,
      allowCardTypes: [...limitForm.allowCardTypes],
      disableCardBrands: [...limitForm.disableCardBrands],
      dailyOrderLimit: limitForm.dailyOrderLimit,
      maxSuccessCount: limitForm.maxSuccessCount,
      payFrequency: limitForm.payFrequency,
      preferCountries: [...limitForm.preferCountries],
      disableCountries: [...limitForm.disableCountries],
      calcCurrency: limitForm.calcCurrency,
      interceptMin: limitForm.interceptMin,
      disableCardTypes: [...limitForm.disableCardTypes],
    });
    limitOpen.value = false;
    message.success('已保存');
    await loadList();
  } catch {
    // 错误提示由 request 拦截器处理
  } finally {
    saving.value = false;
  }
}

async function onToggleStatus(
  row: ChannelAccountRow,
  checked: boolean | number | string,
) {
  const status = Boolean(checked);
  const prev = row.status;
  row.status = status;
  try {
    await setChannelAccountStatus(row.id, status);
  } catch {
    row.status = prev;
  }
}

function onBatchEdit() {
  message.info('批量修改暂未接入（静态页）');
}

onMounted(async () => {
  await Promise.all([
    loadConfigOptions(),
    loadChannelOptions(),
    loadSiteBOptions(),
    loadGroupFilterOptions(),
    loadAssignUserFilterOptions(),
  ]);
  await loadList();
});
</script>

<template>
  <Page auto-content-height description="通道账号">
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
              v-model:value="searchForm.channelId"
              :options="channelFilterOptions"
              allow-clear
              class="w-36"
              option-filter-prop="label"
              placeholder="请选择通道"
              show-search
            />
          </FormItem>
          <FormItem label="添加时间">
            <RangePicker v-model:value="searchForm.createdRange" class="w-60" />
          </FormItem>
          <FormItem label="账号分组">
            <Select
              v-model:value="searchForm.groupId"
              :options="groupFilterOptions"
              allow-clear
              class="w-36"
              option-filter-prop="label"
              placeholder="账号分组"
              show-search
            />
          </FormItem>
          <FormItem label="分配用户">
            <Select
              v-model:value="searchForm.assignedUserId"
              :options="assignUserFilterOptions"
              allow-clear
              class="w-36"
              option-filter-prop="label"
              placeholder="分配用户"
              show-search
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
          :data-source="accountList"
          :loading="loading"
          :pagination="{ pageSize: 10, showSizeChanger: true }"
          :scroll="{ x: 2140 }"
          row-key="id"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
              <Space :size="0" class="inline-flex flex-nowrap">
                <Tooltip title="编辑">
                  <Button
                    class="!px-1.5"
                    size="small"
                    type="link"
                    @click="onEdit(record as ChannelAccountRow)"
                  >
                    <IconifyIcon class="size-4" icon="lucide:pencil" />
                  </Button>
                </Tooltip>
                <Tooltip title="限制">
                  <Button
                    class="!px-1.5"
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
                  <Button class="!px-1.5" disabled size="small" type="link">
                    <IconifyIcon class="size-4" icon="lucide:receipt" />
                  </Button>
                </Tooltip>
                <Tooltip
                  :title="
                    record.groupNames?.length
                      ? '已绑定通道分组，无法删除'
                      : '删除'
                  "
                >
                  <Button
                    :disabled="!!record.groupNames?.length"
                    class="!px-1.5"
                    danger
                    size="small"
                    type="link"
                    @click="onDelete(record as ChannelAccountRow)"
                  >
                    <IconifyIcon class="size-4" icon="lucide:trash-2" />
                  </Button>
                </Tooltip>
              </Space>
            </template>
            <template v-else-if="column.key === 'groupName'">
              <div class="whitespace-pre-line leading-5">
                {{
                  record.groupNames?.length ? record.groupNames.join('\n') : '-'
                }}
              </div>
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
            <template v-else-if="column.key === 'updated'">
              <div>{{ record.updatedBy }}</div>
              <div class="text-muted-foreground text-xs">
                {{ record.updatedAt }}
              </div>
            </template>
            <template v-else-if="column.key === 'created'">
              <div>{{ record.createdBy }}</div>
              <div class="text-muted-foreground text-xs">
                {{ record.createdAt }}
              </div>
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
            v-model:value="step1Form.channelId"
            :options="channelOptions"
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
          <FormItem label="B站" required>
            <Select
              v-model:value="step2Form.siteBId"
              :options="siteBOptions"
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
          <FormItem label="B站" required>
            <Select
              v-model:value="editForm.siteBId"
              :options="siteBOptions"
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
            <Select
              v-model:value="editForm.environment"
              :options="ENVIRONMENT_OPTIONS"
              placeholder="请选择环境"
            />
          </FormItem>
          <FormItem label="web秘钥">
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
