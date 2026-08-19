<script lang="ts" setup>
import type { CardBinRow } from '../shared';

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
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
} from 'ant-design-vue';

import {
  CARD_BRAND_LABELS,
  CARD_TYPE_LABELS,
  COUNTRY_OPTIONS,
  countryLabel,
  createCardBin,
  mockCardBinList,
  toOptions,
  updateCardBin,
} from '../shared';

defineOptions({ name: 'CardBinVerify' });

const searchForm = reactive({
  bin: '',
  brand: '',
});

const applied = reactive({
  bin: '',
  brand: '',
});

const form = reactive({
  bin: '',
  brand: 'visa',
  cardType: 'credit',
  bank: '',
  country: 'US',
  status: true,
});

const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingId = ref<null | number>(null);

const modalTitle = computed(() => (editingId.value ? '编辑卡头' : '新增卡头'));

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    fixed: 'left' as const,
  },
  { title: '操作', key: 'actions', width: 80, fixed: 'left' as const },
  { title: '卡头', dataIndex: 'bin', key: 'bin', width: 120 },
  { title: '卡组织', key: 'brand', width: 140 },
  { title: '卡类型', key: 'cardType', width: 120 },
  { title: '发卡行', dataIndex: 'bank', key: 'bank', width: 160 },
  { title: '国家', key: 'country', width: 120 },
  { title: '状态', key: 'status', width: 90 },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
];

const brandFilterOptions = [
  { label: '全部', value: '' },
  ...toOptions(CARD_BRAND_LABELS),
];

const list = computed(() => {
  return mockCardBinList.value.filter((row) => {
    if (applied.bin && !row.bin.includes(applied.bin)) {
      return false;
    }
    if (applied.brand && row.brand !== applied.brand) {
      return false;
    }
    return true;
  });
});

function handleSearch() {
  applied.bin = searchForm.bin.trim();
  applied.brand = searchForm.brand;
}

function resetSearch() {
  searchForm.bin = '';
  searchForm.brand = '';
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
  form.bin = '';
  form.brand = 'visa';
  form.cardType = 'credit';
  form.bank = '';
  form.country = 'US';
  form.status = true;
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function onEdit(row: CardBinRow) {
  editingId.value = row.id;
  form.bin = row.bin;
  form.brand = row.brand;
  form.cardType = row.cardType;
  form.bank = row.bank;
  form.country = row.country;
  form.status = row.status;
  modalOpen.value = true;
}

function handleSave() {
  const bin = form.bin.trim();
  if (!bin) {
    message.warning('请输入卡头');
    return;
  }
  saving.value = true;
  const payload = {
    bin,
    brand: form.brand,
    cardType: form.cardType,
    bank: form.bank.trim(),
    country: form.country,
    status: form.status,
  };
  if (editingId.value === null) {
    createCardBin(payload);
    message.success('已新增（静态，未接后端）');
  } else {
    updateCardBin(editingId.value, payload);
    message.success('已保存（静态，未接后端）');
  }
  saving.value = false;
  modalOpen.value = false;
}

function onToggleStatus(row: CardBinRow, checked: boolean | number | string) {
  row.status = Boolean(checked);
}
</script>

<template>
  <Page auto-content-height description="当前为静态预览，数据未接后端">
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="gap-y-3">
        <FormItem label="卡头">
          <Input
            v-model:value="searchForm.bin"
            allow-clear
            class="w-44"
            placeholder="请输入卡头"
          />
        </FormItem>
        <FormItem label="卡组织">
          <Select
            v-model:value="searchForm.brand"
            :options="brandFilterOptions"
            class="w-40"
            placeholder="卡组织"
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
        :scroll="{ x: 1100 }"
        row-key="id"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <Tooltip title="编辑">
              <Button
                size="small"
                type="link"
                @click="onEdit(record as CardBinRow)"
              >
                <IconifyIcon class="size-4" icon="lucide:pencil" />
              </Button>
            </Tooltip>
          </template>
          <template v-else-if="column.key === 'brand'">
            {{ CARD_BRAND_LABELS[record.brand] || record.brand }}
          </template>
          <template v-else-if="column.key === 'cardType'">
            {{ CARD_TYPE_LABELS[record.cardType] || record.cardType }}
          </template>
          <template v-else-if="column.key === 'country'">
            {{ countryLabel(record.country) }}
          </template>
          <template v-else-if="column.key === 'status'">
            <Switch
              :checked="record.status"
              size="small"
              @change="
                (checked) => onToggleStatus(record as CardBinRow, checked)
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
        <FormItem label="卡头" required>
          <Input
            v-model:value="form.bin"
            allow-clear
            placeholder="请输入卡头，如 411111"
          />
        </FormItem>
        <FormItem label="卡组织">
          <Select
            v-model:value="form.brand"
            :options="toOptions(CARD_BRAND_LABELS)"
            placeholder="请选择卡组织"
          />
        </FormItem>
        <FormItem label="卡类型">
          <Select
            v-model:value="form.cardType"
            :options="toOptions(CARD_TYPE_LABELS)"
            placeholder="请选择卡类型"
          />
        </FormItem>
        <FormItem label="发卡行">
          <Input
            v-model:value="form.bank"
            allow-clear
            placeholder="请输入发卡行"
          />
        </FormItem>
        <FormItem label="国家">
          <Select
            v-model:value="form.country"
            :options="COUNTRY_OPTIONS"
            option-filter-prop="label"
            placeholder="请选择国家"
            show-search
          />
        </FormItem>
        <FormItem label="状态">
          <Switch v-model:checked="form.status" />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
