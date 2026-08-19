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
  Table,
  Tag,
  Tooltip,
} from 'ant-design-vue';

import {
  CARD_BIN_SEARCH_OPTIONS,
  CARD_LENGTH_OPTIONS,
  CARD_NAME_OPTIONS,
  createCardBin,
  emptyBinPrefix,
  formatBinPrefix,
  mockCardBinList,
  prefixToRegex,
  updateCardBin,
} from '../shared';

defineOptions({ name: 'CardBinVerify' });

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
  name: '',
  lengths: [] as number[],
  prefixes: [emptyBinPrefix()],
});

const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingId = ref<null | number>(null);

const modalTitle = computed(() =>
  editingId.value ? '编辑卡类型' : '新增卡类型',
);

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    fixed: 'left' as const,
  },
  { title: '操作', key: 'actions', width: 80, fixed: 'left' as const },
  { title: '缩写', dataIndex: 'code', key: 'code', width: 90 },
  { title: '名称', dataIndex: 'name', key: 'name', width: 240 },
  { title: '长度', key: 'lengths', width: 200 },
  { title: '验证规则', key: 'prefixes', width: 360 },
  { title: '添加时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '添加人', dataIndex: 'createdBy', key: 'createdBy', width: 120 },
  { title: '操作时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
  { title: '操作人', dataIndex: 'updatedBy', key: 'updatedBy', width: 120 },
];

const list = computed(() => {
  const keyword = applied.keyword.toLowerCase();
  if (!keyword) {
    return mockCardBinList.value;
  }
  return mockCardBinList.value.filter((row) => {
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
  form.name = '';
  form.lengths = [];
  form.prefixes = [emptyBinPrefix()];
}

function openCreate() {
  editingId.value = null;
  resetForm();
  modalOpen.value = true;
}

function onEdit(row: CardBinRow) {
  editingId.value = row.id;
  form.code = row.code;
  form.name = row.name;
  form.lengths = [...row.lengths];
  form.prefixes =
    row.prefixes.length > 0
      ? row.prefixes.map((item) => ({ ...item }))
      : [emptyBinPrefix()];
  modalOpen.value = true;
}

function addPrefix() {
  form.prefixes.push(emptyBinPrefix());
}

function removePrefix(index: number) {
  if (form.prefixes.length === 1) {
    form.prefixes[0] = emptyBinPrefix();
    return;
  }
  form.prefixes.splice(index, 1);
}

function handleSave() {
  const code = form.code.trim().toUpperCase();
  const name = form.name.trim();
  if (!code) {
    message.warning('请输入缩写');
    return;
  }
  if (!name) {
    message.warning('请选择名称');
    return;
  }

  const prefixes = [];
  for (const item of form.prefixes) {
    const start = item.start.trim();
    const end = item.end.trim();
    if (!start && !end) {
      continue;
    }
    if (!/^\d+$/.test(start)) {
      message.warning('卡头只填数字，例如 62');
      return;
    }
    if (end) {
      if (!/^\d+$/.test(end)) {
        message.warning('结束卡头只填数字');
        return;
      }
      if (end.length !== start.length) {
        message.warning('起始和结束卡头位数要一致，例如 60 至 63');
        return;
      }
      if (Number(end) < Number(start)) {
        message.warning('结束卡头不能小于起始卡头');
        return;
      }
    }
    prefixes.push({ start, end });
  }
  if (prefixes.length === 0) {
    message.warning('请至少添加一条卡头规则');
    return;
  }

  saving.value = true;
  const payload = {
    code,
    name,
    lengths: [...form.lengths].toSorted((a, b) => a - b),
    prefixes,
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
</script>

<template>
  <Page auto-content-height description="当前为静态预览，数据未接后端">
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="gap-y-3">
        <FormItem label="筛选">
          <Select
            v-model:value="searchForm.field"
            :options="CARD_BIN_SEARCH_OPTIONS"
            class="w-28"
          />
        </FormItem>
        <FormItem>
          <Input
            v-model:value="searchForm.keyword"
            allow-clear
            class="w-52"
            placeholder="请输入名称/缩写"
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
        :scroll="{ x: 1600 }"
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
          <template v-else-if="column.key === 'lengths'">
            <div class="flex flex-wrap gap-1">
              <Tag v-for="item in record.lengths" :key="item">{{ item }}</Tag>
            </div>
          </template>
          <template v-else-if="column.key === 'prefixes'">
            <div class="flex flex-wrap gap-1">
              <Tooltip
                v-for="item in record.prefixes"
                :key="formatBinPrefix(item)"
                :title="`卡头 ${formatBinPrefix(item)}`"
              >
                <Tag>{{ prefixToRegex(item) }}</Tag>
              </Tooltip>
            </div>
          </template>
        </template>
      </Table>
    </Card>

    <Modal
      v-model:open="modalOpen"
      :confirm-loading="saving"
      :title="modalTitle"
      destroy-on-close
      width="640px"
      @ok="handleSave"
    >
      <Form class="mt-2" layout="vertical">
        <FormItem label="缩写" required>
          <Input
            v-model:value="form.code"
            allow-clear
            placeholder="如 UP、AE、JCB"
          />
        </FormItem>
        <FormItem label="名称" required>
          <Select
            v-model:value="form.name"
            :options="CARD_NAME_OPTIONS"
            allow-clear
            option-filter-prop="label"
            placeholder="请选择卡名称"
            show-search
          />
        </FormItem>
        <FormItem label="长度">
          <Select
            v-model:value="form.lengths"
            :options="CARD_LENGTH_OPTIONS"
            allow-clear
            mode="multiple"
            placeholder="请选择卡号长度"
          />
        </FormItem>
        <FormItem label="卡头规则">
          <div class="flex flex-col gap-2">
            <div
              v-for="(item, index) in form.prefixes"
              :key="index"
              class="flex items-center gap-2"
            >
              <Input
                v-model:value="item.start"
                allow-clear
                class="flex-1"
                placeholder="起始，如 62"
              />
              <span class="text-muted-foreground shrink-0">至</span>
              <Input
                v-model:value="item.end"
                allow-clear
                class="flex-1"
                placeholder="结束，可不填"
              />
              <Button @click="removePrefix(index)">删除</Button>
            </div>
            <Button block @click="addPrefix">
              <template #icon>
                <IconifyIcon icon="lucide:plus" />
              </template>
              添加卡头
            </Button>
          </div>
          <div class="text-muted-foreground mt-1 text-xs">
            只填卡号开头数字。单个卡头只填起始，例如 62；连续一段再填结束，例如
            60 至 63。
          </div>
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
