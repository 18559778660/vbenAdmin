<script lang="ts" setup>
import type { ChannelGroupRow, GroupAccountRow } from './shared';

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
import { getChannelList } from '#/api/channel';
import {
  createChannelGroup,
  getChannelGroupAccounts,
  getChannelGroupList,
  setChannelGroupAccountMembership,
  updateChannelGroup,
} from '#/api/channel-group';

import { ACCOUNT_LIMIT_MODE_LABELS } from '../account/shared';
import {
  CARD_BRAND_LABELS,
  COLLECT_RULE_LABELS,
  toOptions,
  validateInterceptRange,
  validateSuccessSetting,
} from '../shared';
import { money, remarkText, shipModeText } from './shared';

defineOptions({ name: 'ChannelGroup' });

const searchForm = reactive({
  id: undefined as number | undefined,
  code: '',
});

const applied = reactive({
  id: undefined as number | undefined,
  code: '',
});

const groupForm = reactive({
  name: '',
  code: '',
  oldCustomerDays: 30,
  payFrequencyDays: 1,
  failLimitCount: 1,
  successLimitCount: 3,
  interceptMode: 'reset',
  interceptCurrency: 'USD',
  interceptMax: 0,
  interceptMin: 0,
  dailyOrderLimit: 0,
  dailyAmountLimit: 0,
  preferCountries: [] as string[],
  disableCountries: [] as string[],
  disableCardBrands: [] as string[],
  disableCardTypes: [] as string[],
  allowCountries: [] as string[],
  allowCardTypes: [] as string[],
  collectRule: 'round',
  autoShip: true,
});

const accountSearchForm = reactive({
  channelId: undefined as number | undefined,
});

const accountApplied = reactive({
  channelId: undefined as number | undefined,
});

const loading = ref(false);
const saving = ref(false);
const formOpen = ref(false);
const accountOpen = ref(false);
const editingId = ref<null | number>(null);
const viewingGroupId = ref<null | number>(null);
const viewingGroupName = ref('');
const list = ref<ChannelGroupRow[]>([]);
const accountList = ref<GroupAccountRow[]>([]);
const accountLoading = ref(false);
const membershipSavingId = ref<null | number>(null);

const currencyOptions = ref<{ label: string; value: string }[]>([]);
const countryOptions = ref<{ label: string; value: string }[]>([]);
const cardTypeOptions = ref<{ label: string; value: string }[]>([]);
const channelOptions = ref<{ label: string; value: number }[]>([]);

const channelFilterOptions = computed(() => [
  { label: '全部', value: undefined },
  ...channelOptions.value,
]);

const collectRuleOptions = toOptions(COLLECT_RULE_LABELS);
const amountLimitModeOptions = Object.entries(ACCOUNT_LIMIT_MODE_LABELS).map(
  ([value, label]) => ({ label, value }),
);

const formTitle = computed(() => (editingId.value ? '编辑' : '新增'));
const isEditing = computed(() => editingId.value !== null);

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
    width: 100,
    fixed: 'left' as const,
  },
  { title: '分组CODE', dataIndex: 'code', key: 'code', width: 120 },
  { title: '分组名', dataIndex: 'name', key: 'name', width: 140 },
  { title: '金额设置', key: 'amountSetting', width: 260 },
  {
    title: '老客户判断时间',
    dataIndex: 'oldCustomerDays',
    key: 'oldCustomerDays',
    width: 130,
  },
  { title: '成功设置', key: 'successSetting', width: 140 },
  { title: '拦截设置', key: 'intercept', width: 200 },
  { title: '网关', key: 'gateway', width: 120 },
  { title: '禁用国家', key: 'disableCountries', width: 120 },
  { title: '发货模式', key: 'autoShip', width: 100 },
  { title: '备注', key: 'remark', width: 180 },
  { title: '更新', key: 'updated', width: 170 },
  { title: '创建', key: 'created', width: 170 },
];

const accountColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  {
    title: '通道名',
    dataIndex: 'channelName',
    key: 'channelName',
    width: 160,
  },
  { title: '状态', key: 'inGroup', width: 80 },
  { title: '账号状态', key: 'accountStatus', width: 100 },
  { title: 'B站', dataIndex: 'siteB', key: 'siteB', width: 160 },
  { title: '通道', dataIndex: 'channel', key: 'channel', width: 140 },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 120 },
];

