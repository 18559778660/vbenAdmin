<script lang="ts" setup>
import type { ChannelRow } from '../shared';

import { computed, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  RadioGroup,
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
  createChannel,
  getChannelList,
  setChannelStatus,
  updateChannel,
  updateChannelLimits,
} from '#/api/channel';

import {
  AMOUNT_LIMIT_MODE_LABELS,
  CARD_BRAND_LABELS,
  COLLECT_RULE_LABELS,
  INTERCEPT_MODE_LABELS,
  MIXER_OPTIONS,
  money,
  ORDER_NO_MODE_LABELS,
  PAYMENT_MODE_COLORS,
  PAYMENT_MODE_LABELS,
  PAYMENT_MODE_OPTIONS,
  PRODUCT_INFO_LABELS,
  RETURN_VERIFY_LABELS,
  SUCCESS_MODE_LABELS,
  toOptions,
  validateInterceptRange,
  validateSuccessSetting,
} from '../shared';

defineOptions({ name: 'ChannelList' });

const searchForm = reactive({
  id: undefined as number | undefined,
  name: '',
});

const applied = reactive({
  id: undefined as number | undefined,
  name: '',
});

const loading = ref(false);
const list = ref<ChannelRow[]>([]);
const channelNameOptions = ref<{ label: string; value: string }[]>([]);
const modalOpen = ref(false);
const infoOpen = ref(false);
const editOpen = ref(false);
const saving = ref(false);
const editingId = ref<null | number>(null);

const form = reactive({
  name: '',
  paymentMode: 'local',
  siteBGroup: '',
  orderNoMode: 'site',
  settleRate: 0,
  payParams: '',
  productInfo: 'kezhan',
  channelCode: '',
  payCode: '',
  returnVerify: 'verify',
  oldCustomerDays: 30,
  returnIpWhitelist: '',
});

const infoForm = reactive({
  name: '',
  payCode: '',
  paymentMode: 'local',
  mixers: [] as string[],
  settleRate: 0,
  remark: '',
  returnIpWhitelist: '',
  disableBrandWords: '',
  collectRule: 'random',
  shipRange: '40-50',
  orderNoMode: 'site',
  sort: 1,
  productInfo: 'kezhan',
  returnVerify: 'verify',
  oldCustomerDays: 30,
  autoShip: true,
  returnKeywords: '',
});

const editForm = reactive({
  channelCode: '',
  dailyAmountLimit: 0,
  payFrequency: 0,
  failCount: 0,
  amountLimitMode: 'single',
  interceptMax: 0,
  currencies: [] as string[],
  allowCountries: [] as string[],
  allowCardTypes: [] as string[],
  disableCardBrands: [] as string[],
  dailyOrderLimit: 0,
  mutualHoldAmount: 0,
  successCount: 0,
  failAutoClose: 0,
  calcCurrency: 'USD',
  interceptMin: 0,
  preferCountries: [] as string[],
  disableCountries: [] as string[],
  disableCardTypes: [] as string[],
});

const modalTitle = computed(() => '新增');

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
    width: 130,
    fixed: 'left' as const,
  },
  { title: '通道名称', dataIndex: 'name', key: 'name', width: 120 },
  { title: '压缩包', key: 'package', width: 80 },
  { title: '剩余金额', key: 'remain', width: 150 },
  { title: '金额设置', key: 'amountSetting', width: 220 },
  { title: '拦截设置', key: 'intercept', width: 200 },
  { title: '状态', key: 'status', width: 80 },
  { title: '支付模式', key: 'paymentMode', width: 110 },
  { title: '网关', key: 'gateway', width: 120 },
  { title: '成功设置', key: 'successMode', width: 100 },
  { title: '限制国家', key: 'countries', width: 140 },
  { title: '支付货币', key: 'currencies', width: 140 },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 200,
    ellipsis: true,
  },
  { title: '结算比例', dataIndex: 'settleRate', key: 'settleRate', width: 90 },
  { title: '更新', key: 'updated', width: 170 },
  { title: '创建', key: 'created', width: 170 },
];

const currencyOptions = ref<{ label: string; value: string }[]>([]);
const countryOptions = ref<{ label: string; value: string }[]>([]);
const cardTypeOptions = ref<{ label: string; value: string }[]>([]);

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

