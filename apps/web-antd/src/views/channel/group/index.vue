<script lang="ts" setup>
import type { ChannelGroupRow } from './shared';

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
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'ant-design-vue';

import { ACCOUNT_LIMIT_MODE_LABELS } from '../account/shared';
import {
  COLLECT_RULE_LABELS,
  INTERCEPT_MODE_LABELS,
  toOptions,
} from '../shared';
import {
  getGroupAccounts,
  mockChannelGroupList,
  money,
  nowText,
  PAYMENT_METHOD_FILTER_OPTIONS,
  remarkText,
} from './shared';

defineOptions({ name: 'ChannelGroup' });

const searchForm = reactive({
  id: undefined as number | undefined,
  code: '',
});

const applied = reactive({
  id: undefined as number | undefined,
  code: '',
});

const editForm = reactive({
  name: '',
  collectRule: 'random',
  oldCustomerDays: 30,
  payFrequencyDays: 1,
  failLimitCount: 3,
  successLimitCount: 1,
});

const accountSearchForm = reactive({
  paymentMethod: '',
});

const accountApplied = reactive({
  paymentMethod: '',
});

const loading = ref(false);
const saving = ref(false);
const editOpen = ref(false);
const accountOpen = ref(false);
const editingId = ref<null | number>(null);
const viewingGroupId = ref<null | number>(null);
const viewingGroupName = ref('');

const collectRuleOptions = toOptions(COLLECT_RULE_LABELS);

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
  { title: '备注', key: 'remark', width: 180 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
  { title: '创建人', dataIndex: 'createdBy', key: 'createdBy', width: 100 },
  { title: '操作时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 170 },
  { title: '操作人', dataIndex: 'updatedBy', key: 'updatedBy', width: 100 },
];

const accountColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  {
    title: '通道名',
    dataIndex: 'channelName',
    key: 'channelName',
    width: 160,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '账号状态', key: 'accountStatus', width: 100 },
  { title: 'B站', dataIndex: 'siteB', key: 'siteB', width: 160 },
  { title: '通道', dataIndex: 'channel', key: 'channel', width: 140 },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 120 },
];

const filteredList = computed(() => {
  return mockChannelGroupList.value.filter((row) => {
    if (applied.id && row.id !== applied.id) return false;
    if (applied.code && !row.code.includes(applied.code.trim())) return false;
    return true;
  });
});

const filteredAccounts = computed(() => {
  if (!viewingGroupId.value) return [];
  return getGroupAccounts(viewingGroupId.value).filter((row) => {
    if (
      accountApplied.paymentMethod &&
      row.paymentMethod !== accountApplied.paymentMethod
    ) {
      return false;
    }
    return true;
  });
});

function handleSearch() {
  applied.id = searchForm.id;
  applied.code = searchForm.code;
}

function resetSearch() {
  searchForm.id = undefined;
  searchForm.code = '';
  handleSearch();
}

function handleRefresh() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
    message.success('已刷新（静态数据）');
  }, 200);
}

function openCreate() {
  message.info('新增暂未开放（静态页）');
}

function openEdit(row: ChannelGroupRow) {
  editingId.value = row.id;
  editForm.name = row.name;
  editForm.collectRule = row.collectRule;
  editForm.oldCustomerDays = row.oldCustomerDays;
  editForm.payFrequencyDays = row.payFrequencyDays;
  editForm.failLimitCount = row.failLimitCount;
  editForm.successLimitCount = row.successLimitCount;
  editOpen.value = true;
}

function handleEditSave() {
  if (!editForm.name.trim()) {
    message.warning('请填写分组名');
    return;
  }
  const row = mockChannelGroupList.value.find(
    (item) => item.id === editingId.value,
  );
  if (!row) {
    message.warning('分组不存在');
    return;
  }
  saving.value = true;
  Object.assign(row, {
    name: editForm.name.trim(),
    collectRule: editForm.collectRule,
    oldCustomerDays: editForm.oldCustomerDays,
    payFrequencyDays: editForm.payFrequencyDays,
    failLimitCount: editForm.failLimitCount,
    successLimitCount: editForm.successLimitCount,
    updatedAt: nowText(),
    updatedBy: 'admin',
  });
  saving.value = false;
  editOpen.value = false;
  message.success('已保存（静态，未接后端）');
}

function onViewAccounts(row: ChannelGroupRow) {
  viewingGroupId.value = row.id;
  viewingGroupName.value = row.name;
  accountSearchForm.paymentMethod = '';
  accountApplied.paymentMethod = '';
  accountOpen.value = true;
}

function handleAccountSearch() {
  accountApplied.paymentMethod = accountSearchForm.paymentMethod;
}

function resetAccountSearch() {
  accountSearchForm.paymentMethod = '';
  accountApplied.paymentMethod = '';
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
        :scroll="{ x: 1900 }"
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
                    INTERCEPT_MODE_LABELS[record.interceptMode] ||
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
        </template>
      </Table>
    </Card>

    <Modal
      v-model:open="editOpen"
      :confirm-loading="saving"
      :footer="null"
      destroy-on-close
      title="编辑"
      width="480px"
    >
      <Form layout="vertical" class="pt-2">
        <FormItem label="分组名" required>
          <Input v-model:value="editForm.name" placeholder="请输入分组名" />
        </FormItem>
        <FormItem label="收款规则">
          <Select
            v-model:value="editForm.collectRule"
            :options="collectRuleOptions"
            allow-clear
            placeholder="请选择收款规则"
          />
        </FormItem>
        <FormItem label="老客户判断时间">
          <InputNumber
            v-model:value="editForm.oldCustomerDays"
            :min="0"
            class="w-full"
          />
        </FormItem>
        <FormItem label="支付频率时间(day)">
          <InputNumber
            v-model:value="editForm.payFrequencyDays"
            :min="0"
            class="w-full"
          />
        </FormItem>
        <FormItem label="失败限制次数">
          <InputNumber
            v-model:value="editForm.failLimitCount"
            :min="0"
            class="w-full"
          />
        </FormItem>
        <FormItem label="成功限制次数">
          <InputNumber
            v-model:value="editForm.successLimitCount"
            :min="0"
            class="w-full"
          />
        </FormItem>
        <FormItem>
          <Space>
            <Button :loading="saving" type="primary" @click="handleEditSave">
              提交
            </Button>
            <Button @click="editOpen = false">关闭</Button>
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
            v-model:value="accountSearchForm.paymentMethod"
            :options="PAYMENT_METHOD_FILTER_OPTIONS"
            class="w-40"
            placeholder="支付方式"
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
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :scroll="{ x: 900 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            {{ record.status || '' }}
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
