<script lang="ts" setup>
import type { CountryRow } from '../shared';

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
  COUNTRY_SEARCH_OPTIONS,
  countryNameByCode,
  countrySelectOptions,
  createCountry,
  mockCountryList,
  updateCountry,
} from '../shared';

defineOptions({ name: 'CountryList' });

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
  cardBinRatio: 99,
});

const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingId = ref<null | number>(null);

const modalTitle = computed(() => (editingId.value ? '查看国家' : '新增国家'));
const allCountryOptions = countrySelectOptions();

const countryOptions = computed(() => {
  const used = new Set(mockCountryList.value.map((item) => item.code));
  const current = editingId.value
    ? mockCountryList.value.find((item) => item.id === editingId.value)?.code
    : '';
  return allCountryOptions.filter(
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
  { title: '名称', dataIndex: 'name', key: 'name', width: 280 },
  { title: '2位CODE', dataIndex: 'code', key: 'code', width: 120 },
  { title: '大卡头占比', key: 'cardBinRatio', width: 140 },
];

const list = computed(() => {
  const keyword = applied.keyword.toLowerCase();
  if (!keyword) {
    return mockCountryList.value;
  }
  return mockCountryList.value.filter((row) => {
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
  form.cardBinRatio = 99;
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function onView(row: CountryRow) {
  editingId.value = row.id;
  form.code = row.code;
  form.cardBinRatio = row.cardBinRatio;
  modalOpen.value = true;
}

function handleSave() {
  if (!form.code) {
    message.warning('请选择国家');
    return;
  }
  if (
    form.cardBinRatio === null ||
    form.cardBinRatio === undefined ||
    form.cardBinRatio < 0
  ) {
    message.warning('请输入有效的大卡头占比');
    return;
  }
  saving.value = true;
  const payload = {
    code: form.code,
    name: countryNameByCode(form.code),
    cardBinRatio: form.cardBinRatio,
  };
  if (editingId.value === null) {
    createCountry(payload);
    message.success('已新增（静态，未接后端）');
  } else {
    updateCountry(editingId.value, payload);
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
            :options="COUNTRY_SEARCH_OPTIONS"
            class="w-32"
          />
        </FormItem>
        <FormItem>
          <Input
            v-model:value="searchForm.keyword"
            allow-clear
            class="w-56"
            placeholder="请输入名称/2位CODE"
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
        :scroll="{ x: 800 }"
        row-key="id"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <Tooltip title="查看">
              <Button
                size="small"
                type="link"
                @click="onView(record as CountryRow)"
              >
                <IconifyIcon class="size-4" icon="lucide:eye" />
              </Button>
            </Tooltip>
          </template>
          <template v-else-if="column.key === 'cardBinRatio'">
            {{ Number(record.cardBinRatio).toFixed(2) }}
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
        <FormItem label="国家" required>
          <Select
            v-model:value="form.code"
            :disabled="editingId !== null"
            :options="countryOptions"
            option-filter-prop="label"
            placeholder="请选择国家"
            show-search
          />
          <div class="text-muted-foreground mt-1 text-xs">
            从标准国家列表选择，名称和 2 位 CODE 会自动带出
          </div>
        </FormItem>
        <FormItem label="大卡头占比" required>
          <InputNumber
            v-model:value="form.cardBinRatio"
            :max="100"
            :min="0"
            :precision="2"
            class="w-full"
            placeholder="请输入大卡头占比"
          />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