function countryLabel(code: string) {
  return (
    countryOptions.value.find((item) => item.value === code)?.label || code
  );
}

const listData = computed(() => list.value);

function buildListParams() {
  const params: {
    id?: number;
    name?: string;
  } = {};
  if (applied.id !== undefined) {
    params.id = applied.id;
  }
  if (applied.name) {
    params.name = applied.name;
  }
  return params;
}

async function loadChannelNameOptions() {
  try {
    const rows = await getChannelList();
    const names = [
      ...new Set(rows.map((row) => row.name.trim()).filter(Boolean)),
    ].toSorted();
    channelNameOptions.value = names.map((name) => ({
      label: name,
      value: name,
    }));
  } catch {
    channelNameOptions.value = [];
  }
}

async function loadList() {
  loading.value = true;
  try {
    list.value = await getChannelList(buildListParams());
  } finally {
    loading.value = false;
  }
}

async function refreshPage() {
  await Promise.all([loadList(), loadChannelNameOptions()]);
}

function handleSearch() {
  applied.id = searchForm.id;
  applied.name = searchForm.name.trim();
  void loadList();
}

function resetSearch() {
  searchForm.id = undefined;
  searchForm.name = '';
  handleSearch();
}

function handleRefresh() {
  void refreshPage().then(() => {
    message.success('已刷新');
  });
}

