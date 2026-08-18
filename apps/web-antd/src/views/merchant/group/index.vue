<script lang="ts" setup>
import type { MerchantApi, MerchantGroupApi } from '#/api/merchant';

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
  Tag,
  Tooltip,
} from 'ant-design-vue';

import {
  createMerchantGroup,
  deleteMerchantGroup,
  getMerchantGroupList,
  getMerchantOptions,
  updateMerchantGroup,
} from '#/api/merchant';

defineOptions({ name: 'MerchantGroup' });

const searchForm = reactive({
  id: undefined as number | undefined,
  name: '',
});

const form = reactive({
  name: '',
  merchantIds: [] as number[],
});

const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingId = ref<null | number>(null);
const list = ref<MerchantGroupApi.Group[]>([]);
const merchantOptions = ref<{ label: string; value: number }[]>([]);

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    fixed: 'left' as const,
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'left' as const,
  },
  { title: '分组名', dataIndex: 'name', key: 'name', width: 160 },
  { title: '商户列表', key: 'merchants', width: 280 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '创建人', dataIndex: 'createdBy', key: 'createdBy', width: 120 },
  { title: '操作时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
  { title: '操作人', dataIndex: 'updatedBy', key: 'updatedBy', width: 120 },
];

const modalTitle = computed(() => (editingId.value ? '编辑分组' : '新增分组'));

function buildQuery(): MerchantGroupApi.ListParams {
  const params: MerchantGroupApi.ListParams = {};
  if (searchForm.id !== undefined) {
    params.id = searchForm.id;
  }
  if (searchForm.name.trim()) {
    params.name = searchForm.name.trim();
  }
  return params;
}

async function loadList() {
  loading.value = true;
  try {
    list.value = await getMerchantGroupList(buildQuery());
  } finally {
    loading.value = false;
  }
}

async function loadMerchantOptions() {
  const opts = await getMerchantOptions();
  merchantOptions.value = opts.map((item: MerchantApi.MerchantOption) => ({
    label: `${item.name}（${item.account}）`,
    value: item.id,
  }));
}

function handleSearch() {
  void loadList();
}

function resetSearch() {
  searchForm.id = undefined;
  searchForm.name = '';
  void loadList();
}

function handleRefresh() {
  void Promise.all([loadList(), loadMerchantOptions()]);
}

function resetForm() {
  form.name = '';
  form.merchantIds = [];
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function onEdit(row: MerchantGroupApi.Group) {
  editingId.value = row.id;
  form.name = row.name;
  form.merchantIds = (row.merchants || []).map((item) => item.id);
  modalOpen.value = true;
}

async function handleSave() {
  const name = form.name.trim();
  if (!name) {
    message.warning('请输入分组名');
    return;
  }
  saving.value = true;
  try {
    const payload = {
      name,
      merchantIds: form.merchantIds,
    };
    if (editingId.value === null) {
      await createMerchantGroup(payload);
      message.success('新增成功');
    } else {
      await updateMerchantGroup(editingId.value, payload);
      message.success('保存成功');
    }
    modalOpen.value = false;
    await loadList();
  } finally {
    saving.value = false;
  }
}

function onDelete(row: MerchantGroupApi.Group) {
  Modal.confirm({
    title: '删除分组',
    content: `确定删除分组「${row.name}」吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      await deleteMerchantGroup(row.id);
      message.success('已删除');
      await loadList();
    },
  });
}

onMounted(async () => {
  await Promise.all([loadList(), loadMerchantOptions()]);
});
</script>

<template>
  <Page auto-content-height description="把商户归到分组里，方便后续统一管理">
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="gap-y-3">
        <FormItem label="ID">
          <InputNumber
            v-model:value="searchForm.id"
            :controls="false"
            :min="1"
            allow-clear
            class="w-40"
            placeholder="请输入ID"
          />
        </FormItem>
        <FormItem label="标题">
          <Input
            v-model:value="searchForm.name"
            allow-clear
            class="w-44"
            placeholder="请输入分组名"
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
        :scroll="{ x: 1200 }"
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
                  @click="onEdit(record as MerchantGroupApi.Group)"
                >
                  <IconifyIcon class="size-4" icon="lucide:pencil" />
                </Button>
              </Tooltip>
              <Tooltip title="删除">
                <Button
                  danger
                  size="small"
                  type="link"
                  @click="onDelete(record as MerchantGroupApi.Group)"
                >
                  <IconifyIcon class="size-4" icon="lucide:trash-2" />
                </Button>
              </Tooltip>
            </Space>
          </template>
          <template v-else-if="column.key === 'merchants'">
            <div
              v-if="(record as MerchantGroupApi.Group).merchants?.length"
              class="flex flex-wrap gap-1"
            >
              <Tag
                v-for="item in (record as MerchantGroupApi.Group).merchants"
                :key="item.id"
              >
                {{ item.name }}
              </Tag>
            </div>
            <span v-else class="text-muted-foreground">-</span>
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
      <Form layout="vertical" class="mt-4">
        <FormItem label="分组名" required>
          <Input
            v-model:value="form.name"
            allow-clear
            :maxlength="64"
            placeholder="请输入分组名"
          />
        </FormItem>
        <FormItem label="商户">
          <Select
            v-model:value="form.merchantIds"
            :options="merchantOptions"
            allow-clear
            mode="multiple"
            option-filter-prop="label"
            placeholder="请选择商户"
            show-search
          />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
