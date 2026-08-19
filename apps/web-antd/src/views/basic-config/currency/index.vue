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
  Select,
  Space,
  Table,
  Tooltip,
} from 'ant-design-vue';

import {
  createCurrency,
  CURRENCY_SEARCH_OPTIONS,
  currencyNameByCode,
  currencySelectOptions,
  mockCurrencyList,
  updateCurrency,
} from '../shared';

defineOptions({ name: 'CurrencyList' });

const searchForm = reactive({
  field: '',
  keyword: '',
});

const applied = reactive({
  field: '',
  keyword: '',
});

const form = reactive({
  code: '',
  rate: 1,
});

const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingId = ref<null | number>(null);

const modalTitle = computed(() => (editingId.value ? '编辑货币' : '新增货币'));
const allCurrencyOptions = currencySelectOptions();

const currencyOptions = computed(() => {
  const used = new Set(mockCurrencyList.value.map((item) => item.code));
  const current = editingId.value
    ? mockCurrencyList.value.find((item) => item.id === editingId.value)?.code
    : '';
  return allCurrencyOptions.filter(
    (item) => !used.has(item.value) || item.value === current,
  );
});

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    fixed: 'left' as const,
  },
  { title: '操作', key: 'actions', width: 80, fixed: 'left' as const },
  { title: '名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: 'CODE', dataIndex: 'code', key: 'code', width: 100 },
  { title: '汇率', key: 'rate', width: 140 },
  { title: '操作时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
  { title: '操作人', dataIndex: 'updatedBy', key: 'updatedBy', width: 120 },
];

const list = computed(() => {
  const keyword = applied.keyword.toLowerCase();
  if (!keyword) {
    return mockCurrencyList.value;
  }
  return mockCurrencyList.value.filter((row) => {
    const matchCode = row.code.toLowerCase().includes(keyword);
    const matchName = row.name.toLowerCase().includes(keyword);
    if (applied.field === 'code') {
      return matchCode;
    }
    if (applied.field === 'name') {
      return matchName;
    }
    return matchCode || matchName;
  });
});

function handleSearch() {
  applied.field = searchForm.field;
  applied.keyword = searchForm.keyword.trim();
}

function resetSearch() {
  searchForm.field = '';
  searchForm.keyword = '';
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
  form.rate = 1;
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function onEdit(row: CurrencyRow) {
  editingId.value = row.id;
  form.code = row.code;
  form.rate = row.rate;
  modalOpen.value = true;
}

function handleSave() {
  if (!form.code) {
    message.warning('请选择货币');
    return;
  }
  if (form.rate === null || form.rate === undefined || form.rate < 0) {
    message.warning('请输入有效汇率');
    return;
  }
  saving.value = true;
  const payload = {
    code: form.code,
    name: currencyNameByCode(form.code),
    rate: form.rate,
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
</script>

<template>
  <Page auto-content-height description="当前为静态预览，数据未接后端">
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="gap-y-3">
        <FormItem label="筛选">
          <Select
            v-model:value="searchForm.field"
            :options="CURRENCY_SEARCH_OPTIONS"
            class="w-28"
          />
        </FormItem>
        <FormItem>
          <Input
            v-model:value="searchForm.keyword"
            allow-clear
            class="w-52"
            placeholder="请输入名称/CODE"
            @press-enter="handleSearch"
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
          <template v-else-if="column.key === 'rate'">
            <Button type="link" @click="onEdit(record as CurrencyRow)">
              {{ record.rate }}
            </Button>
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
        <FormItem label="货币" required>
          <Select
            v-model:value="form.code"
            :disabled="editingId !== null"
            :options="currencyOptions"
            option-filter-prop="label"
            placeholder="请选择货币"
            show-search
          />
          <div class="text-muted-foreground mt-1 text-xs">
            从标准货币列表选择，名称和 CODE 会自动带出
          </div>
        </FormItem>
        <FormItem label="汇率" required>
          <InputNumber
            v-model:value="form.rate"
            :min="0"
            :precision="4"
            class="w-full"
            placeholder="请输入汇率"
          />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