function resetForm() {
  form.name = '';
  form.paymentMode = 'local';
  form.siteBGroup = '';
  form.orderNoMode = 'site';
  form.settleRate = 0;
  form.payParams = '';
  form.productInfo = 'kezhan';
  form.channelCode = '';
  form.payCode = '';
  form.returnVerify = 'verify';
  form.oldCustomerDays = 30;
  form.returnIpWhitelist = '';
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function onEdit(row: ChannelRow) {
  editingId.value = row.id;
  infoForm.name = row.name;
  infoForm.payCode = row.payCode;
  infoForm.paymentMode = row.paymentMode;
  infoForm.mixers = [...row.mixers];
  infoForm.settleRate = row.settleRate;
  infoForm.remark = row.remark;
  infoForm.returnIpWhitelist = row.returnIpWhitelist;
  infoForm.disableBrandWords = row.disableBrandWords;
  infoForm.collectRule =
    row.collectRule === 'weight' ? 'random' : row.collectRule;
  infoForm.shipRange = row.shipRange;
  infoForm.orderNoMode = row.orderNoMode;
  infoForm.sort = row.sort;
  infoForm.productInfo = row.productInfo;
  infoForm.returnVerify = row.returnVerify;
  infoForm.oldCustomerDays = row.oldCustomerDays;
  infoForm.autoShip = row.autoShip;
  infoForm.returnKeywords = row.returnKeywords;
  infoOpen.value = true;
}

function onLimit(row: ChannelRow) {
  editingId.value = row.id;
  void loadConfigOptions();
  editForm.channelCode = row.channelCode;
  editForm.dailyAmountLimit = row.dailyAmountLimit;
  editForm.payFrequency = row.payFrequency;
  editForm.failCount = row.failCount;
  editForm.amountLimitMode = row.amountLimitMode;
  editForm.interceptMax = row.interceptMax;
  editForm.currencies = [...row.currencies];
  editForm.allowCountries = [
    ...(row.allowCountries.length > 0 ? row.allowCountries : row.countries),
  ];
  editForm.allowCardTypes = [...row.allowCardTypes];
  editForm.disableCardBrands = [...row.disableCardBrands];
  editForm.dailyOrderLimit = row.dailyOrderLimit;
  editForm.mutualHoldAmount = row.mutualHoldAmount;
  editForm.successCount = row.successCount;
  editForm.failAutoClose = row.failAutoClose;
  editForm.calcCurrency = row.calcCurrency;
  editForm.interceptMin = row.interceptMin;
  editForm.preferCountries = [...row.preferCountries];
  editForm.disableCountries = [...row.disableCountries];
  editForm.disableCardTypes = [...row.disableCardTypes];
  editOpen.value = true;
}

async function handleSave() {
  const name = form.name.trim();
  if (!name) {
    message.warning('请输入通道名');
    return;
  }
  saving.value = true;
  try {
    await createChannel({
      name,
      paymentMode: form.paymentMode,
      siteBGroup: form.siteBGroup.trim(),
      orderNoMode: form.orderNoMode,
      settleRate: form.settleRate,
      payParams: form.payParams,
      productInfo: form.productInfo,
      channelCode: form.channelCode.trim(),
      payCode: form.payCode.trim(),
      returnVerify: form.returnVerify,
      oldCustomerDays: form.oldCustomerDays,
      returnIpWhitelist: form.returnIpWhitelist,
    });
    modalOpen.value = false;
    message.success('已新增');
    await refreshPage();
  } finally {
    saving.value = false;
  }
}

async function handleInfoSave() {
  const name = infoForm.name.trim();
  if (!name) {
    message.warning('请输入通道名');
    return;
  }
  if (editingId.value === null) {
    return;
  }
  saving.value = true;
  try {
    await updateChannel(editingId.value, {
      name,
      payCode: infoForm.payCode.trim(),
      paymentMode: infoForm.paymentMode,
      mixers: [...infoForm.mixers],
      settleRate: infoForm.settleRate,
      remark: infoForm.remark.trim(),
      returnIpWhitelist: infoForm.returnIpWhitelist,
      disableBrandWords: infoForm.disableBrandWords,
      collectRule: infoForm.collectRule,
      shipRange: infoForm.shipRange.trim() || '40-50',
      orderNoMode: infoForm.orderNoMode,
      sort: infoForm.sort,
      productInfo: infoForm.productInfo,
      returnVerify: infoForm.returnVerify,
      oldCustomerDays: infoForm.oldCustomerDays,
      autoShip: infoForm.autoShip,
      returnKeywords: infoForm.returnKeywords,
    });
    infoOpen.value = false;
    message.success('已保存');
    await refreshPage();
  } finally {
    saving.value = false;
  }
}

async function copyGatewayUrl(url: string) {
  if (!url) {
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    message.success('网关地址已复制');
  } catch {
    message.error('复制失败，请手动复制');
  }
}

async function handleEditSave() {
  if (editingId.value === null) {
    return;
  }
  const rangeError = validateInterceptRange(
    editForm.interceptMin,
    editForm.interceptMax,
  );
  if (rangeError) {
    message.warning(rangeError);
    return;
  }
  const successSettingError = validateSuccessSetting(
    editForm.payFrequency,
    editForm.successCount,
    editForm.failCount,
  );
  if (successSettingError) {
    message.warning(successSettingError);
    return;
  }
  saving.value = true;
  try {
    await updateChannelLimits(editingId.value, {
      channelCode: editForm.channelCode.trim(),
      dailyAmountLimit: editForm.dailyAmountLimit,
      payFrequency: editForm.payFrequency,
      failCount: editForm.failCount,
      amountLimitMode: editForm.amountLimitMode,
      interceptMax: editForm.interceptMax,
      currencies: [...editForm.currencies],
      allowCountries: [...editForm.allowCountries],
      allowCardTypes: [...editForm.allowCardTypes],
      disableCardBrands: [...editForm.disableCardBrands],
      dailyOrderLimit: editForm.dailyOrderLimit,
      mutualHoldAmount: editForm.mutualHoldAmount,
      successCount: editForm.successCount,
      failAutoClose: editForm.failAutoClose,
      calcCurrency: editForm.calcCurrency,
      interceptMin: editForm.interceptMin,
      preferCountries: [...editForm.preferCountries],
      disableCountries: [...editForm.disableCountries],
      disableCardTypes: [...editForm.disableCardTypes],
    });
    editOpen.value = false;
    message.success('已保存');
    await refreshPage();
  } finally {
    saving.value = false;
  }
}

function onLog(row: ChannelRow) {
  message.info(`上传压缩包功能暂未接入：${row.name}`);
}

async function onToggleStatus(
  row: ChannelRow,
  checked: boolean | number | string,
) {
  const status = Boolean(checked);
  try {
    await setChannelStatus(row.id, status);
    row.status = status;
    message.success(status ? '已启用' : '已禁用');
    await refreshPage();
  } catch {
    await refreshPage();
  }
}

onMounted(() => {
  void loadConfigOptions();
  void refreshPage();
});
</script>

<template>
  <Page auto-content-height>
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="gap-y-3">
        <FormItem label="ID">
          <InputNumber
            v-model:value="searchForm.id"
            :controls="false"
            :min="1"
            class="w-36"
            placeholder="ID"
          />
        </FormItem>
        <FormItem label="通道名称">
          <Select
            v-model:value="searchForm.name"
            :options="channelNameOptions"
            allow-clear
            class="w-44"
            placeholder="通道名称"
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
      <div class="mb-4 flex justify-between">
        <Space>
          <Button type="primary" @click="openCreate">
            <template #icon>
              <IconifyIcon icon="lucide:plus" />
            </template>
            新增
          </Button>
          <Button @click="handleRefresh">
            <template #icon>
              <IconifyIcon icon="lucide:refresh-cw" />
            </template>
            刷新
          </Button>
        </Space>
      </div>

      <Table
        :columns="columns"
        :data-source="listData"
        :loading="loading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :scroll="{ x: 2400 }"
        row-key="id"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <Space>
              <Tooltip title="编辑">
                <Button
                  size="small"
                  type="link"
                  @click="onEdit(record as ChannelRow)"
                >
                  <IconifyIcon class="size-4" icon="lucide:pencil" />
                </Button>
              </Tooltip>
              <Tooltip title="限制">
                <Button
                  size="small"
                  type="link"
                  @click="onLimit(record as ChannelRow)"
                >
                  <IconifyIcon
                    class="size-4"
                    icon="lucide:sliders-horizontal"
                  />
                </Button>
              </Tooltip>
              <Tooltip title="上传压缩包">
                <Button
                  size="small"
                  type="link"
                  @click="onLog(record as ChannelRow)"
                >
                  <IconifyIcon class="size-4" icon="lucide:file-check" />
                </Button>
              </Tooltip>
            </Space>
          </template>
          <template v-else-if="column.key === 'package'">
            <Tooltip v-if="record.packageName" :title="record.packageName">
              <span
                class="inline-flex size-8 items-center justify-center rounded border border-orange-300 bg-orange-50 text-orange-500"
              >
                <IconifyIcon class="size-5" icon="lucide:file-archive" />
              </span>
            </Tooltip>
            <span v-else class="text-muted-foreground">-</span>
          </template>
          <template v-else-if="column.key === 'remain'">
            <div class="flex flex-col gap-1">
              <Tag color="blue">总额: {{ record.totalAmount }}</Tag>
              <Tag color="magenta">余额: {{ record.balance }}</Tag>
            </div>
          </template>
          <template v-else-if="column.key === 'amountSetting'">
            <div class="text-xs leading-5 text-green-600">
              <div>
                日限单数: {{ record.dailyOrderLimit }} | 日限金额:
                {{ money(record.dailyAmountLimit) }} USD
              </div>
              <div>
                日收笔数: {{ record.dailyRecvCount }} | 日收金额:
                {{ money(record.dailyRecvAmount) }} USD
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'intercept'">
            <div class="text-xs leading-5 text-red-500">
              <div>
                模式: {{ INTERCEPT_MODE_LABELS[record.interceptMode] }} | 货币:
                {{ record.interceptCurrency }}
              </div>
              <div>
                最高: {{ money(record.interceptMax) }} | 最低:
                {{ money(record.interceptMin) }}
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'status'">
            <Switch
              :checked="record.status"
              size="small"
              @change="
                (checked) => onToggleStatus(record as ChannelRow, checked)
              "
            />
          </template>
          <template v-else-if="column.key === 'paymentMode'">
            <span
              :class="
                PAYMENT_MODE_COLORS[record.paymentMode] || 'text-orange-500'
              "
            >
              {{
                PAYMENT_MODE_LABELS[record.paymentMode] || record.paymentMode
              }}
            </span>
          </template>
          <template v-else-if="column.key === 'gateway'">
            <Tooltip v-if="record.gatewayUrl" :title="record.gatewayUrl">
              <Button
                class="px-0"
                size="small"
                type="link"
                @click="copyGatewayUrl(record.gatewayUrl)"
              >
                网关
                <IconifyIcon class="ml-1 size-3.5" icon="lucide:copy" />
              </Button>
            </Tooltip>
            <span v-else class="text-muted-foreground">-</span>
          </template>
          <template v-else-if="column.key === 'successMode'">
            <span
              :class="
                record.successMode === 'limited'
                  ? 'text-orange-500'
                  : 'text-green-600'
              "
            >
              {{
                SUCCESS_MODE_LABELS[record.successMode] || record.successMode
              }}
            </span>
          </template>
          <template v-else-if="column.key === 'countries'">
            <div v-if="record.countries.length" class="flex flex-wrap gap-1">
              <Tag v-for="code in record.countries" :key="code">
                {{ countryLabel(code) }}
              </Tag>
            </div>
            <span v-else class="text-muted-foreground">-</span>
          </template>
          <template v-else-if="column.key === 'currencies'">
            <div v-if="record.currencies.length" class="flex flex-wrap gap-1">
              <Tag v-for="code in record.currencies" :key="code">
                {{ code }}
              </Tag>
            </div>
            <span v-else class="text-muted-foreground">-</span>
          </template>
          <template v-else-if="column.key === 'updated'">
            <div class="text-xs leading-5">
              <div>{{ record.updatedBy }}</div>
              <div>{{ record.updatedAt }}</div>
            </div>
          </template>
          <template v-else-if="column.key === 'created'">
            <div class="text-xs leading-5">
              <div>{{ record.createdBy }}</div>
              <div>{{ record.createdAt }}</div>
            </div>
          </template>
        </template>
      </Table>
    </Card>

    <Modal
      v-model:open="modalOpen"
      :confirm-loading="saving"
      :title="modalTitle"
      destroy-on-close
      width="880px"
      @ok="handleSave"
    >
      <Form class="mt-2" layout="vertical">
        <div class="grid grid-cols-1 gap-x-10 md:grid-cols-2">
          <div>
            <FormItem label="通道名" required>
              <Input
                v-model:value="form.name"
                allow-clear
                placeholder="请输入通道名"
              />
            </FormItem>
            <FormItem label="支付模式">
              <Select
                v-model:value="form.paymentMode"
                :options="PAYMENT_MODE_OPTIONS"
                allow-clear
                placeholder="请选择支付模式"
              />
            </FormItem>
            <FormItem label="B站分组">
              <Input
                v-model:value="form.siteBGroup"
                allow-clear
                disabled
                placeholder="暂未开放"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                用户通道账号选择B站（暂未开放）
              </div>
            </FormItem>
            <FormItem label="订单号设置">
              <Select
                v-model:value="form.orderNoMode"
                :options="toOptions(ORDER_NO_MODE_LABELS)"
                allow-clear
                placeholder="请选择订单号设置"
              />
            </FormItem>
            <FormItem label="结算比例">
              <InputNumber
                v-model:value="form.settleRate"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">百分制</div>
            </FormItem>
            <FormItem label="支付参数">
              <Input.TextArea
                v-model:value="form.payParams"
                :rows="5"
                placeholder="请输入支付参数"
              />
            </FormItem>
          </div>
          <div>
            <FormItem label="商品信息">
              <Select
                v-model:value="form.productInfo"
                :options="toOptions(PRODUCT_INFO_LABELS)"
                allow-clear
                placeholder="请选择商品信息"
              />
            </FormItem>
            <FormItem label="通道CODE">
              <Input
                v-model:value="form.channelCode"
                allow-clear
                placeholder="请输入通道CODE"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                需于网站目录名一致
              </div>
            </FormItem>
            <FormItem label="支付CODE">
              <Input
                v-model:value="form.payCode"
                allow-clear
                placeholder="请输入支付CODE"
              />
              <div class="text-muted-foreground mt-1 text-xs">网关 CODE</div>
            </FormItem>
            <FormItem label="返回页验证">
              <Select
                v-model:value="form.returnVerify"
                :options="toOptions(RETURN_VERIFY_LABELS)"
                allow-clear
                placeholder="请选择"
              />
            </FormItem>
            <FormItem label="老客户判断时间">
              <InputNumber
                v-model:value="form.oldCustomerDays"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">单位 day</div>
            </FormItem>
            <FormItem label="返回验证IP白名单">
              <Input.TextArea
                v-model:value="form.returnIpWhitelist"
                :rows="5"
                placeholder="请输入返回验证IP白名单"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                （返回页验证开启后使用）
              </div>
            </FormItem>
          </div>
        </div>
      </Form>
    </Modal>

    <Modal
      v-model:open="infoOpen"
      :confirm-loading="saving"
      destroy-on-close
      title="编辑"
      width="880px"
      @ok="handleInfoSave"
    >
      <Form class="mt-2" layout="vertical">
        <div class="grid grid-cols-1 gap-x-10 md:grid-cols-2">
          <div>
            <FormItem label="通道名" required>
              <Input
                v-model:value="infoForm.name"
                allow-clear
                placeholder="请输入通道名"
              />
            </FormItem>
            <FormItem label="支付CODE">
              <Input
                v-model:value="infoForm.payCode"
                allow-clear
                placeholder="请输入支付CODE"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                网关 CODE，一旦修改之前网关作废，请谨慎操作
              </div>
            </FormItem>
            <FormItem label="支付模式">
              <Select
                v-model:value="infoForm.paymentMode"
                :options="PAYMENT_MODE_OPTIONS"
                allow-clear
                placeholder="请选择支付模式"
              />
            </FormItem>
            <FormItem label="一抛">
              <Select
                v-model:value="infoForm.mixers"
                :options="MIXER_OPTIONS"
                allow-clear
                disabled
                mode="multiple"
                placeholder="暂未开放"
              />
            </FormItem>
            <FormItem label="结算比例">
              <InputNumber
                v-model:value="infoForm.settleRate"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">百分比</div>
            </FormItem>
            <FormItem label="备注">
              <Input
                v-model:value="infoForm.remark"
                allow-clear
                placeholder="请输入备注"
              />
              <div class="text-muted-foreground mt-1 text-xs">备注信息</div>
            </FormItem>
            <FormItem label="返回验证IP白名单">
              <Input
                v-model:value="infoForm.returnIpWhitelist"
                allow-clear
                placeholder="请输入返回验证IP白名单"
              />
            </FormItem>
            <FormItem label="禁用品牌词">
              <Input.TextArea
                v-model:value="infoForm.disableBrandWords"
                :rows="4"
                placeholder="请输入禁用品牌词"
              />
            </FormItem>
          </div>
          <div>
            <FormItem label="收款规则">
              <Select
                v-model:value="infoForm.collectRule"
                :options="toOptions(COLLECT_RULE_LABELS)"
                placeholder="请选择收款规则"
              />
            </FormItem>
            <FormItem label="发货范围">
              <Input
                v-model:value="infoForm.shipRange"
                allow-clear
                placeholder="请输入发货范围"
              />
              <div class="text-muted-foreground mt-1 text-xs">默认 40-50</div>
            </FormItem>
            <FormItem label="订单号设置">
              <Select
                v-model:value="infoForm.orderNoMode"
                :options="toOptions(ORDER_NO_MODE_LABELS)"
                allow-clear
                placeholder="请选择订单号设置"
              />
            </FormItem>
            <FormItem label="排序">
              <InputNumber
                v-model:value="infoForm.sort"
                :min="0"
                class="w-full"
              />
            </FormItem>
            <FormItem label="商品信息">
              <Select
                v-model:value="infoForm.productInfo"
                :options="toOptions(PRODUCT_INFO_LABELS)"
                allow-clear
                placeholder="请选择商品信息"
              />
            </FormItem>
            <FormItem label="返回页面拦截">
              <Select
                v-model:value="infoForm.returnVerify"
                :options="toOptions(RETURN_VERIFY_LABELS)"
                allow-clear
                placeholder="请选择"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                验证返回页面的 IP 和浏览器信息
              </div>
            </FormItem>
            <FormItem label="老客户判断时间">
              <InputNumber
                v-model:value="infoForm.oldCustomerDays"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">单位 day</div>
            </FormItem>
            <FormItem label="发货模式">
              <RadioGroup v-model:value="infoForm.autoShip">
                <Radio :value="true">自动发货</Radio>
                <Radio :value="false">手动发货</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="返回关键词">
              <Input.TextArea
                v-model:value="infoForm.returnKeywords"
                :rows="4"
                placeholder="请输入返回关键词"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                当返回以下信息时，自动关闭账号并发送邮件。多个关键词用 || 隔开
              </div>
            </FormItem>
          </div>
        </div>
      </Form>
    </Modal>

    <Modal
      v-model:open="editOpen"
      :confirm-loading="saving"
      destroy-on-close
      title="限制"
      width="880px"
      @ok="handleEditSave"
    >
      <Form class="mt-2" layout="vertical">
        <div class="grid grid-cols-1 gap-x-10 md:grid-cols-2">
          <div>
            <FormItem label="通道CODE">
              <Input
                v-model:value="editForm.channelCode"
                allow-clear
                placeholder="请输入通道CODE"
              />
            </FormItem>
            <FormItem label="日限金额(USD)">
              <InputNumber
                v-model:value="editForm.dailyAmountLimit"
                :min="0"
                :precision="2"
                class="w-full"
              />
            </FormItem>
            <FormItem label="支付频率(day)">
              <InputNumber
                v-model:value="editForm.payFrequency"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                与成功次数/失败次数配合构成成功设置；三者都未配置则为不限制
              </div>
            </FormItem>
            <FormItem label="失败次数">
              <InputNumber
                v-model:value="editForm.failCount"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                支付频率内连续失败达到 N 次后报失败；需同时填写支付频率
              </div>
            </FormItem>
            <FormItem label="金额限制模式">
              <Select
                v-model:value="editForm.amountLimitMode"
                :options="toOptions(AMOUNT_LIMIT_MODE_LABELS)"
                allow-clear
                placeholder="请选择金额限制模式"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                单笔：超过 120 只收 120；拦截：超过 120 不收
              </div>
            </FormItem>
            <FormItem label="限制最大金额">
              <InputNumber
                v-model:value="editForm.interceptMax"
                :min="editForm.interceptMin"
                :precision="2"
                class="w-full"
              />
            </FormItem>
            <FormItem label="支付货币">
              <Select
                v-model:value="editForm.currencies"
                :options="currencyOptions"
                allow-clear
                mode="multiple"
                option-filter-prop="label"
                placeholder="请选择支付货币"
                show-search
              />
              <div class="text-muted-foreground mt-1 text-xs">
                某支付方式仅支持这些货币；不选表示不限制
              </div>
            </FormItem>
            <FormItem label="仅支持国家">
              <Select
                v-model:value="editForm.allowCountries"
                :options="countryOptions"
                allow-clear
                mode="multiple"
                option-filter-prop="label"
                placeholder="请选择仅支持国家"
                show-search
              />
            </FormItem>
            <FormItem label="仅支持卡类型">
              <Select
                v-model:value="editForm.allowCardTypes"
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
                v-model:value="editForm.disableCardBrands"
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
                v-model:value="editForm.dailyOrderLimit"
                :min="0"
                class="w-full"
              />
            </FormItem>
            <FormItem label="互抛限制金额(USD)">
              <InputNumber
                v-model:value="editForm.mutualHoldAmount"
                :min="0"
                :precision="2"
                class="w-full"
              />
            </FormItem>
            <FormItem label="成功次数">
              <InputNumber
                v-model:value="editForm.successCount"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                支付频率内允许成功的笔数；需同时填写支付频率
              </div>
            </FormItem>
            <FormItem label="失败自动关闭">
              <InputNumber
                v-model:value="editForm.failAutoClose"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                不同用户连续失败次数达到 N 次后自动关闭通道
              </div>
            </FormItem>
            <FormItem label="计算货币">
              <Select
                v-model:value="editForm.calcCurrency"
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
                v-model:value="editForm.interceptMin"
                :max="
                  editForm.interceptMax > 0 ? editForm.interceptMax : undefined
                "
                :min="0"
                :precision="2"
                class="w-full"
              />
            </FormItem>
            <FormItem label="优先国家">
              <Select
                v-model:value="editForm.preferCountries"
                :options="countryOptions"
                allow-clear
                mode="multiple"
                option-filter-prop="label"
                placeholder="请选择优先国家"
                show-search
              />
              <div class="text-muted-foreground mt-1 text-xs">
                分流时同国家优先使用该支付方式
              </div>
            </FormItem>
            <FormItem label="禁用国家">
              <Select
                v-model:value="editForm.disableCountries"
                :options="countryOptions"
                allow-clear
                mode="multiple"
                option-filter-prop="label"
                placeholder="请选择禁用国家"
                show-search
              />
            </FormItem>
            <FormItem label="禁用卡类型">
              <Select
                v-model:value="editForm.disableCardTypes"
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
