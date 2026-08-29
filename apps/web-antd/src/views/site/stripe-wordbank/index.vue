<script lang="ts" setup>
import type { StripeWordBankRow } from './shared';

import { computed, onMounted, reactive, ref } from 'vue';

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
  createStripeWordBank,
  deleteStripeWordBank,
  getStripeWordBankList,
  updateStripeWordBank,
} from '#/api/stripe-wordbank';

import { CONFIG_ITEM_OPTIONS } from './shared';

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
const list = ref<StripeWordBankRow[]>([]);

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

async function loadList() {
  loading.value = true;
  try {
    list.value = await getStripeWordBankList();
  } catch (error) {
    list.value = [];
    message.error(error instanceof Error ? error.message : '加载列表失败');
  } finally {
    loading.value = false;
  }
}

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
  const name = form.name.trim();
  if (!isEditing.value && !name) {
    message.warning('请输入名称');
    return false;
  }
  if (form.configItem === '目录') {
    if (name.startsWith('/')) {
      message.warning('目录类名称不能以 / 开头');
      return false;
    }
  } else if (!name.startsWith('/')) {
    message.warning('路径类名称需以 / 开头');
    return false;
  }
  return true;
}

async function handleSave() {
  if (!validateForm()) return;
  saving.value = true;
  try {
    if (editingId.value) {
      await updateStripeWordBank(editingId.value, {
        configItem: form.configItem,
      });
      message.success('已保存');
    } else {
      await createStripeWordBank({
        name: form.name.trim(),
        configItem: form.configItem,
      });
      message.success('已新增');
    }
    modalOpen.value = false;
    await loadList();
  } catch {
    // 错误提示由 request 拦截器处理
  } finally {
    saving.value = false;
  }
}

async function handleDelete(row: StripeWordBankRow) {
  try {
    await deleteStripeWordBank(row.id);
    selectedRowKeys.value = selectedRowKeys.value.filter((id) => id !== row.id);
    message.success('已删除');
    await loadList();
  } catch {
    // 错误提示由 request 拦截器处理
  }
}

function onSelectionChange(keys: (number | string)[]) {
  selectedRowKeys.value = keys.map(Number);
}

onMounted(() => {
  void loadList();
});
</script>

<template>
  <Page auto-content-height description="STRIPE 路径库">
    <Card :bordered="false">
      <div class="mb-4">
        <Space wrap>
          <Button :loading="loading" @click="loadList">
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
        :data-source="list"
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
