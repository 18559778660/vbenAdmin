<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

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
  Radio,
  RadioGroup,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'ant-design-vue';

defineOptions({ name: 'MerchantList' });

/** 商户列表行（前端 mock，后端对接前本地维护） */
interface MerchantRow {
  id: number;
  name: string;
  account: string;
  password: string;
  contact: string;
  parentId: null | number;
  parentName: string;
  autoShip: boolean;
  confirmEmail: boolean;
  status: boolean;
  limitMode: string;
  rateDiff: number;
  holdRate: number;
  mutualHoldRate: number;
  holdStatus: number;
  mutualHoldStatus: number;
  secretKey: string;
  auditSiteA: 'auto' | 'manual';
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  starred: boolean;
}

const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
];

const holdStatusOptions = [
  { label: '全部', value: '' },
  { label: '开启', value: 1 },
  { label: '关闭', value: 0 },
];

const emailOptions = [
  { label: '发送', value: 1 },
  { label: '不发送', value: 0 },
];

const limitModeOptions = [
  { label: '单一级别', value: 'single' },
  { label: '多级别', value: 'multi' },
];

const searchForm = reactive({
  merchant: '',
  parentId: undefined as number | undefined,
  status: '' as '' | number,
  holdStatus: '' as '' | number,
  mutualHoldStatus: '' as '' | number,
});

const createForm = reactive({
  name: '',
  contact: '',
  rateDiff: 0,
  holdRate: 0,
  mutualHoldRate: 0,
  confirmEmail: 1,
  auditSiteA: 'manual' as 'auto' | 'manual',
  autoShip: true,
});

const loading = ref(false);
const modalOpen = ref(false);
const saving = ref(false);

const mockList = ref<MerchantRow[]>([
  {
    id: 303,
    name: 'A200',
    account: 'WIN0303',
    password: 'xErGvvYzvExY',
    contact: '',
    parentId: null,
    parentName: '-',
    autoShip: false,
    confirmEmail: true,
    status: true,
    limitMode: 'single',
    rateDiff: 0,
    holdRate: 0,
    mutualHoldRate: 0,
    holdStatus: 0,
    mutualHoldStatus: 0,
    secretKey: '5f7d14a8c2e94b1f9d6e3a7c0b8e2f15',
    auditSiteA: 'manual',
    createdBy: 'admin',
    createdAt: '2024-08-06 15:02:38',
    updatedBy: 'admin',
    updatedAt: '2024-08-06 15:02:38',
    starred: false,
  },
  {
    id: 288,
    name: 'demo_shop',
    account: 'merchant288',
    password: 'DemoPass123',
    contact: '13800000000',
    parentId: 303,
    parentName: 'A200',
    autoShip: true,
    confirmEmail: false,
    status: true,
    limitMode: 'multi',
    rateDiff: 2,
    holdRate: 10,
    mutualHoldRate: 0,
    holdStatus: 1,
    mutualHoldStatus: 0,
    secretKey: 'a1b2c3d4e5f6789012345678abcdef01',
    auditSiteA: 'auto',
    createdBy: 'admin',
    createdAt: '2025-01-12 10:20:00',
    updatedBy: 'admin',
    updatedAt: '2025-03-01 09:11:22',
    starred: true,
  },
]);

const parentOptions = computed(() =>
  mockList.value.map((item) => ({
    label: `${item.name}（${item.account}）`,
    value: item.id,
  })),
);

const filteredList = computed(() => {
  return mockList.value.filter((item) => {
    if (searchForm.merchant) {
      const key = searchForm.merchant.trim().toLowerCase();
      if (!item.name.toLowerCase().includes(key)) {
        return false;
      }
    }
    // 未选 / 点 X 清空：不按上级过滤
    if (
      searchForm.parentId !== undefined &&
      item.parentId !== searchForm.parentId
    ) {
      return false;
    }
    if (searchForm.status !== '' && Number(item.status) !== searchForm.status) {
      return false;
    }
    if (
      searchForm.holdStatus !== '' &&
      item.holdStatus !== searchForm.holdStatus
    ) {
      return false;
    }
    if (
      searchForm.mutualHoldStatus !== '' &&
      item.mutualHoldStatus !== searchForm.mutualHoldStatus
    ) {
      return false;
    }
    return true;
  });
});

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
  { title: '自动发货', dataIndex: 'autoShip', key: 'autoShip', width: 110 },
  { title: '上级商户', dataIndex: 'parentName', key: 'parentName', width: 120 },
  { title: '商户名', dataIndex: 'name', key: 'name', width: 120 },
  { title: '账号', dataIndex: 'account', key: 'account', width: 140 },
  { title: '登录密码', dataIndex: 'password', key: 'password', width: 140 },
  {
    title: '确认邮件',
    dataIndex: 'confirmEmail',
    key: 'confirmEmail',
    width: 100,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '限制模式', dataIndex: 'limitMode', key: 'limitMode', width: 110 },
  { title: '汇率差', dataIndex: 'rateDiff', key: 'rateDiff', width: 90 },
  { title: '扣单', dataIndex: 'holdRate', key: 'holdRate', width: 80 },
  {
    title: '互抛扣单',
    dataIndex: 'mutualHoldRate',
    key: 'mutualHoldRate',
    width: 100,
  },
  {
    title: '密钥',
    dataIndex: 'secretKey',
    key: 'secretKey',
    width: 200,
    ellipsis: true,
  },
  { title: '创建', key: 'created', width: 170 },
  { title: '更新', key: 'updated', width: 170 },
];

