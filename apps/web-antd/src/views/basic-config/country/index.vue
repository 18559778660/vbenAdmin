<script lang="ts" setup>
import type { CountryApi } from '#/api/basic-config';

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
  Select,
  Space,
  Table,
  Tooltip,
} from 'ant-design-vue';

import {
  createCountry,
  deleteCountry,
  getCountryList,
  getCountryOptions,
  updateCountry,
} from '#/api/basic-config';

import { COUNTRY_SEARCH_OPTIONS } from '../shared';

defineOptions({ name: 'CountryList' });

const searchForm = reactive({
  field: '',
  keyword: '',
});

const form = reactive({
  code: '',
  cardBinRatio: 99 as number | undefined,
});

const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingId = ref<null | number>(null);
const list = ref<CountryApi.Country[]>([]);
const catalogOptions = ref<CountryApi.Option[]>([]);

const modalTitle = computed(() => (editingId.value ? '编辑国家' : '新增国家'));

const countryOptions = computed(() => {
  const used = new Set(list.value.map((item) => item.code));
  const current = editingId.value
    ? list.value.find((item) => item.id === editingId.value)?.code
    : '';
  return catalogOptions.value.filter(
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
  { title: '操作', key: 'actions', width: 108, fixed: 'left' as const },
  { title: '名称', dataIndex: 'name', key: 'name', width: 280 },
  { title: '2位CODE', dataIndex: 'code', key: 'code', width: 120 },
  { title: '大卡头占比', key: 'cardBinRatio', width: 140 },
  { title: '操作时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
  { title: '操作人', dataIndex: 'updatedBy', key: 'updatedBy', width: 120 },
];

function buildQuery(): CountryApi.ListParams {
  const params: CountryApi.ListParams = {};
  if (searchForm.field) {
    params.field = searchForm.field;
  }
  if (searchForm.keyword.trim()) {
    params.keyword = searchForm.keyword.trim();
  }
  return params;
}

async function loadOptions() {
  catalogOptions.value = await getCountryOptions();
}

async function loadList() {
  loading.value = true;
  try {
    list.value = await getCountryList(buildQuery());
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  void loadList();
}

function resetSearch() {
  searchForm.field = '';
  searchForm.keyword = '';
  void loadList();
}

function handleRefresh() {
  void loadList();
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

function onEdit(row: CountryApi.Country) {
  editingId.value = row.id;
  form.code = row.code;
  form.cardBinRatio = row.cardBinRatio;
  modalOpen.value = true;
}

function onDelete(row: CountryApi.Country) {
  Modal.confirm({
    title: '删除国家',
    content: `确定删除国家「${row.name}（${row.code}）」吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      await deleteCountry(row.id);
      message.success('已删除');
      await loadList();
    },
  });
}

async function handleSave() {
  if (!form.code) {
    message.warning('请选择国家');
    return;
  }
  if (
    form.cardBinRatio === undefined ||
    form.cardBinRatio < 0 ||
    form.cardBinRatio > 100
  ) {
    message.warning('请输入有效的大卡头占比');
    return;
  }
  saving.value = true;
  try {
    const payload = {
      code: form.code,
      cardBinRatio: form.cardBinRatio,
    };
    if (editingId.value === null) {
      await createCountry(payload);
      message.success('新增成功');
    } else {
      await updateCountry(editingId.value, payload);
      message.success('保存成功');
    }
    modalOpen.value = false;
    await loadList();
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  void Promise.all([loadList(), loadOptions()]);
});
</script>

<template>
  <Page
    auto-content-height
    description="从标准国家列表新增，名称和 2 位 CODE 自动带出"
  >
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
        :scroll="{ x: 1000 }"
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
                  @click="onEdit(record as CountryApi.Country)"
                >
                  <IconifyIcon class="size-4" icon="lucide:pencil" />
                </Button>
              </Tooltip>
              <Tooltip title="删除">
                <Button
                  danger
                  size="small"
                  type="link"
                  @click="onDelete(record as CountryApi.Country)"
                >
                  <IconifyIcon class="size-4" icon="lucide:trash-2" />
                </Button>
              </Tooltip>
            </Space>
          </template>
          <template v-else-if="column.key === 'cardBinRatio'">
            <Button type="link" @click="onEdit(record as CountryApi.Country)">
              {{ Number(record.cardBinRatio).toFixed(2) }}
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
