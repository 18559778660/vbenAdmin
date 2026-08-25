<script lang="ts" setup>
import type { SiteBGatewayRow, SiteBRow } from './shared';

import { computed, reactive, ref } from 'vue';

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
  accountStatusClass,
  accountStatusText,
  buildLinkAddress,
  channelText,
  defaultRunDirectory,
  FRAMEWORK_OPTIONS,
  FTP_OPTIONS,
  ftpLabel,
  getSiteGateways,
  mockSiteBList,
  nextSiteBIdValue,
  nowText,
  PAYMENT_MODE_COLORS,
  PAYMENT_MODE_LABELS,
  PLATFORM_FILTER_OPTIONS,
  PLATFORM_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from './shared';

defineOptions({ name: 'SiteBList' });

const searchForm = reactive({
  id: undefined as number | undefined,
  domain: '',
  remark: '',
  status: '' as '0' | '1' | '',
  platform: '',
});

const applied = reactive({
  id: undefined as number | undefined,
  domain: '',
  remark: '',
  status: '' as '0' | '1' | '',
  platform: '',
});

const createForm = reactive({
  domain: '',
  platform: 'stripe',
  framework: '其他',
  isFtp: 1 as 0 | 1,
  host: '',
  account: '',
  password: '',
  runDirectory: '',
});

const loading = ref(false);
const saving = ref(false);
const createOpen = ref(false);
const editOpen = ref(false);
const gatewayOpen = ref(false);
const editingId = ref<null | number>(null);
const viewingSiteId = ref<null | number>(null);
const viewingDomain = ref('');

const editForm = reactive({
  platform: '',
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

const filteredList = computed(() => {
  return mockSiteBList.value.filter((row) => {
    if (applied.id && row.id !== applied.id) return false;
    if (
      applied.domain &&
      !row.domain.toLowerCase().includes(applied.domain.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      applied.remark &&
      !row.remark.toLowerCase().includes(applied.remark.trim().toLowerCase())
    ) {
      return false;
    }
    if (applied.platform && row.platform !== applied.platform) return false;
    if (applied.status === '1' && !row.status) return false;
    if (applied.status === '0' && row.status) return false;
    return true;
  });
});

const gatewayList = computed(() => {
  if (!viewingSiteId.value) return [];
  return getSiteGateways(viewingSiteId.value);
});

function handleSearch() {
  applied.id = searchForm.id;
  applied.domain = searchForm.domain;
  applied.remark = searchForm.remark;
  applied.status = searchForm.status;
  applied.platform = searchForm.platform;
}

function resetSearch() {
  searchForm.id = undefined;
  searchForm.domain = '';
  searchForm.remark = '';
  searchForm.status = '';
  searchForm.platform = '';
  handleSearch();
}

function resetCreateForm() {
  createForm.domain = '';
  createForm.platform = 'stripe';
  createForm.framework = '其他';
  createForm.isFtp = 1;
  createForm.host = '';
  createForm.account = '';
  createForm.password = '';
  createForm.runDirectory = '';
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
  return true;
}

function handleCreateSave() {
  if (!validateCreateForm()) return;
  saving.value = true;
  const time = nowText();
  const isFtp = createForm.isFtp === 1;
  mockSiteBList.value.unshift({
    id: nextSiteBIdValue(),
    domain: createForm.domain.trim(),
    channel: createForm.platform,
    channelEnabled: true,
    platform: createForm.platform,
    framework: createForm.framework,
    status: true,
    isFtp,
    host: createForm.host.trim(),
    account: createForm.account.trim(),
    password: createForm.password,
    linkAddress: buildLinkAddress(isFtp, createForm.host, createForm.account),
    runDirectory:
      createForm.runDirectory.trim() ||
      defaultRunDirectory(createForm.platform),
    remark: '',
    updatedBy: 'admin',
    updatedAt: time,
    createdBy: 'admin',
    createdAt: time,
  });
  saving.value = false;
  createOpen.value = false;
  message.success('已新增（静态，未接后端）');
}

function onToggleStatus(row: SiteBRow, checked: boolean | number | string) {
  row.status = Boolean(checked);
  row.updatedAt = nowText();
  row.updatedBy = 'admin';
}

function onUpdateCode() {
  message.info('更新代码功能暂未接入（静态页）');
}

function openGatewayList(row: SiteBRow) {
  viewingSiteId.value = row.id;
  viewingDomain.value = row.domain;
  gatewayOpen.value = true;
}

function onGatewayAction() {
  message.info('网关配置暂未接入（静态页）');
}

function openEdit(row: SiteBRow) {
  editingId.value = row.id;
  editForm.platform = row.platform;
  editForm.framework = row.framework;
  editForm.isFtp = row.isFtp;
  editForm.host = row.host;
  editForm.account = row.account;
  editForm.password = row.password;
  editOpen.value = true;
}

function handleEditSave() {
  if (!editingId.value) return;
  saving.value = true;
  const row = mockSiteBList.value.find((item) => item.id === editingId.value);
  if (row) {
    row.host = editForm.host.trim();
    row.account = editForm.account.trim();
    row.password = editForm.password;
    row.linkAddress = buildLinkAddress(row.isFtp, row.host, row.account);
    row.updatedAt = nowText();
    row.updatedBy = 'admin';
  }
  saving.value = false;
  editOpen.value = false;
  message.success('已保存（静态，未接后端）');
}
</script>

<template>
  <Page auto-content-height description="当前为静态预览，数据未接后端">
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
            v-model:value="searchForm.platform"
            :options="PLATFORM_FILTER_OPTIONS"
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
        :data-source="filteredList"
        :loading="loading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
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
                  @click="openGatewayList(record as SiteBRow)"
                >
                  <IconifyIcon class="size-4" icon="lucide:eye" />
                </Button>
              </Tooltip>
              <Tooltip title="编辑">
                <Button
                  size="small"
                  type="link"
                  @click="openEdit(record as SiteBRow)"
                >
                  <IconifyIcon class="size-4" icon="lucide:pencil" />
                </Button>
              </Tooltip>
            </Space>
          </template>
          <template v-else-if="column.key === 'channel'">
            {{ channelText(record as SiteBRow) }}
          </template>
          <template v-else-if="column.key === 'status'">
            <Switch
              :checked="record.status"
              size="small"
              @change="(checked) => onToggleStatus(record as SiteBRow, checked)"
            />
          </template>
          <template v-else-if="column.key === 'runDirectory'">
            <a
              v-if="record.runDirectory"
              class="text-primary"
              href="javascript:void(0)"
            >
              {{ record.runDirectory }}
            </a>
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
        <FormItem label="通道平台">
          <Select
            v-model:value="createForm.platform"
            :options="PLATFORM_OPTIONS"
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
          <Input
            v-model:value="createForm.runDirectory"
            placeholder="请输入运行目录"
          />
          <div class="text-muted-foreground mt-1 text-xs">
            stripe 系列清空 其他通道默认填【deal】
          </div>
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
          <div>{{ editForm.platform }}</div>
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
