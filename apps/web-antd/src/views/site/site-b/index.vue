<script lang="ts" setup>
import type { SiteBGatewayRow } from './shared';

import type { SiteBApi } from '#/api';

import { computed, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  InputPassword,
  message,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'ant-design-vue';

import {
  createSiteB,
  getChannelPlatformOptions,
  getSiteBList,
  setSiteBStatus,
  updateSiteB,
} from '#/api';

import {
  accountStatusClass,
  accountStatusText,
  channelText,
  DEFAULT_RUN_DIRECTORY,
  FRAMEWORK_OPTIONS,
  FTP_OPTIONS,
  ftpLabel,
  getSiteGateways,
  PAYMENT_MODE_COLORS,
  PAYMENT_MODE_LABELS,
  STATUS_FILTER_OPTIONS,
} from './shared';

defineOptions({ name: 'SiteBList' });

const searchForm = reactive({
  id: undefined as number | undefined,
  domain: '',
  remark: '',
  status: '' as '0' | '1' | '',
  platformId: undefined as number | undefined,
});

const createForm = reactive({
  domain: '',
  platformId: undefined as number | undefined,
  framework: '其他',
  isFtp: 1 as 0 | 1,
  host: '',
  account: '',
  password: '',
});

const loading = ref(false);
const saving = ref(false);
const selectedRowKeys = ref<number[]>([]);
const list = ref<SiteBApi.SiteB[]>([]);
const platformOptions = ref<{ label: string; value: number }[]>([]);

const platformFilterOptions = computed(() => [
  { label: '全部', value: undefined },
  ...platformOptions.value,
]);

const createOpen = ref(false);
const editOpen = ref(false);
const gatewayOpen = ref(false);
const editingId = ref<null | number>(null);
const viewingSiteId = ref<null | number>(null);
const viewingDomain = ref('');

const editForm = reactive({
  platformName: '',
  framework: '',
  isFtp: true,
  host: '',
  account: '',
  password: '',
});

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 70,
    fixed: 'left' as const,
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    fixed: 'left' as const,
  },
  { title: '域名', dataIndex: 'domain', key: 'domain', width: 150 },
  { title: '通道', key: 'channel', width: 120 },
  { title: '通道平台', dataIndex: 'platform', key: 'platform', width: 100 },
  { title: '框架', dataIndex: 'framework', key: 'framework', width: 80 },
  { title: '状态', key: 'status', width: 80 },
  {
    title: '链接地址',
    dataIndex: 'linkAddress',
    key: 'linkAddress',
    width: 120,
  },
  { title: '运行目录', key: 'runDirectory', width: 110 },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 220 },
  { title: '更新', key: 'updated', width: 170 },
  { title: '创建', key: 'created', width: 170 },
];

const gatewayColumns = [
  {
    title: '通道名称',
    dataIndex: 'channelName',
    key: 'channelName',
    width: 140,
  },
  { title: '状态', key: 'status', width: 90 },
  { title: '账号状态', key: 'accountStatus', width: 160 },
  { title: '支付模式', key: 'paymentMode', width: 110 },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 120 },
  { title: '网关', key: 'gateway', width: 90 },
];

const gatewayList = computed(() => {
  if (!viewingSiteId.value) return [];
  return getSiteGateways(viewingSiteId.value);
});

async function loadPlatformOptions() {
  try {
    const rows = await getChannelPlatformOptions();
    platformOptions.value = rows.map((row) => ({
      label: row.label,
      value: row.id,
    }));
  } catch {
    platformOptions.value = [];
  }
}

async function loadList() {
  loading.value = true;
  try {
    list.value = await getSiteBList({
      id: searchForm.id,
      domain: searchForm.domain.trim() || undefined,
      remark: searchForm.remark.trim() || undefined,
      status: searchForm.status || undefined,
      platformId: searchForm.platformId,
    });
  } finally {
    loading.value = false;
  }
}

async function handleSearch() {
  await loadList();
}

function resetSearch() {
  searchForm.id = undefined;
  searchForm.domain = '';
  searchForm.remark = '';
  searchForm.status = '';
  searchForm.platformId = undefined;
  void loadList();
}

function resetCreateForm() {
  createForm.domain = '';
  createForm.platformId = platformOptions.value[0]?.value;
  createForm.framework = '其他';
  createForm.isFtp = 1;
  createForm.host = '';
  createForm.account = '';
  createForm.password = '';
}

function openCreate() {
  resetCreateForm();
  createOpen.value = true;
}

function validateCreateForm() {
  if (!createForm.domain.trim()) {
    message.warning('请输入域名');
    return false;
  }
  if (!createForm.platformId) {
    message.warning('请选择通道平台');
    return false;
  }
  return true;
}

