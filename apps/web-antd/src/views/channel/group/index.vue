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
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'ant-design-vue';

import {
  mockChannelGroupList,
  money,
  nextGroupIdValue,
  nowText,
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

const form = reactive({
  code: '',
  name: '',
  gateway: true,
  oldCustomerDays: 30,
  totalAmount: 0,
  balance: 0,
  availableAccountCount: 0,
});

const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingId = ref<null | number>(null);

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
  { title: '剩余金额', key: 'remain', width: 150 },
  { title: '网关', key: 'gateway', width: 90 },
  {
    title: '老客户判断时间',
    dataIndex: 'oldCustomerDays',
    key: 'oldCustomerDays',
    width: 130,
  },
  { title: '备注', key: 'remark', width: 180 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
  { title: '创建人', dataIndex: 'createdBy', key: 'createdBy', width: 100 },
  { title: '操作时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 170 },
  { title: '操作人', dataIndex: 'updatedBy', key: 'updatedBy', width: 100 },
];

const modalTitle = computed(() => (editingId.value ? '编辑分组' : '新增分组'));

const filteredList = computed(() => {
  return mockChannelGroupList.value.filter((row) => {
    if (applied.id && row.id !== applied.id) return false;
    if (applied.code && !row.code.includes(applied.code.trim())) return false;
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

function resetForm() {
  form.code = '';
  form.name = '';
  form.gateway = true;
  form.oldCustomerDays = 30;
  form.totalAmount = 0;
  form.balance = 0;
  form.availableAccountCount = 0;
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function openEdit(row: ChannelGroupRow) {
  editingId.value = row.id;
  form.code = row.code;
  form.name = row.name;
  form.gateway = row.gateway;
  form.oldCustomerDays = row.oldCustomerDays;
  form.totalAmount = row.totalAmount;
  form.balance = row.balance;
  form.availableAccountCount = row.availableAccountCount;
  modalOpen.value = true;
}

function handleSave() {
  if (!form.code.trim() || !form.name.trim()) {
    message.warning('请填写分组CODE和分组名');
    return;
  }
  saving.value = true;
  const timestamp = nowText();
  if (editingId.value) {
    const row = mockChannelGroupList.value.find(
      (item) => item.id === editingId.value,
    );
    if (row) {
      Object.assign(row, {
        code: form.code.trim(),
        name: form.name.trim(),
        gateway: form.gateway,
        oldCustomerDays: form.oldCustomerDays,
        totalAmount: form.totalAmount,
        balance: form.balance,
        availableAccountCount: form.availableAccountCount,
        updatedAt: timestamp,
        updatedBy: 'admin',
      });
    }
  } else {
    mockChannelGroupList.value.unshift({
      id: nextGroupIdValue(),
      code: form.code.trim(),
      name: form.name.trim(),
      gateway: form.gateway,
      oldCustomerDays: form.oldCustomerDays,
      totalAmount: form.totalAmount,
      balance: form.balance,
      availableAccountCount: form.availableAccountCount,
      createdAt: timestamp,
      createdBy: 'admin',
      updatedAt: timestamp,
      updatedBy: 'admin',
    });
  }
  saving.value = false;
  modalOpen.value = false;
  message.success('已保存（静态，未接后端）');
}

function onViewAccounts(_row: ChannelGroupRow) {
  message.info('分组账号列表暂未接入（静态页）');
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
        :scroll="{ x: 1600 }"
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
              <Tooltip title="分组账号">
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
          <template v-else-if="column.key === 'remain'">
            <div class="flex flex-col gap-1">
              <Tag color="blue">总额: {{ money(record.totalAmount) }}</Tag>
              <Tag :color="record.balance > 0 ? 'green' : 'red'">
                余额: {{ money(record.balance) }}
              </Tag>
            </div>
          </template>
          <template v-else-if="column.key === 'gateway'">
            <Tag v-if="record.gateway" bordered>网关</Tag>
            <span v-else class="text-muted-foreground">-</span>
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
      v-model:open="modalOpen"
      :confirm-loading="saving"
      :title="modalTitle"
      destroy-on-close
      width="560px"
      @ok="handleSave"
    >
      <Form layout="vertical" class="pt-2">
        <FormItem label="分组CODE" required>
          <Input v-model:value="form.code" placeholder="请输入分组CODE" />
        </FormItem>
        <FormItem label="分组名" required>
          <Input v-model:value="form.name" placeholder="请输入分组名" />
        </FormItem>
        <FormItem label="网关">
          <Switch v-model:checked="form.gateway" />
        </FormItem>
        <FormItem label="老客户判断时间">
          <InputNumber
            v-model:value="form.oldCustomerDays"
            :min="0"
            class="w-full"
          />
        </FormItem>
        <FormItem label="总额">
          <InputNumber
            v-model:value="form.totalAmount"
            :min="0"
            :precision="2"
            class="w-full"
          />
        </FormItem>
        <FormItem label="余额">
          <InputNumber
            v-model:value="form.balance"
            :min="0"
            :precision="2"
            class="w-full"
          />
        </FormItem>
        <FormItem label="可用账号数">
          <InputNumber
            v-model:value="form.availableAccountCount"
            :min="0"
            class="w-full"
          />
          <div class="text-muted-foreground mt-1 text-xs">
            用于列表备注展示：0 显示无可用账号，大于 0 显示可用账号数量
          </div>
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