function resetSearch() {
  searchForm.merchant = '';
  searchForm.parentId = undefined;
  searchForm.status = '';
  searchForm.holdStatus = '';
  searchForm.mutualHoldStatus = '';
}

function handleSearch() {
  message.success('已按条件筛选（当前为前端 mock）');
}

function handleRefresh() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
    message.success('已刷新');
  }, 300);
}

function resetCreateForm() {
  createForm.name = '';
  createForm.contact = '';
  createForm.rateDiff = 0;
  createForm.holdRate = 0;
  createForm.mutualHoldRate = 0;
  createForm.confirmEmail = 1;
  createForm.auditSiteA = 'manual';
  createForm.autoShip = true;
}

function openCreate() {
  resetCreateForm();
  modalOpen.value = true;
}

function handleCreate() {
  const name = createForm.name.trim();
  if (!name) {
    message.warning('请输入商户名');
    return;
  }
  if (!/^[a-zA-Z0-9]+$/.test(name)) {
    message.warning('商户名可由英文字母、数字组成');
    return;
  }
  if (createForm.rateDiff < 0 || createForm.rateDiff > 100) {
    message.warning('汇率偏差范围为 0~100');
    return;
  }

  saving.value = true;
  window.setTimeout(() => {
    const now = formatNow();
    const id = Math.max(...mockList.value.map((item) => item.id), 0) + 1;
    mockList.value.unshift({
      id,
      name,
      account: `M${String(id).padStart(4, '0')}`,
      password: randomPassword(),
      contact: createForm.contact.trim(),
      parentId: null,
      parentName: '-',
      autoShip: createForm.autoShip,
      confirmEmail: createForm.confirmEmail === 1,
      status: true,
      limitMode: 'single',
      rateDiff: createForm.rateDiff,
      holdRate: createForm.holdRate,
      mutualHoldRate: createForm.mutualHoldRate,
      holdStatus: createForm.holdRate > 0 ? 1 : 0,
      mutualHoldStatus: createForm.mutualHoldRate > 0 ? 1 : 0,
      secretKey: randomSecret(),
      auditSiteA: createForm.auditSiteA,
      createdBy: 'admin',
      createdAt: now,
      updatedBy: 'admin',
      updatedAt: now,
      starred: false,
    });
    saving.value = false;
    modalOpen.value = false;
    message.success('已新增（仅前端 mock，未调后端）');
  }, 200);
}

function formatNow() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function randomPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  return Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}

function randomSecret() {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
}

function onEdit(row: MerchantRow) {
  message.info(`编辑商户 ${row.name}（后续接后端）`);
}

function onResetPassword(row: MerchantRow) {
  Modal.confirm({
    title: '重置密码',
    content: `确认重置商户「${row.name}」的登录密码？当前为前端演示。`,
    onOk() {
      row.password = randomPassword();
      row.updatedAt = formatNow();
      row.updatedBy = 'admin';
      message.success('密码已重置（mock）');
    },
  });
}

function onToggleStar(row: MerchantRow) {
  row.starred = !row.starred;
}

function limitModeLabel(value: string) {
  return limitModeOptions.find((item) => item.value === value)?.label ?? value;
}
</script>