async function handleCreateSave() {
  if (!validateCreateForm()) return;
  const platformId = createForm.platformId;
  if (!platformId) return;
  saving.value = true;
  try {
    await createSiteB({
      domain: createForm.domain.trim(),
      platformId,
      framework: createForm.framework,
      isFtp: createForm.isFtp === 1,
      host: createForm.host.trim(),
      account: createForm.account.trim(),
      password: createForm.password,
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

async function onToggleStatus(
  row: SiteBApi.SiteB,
  checked: boolean | number | string,
) {
  const status = Boolean(checked);
  loading.value = true;
  try {
    const updated = await setSiteBStatus(row.id, status);
    Object.assign(row, updated);
  } catch {
    // 错误提示由 request 拦截器处理
  } finally {
    loading.value = false;
  }
}

function onSelectionChange(keys: (number | string)[]) {
  selectedRowKeys.value = keys.map(Number);
}

function onUpdateCode() {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先勾选要更新代码的记录');
    return;
  }
  message.info('更新代码功能暂未接入');
}

function openGatewayList(row: SiteBApi.SiteB) {
  viewingSiteId.value = row.id;
  viewingDomain.value = row.domain;
  gatewayOpen.value = true;
}

function onGatewayAction() {
  message.info('网关配置暂未接入');
}

function openEdit(row: SiteBApi.SiteB) {
  editingId.value = row.id;
  editForm.platformName = row.platformName || row.platform;
  editForm.framework = row.framework;
  editForm.isFtp = row.isFtp;
  editForm.host = row.host;
  editForm.account = row.account;
  editForm.password = row.password;
  editOpen.value = true;
}

async function handleEditSave() {
  if (!editingId.value) return;
  saving.value = true;
  try {
    await updateSiteB(editingId.value, {
      host: editForm.host.trim(),
      account: editForm.account.trim(),
      password: editForm.password,
    });
    editOpen.value = false;
    message.success('已保存');
    await loadList();
  } catch {
    // 错误提示由 request 拦截器处理
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await loadPlatformOptions();
  resetCreateForm();
  await loadList();
});
</script>

<template>
  <Page auto-content-height description="B站管理">
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="w-full gap-y-3">
        <FormItem label="ID">
          <Input
            v-model:value="searchForm.id"
            allow-clear
            class="!w-28"
            placeholder="ID"
            type="number"
          />
        </FormItem>
        <FormItem label="域名">
          <Input
            v-model:value="searchForm.domain"
            allow-clear
            class="!w-40"
            placeholder="域名"
          />
        </FormItem>
        <FormItem label="备注">
          <Input
            v-model:value="searchForm.remark"
            allow-clear
            class="!w-36"
            placeholder="备注"
          />
        </FormItem>
        <FormItem label="状态">
          <Select
            v-model:value="searchForm.status"
            :options="STATUS_FILTER_OPTIONS"
            allow-clear
            class="!w-28"
            placeholder="状态"
          />
        </FormItem>
        <FormItem label="通道平台">
          <Select
            v-model:value="searchForm.platformId"
            :options="platformFilterOptions"
            allow-clear
            class="!w-32"
            placeholder="通道平台"
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
          <Button type="primary" @click="openCreate">
            <template #icon>
              <IconifyIcon icon="lucide:plus" />
            </template>
            新增
          </Button>
          <Button type="primary" @click="onUpdateCode">
            <template #icon>
              <IconifyIcon icon="lucide:upload" />
            </template>
            更新代码
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
        :scroll="{ x: 1580 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <Space :size="0">
              <Tooltip title="网关列表">
                <Button
                  size="small"
                  type="link"
                  @click="openGatewayList(record as SiteBApi.SiteB)"
                >
                  <IconifyIcon class="size-4" icon="lucide:eye" />
                </Button>
              </Tooltip>
              <Tooltip title="编辑">
                <Button
                  size="small"
                  type="link"
                  @click="openEdit(record as SiteBApi.SiteB)"
                >
                  <IconifyIcon class="size-4" icon="lucide:pencil" />
                </Button>
              </Tooltip>
            </Space>
          </template>
          <template v-else-if="column.key === 'channel'">
            {{ channelText(record as SiteBApi.SiteB) }}
          </template>
          <template v-else-if="column.key === 'status'">
            <Switch
              :checked="record.status"
              size="small"
              @change="
                (checked) => onToggleStatus(record as SiteBApi.SiteB, checked)
              "
            />
          </template>
          <template v-else-if="column.key === 'runDirectory'">
            <span v-if="record.runDirectory">{{ record.runDirectory }}</span>
          </template>
          <template v-else-if="column.key === 'updated'">
            <div>{{ record.updatedBy }}</div>
            <div class="text-muted-foreground text-xs">
              {{ record.updatedAt }}
            </div>
          </template>
          <template v-else-if="column.key === 'created'">
            <div>{{ record.createdBy }}</div>
            <div class="text-muted-foreground text-xs">
              {{ record.createdAt }}
            </div>
          </template>
        </template>
      </Table>
    </Card>

    <Modal
      v-model:open="createOpen"
      :footer="null"
      destroy-on-close
      title="新增"
      width="520px"
    >
      <Form layout="vertical" class="pt-2">
        <FormItem label="域名" required>
          <Input v-model:value="createForm.domain" placeholder="请输入域名" />
          <div class="text-muted-foreground mt-1 text-xs">
            必填，如: www.baidu.com
          </div>
        </FormItem>
        <FormItem label="通道平台" required>
          <Select
            v-model:value="createForm.platformId"
            :options="platformOptions"
            placeholder="请选择一项"
          />
        </FormItem>
        <FormItem label="框架">
          <Select
            v-model:value="createForm.framework"
            :options="FRAMEWORK_OPTIONS"
            placeholder="请选择一项"
          />
        </FormItem>
        <FormItem label="是否是FTP">
          <Select
            v-model:value="createForm.isFtp"
            :options="FTP_OPTIONS"
            placeholder="请选择一项"
          />
        </FormItem>
        <FormItem label="主机">
          <Input v-model:value="createForm.host" placeholder="请输入主机" />
          <div class="text-muted-foreground mt-1 text-xs">非必填，建议填写</div>
        </FormItem>
        <FormItem label="账号">
          <Input v-model:value="createForm.account" placeholder="请输入账号" />
          <div class="text-muted-foreground mt-1 text-xs">非必填，建议填写</div>
        </FormItem>
        <FormItem label="密码">
          <InputPassword
            v-model:value="createForm.password"
            placeholder="请输入密码"
          />
          <div class="text-muted-foreground mt-1 text-xs">非必填，建议填写</div>
        </FormItem>
        <FormItem label="运行目录">
          <Input :value="DEFAULT_RUN_DIRECTORY" disabled />
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

    <Modal
      v-model:open="editOpen"
      :footer="null"
      destroy-on-close
      title="编辑"
      width="520px"
    >
      <Form layout="vertical" class="pt-2">
        <FormItem label="通道平台">
          <div>{{ editForm.platformName }}</div>
        </FormItem>
        <FormItem label="框架">
          <div>{{ editForm.framework }}</div>
        </FormItem>
        <FormItem label="是否是FTP">
          <div>{{ ftpLabel(editForm.isFtp) }}</div>
        </FormItem>
        <FormItem label="主机">
          <Input v-model:value="editForm.host" placeholder="请输入主机" />
          <div class="text-muted-foreground mt-1 text-xs">非必填，建议填写</div>
        </FormItem>
        <FormItem label="账号">
          <Input v-model:value="editForm.account" placeholder="请输入账号" />
          <div class="text-muted-foreground mt-1 text-xs">非必填，建议填写</div>
        </FormItem>
        <FormItem label="密码">
          <InputPassword
            v-model:value="editForm.password"
            placeholder="请输入密码"
          />
          <div class="text-muted-foreground mt-1 text-xs">非必填，建议填写</div>
        </FormItem>
        <FormItem>
          <Space>
            <Button :loading="saving" type="primary" @click="handleEditSave">
              提交
            </Button>
            <Button type="link" @click="editOpen = false">返回</Button>
          </Space>
        </FormItem>
      </Form>
    </Modal>

    <Modal
      v-model:open="gatewayOpen"
      :footer="null"
      destroy-on-close
      title="网关列表"
      width="860px"
    >
      <div
        v-if="viewingDomain"
        class="mb-4 flex items-center justify-between rounded bg-green-50 px-4 py-2 text-green-700"
      >
        <span>{{ viewingDomain }}</span>
      </div>

      <Table
        :columns="gatewayColumns"
        :data-source="gatewayList"
        :pagination="false"
        :scroll="{ x: 720 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <Tag :color="record.status ? 'green' : 'default'">
              {{ record.status ? '启用' : '禁用' }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'accountStatus'">
            <span :class="accountStatusClass(record as SiteBGatewayRow)">
              {{ accountStatusText(record as SiteBGatewayRow) }}
            </span>
          </template>
          <template v-else-if="column.key === 'paymentMode'">
            <span
              :class="
                PAYMENT_MODE_COLORS[(record as SiteBGatewayRow).paymentMode]
              "
            >
              {{ PAYMENT_MODE_LABELS[(record as SiteBGatewayRow).paymentMode] }}
            </span>
          </template>
          <template v-else-if="column.key === 'gateway'">
            <Button size="small" @click="onGatewayAction">网关</Button>
          </template>
        </template>
      </Table>
    </Modal>
  </Page>
</template>
