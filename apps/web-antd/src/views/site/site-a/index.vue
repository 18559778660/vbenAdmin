<script lang="ts" setup>
import type { SiteAStatus } from './shared';

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
} from 'ant-design-vue';

import {
  domainHref,
  FRAMEWORK_OPTIONS,
  MERCHANT_FORM_OPTIONS,
  MERCHANT_OPTIONS,
  mockSiteAList,
  nextSiteAIdValue,
  nowText,
  STATUS_COLORS,
  STATUS_FILTER_OPTIONS,
  STATUS_LABELS,
} from './shared';

defineOptions({ name: 'SiteAList' });

const searchForm = reactive({
  merchant: '',
  domain: '',
  status: '' as '' | SiteAStatus,
});

const applied = reactive({
  merchant: '',
  domain: '',
  status: '' as '' | SiteAStatus,
});

const createForm = reactive({
  merchant: undefined as string | undefined,
  domain: '',
  framework: undefined as string | undefined,
});

const loading = ref(false);
const saving = ref(false);
const createOpen = ref(false);
const selectedRowKeys = ref<number[]>([]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 90 },
  { title: '商户', dataIndex: 'merchant', key: 'merchant', width: 100 },
  { title: '域名', key: 'domain', width: 180 },
  { title: '框架', dataIndex: 'framework', key: 'framework', width: 100 },
  { title: '状态', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
  { title: '创建人', dataIndex: 'createdBy', key: 'createdBy', width: 100 },
  { title: '操作时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 170 },
  { title: '操作人', dataIndex: 'updatedBy', key: 'updatedBy', width: 100 },
];

const filteredList = computed(() => {
  return mockSiteAList.value.filter((row) => {
    if (applied.merchant && row.merchant !== applied.merchant) return false;
    if (
      applied.domain &&
      !row.domain.toLowerCase().includes(applied.domain.trim().toLowerCase())
    ) {
      return false;
    }
    if (applied.status && row.status !== applied.status) return false;
    return true;
  });
});

function handleSearch() {
  applied.merchant = searchForm.merchant;
  applied.domain = searchForm.domain;
  applied.status = searchForm.status;
}

function resetSearch() {
  searchForm.merchant = '';
  searchForm.domain = '';
  searchForm.status = '';
  handleSearch();
}

function resetCreateForm() {
  createForm.merchant = undefined;
  createForm.domain = '';
  createForm.framework = undefined;
}

function openCreate() {
  resetCreateForm();
  createOpen.value = true;
}

function validateCreateForm() {
  if (!createForm.merchant) {
    message.warning('请选择商户');
    return false;
  }
  const domain = createForm.domain.trim();
  if (!domain) {
    message.warning('请输入域名');
    return false;
  }
  if (!createForm.framework) {
    message.warning('请选择框架');
    return false;
  }
  return true;
}

function handleCreateSave() {
  if (!validateCreateForm()) return;
  const merchant = createForm.merchant;
  const framework = createForm.framework;
  if (!merchant || !framework) return;
  saving.value = true;
  const time = nowText();
  mockSiteAList.value.unshift({
    id: nextSiteAIdValue(),
    merchant,
    domain: createForm.domain.trim(),
    framework,
    status: 'pending',
    createdAt: time,
    createdBy: 'admin',
    updatedAt: time,
    updatedBy: 'admin',
  });
  saving.value = false;
  createOpen.value = false;
  message.success('已新增（静态，未接后端）');
}

function onSelectionChange(keys: (number | string)[]) {
  selectedRowKeys.value = keys.map(Number);
}

function ensureSelection(action: string) {
  if (selectedRowKeys.value.length === 0) {
    message.warning(`请先勾选要${action}的记录`);
    return false;
  }
  return true;
}

function updateSelectedStatus(status: SiteAStatus, action: string) {
  if (!ensureSelection(action)) return;
  const keySet = new Set(selectedRowKeys.value);
  const time = nowText();
  mockSiteAList.value.forEach((row) => {
    if (!keySet.has(row.id)) return;
    row.status = status;
    row.updatedAt = time;
    row.updatedBy = 'admin';
  });
  message.success(`已${action} ${selectedRowKeys.value.length} 条（静态）`);
}

function onExport() {
  message.info('导出功能暂未接入（静态页）');
}

function onBatchAudit() {
  updateSelectedStatus('audited', '批量审核');
}

function onApprove() {
  updateSelectedStatus('audited', '通过');
}

function onDisable() {
  updateSelectedStatus('disabled', '禁用');
}
</script>

<template>
  <Page auto-content-height description="当前为静态预览，数据未接后端">
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="w-full gap-y-3">
        <FormItem label="商户">
          <Select
            v-model:value="searchForm.merchant"
            :options="MERCHANT_OPTIONS"
            allow-clear
            class="!w-36"
            placeholder="商户"
          />
        </FormItem>
        <FormItem label="域名">
          <Input
            v-model:value="searchForm.domain"
            allow-clear
            class="!w-44"
            placeholder="域名"
          />
        </FormItem>
        <FormItem label="状态">
          <Select
            v-model:value="searchForm.status"
            :options="STATUS_FILTER_OPTIONS"
            allow-clear
            class="!w-32"
            placeholder="状态"
          />
        </FormItem>
        <FormItem class="ml-auto">
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
      <div class="mb-4">
        <Space wrap>
          <Button @click="onExport">
            <template #icon>
              <IconifyIcon icon="lucide:download" />
            </template>
            导出
          </Button>
          <Button type="primary" @click="openCreate">
            <template #icon>
              <IconifyIcon icon="lucide:plus" />
            </template>
            新增
          </Button>
          <Button type="primary" @click="onBatchAudit">
            <template #icon>
              <IconifyIcon icon="lucide:check-check" />
            </template>
            批量审核
          </Button>
          <Button type="primary" @click="onApprove">
            <template #icon>
              <IconifyIcon icon="lucide:circle-check" />
            </template>
            通过
          </Button>
          <Button danger type="primary" @click="onDisable">
            <template #icon>
              <IconifyIcon icon="lucide:ban" />
            </template>
            禁用
          </Button>
        </Space>
      </div>

      <Table
        :columns="columns"
        :data-source="filteredList"
        :loading="loading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :row-selection="{
          selectedRowKeys,
          onChange: onSelectionChange,
        }"
        :scroll="{ x: 1200 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'domain'">
            <a
              v-if="domainHref(record.domain)"
              :href="domainHref(record.domain)"
              class="text-primary"
              rel="noopener noreferrer"
              target="_blank"
            >
              {{ record.domain }}
            </a>
            <span v-else>{{ record.domain }}</span>
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="STATUS_COLORS[record.status as SiteAStatus]">
              {{ STATUS_LABELS[record.status as SiteAStatus] }}
            </Tag>
          </template>
        </template>
      </Table>
    </Card>

    <Modal
      v-model:open="createOpen"
      :footer="null"
      destroy-on-close
      title="新增"
      width="480px"
    >
      <Form layout="vertical" class="pt-2">
        <FormItem label="商户" required>
          <Select
            v-model:value="createForm.merchant"
            :options="MERCHANT_FORM_OPTIONS"
            placeholder="请选择一项"
          />
        </FormItem>
        <FormItem label="域名" required>
          <Input v-model:value="createForm.domain" placeholder="请输入域名" />
          <div class="text-muted-foreground mt-1 text-xs">
            必填，如: www.baidu.com
          </div>
        </FormItem>
        <FormItem label="框架" required>
          <Select
            v-model:value="createForm.framework"
            :options="FRAMEWORK_OPTIONS"
            placeholder="请选择一项"
          />
        </FormItem>
        <FormItem>
          <Space>
            <Button :loading="saving" type="primary" @click="handleCreateSave">
              提交
            </Button>
            <Button @click="createOpen = false">关闭</Button>
          </Space>
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