const filteredList = computed(() => list.value);

const filteredAccounts = computed(() => accountList.value);

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

async function loadList() {
  loading.value = true;
  try {
    list.value = await getChannelGroupList({
      id: applied.id,
      code: applied.code.trim() || undefined,
    });
  } catch (error) {
    list.value = [];
    message.error(error instanceof Error ? error.message : '加载分组列表失败');
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  applied.id = searchForm.id;
  applied.code = searchForm.code;
  void loadList();
}

function resetSearch() {
  searchForm.id = undefined;
  searchForm.code = '';
  handleSearch();
}

function handleRefresh() {
  void loadList();
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

function resetGroupForm() {
  groupForm.name = '';
  groupForm.code = '';
  groupForm.oldCustomerDays = 30;
  groupForm.payFrequencyDays = 1;
  groupForm.failLimitCount = 1;
  groupForm.successLimitCount = 3;
  groupForm.interceptMode = 'reset';
  groupForm.interceptCurrency = currencyOptions.value[0]?.value || 'USD';
  groupForm.interceptMax = 0;
  groupForm.interceptMin = 0;
  groupForm.dailyOrderLimit = 0;
  groupForm.dailyAmountLimit = 0;
  groupForm.preferCountries = [];
  groupForm.disableCountries = [];
  groupForm.disableCardBrands = [];
  groupForm.disableCardTypes = [];
  groupForm.allowCountries = [];
  groupForm.allowCardTypes = [];
  groupForm.collectRule = 'round';
  groupForm.autoShip = true;
}

function fillGroupForm(row: ChannelGroupRow) {
  groupForm.name = row.name;
  groupForm.code = row.code;
  groupForm.oldCustomerDays = row.oldCustomerDays;
  groupForm.payFrequencyDays = row.payFrequencyDays;
  groupForm.failLimitCount = row.failLimitCount;
  groupForm.successLimitCount = row.successLimitCount;
  groupForm.interceptMode = row.interceptMode;
  groupForm.interceptCurrency = row.interceptCurrency;
  groupForm.interceptMax = row.interceptMax;
  groupForm.interceptMin = row.interceptMin;
  groupForm.dailyOrderLimit = row.dailyOrderLimit;
  groupForm.dailyAmountLimit = row.dailyAmountLimit;
  groupForm.preferCountries = [...row.preferCountries];
  groupForm.disableCountries = [...row.disableCountries];
  groupForm.disableCardBrands = [...row.disableCardBrands];
  groupForm.disableCardTypes = [...row.disableCardTypes];
  groupForm.allowCountries = [...row.allowCountries];
  groupForm.allowCardTypes = [...row.allowCardTypes];
  groupForm.collectRule = row.collectRule;
  groupForm.autoShip = row.autoShip;
}

function buildFormPayload() {
  return {
    name: groupForm.name.trim(),
    code: groupForm.code.trim(),
    oldCustomerDays: groupForm.oldCustomerDays,
    payFrequencyDays: groupForm.payFrequencyDays,
    failLimitCount: groupForm.failLimitCount,
    successLimitCount: groupForm.successLimitCount,
    interceptMode: groupForm.interceptMode,
    interceptCurrency: groupForm.interceptCurrency,
    interceptMax: groupForm.interceptMax,
    interceptMin: groupForm.interceptMin,
    dailyOrderLimit: groupForm.dailyOrderLimit,
    dailyAmountLimit: groupForm.dailyAmountLimit,
    preferCountries: [...groupForm.preferCountries],
    disableCountries: [...groupForm.disableCountries],
    disableCardBrands: [...groupForm.disableCardBrands],
    disableCardTypes: [...groupForm.disableCardTypes],
    allowCountries: [...groupForm.allowCountries],
    allowCardTypes: [...groupForm.allowCardTypes],
    collectRule: groupForm.collectRule,
    autoShip: groupForm.autoShip,
  };
}

function buildUpdatePayload() {
  const payload = buildFormPayload();
  const { name: _name, code: _code, ...updatePayload } = payload;
  return updatePayload;
}

function openCreate() {
  editingId.value = null;
  resetGroupForm();
  formOpen.value = true;
}

function openEdit(row: ChannelGroupRow) {
  editingId.value = row.id;
  fillGroupForm(row);
  formOpen.value = true;
}

async function handleFormSave() {
  if (!groupForm.name.trim() || !groupForm.code.trim()) {
    message.warning('请填写分组名和分组CODE');
    return;
  }
  const rangeError = validateInterceptRange(
    groupForm.interceptMin,
    groupForm.interceptMax,
  );
  if (rangeError) {
    message.warning(rangeError);
    return;
  }
  const successSettingError = validateSuccessSetting(
    groupForm.payFrequencyDays,
    groupForm.successLimitCount,
    groupForm.failLimitCount,
  );
  if (successSettingError) {
    message.warning(successSettingError);
    return;
  }
  saving.value = true;
  try {
    if (editingId.value) {
      await updateChannelGroup(editingId.value, buildUpdatePayload());
      message.success('更新成功');
    } else {
      await createChannelGroup(buildFormPayload());
      message.success('创建成功');
    }
    formOpen.value = false;
    await loadList();
  } catch (error) {
    message.error(error instanceof Error ? error.message : '保存失败');
  } finally {
    saving.value = false;
  }
}

function onViewAccounts(row: ChannelGroupRow) {
  viewingGroupId.value = row.id;
  viewingGroupName.value = row.name;
  accountSearchForm.channelId = undefined;
  accountApplied.channelId = undefined;
  accountOpen.value = true;
  void loadGroupAccounts();
}

async function loadGroupAccounts() {
  if (!viewingGroupId.value) {
    accountList.value = [];
    return;
  }
  accountLoading.value = true;
  try {
    accountList.value = await getChannelGroupAccounts(viewingGroupId.value, {
      channelId: accountApplied.channelId,
    });
  } catch (error) {
    accountList.value = [];
    message.error(error instanceof Error ? error.message : '加载账号列表失败');
  } finally {
    accountLoading.value = false;
  }
}

async function handleMembershipChange(
  record: GroupAccountRow,
  checked: boolean,
) {
  if (!viewingGroupId.value) {
    return;
  }
  membershipSavingId.value = record.id;
  try {
    await setChannelGroupAccountMembership(
      viewingGroupId.value,
      record.id,
      checked,
    );
    record.inGroup = checked;
    message.success(checked ? '已归属当前分组' : '已移出当前分组');
    await loadList();
  } catch (error) {
    message.error(error instanceof Error ? error.message : '操作失败');
  } finally {
    membershipSavingId.value = null;
  }
}

function handleAccountSearch() {
  accountApplied.channelId = accountSearchForm.channelId;
  void loadGroupAccounts();
}

function resetAccountSearch() {
  accountSearchForm.channelId = undefined;
  accountApplied.channelId = undefined;
  void loadGroupAccounts();
}

onMounted(() => {
  void loadConfigOptions();
  void loadChannelOptions();
  void loadList();
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
            class="w-28"
            placeholder="ID"
          />
        </FormItem>
        <FormItem label="分组CODE">
          <Input
            v-model:value="searchForm.code"
            allow-clear
            class="w-40"
            placeholder="分组CODE"
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
        :scroll="{ x: 2000 }"
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
                  @click="openEdit(record as ChannelGroupRow)"
                >
                  <IconifyIcon class="size-4" icon="lucide:pencil" />
                </Button>
              </Tooltip>
              <Tooltip title="账号列表">
                <Button
                  size="small"
                  type="link"
                  @click="onViewAccounts(record as ChannelGroupRow)"
                >
                  <IconifyIcon class="size-4" icon="lucide:list" />
                </Button>
              </Tooltip>
            </Space>
          </template>
          <template v-else-if="column.key === 'amountSetting'">
            <div class="text-xs leading-5">
              <div class="mb-1 flex flex-wrap gap-1">
                <Tag color="blue">总额: {{ money(record.totalAmount) }}</Tag>
                <Tag :color="record.balance > 0 ? 'green' : 'red'">
                  余额: {{ money(record.balance) }}
                </Tag>
              </div>
              <div class="text-purple-600">
                日限单数: {{ record.dailyOrderLimit }}
                <span class="mx-1">|</span>
                日限金额: {{ money(record.dailyAmountLimit) }} USD
              </div>
              <div class="text-green-600">
                日收笔数: {{ record.dailyRecvCount }}
                <span class="mx-1">|</span>
                日收金额: {{ money(record.dailyRecvAmount) }} USD
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'successSetting'">
            <div class="text-xs leading-5">
              <div class="text-green-600">
                成功 {{ record.payFrequencyDays }}天
                {{ record.successLimitCount }}笔
              </div>
              <div class="text-red-500">
                失败 {{ record.payFrequencyDays }}天
                {{ record.failLimitCount }}笔
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'intercept'">
            <div class="text-xs leading-5">
              <div>
                模式:
                <span class="text-red-500">
                  {{
                    ACCOUNT_LIMIT_MODE_LABELS[record.interceptMode] ||
                    record.interceptMode
                  }}
                </span>
                <span class="mx-1">|</span>
                货币:
                <span class="text-red-500">{{ record.interceptCurrency }}</span>
              </div>
              <div>
                最高:
                <span class="text-red-500">
                  {{ money(record.interceptMax) }}
                </span>
                <span class="mx-1">|</span>
                最低:
                <span class="text-red-500">
                  {{ money(record.interceptMin) }}
                </span>
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'remark'">
            <span
              :class="
                record.availableAccountCount > 0
                  ? 'text-green-600'
                  : 'text-red-500'
              "
            >
              {{ remarkText(record as ChannelGroupRow) }}
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
          <template v-else-if="column.key === 'disableCountries'">
            <Space wrap size="small">
              <Tag v-for="code in record.disableCountries" :key="code">
                {{ code }}
              </Tag>
            </Space>
          </template>
          <template v-else-if="column.key === 'autoShip'">
            {{ shipModeText(record.autoShip) }}
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

    <Modal
      v-model:open="formOpen"
      :body-style="{ maxHeight: '70vh', overflowY: 'auto' }"
      :confirm-loading="saving"
      :footer="null"
      destroy-on-close
      :title="formTitle"
      width="520px"
    >
      <Form layout="vertical" class="pt-2">
        <FormItem label="分组名" required>
          <Input
            v-model:value="groupForm.name"
            :disabled="isEditing"
            placeholder="请输入分组名"
          />
        </FormItem>
        <FormItem label="分组CODE" required>
          <Input
            v-model:value="groupForm.code"
            :disabled="isEditing"
            placeholder="请输入分组CODE"
          />
        </FormItem>
        <FormItem label="老客户判断时间">
          <InputNumber
            v-model:value="groupForm.oldCustomerDays"
            :min="0"
            class="w-full"
          />
        </FormItem>
        <FormItem label="支付频率时间(day)">
          <InputNumber
            v-model:value="groupForm.payFrequencyDays"
            :min="0"
            class="w-full"
          />
        </FormItem>
        <FormItem label="失败限制次数">
          <InputNumber
            v-model:value="groupForm.failLimitCount"
            :min="0"
            class="w-full"
          />
        </FormItem>
        <FormItem label="成功限制次数">
          <InputNumber
            v-model:value="groupForm.successLimitCount"
            :min="0"
            class="w-full"
          />
        </FormItem>
        <FormItem label="金额限制模式">
          <Select
            v-model:value="groupForm.interceptMode"
            :options="amountLimitModeOptions"
            placeholder="请选择"
          />
          <div class="text-muted-foreground mt-1 text-xs">
            重置：超过120只收120,拦截：超过120不收
          </div>
        </FormItem>
        <FormItem label="计算货币">
          <Select
            v-model:value="groupForm.interceptCurrency"
            :options="currencyOptions"
            option-filter-prop="label"
            placeholder="请选择计算货币"
            show-search
          />
          <div class="text-muted-foreground mt-1 text-xs">限制金额时使用</div>
        </FormItem>
        <FormItem label="限制最大金额">
          <InputNumber
            v-model:value="groupForm.interceptMax"
            :min="0"
            :precision="2"
            class="w-full"
          />
        </FormItem>
        <FormItem label="限制最小金额">
          <InputNumber
            v-model:value="groupForm.interceptMin"
            :min="0"
            :precision="2"
            class="w-full"
          />
        </FormItem>
        <FormItem label="日限单数">
          <InputNumber
            v-model:value="groupForm.dailyOrderLimit"
            :min="0"
            class="w-full"
          />
        </FormItem>
        <FormItem label="日限金额(USD)">
          <InputNumber
            v-model:value="groupForm.dailyAmountLimit"
            :min="0"
            :precision="2"
            class="w-full"
          />
        </FormItem>
        <FormItem label="优先国家">
          <Select
            v-model:value="groupForm.preferCountries"
            :options="countryOptions"
            allow-clear
            mode="multiple"
            option-filter-prop="label"
            placeholder="请选择优先国家"
            show-search
          />
        </FormItem>
        <FormItem label="禁用国家">
          <Select
            v-model:value="groupForm.disableCountries"
            :options="countryOptions"
            allow-clear
            mode="multiple"
            option-filter-prop="label"
            placeholder="请选择禁用国家"
            show-search
          />
        </FormItem>
        <FormItem label="禁用卡头">
          <Select
            v-model:value="groupForm.disableCardBrands"
            :options="toOptions(CARD_BRAND_LABELS)"
            allow-clear
            disabled
            mode="multiple"
            placeholder="暂未开放"
          />
        </FormItem>
        <FormItem label="禁用卡类型">
          <Select
            v-model:value="groupForm.disableCardTypes"
            :options="cardTypeOptions"
            allow-clear
            mode="multiple"
            option-filter-prop="label"
            placeholder="请选择一项或多项"
            show-search
          />
        </FormItem>
        <FormItem label="仅支持国家">
          <Select
            v-model:value="groupForm.allowCountries"
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
            v-model:value="groupForm.allowCardTypes"
            :options="cardTypeOptions"
            allow-clear
            mode="multiple"
            option-filter-prop="label"
            placeholder="请选择一项或多项"
            show-search
          />
        </FormItem>
        <FormItem label="收款规则">
          <Select
            v-model:value="groupForm.collectRule"
            :options="collectRuleOptions"
            placeholder="请选择收款规则"
          />
        </FormItem>
        <FormItem label="发货模式">
          <RadioGroup v-model:value="groupForm.autoShip">
            <Radio :value="true">自动发货</Radio>
            <Radio :value="false">手动发货</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Space>
            <Button :loading="saving" type="primary" @click="handleFormSave">
              提交
            </Button>
            <Button @click="formOpen = false">关闭</Button>
          </Space>
        </FormItem>
      </Form>
    </Modal>

    <Modal
      v-model:open="accountOpen"
      :footer="null"
      destroy-on-close
      title="账号列表"
      width="960px"
    >
      <div v-if="viewingGroupName" class="text-muted-foreground mb-4 text-sm">
        当前分组：{{ viewingGroupName }}
      </div>
      <Form layout="inline" class="mb-4 gap-y-3">
        <FormItem label="支付方式">
          <Select
            v-model:value="accountSearchForm.channelId"
            :options="channelFilterOptions"
            allow-clear
            class="w-40"
            option-filter-prop="label"
            placeholder="请选择通道"
            show-search
          />
        </FormItem>
        <FormItem>
          <Space>
            <Button type="primary" @click="handleAccountSearch">
              <template #icon>
                <IconifyIcon icon="lucide:search" />
              </template>
              搜索
            </Button>
            <Button @click="resetAccountSearch">
              <template #icon>
                <IconifyIcon icon="lucide:rotate-ccw" />
              </template>
              重置
            </Button>
          </Space>
        </FormItem>
      </Form>

      <Table
        :columns="accountColumns"
        :data-source="filteredAccounts"
        :loading="accountLoading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :scroll="{ x: 900 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'inGroup'">
            <Switch
              :checked="record.inGroup"
              :loading="membershipSavingId === record.id"
              @change="
                (checked) =>
                  handleMembershipChange(record as GroupAccountRow, !!checked)
              "
            />
          </template>
          <template v-else-if="column.key === 'accountStatus'">
            <Tag :color="record.accountStatus ? 'green' : 'default'">
              {{ record.accountStatus ? '启用' : '禁用' }}
            </Tag>
          </template>
        </template>
      </Table>
    </Modal>
  </Page>
</template>
