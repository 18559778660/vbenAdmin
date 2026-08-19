<script lang="ts" setup>
import type { ChannelRow } from '../shared';

import { computed, reactive, ref } from 'vue';

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
  AMOUNT_LIMIT_MODE_LABELS,
  CARD_BRAND_LABELS,
  CARD_TYPE_LABELS,
  COLLECT_RULE_LABELS,
  COUNTRY_OPTIONS,
  countryLabel,
  createChannel,
  CURRENCY_OPTIONS,
  getChannelById,
  INTERCEPT_MODE_LABELS,
  MIXER_OPTIONS,
  mockChannelList,
  money,
  nowText,
  ORDER_NO_MODE_LABELS,
  PAYMENT_MODE_LABELS,
  platformFilterOptions,
  PRODUCT_INFO_LABELS,
  RETURN_VERIFY_LABELS,
  SUCCESS_MODE_LABELS,
  toOptions,
  updateChannel,
} from '../shared';

defineOptions({ name: 'ChannelList' });

const searchForm = reactive({
  id: undefined as number | undefined,
  name: '',
  platform: '',
});

const applied = reactive({
  id: undefined as number | undefined,
  name: '',
  platform: '',
});

const loading = ref(false);
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
  productInfo: 'site',
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
  productInfo: 'site',
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
  { title: '网关', key: 'gateway', width: 80 },
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

const list = computed(() => {
  return mockChannelList.value.filter((row) => {
    if (applied.id !== undefined && row.id !== applied.id) {
      return false;
    }
    if (applied.name && !row.name.includes(applied.name)) {
      return false;
    }
    if (applied.platform && row.platform !== applied.platform) {
      return false;
    }
    return true;
  });
});

function handleSearch() {
  applied.id = searchForm.id;
  applied.name = searchForm.name.trim();
  applied.platform = searchForm.platform;
}

function resetSearch() {
  searchForm.id = undefined;
  searchForm.name = '';
  searchForm.platform = '';
  handleSearch();
}

function handleRefresh() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
    message.success('已刷新（静态数据）');
  }, 300);
}