<template>
  <Page
    auto-content-height
    description="商户列表（前端 mock，字段按旧系统对齐）"
  >
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="gap-y-3">
        <FormItem label="商户">
          <Input
            v-model:value="searchForm.merchant"
            allow-clear
            class="w-44"
            placeholder="请输入商户名"
          />
        </FormItem>
        <FormItem label="上级">
          <Select
            v-model:value="searchForm.parentId"
            :options="parentOptions"
            allow-clear
            class="w-44"
            placeholder="全部"
            @change="
              (value) =>
                (searchForm.parentId =
                  (value as number | undefined) ?? undefined)
            "
          />
        </FormItem>
        <FormItem label="状态">
          <Select
            v-model:value="searchForm.status"
            :options="statusOptions"
            class="w-32"
          />
        </FormItem>
        <FormItem label="扣单状态">
          <Select
            v-model:value="searchForm.holdStatus"
            :options="holdStatusOptions"
            class="w-32"
          />
        </FormItem>
        <FormItem label="互抛扣单状态">
          <Select
            v-model:value="searchForm.mutualHoldStatus"
            :options="holdStatusOptions"
            class="w-32"
          />
        </FormItem>
        <FormItem>
          <Space>
            <Button type="primary" @click="handleSearch">搜索</Button>
            <Button @click="resetSearch">重置</Button>
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
        :data-source="filteredList"
        :loading="loading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :scroll="{ x: 1900 }"
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
                  @click="onEdit(record as MerchantRow)"
                >
                  <IconifyIcon class="size-4" icon="lucide:pencil" />
                </Button>
              </Tooltip>
              <Tooltip title="重置密码">
                <Button
                  size="small"
                  type="link"
                  @click="onResetPassword(record as MerchantRow)"
                >
                  <IconifyIcon class="size-4" icon="lucide:key-round" />
                </Button>
              </Tooltip>
              <Tooltip :title="record.starred ? '取消星标' : '星标'">
                <Button
                  size="small"
                  type="link"
                  @click="onToggleStar(record as MerchantRow)"
                >
                  <IconifyIcon
                    class="size-4"
                    :icon="record.starred ? 'lucide:star' : 'lucide:star'"
                    :style="{ color: record.starred ? '#faad14' : undefined }"
                  />
                </Button>
              </Tooltip>
            </Space>
          </template>
          <template v-else-if="column.key === 'autoShip'">
            {{ record.autoShip ? '自动发货' : '手动发货' }}
          </template>
          <template v-else-if="column.key === 'confirmEmail'">
            <Switch v-model:checked="record.confirmEmail" size="small" />
          </template>
          <template v-else-if="column.key === 'status'">
            <Switch v-model:checked="record.status" size="small" />
          </template>
          <template v-else-if="column.key === 'limitMode'">
            <Tag :color="record.limitMode === 'single' ? 'gold' : 'blue'">
              {{ limitModeLabel(record.limitMode) }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'created'">
            <div class="leading-5">
              <div>{{ record.createdBy }}</div>
              <div class="text-muted-foreground text-xs">
                {{ record.createdAt }}
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'updated'">
            <div class="leading-5">
              <div>{{ record.updatedBy }}</div>
              <div class="text-muted-foreground text-xs">
                {{ record.updatedAt }}
              </div>
            </div>
          </template>
        </template>
      </Table>
    </Card>

    <Modal
      v-model:open="modalOpen"
      :confirm-loading="saving"
      destroy-on-close
      title="新增商户"
      width="560px"
      @ok="handleCreate"
    >
      <Form class="mt-2" layout="vertical">
        <FormItem label="商户名" required>
          <Input v-model:value="createForm.name" placeholder="请输入商户名" />
          <div class="text-muted-foreground mt-1 text-xs">
            必填，可由英文字母、数字组成
          </div>
        </FormItem>
        <FormItem label="联系方式">
          <Input
            v-model:value="createForm.contact"
            placeholder="请输入联系方式"
          />
        </FormItem>
        <FormItem label="汇率偏差">
          <InputNumber
            v-model:value="createForm.rateDiff"
            :max="100"
            :min="0"
            class="w-full"
          />
          <div class="text-muted-foreground mt-1 text-xs">
            默认 0，最大值 100。假如设置为 2，当网站货币不为美元时，美元金额 =
            网站金额 × 汇率 × (100-2)/100
          </div>
        </FormItem>
        <FormItem label="扣单">
          <InputNumber
            v-model:value="createForm.holdRate"
            :min="0"
            class="w-full"
          />
          <div class="text-muted-foreground mt-1 text-xs">
            默认 0。假如设置为 10，该商户每成功 9 单后的第 10 单会显示失败
          </div>
        </FormItem>
        <FormItem label="互抛扣单">
          <InputNumber
            v-model:value="createForm.mutualHoldRate"
            :min="0"
            class="w-full"
          />
          <div class="text-muted-foreground mt-1 text-xs">
            默认 0。假如设置为 10，该商户每成功 9 单后的第 10 单会显示失败
          </div>
        </FormItem>
        <FormItem label="是否发送确认邮件">
          <Select
            v-model:value="createForm.confirmEmail"
            :options="emailOptions"
            class="w-full"
          />
        </FormItem>
        <FormItem label="审核A站">
          <RadioGroup v-model:value="createForm.auditSiteA">
            <Radio value="manual">手动审核</Radio>
            <Radio value="auto">自动审核</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="发货模式">
          <RadioGroup v-model:value="createForm.autoShip">
            <Radio :value="true">自动发货</Radio>
            <Radio :value="false">手动发货</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <template #footer>
        <Space>
          <Button type="primary" :loading="saving" @click="handleCreate">
            提交
          </Button>
          <Button @click="modalOpen = false">关闭</Button>
        </Space>
      </template>
    </Modal>
  </Page>
</template>
