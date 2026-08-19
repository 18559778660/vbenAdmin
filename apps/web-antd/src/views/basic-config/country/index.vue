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
  message,
  Modal,
  Space,
  Switch,
  Table,
  Tooltip,
} from 'ant-design-vue';

import { createCountry, mockCountryList, updateCountry } from '../shared';

defineOptions({ name: 'CountryList' });

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
  nameEn: '',
  status: true,
});

const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingId = ref<null | number>(null);

const modalTitle = computed(() => (editingId.value ? '编辑国家' : '新增国家'));

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    fixed: 'left' as const,
  },
  { title: '操作', key: 'actions', width: 80, fixed: 'left' as const },
  { title: '国家代码', dataIndex: 'code', key: 'code', width: 120 },
  { title: '中文名', dataIndex: 'name', key: 'name', width: 160 },
  { title: '英文名', dataIndex: 'nameEn', key: 'nameEn', width: 200 },
  { title: '状态', key: 'status', width: 90 },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
];

const list = computed(() => {
  return mockCountryList.value.filter((row) => {
    if (
      applied.code &&
      !row.code.toLowerCase().includes(applied.code.toLowerCase())
    ) {
      return false;
    }
    if (
      applied.name &&
      !row.name.includes(applied.name) &&
      !row.nameEn.toLowerCase().includes(applied.name.toLowerCase())
    ) {
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
  form.nameEn = '';
  form.status = true;
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function onEdit(row: CountryRow) {
  editingId.value = row.id;
  form.code = row.code;
  form.name = row.name;
  form.nameEn = row.nameEn;
  form.status = row.status;
  modalOpen.value = true;
}

function handleSave() {
  const code = form.code.trim().toUpperCase();
  const name = form.name.trim();
  if (!code) {
    message.warning('请输入国家代码');
    return;
  }
  if (!name) {
    message.warning('请输入中文名');
    return;
  }
  saving.value = true;
  const payload = {
    code,
    name,
    nameEn: form.nameEn.trim(),
    status: form.status,
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

function onToggleStatus(row: CountryRow, checked: boolean | number | string) {
  row.status = Boolean(checked);
}
</script>

<template>
  <Page auto-content-height description="当前为静态预览，数据未接后端">
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="gap-y-3">
        <FormItem label="国家代码">
          <Input
            v-model:value="searchForm.code"
            allow-clear
            class="w-40"
            placeholder="如 US"
          />
        </FormItem>
        <FormItem label="名称">
          <Input
            v-model:value="searchForm.name"
            allow-clear
            class="w-44"
            placeholder="中文名或英文名"
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
                @click="onEdit(record as CountryRow)"
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
                (checked) => onToggleStatus(record as CountryRow, checked)
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
        <FormItem label="国家代码" required>
          <Input v-model:value="form.code" allow-clear placeholder="如 US" />
        </FormItem>
        <FormItem label="中文名" required>
          <Input
            v-model:value="form.name"
            allow-clear
            placeholder="请输入中文名"
          />
        </FormItem>
        <FormItem label="英文名">
          <Input
            v-model:value="form.nameEn"
            allow-clear
            placeholder="请输入英文名"
          />
        </FormItem>
        <FormItem label="状态">
          <Switch v-model:checked="form.status" />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
