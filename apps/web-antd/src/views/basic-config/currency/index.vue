<script lang="ts" setup>
import type { CurrencyApi } from '#/api/basic-config';

import { computed, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  Alert,
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
  deleteCurrency,
  getCurrencyList,
  getCurrencyOptions,
  updateCurrency,
} from '#/api/basic-config';

import { CURRENCY_SEARCH_OPTIONS } from '../shared';

defineOptions({ name: 'CurrencyList' });

const searchForm = reactive({
  field: '',
  keyword: '',
});

const form = reactive({
  code: '',
  rate: 1 as number | undefined,
});

const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingId = ref<null | number>(null);
const list = ref<CurrencyApi.Currency[]>([]);
const catalogOptions = ref<CurrencyApi.Option[]>([]);

const modalTitle = computed(() => (editingId.value ? '编辑货币' : '新增货币'));

const currencyOptions = computed(() => {
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
  { title: '名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: 'CODE', dataIndex: 'code', key: 'code', width: 100 },
  { title: '汇率', key: 'rate', width: 140 },
  { title: '操作时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
  { title: '操作人', dataIndex: 'updatedBy', key: 'updatedBy', width: 120 },
];

function buildQuery(): CurrencyApi.ListParams {
  const params: CurrencyApi.ListParams = {};
  if (searchForm.field) {
    params.field = searchForm.field;
  }
  if (searchForm.keyword.trim()) {
    params.keyword = searchForm.keyword.trim();
  }
  return params;
}

async function loadOptions() {
  catalogOptions.value = await getCurrencyOptions();
}

async function loadList() {
  loading.value = true;
  try {
    list.value = await getCurrencyList(buildQuery());
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
  form.rate = 1;
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function onEdit(row: CurrencyApi.Currency) {
  editingId.value = row.id;
  form.code = row.code;
  form.rate = row.rate;
  modalOpen.value = true;
}

function onDelete(row: CurrencyApi.Currency) {
  Modal.confirm({
    title: '删除货币',
    content: `确定删除货币「${row.name}（${row.code}）」吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      await deleteCurrency(row.id);
      message.success('已删除');
      await loadList();
    },
  });
}

async function handleSave() {
  if (!form.code) {
    message.warning('请选择货币');
    return;
  }
  if (form.rate === undefined || form.rate < 0) {
    message.warning('请输入有效汇率');
    return;
  }
  saving.value = true;
  try {
    const payload = {
      code: form.code,
      rate: form.rate,
    };
    if (editingId.value === null) {
      await createCurrency(payload);
      message.success('新增成功');
    } else {
      await updateCurrency(editingId.value, payload);
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
    description="从标准货币列表新增，名称和 CODE 自动带出"
  >
    <Alert
      class="mb-4"
      show-icon
      type="info"
      message="汇率说明"
      description="以美元（USD）为基准币，USD 汇率请保持为 1（一比一）。其他货币的汇率表示「1 美元可兑换多少该币种」，例如 CNY=7.12 表示 1 USD ≈ 7.12 CNY。订单汇总「收款金额(USD)」会按此汇率折算；缺失或无效汇率时按 1:1 兜底。"
    />

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
            <Space>
              <Tooltip title="编辑">
                <Button
                  size="small"
                  type="link"
                  @click="onEdit(record as CurrencyApi.Currency)"
                >
                  <IconifyIcon class="size-4" icon="lucide:pencil" />
                </Button>
              </Tooltip>
              <Tooltip title="删除">
                <Button
                  danger
                  size="small"
                  type="link"
                  @click="onDelete(record as CurrencyApi.Currency)"
                >
                  <IconifyIcon class="size-4" icon="lucide:trash-2" />
                </Button>
              </Tooltip>
            </Space>
          </template>
          <template v-else-if="column.key === 'rate'">
            <Button type="link" @click="onEdit(record as CurrencyApi.Currency)">
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
          <div class="text-muted-foreground mt-1 text-xs">
            含义：1 美元可兑换多少该币种。USD 请填 1；如 CNY 填 7.12。
          </div>
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
