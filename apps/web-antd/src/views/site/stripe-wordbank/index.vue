<script lang="ts" setup>
import type { StripeWordBankRow } from './shared';

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
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
} from 'ant-design-vue';

import {
  CONFIG_ITEM_OPTIONS,
  mockStripeWordBankList,
  nextWordBankIdValue,
} from './shared';

defineOptions({ name: 'StripeWordBank' });

const form = reactive({
  name: '',
  configItem: 'webhook链接',
});

const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingId = ref<null | number>(null);
const selectedRowKeys = ref<number[]>([]);

const modalTitle = computed(() => (editingId.value ? '编辑' : '新增'));
const isEditing = computed(() => editingId.value !== null);

const columns = [
  {
    title: '操作',
    key: 'actions',
    width: 90,
    fixed: 'left' as const,
  },
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    sorter: (a: StripeWordBankRow, b: StripeWordBankRow) =>
      a.name.localeCompare(b.name),
    width: 180,
  },
  {
    title: '使用次数',
    dataIndex: 'usageCount',
    key: 'usageCount',
    sorter: (a: StripeWordBankRow, b: StripeWordBankRow) =>
      a.usageCount - b.usageCount,
    width: 110,
  },
  {
    title: '配置项',
    dataIndex: 'configItem',
    key: 'configItem',
    filters: CONFIG_ITEM_OPTIONS.map((item) => ({
      text: item.label,
      value: item.value,
    })),
    onFilter: (value: boolean | number | string, record: StripeWordBankRow) =>
      record.configItem === value,
    width: 140,
  },
];

function resetForm() {
  form.name = '';
  form.configItem = 'webhook链接';
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function openEdit(row: StripeWordBankRow) {
  editingId.value = row.id;
  form.name = row.name;
  form.configItem = row.configItem;
  modalOpen.value = true;
}

function validateForm() {
  if (isEditing.value) {
    return true;
  }
  if (!form.name.trim()) {
    message.warning('请输入名称');
    return false;
  }
  if (!form.name.trim().startsWith('/')) {
    message.warning('名称建议以 / 开头');
    return false;
  }
  return true;
}

function handleSave() {
  if (!validateForm()) return;
  saving.value = true;
  if (editingId.value) {
    const row = mockStripeWordBankList.value.find(
      (item) => item.id === editingId.value,
    );
    if (row) {
      row.configItem = form.configItem;
    }
    message.success('已保存（静态，未接后端）');
  } else {
    mockStripeWordBankList.value.unshift({
      id: nextWordBankIdValue(),
      name: form.name.trim(),
      usageCount: 0,
      configItem: form.configItem,
    });
    message.success('已新增（静态，未接后端）');
  }
  saving.value = false;
  modalOpen.value = false;
}

function handleDelete(row: StripeWordBankRow) {
  mockStripeWordBankList.value = mockStripeWordBankList.value.filter(
    (item) => item.id !== row.id,
  );
  selectedRowKeys.value = selectedRowKeys.value.filter((id) => id !== row.id);
  message.success('已删除（静态，未接后端）');
}

function handleRefresh() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
    message.success('已刷新（静态数据）');
  }, 300);
}

function onSelectionChange(keys: (number | string)[]) {
  selectedRowKeys.value = keys.map(Number);
}
</script>

<template>
  <Page auto-content-height description="STRIPE 路径库 · 当前为静态预览">
    <Card :bordered="false">
      <div class="mb-4">
        <Space wrap>
          <Button @click="handleRefresh">
            <template #icon>
              <IconifyIcon icon="lucide:rotate-cw" />
            </template>
            刷新
          </Button>
          <Button type="primary" @click="openCreate">
            <template #icon>
              <IconifyIcon icon="lucide:plus" />
            </template>
            新增
          </Button>
        </Space>
      </div>

      <Table
        :columns="columns"
        :data-source="mockStripeWordBankList"
        :loading="loading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :row-selection="{
          selectedRowKeys,
          onChange: onSelectionChange,
        }"
        :scroll="{ x: 700 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <Space :size="0">
              <Tooltip title="编辑">
                <Button
                  size="small"
                  type="link"
                  @click="openEdit(record as StripeWordBankRow)"
                >
                  <IconifyIcon class="size-4" icon="lucide:pencil" />
                </Button>
              </Tooltip>
              <Popconfirm
                title="确认删除该路径？"
                @confirm="handleDelete(record as StripeWordBankRow)"
              >
                <Tooltip title="删除">
                  <Button danger size="small" type="link">
                    <IconifyIcon class="size-4" icon="lucide:x" />
                  </Button>
                </Tooltip>
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <Modal
      v-model:open="modalOpen"
      :footer="null"
      destroy-on-close
      :title="modalTitle"
      width="480px"
    >
      <Form layout="vertical" class="pt-2">
        <FormItem label="名称" required>
          <Input
            v-if="!isEditing"
            v-model:value="form.name"
            placeholder="请输入路径，如 /hook"
          />
          <div v-else>{{ form.name }}</div>
        </FormItem>
        <FormItem label="配置项" required>
          <Select
            v-model:value="form.configItem"
            :options="CONFIG_ITEM_OPTIONS"
            placeholder="请选择配置项"
          />
        </FormItem>
        <FormItem>
          <Space>
            <Button :loading="saving" type="primary" @click="handleSave">
              提交
            </Button>
            <Button @click="modalOpen = false">关闭</Button>
          </Space>
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