function resetForm() {
  form.name = '';
  form.paymentMode = 'local';
  form.siteBGroup = '';
  form.orderNoMode = 'site';
  form.settleRate = 0;
  form.payParams = '';
  form.productInfo = 'site';
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
  infoForm.collectRule = row.collectRule;
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

function handleSave() {
  const name = form.name.trim();
  if (!name) {
    message.warning('请输入通道名');
    return;
  }
  saving.value = true;
  const payload = {
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
  };
  if (editingId.value === null) {
    createChannel({
      platform: 'antom',
      packageName: '',
      totalAmount: 0,
      balance: 0,
      dailyOrderLimit: 0,
      dailyAmountLimit: 0,
      dailyRecvCount: 0,
      dailyRecvAmount: 0,
      interceptMode: 'reset',
      interceptCurrency: 'USD',
      interceptMax: 0,
      interceptMin: 0,
      status: true,
      gateway: true,
      successMode: 'unlimited',
      countries: [],
      currencies: [],
      remark: '',
      payFrequency: 0,
      failCount: 0,
      successCount: 0,
      failAutoClose: 0,
      mutualHoldAmount: 0,
      amountLimitMode: 'single',
      calcCurrency: 'USD',
      allowCountries: [],
      preferCountries: [],
      disableCountries: [],
      allowCardTypes: [],
      disableCardTypes: [],
      disableCardBrands: [],
      mixers: [],
      collectRule: 'random',
      shipRange: '40-50',
      sort: 1,
      autoShip: true,
      returnKeywords: '',
      disableBrandWords: '',
      ...payload,
    });
    message.success('已新增（静态，未接后端）');
  }
  saving.value = false;
  modalOpen.value = false;
}

function handleInfoSave() {
  const name = infoForm.name.trim();
  if (!name) {
    message.warning('请输入通道名');
    return;
  }
  if (editingId.value === null) {
    return;
  }
  const current = getChannelById(editingId.value);
  if (!current) {
    message.warning('通道不存在');
    return;
  }
  saving.value = true;
  updateChannel(editingId.value, {
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
  saving.value = false;
  infoOpen.value = false;
  message.success('已保存（静态，未接后端）');
}

function handleEditSave() {
  if (editingId.value === null) {
    return;
  }
  const current = getChannelById(editingId.value);
  if (!current) {
    message.warning('通道不存在');
    return;
  }
  saving.value = true;
  updateChannel(editingId.value, {
    channelCode: editForm.channelCode.trim(),
    dailyAmountLimit: editForm.dailyAmountLimit,
    payFrequency: editForm.payFrequency,
    failCount: editForm.failCount,
    amountLimitMode: editForm.amountLimitMode,
    interceptMax: editForm.interceptMax,
    currencies: [...editForm.currencies],
    allowCountries: [...editForm.allowCountries],
    countries: [...editForm.allowCountries],
    allowCardTypes: [...editForm.allowCardTypes],
    disableCardBrands: [...editForm.disableCardBrands],
    dailyOrderLimit: editForm.dailyOrderLimit,
    mutualHoldAmount: editForm.mutualHoldAmount,
    successCount: editForm.successCount,
    failAutoClose: editForm.failAutoClose,
    calcCurrency: editForm.calcCurrency,
    interceptMin: editForm.interceptMin,
    interceptCurrency: editForm.calcCurrency,
    preferCountries: [...editForm.preferCountries],
    disableCountries: [...editForm.disableCountries],
    disableCardTypes: [...editForm.disableCardTypes],
  });
  saving.value = false;
  editOpen.value = false;
  message.success('已保存（静态，未接后端）');
}

function onLog(row: ChannelRow) {
  message.info(`上传压缩包功能暂未接入：${row.name}`);
}

function onToggleStatus(row: ChannelRow, checked: boolean | number | string) {
  row.status = Boolean(checked);
  row.updatedBy = 'admin';
  row.updatedAt = nowText();
}
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
            class="w-36"
            placeholder="ID"
          />
        </FormItem>
        <FormItem label="通道名称">
          <Input
            v-model:value="searchForm.name"
            allow-clear
            class="w-44"
            placeholder="通道名称"
          />
        </FormItem>
        <FormItem label="通道平台">
          <Select
            v-model:value="searchForm.platform"
            :options="platformFilterOptions"
            class="w-40"
            placeholder="通道平台"
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
        :data-source="list"
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
            <span class="text-orange-500">
              {{
                PAYMENT_MODE_LABELS[record.paymentMode] || record.paymentMode
              }}
            </span>
          </template>
          <template v-else-if="column.key === 'gateway'">
            <Tag v-if="record.gateway">网关</Tag>
            <span v-else class="text-muted-foreground">-</span>
          </template>
          <template v-else-if="column.key === 'successMode'">
            <span class="text-green-600">
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
                :options="toOptions(PAYMENT_MODE_LABELS)"
                allow-clear
                placeholder="请选择支付模式"
              />
            </FormItem>
            <FormItem label="B站分组">
              <Input
                v-model:value="form.siteBGroup"
                allow-clear
                placeholder="请输入B站分组"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                用户通道账号选择B站
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
                :options="toOptions(PAYMENT_MODE_LABELS)"
                allow-clear
                placeholder="请选择支付模式"
              />
            </FormItem>
            <FormItem label="一抛">
              <Select
                v-model:value="infoForm.mixers"
                :options="MIXER_OPTIONS"
                allow-clear
                mode="multiple"
                placeholder="请选择一项或多项"
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
                某支付方式一天只收一单
              </div>
            </FormItem>
            <FormItem label="失败次数">
              <InputNumber
                v-model:value="editForm.failCount"
                :min="0"
                class="w-full"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                一定时间内该账号连续失败达到 N 次后报失败，不再提交此通道
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
                :min="0"
                :precision="2"
                class="w-full"
              />
            </FormItem>
            <FormItem label="支付货币">
              <Select
                v-model:value="editForm.currencies"
                :options="CURRENCY_OPTIONS"
                allow-clear
                mode="multiple"
                placeholder="请选择支付货币"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                某支付方式仅支持这些货币；不选表示不限制
              </div>
            </FormItem>
            <FormItem label="仅支持国家">
              <Select
                v-model:value="editForm.allowCountries"
                :options="COUNTRY_OPTIONS"
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
                :options="toOptions(CARD_TYPE_LABELS)"
                allow-clear
                mode="multiple"
                placeholder="请选择一项或多项"
              />
            </FormItem>
            <FormItem label="禁用卡头">
              <Select
                v-model:value="editForm.disableCardBrands"
                :options="toOptions(CARD_BRAND_LABELS)"
                allow-clear
                mode="multiple"
                placeholder="请选择卡组织，如 Visa、万事达"
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
                一定时间内内部能够成功的笔数
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
                :options="CURRENCY_OPTIONS"
                placeholder="请选择计算货币"
              />
              <div class="text-muted-foreground mt-1 text-xs">
                限制金额时使用
              </div>
            </FormItem>
            <FormItem label="限制最小金额">
              <InputNumber
                v-model:value="editForm.interceptMin"
                :min="0"
                :precision="2"
                class="w-full"
              />
            </FormItem>
            <FormItem label="优先国家">
              <Select
                v-model:value="editForm.preferCountries"
                :options="COUNTRY_OPTIONS"
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
                :options="COUNTRY_OPTIONS"
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
                :options="toOptions(CARD_TYPE_LABELS)"
                allow-clear
                mode="multiple"
                placeholder="请选择一项或多项"
              />
            </FormItem>
          </div>
        </div>
      </Form>
    </Modal>
  </Page>
</template>
