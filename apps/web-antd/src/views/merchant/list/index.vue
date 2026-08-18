<script lang="ts" setup>
import type { MerchantApi } from '#/api/merchant';

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
  Radio,
  RadioGroup,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'ant-design-vue';

import {
  createMerchant,
  getMerchantList,
  getMerchantOptions,
  setMerchantStarred,
  setMerchantStatus,
} from '#/api/merchant';

defineOptions({ name: 'MerchantList' });

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
const list = ref<MerchantApi.Merchant[]>([]);
const parentOptions = ref<{ label: string; value: number }[]>([]);

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
  { title: '审核A站', dataIndex: 'auditSiteA', key: 'auditSiteA', width: 110 },
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

const parentSelectOptions = computed(() => parentOptions.value);

function buildQuery(): MerchantApi.ListParams {
  const params: MerchantApi.ListParams = {};
  if (searchForm.merchant.trim()) {
    params.name = searchForm.merchant.trim();
  }
  if (searchForm.parentId !== undefined) {
    params.parentId = searchForm.parentId;
  }
  if (searchForm.status !== '') {
    params.status = searchForm.status;
  }
  if (searchForm.holdStatus !== '') {
    params.holdStatus = searchForm.holdStatus;
  }
  if (searchForm.mutualHoldStatus !== '') {
    params.mutualHoldStatus = searchForm.mutualHoldStatus;
  }
  return params;
}

async function loadList() {
  loading.value = true;
  try {
    list.value = await getMerchantList(buildQuery());
  } finally {
    loading.value = false;
  }
}

async function loadOptions() {
  const opts = await getMerchantOptions();
  parentOptions.value = opts.map((item) => ({
    label: `${item.name}（${item.account}）`,
    value: item.id,
  }));
}

function resetSearch() {
  searchForm.merchant = '';
  searchForm.parentId = undefined;
  searchForm.status = '';
  searchForm.holdStatus = '';
  searchForm.mutualHoldStatus = '';
  void loadList();
}

async function handleSearch() {
  await loadList();
}

async function handleRefresh() {
  await Promise.all([loadList(), loadOptions()]);
  message.success('已刷新');
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

async function handleCreate() {
  const name = createForm.name.trim();
  if (!name) {
    message.warning('请输入商户名');
    return;
  }
  if (!/^[a-zA-Z0-9-]+$/.test(name)) {
    message.warning('商户名可由英文字母、数字、- 组成');
    return;
  }
  if (createForm.rateDiff < 0 || createForm.rateDiff > 100) {
    message.warning('汇率偏差范围为 0~100');
    return;
  }

  saving.value = true;
  try {
    const created = await createMerchant({
      name,
      contact: createForm.contact.trim(),
      rateDiff: createForm.rateDiff,
      holdRate: createForm.holdRate,
      mutualHoldRate: createForm.mutualHoldRate,
      confirmEmail: createForm.confirmEmail,
      auditSiteA: createForm.auditSiteA,
      autoShip: createForm.autoShip,
    });
    modalOpen.value = false;
    message.success(
      `创建成功。登录账号：${created.account}，密码：${created.password}`,
    );
    await Promise.all([loadList(), loadOptions()]);
  } finally {
    saving.value = false;
  }
}

function onEdit(row: MerchantApi.Merchant) {
  message.info(`编辑商户 ${row.name}（后续接接口）`);
}

function onResetPassword(row: MerchantApi.Merchant) {
  message.info(`重置密码 ${row.name}（后续接接口）`);
}

async function copyText(text: string, label = '内容') {
  if (!text) {
    message.warning(`暂无${label}`);
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    message.success(`${label}已复制`);
  } catch {
    message.error('复制失败');
  }
}

async function onToggleStar(row: MerchantApi.Merchant) {
  const next = !row.starred;
  try {
    const updated = await setMerchantStarred(row.id, next);
    row.starred = updated.starred;
    row.updatedBy = updated.updatedBy;
    row.updatedAt = updated.updatedAt;
    message.success(next ? '已加星标' : '已取消星标');
  } catch {
    // 错误提示由请求拦截器处理
  }
}

async function onToggleStatus(
  row: MerchantApi.Merchant,
  checked: boolean | number | string,
) {
  const enabled = Boolean(checked);
  const prev = row.status;
  row.status = enabled;
  try {
    const updated = await setMerchantStatus(row.id, enabled);
    row.status = updated.status;
    row.updatedBy = updated.updatedBy;
    row.updatedAt = updated.updatedAt;
    message.success(enabled ? '已启用' : '已禁用');
  } catch {
    row.status = prev;
  }
}

onMounted(async () => {
  await Promise.all([loadList(), loadOptions()]);
});
</script>

<template>
  <Page auto-content-height description="商户列表，新建后可用账号密码登录后台">
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
            :options="parentSelectOptions"
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
        :data-source="list"
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
                  @click="onEdit(record as MerchantApi.Merchant)"
                >
                  <IconifyIcon class="size-4" icon="lucide:pencil" />
                </Button>
              </Tooltip>
              <Tooltip title="重置密码">
                <Button
                  size="small"
                  type="link"
                  @click="onResetPassword(record as MerchantApi.Merchant)"
                >
                  <IconifyIcon class="size-4" icon="lucide:key-round" />
                </Button>
              </Tooltip>
              <Tooltip :title="record.starred ? '取消星标' : '星标'">
                <Button
                  size="small"
                  type="link"
                  @click="onToggleStar(record as MerchantApi.Merchant)"
                >
                  <IconifyIcon
                    class="size-4"
                    icon="lucide:star"
                    :style="{ color: record.starred ? '#faad14' : undefined }"
                  />
                </Button>
              </Tooltip>
            </Space>
          </template>
          <template v-else-if="column.key === 'autoShip'">
            {{ record.autoShip ? '自动发货' : '手动发货' }}
          </template>
          <template v-else-if="column.key === 'auditSiteA'">
            {{
              (record as MerchantApi.Merchant).auditSiteA === 'auto'
                ? '自动审核'
                : '手动审核'
            }}
          </template>
          <template v-else-if="column.key === 'confirmEmail'">
            <Switch v-model:checked="record.confirmEmail" size="small" />
          </template>
          <template v-else-if="column.key === 'status'">
            <Switch
              :checked="(record as MerchantApi.Merchant).status"
              size="small"
              @change="
                (checked) =>
                  onToggleStatus(record as MerchantApi.Merchant, checked)
              "
            />
          </template>
          <template v-else-if="column.key === 'limitMode'">
            <Tag color="gold">{{ record.limitMode || '统一配置' }}</Tag>
          </template>
          <template v-else-if="column.key === 'secretKey'">
            <div class="flex min-w-0 items-center gap-1">
              <span
                class="truncate"
                :title="(record as MerchantApi.Merchant).secretKey"
              >
                {{ (record as MerchantApi.Merchant).secretKey || '-' }}
              </span>
              <Tooltip
                v-if="(record as MerchantApi.Merchant).secretKey"
                title="复制密钥"
              >
                <Button
                  size="small"
                  type="link"
                  @click="
                    copyText((record as MerchantApi.Merchant).secretKey, '密钥')
                  "
                >
                  <IconifyIcon class="size-4" icon="lucide:copy" />
                </Button>
              </Tooltip>
            </div>
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
            必填，可由英文字母、数字、- 组成
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
