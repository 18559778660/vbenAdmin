<script lang="ts" setup>
import type { CurrencyRow } from '../shared';

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
  Tooltip,
} from 'ant-design-vue';

import { createCurrency, mockCurrencyList, updateCurrency } from '../shared';

defineOptions({ name: 'CurrencyList' });

const searchForm = reactive({
  code: '',
  name: '',
});

const applied = reactive({
  code: '',
  name: '',
});

const form = reactive({
  code: '',
  name: '',
  symbol: '',
  sort: 0,
  status: true,
});

const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingId = ref<null | number>(null);

const modalTitle = computed(() => (editingId.value ? '编辑货币' : '新增货币'));

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    fixed: 'left' as const,
  },
  { title: '操作', key: 'actions', width: 80, fixed: 'left' as const },
  { title: '货币代码', dataIndex: 'code', key: 'code', width: 120 },
  { title: '货币名称', dataIndex: 'name', key: 'name', width: 160 },
  { title: '符号', dataIndex: 'symbol', key: 'symbol', width: 80 },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
  { title: '状态', key: 'status', width: 90 },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
];

const list = computed(() => {
  return mockCurrencyList.value.filter((row) => {
    if (
      applied.code &&
      !row.code.toLowerCase().includes(applied.code.toLowerCase())
    ) {
      return false;
    }
    if (applied.name && !row.name.includes(applied.name)) {
      return false;
    }
    return true;
  });
});

function handleSearch() {
  applied.code = searchForm.code.trim();
  applied.name = searchForm.name.trim();
}

function resetSearch() {
  searchForm.code = '';
  searchForm.name = '';
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
  form.code = '';
  form.name = '';
  form.symbol = '';
  form.sort = 0;
  form.status = true;
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function onEdit(row: CurrencyRow) {
  editingId.value = row.id;
  form.code = row.code;
  form.name = row.name;
  form.symbol = row.symbol;
  form.sort = row.sort;
  form.status = row.status;
  modalOpen.value = true;
}

function handleSave() {
  const code = form.code.trim().toUpperCase();
  const name = form.name.trim();
  if (!code) {
    message.warning('请输入货币代码');
    return;
  }
  if (!name) {
    message.warning('请输入货币名称');
    return;
  }
  saving.value = true;
  const payload = {
    code,
    name,
    symbol: form.symbol.trim(),
    sort: form.sort,
    status: form.status,
  };
  if (editingId.value === null) {
    createCurrency(payload);
    message.success('已新增（静态，未接后端）');
  } else {
    updateCurrency(editingId.value, payload);
    message.success('已保存（静态，未接后端）');
  }
  saving.value = false;
  modalOpen.value = false;
}

function onToggleStatus(row: CurrencyRow, checked: boolean | number | string) {
  row.status = Boolean(checked);
}
</script>

<template>
  <Page auto-content-height description="当前为静态预览，数据未接后端">
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="gap-y-3">
        <FormItem label="货币代码">
          <Input
            v-model:value="searchForm.code"
            allow-clear
            class="w-40"
            placeholder="如 USD"
          />
        </FormItem>
        <FormItem label="货币名称">
          <Input
            v-model:value="searchForm.name"
            allow-clear
            class="w-44"
            placeholder="请输入货币名称"
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
        :scroll="{ x: 900 }"
        row-key="id"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <Tooltip title="编辑">
              <Button
                size="small"
                type="link"
                @click="onEdit(record as CurrencyRow)"
              >
                <IconifyIcon class="size-4" icon="lucide:pencil" />
              </Button>
            </Tooltip>
          </template>
          <template v-else-if="column.key === 'status'">
            <Switch
              :checked="record.status"
              size="small"
              @change="
                (checked) => onToggleStatus(record as CurrencyRow, checked)
              "
            />
          </template>
        </template>
      </Table>
    </Card>

    <Modal
      v-model:open="modalOpen"
      :confirm-loading="saving"
      :title="modalTitle"
      destroy-on-close
      @ok="handleSave"
    >
      <Form class="mt-2" layout="vertical">
        <FormItem label="货币代码" required>
          <Input v-model:value="form.code" allow-clear placeholder="如 USD" />
        </FormItem>
        <FormItem label="货币名称" required>
          <Input
            v-model:value="form.name"
            allow-clear
            placeholder="请输入货币名称"
          />
        </FormItem>
        <FormItem label="符号">
          <Input v-model:value="form.symbol" allow-clear placeholder="如 $" />
        </FormItem>
        <FormItem label="排序">
          <InputNumber v-model:value="form.sort" :min="0" class="w-full" />
        </FormItem>
        <FormItem label="状态">
          <Switch v-model:checked="form.status" />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
