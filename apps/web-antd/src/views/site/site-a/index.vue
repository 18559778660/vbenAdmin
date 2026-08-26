<script lang="ts" setup>
import type { SiteAStatus } from './shared';

import type { SiteAApi } from '#/api';

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
  Select,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';

import {
  batchUpdateSiteAStatus,
  createSiteA,
  getMerchantOptions,
  getSiteAList,
} from '#/api';

import {
  domainHref,
  FRAMEWORK_OPTIONS,
  STATUS_COLORS,
  STATUS_FILTER_OPTIONS,
  STATUS_LABELS,
} from './shared';

defineOptions({ name: 'SiteAList' });

const searchForm = reactive({
  merchantId: undefined as number | undefined,
  domain: '',
  status: '' as '' | SiteAStatus,
});

const createForm = reactive({
  merchantId: undefined as number | undefined,
  domain: '',
  framework: undefined as string | undefined,
});

const loading = ref(false);
const saving = ref(false);
const createOpen = ref(false);
const selectedRowKeys = ref<number[]>([]);
const list = ref<SiteAApi.SiteA[]>([]);
const merchantOptions = ref<{ label: string; value: number }[]>([]);

const merchantFilterOptions = computed(() => [
  { label: '全部', value: undefined as number | undefined },
  ...merchantOptions.value,
]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 90 },
  {
    title: '商户',
    dataIndex: 'merchantName',
    key: 'merchantName',
    width: 120,
  },
  { title: '域名', key: 'domain', width: 180 },
  { title: '框架', dataIndex: 'framework', key: 'framework', width: 120 },
  { title: '状态', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
  { title: '创建人', dataIndex: 'createdBy', key: 'createdBy', width: 100 },
  { title: '操作时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 170 },
  { title: '操作人', dataIndex: 'updatedBy', key: 'updatedBy', width: 100 },
];

async function loadMerchantOptions() {
  const options = await getMerchantOptions();
  merchantOptions.value = options.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}

async function loadList() {
  loading.value = true;
  try {
    list.value = await getSiteAList({
      merchantId: searchForm.merchantId,
      domain: searchForm.domain.trim() || undefined,
      status: searchForm.status || undefined,
    });
  } finally {
    loading.value = false;
  }
}

async function handleSearch() {
  await loadList();
}

function resetSearch() {
  searchForm.merchantId = undefined;
  searchForm.domain = '';
  searchForm.status = '';
  void loadList();
}

function resetCreateForm() {
  createForm.merchantId = undefined;
  createForm.domain = '';
  createForm.framework = undefined;
}

function openCreate() {
  resetCreateForm();
  createOpen.value = true;
}

function validateCreateForm() {
  if (!createForm.merchantId) {
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

async function handleCreateSave() {
  if (!validateCreateForm()) return;
  const merchantId = createForm.merchantId;
  const framework = createForm.framework;
  if (!merchantId || !framework) return;
  saving.value = true;
  try {
    await createSiteA({
      merchantId,
      domain: createForm.domain.trim(),
      framework,
    });
    createOpen.value = false;
    message.success('已新增');
    await loadList();
  } catch {
    // 错误提示由 request 拦截器处理
  } finally {
    saving.value = false;
  }
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

async function updateSelectedStatus(status: SiteAStatus, action: string) {
  if (!ensureSelection(action)) return;
  loading.value = true;
  try {
    const result = await batchUpdateSiteAStatus({
      ids: selectedRowKeys.value,
      status,
    });
    message.success(`已${action} ${result.count} 条`);
    selectedRowKeys.value = [];
    await loadList();
  } catch {
    // 错误提示由 request 拦截器处理
  } finally {
    loading.value = false;
  }
}

function onExport() {
  message.info('导出功能暂未接入');
}

function onBatchAudit() {
  void updateSelectedStatus('audited', '批量审核');
}

function onApprove() {
  void updateSelectedStatus('audited', '通过');
}

function onDisable() {
  void updateSelectedStatus('disabled', '禁用');
}

onMounted(async () => {
  await Promise.all([loadMerchantOptions(), loadList()]);
});
</script>

<template>
  <Page auto-content-height description="A站管理">
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="w-full gap-y-3">
        <FormItem label="商户">
          <Select
            v-model:value="searchForm.merchantId"
            :options="merchantFilterOptions"
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
        :data-source="list"
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
            v-model:value="createForm.merchantId"
            :options="merchantOptions"
            placeholder="请选择一项"
            show-search
            :filter-option="
              (input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
            "
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
