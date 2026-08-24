<script lang="ts" setup>
import type { AssignedAccountRow, AssignUserRow } from './shared';

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
  getUserAccounts,
  mockAssignUserList,
  nextUserIdValue,
  PAYMENT_METHOD_FILTER_OPTIONS,
  remarkText,
  SEARCH_FIELD_OPTIONS,
} from './shared';

defineOptions({ name: 'ChannelAssign' });

const searchForm = reactive({
  field: 'username',
  keyword: '',
});

const applied = reactive({
  field: 'username',
  keyword: '',
});

const createForm = reactive({
  username: '',
  nickname: '',
  password: '',
});

const accountSearchForm = reactive({
  paymentMethod: '',
});

const accountApplied = reactive({
  paymentMethod: '',
});

const loading = ref(false);
const saving = ref(false);
const createOpen = ref(false);
const accountOpen = ref(false);
const viewingUserId = ref<null | number>(null);
const selectedAccountKeys = ref<number[]>([]);

const columns = [
  {
    title: '操作',
    key: 'actions',
    width: 80,
    fixed: 'left' as const,
  },
  { title: '用户名', dataIndex: 'username', key: 'username', width: 160 },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 160 },
  { title: '备注', key: 'remark', width: 220 },
];

const accountColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  {
    title: '通道名',
    dataIndex: 'channelName',
    key: 'channelName',
    width: 160,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '账号状态', key: 'accountStatus', width: 100 },
  { title: 'B站', dataIndex: 'siteB', key: 'siteB', width: 160 },
  { title: '通道', dataIndex: 'channel', key: 'channel', width: 140 },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 120 },
];

const filteredList = computed(() => {
  return mockAssignUserList.value.filter((row) => {
    const keyword = applied.keyword.trim();
    if (!keyword) return true;
    if (applied.field === 'nickname') {
      return row.nickname.includes(keyword);
    }
    return row.username.includes(keyword);
  });
});

const filteredAccounts = computed(() => {
  if (!viewingUserId.value) return [];
  return getUserAccounts(viewingUserId.value).filter((row) => {
    if (
      accountApplied.paymentMethod &&
      row.paymentMethod !== accountApplied.paymentMethod
    ) {
      return false;
    }
    return true;
  });
});

function handleSearch() {
  applied.field = searchForm.field;
  applied.keyword = searchForm.keyword;
}

function resetSearch() {
  searchForm.field = 'username';
  searchForm.keyword = '';
  handleSearch();
}

function resetCreateForm() {
  createForm.username = '';
  createForm.nickname = '';
  createForm.password = '';
}

function openCreate() {
  resetCreateForm();
  createOpen.value = true;
}

function validateCreateForm() {
  const username = createForm.username.trim();
  const password = createForm.password;
  if (!username) {
    message.warning('请输入用户名');
    return false;
  }
  if (!/^[a-z0-9-]+$/i.test(username)) {
    message.warning('用户名可由英文字母、数字组成');
    return false;
  }
  if (!password) {
    message.warning('请输入密码');
    return false;
  }
  if (password.length < 6 || password.length > 20) {
    message.warning('密码需为 6-20 位');
    return false;
  }
  return true;
}

function handleCreateSave() {
  if (!validateCreateForm()) return;
  saving.value = true;
  mockAssignUserList.value.unshift({
    id: nextUserIdValue(),
    username: createForm.username.trim(),
    nickname: createForm.nickname.trim() || createForm.username.trim(),
    assignedCount: 0,
  });
  saving.value = false;
  createOpen.value = false;
  message.success('已新增（静态，未接后端）');
}

function onViewAccounts(row: AssignUserRow) {
  viewingUserId.value = row.id;
  accountSearchForm.paymentMethod = '';
  accountApplied.paymentMethod = '';
  selectedAccountKeys.value = [];
  accountOpen.value = true;
}

function onToggleAccountStatus(
  row: AssignedAccountRow,
  checked: boolean | number | string,
) {
  row.status = Boolean(checked);
}

function onAccountSelectionChange(keys: (number | string)[]) {
  selectedAccountKeys.value = keys.map(Number);
}

function handleAccountSearch() {
  accountApplied.paymentMethod = accountSearchForm.paymentMethod;
}

function resetAccountSearch() {
  accountSearchForm.paymentMethod = '';
  accountApplied.paymentMethod = '';
}
</script>

<template>
  <Page auto-content-height description="当前为静态预览，数据未接后端">
    <Card class="mb-4" :bordered="false">
      <Form layout="inline" class="gap-y-3">
        <FormItem>
          <Input.Group compact class="flex">
            <Select
              v-model:value="searchForm.field"
              :options="SEARCH_FIELD_OPTIONS"
              class="!w-28"
            />
            <Input
              v-model:value="searchForm.keyword"
              allow-clear
              class="!w-44"
              placeholder="请输入"
            />
          </Input.Group>
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
      <div class="mb-4">
        <Button type="primary" @click="openCreate">
          <template #icon>
            <IconifyIcon icon="lucide:plus" />
          </template>
          新增
        </Button>
      </div>

      <Table
        :columns="columns"
        :data-source="filteredList"
        :loading="loading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :scroll="{ x: 800 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <Tooltip title="账号列表">
              <Button
                size="small"
                type="link"
                @click="onViewAccounts(record as AssignUserRow)"
              >
                <IconifyIcon class="size-4" icon="lucide:list" />
              </Button>
            </Tooltip>
          </template>
          <template v-else-if="column.key === 'remark'">
            <span
              :class="
                record.assignedCount > 0 ? 'text-green-600' : 'text-red-500'
              "
            >
              <IconifyIcon
                v-if="record.assignedCount > 0"
                class="mr-1 inline size-3.5"
                icon="lucide:arrow-up-right"
              />
              {{ remarkText(record as AssignUserRow) }}
            </span>
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
        <FormItem label="用户名" required>
          <Input
            v-model:value="createForm.username"
            placeholder="请输入用户名"
          />
          <div class="text-muted-foreground mt-1 text-xs">
            必填，可由英文字母、数字组成
          </div>
        </FormItem>
        <FormItem label="昵称">
          <Input v-model:value="createForm.nickname" placeholder="请输入昵称" />
          <div class="text-muted-foreground mt-1 text-xs">可以是中文</div>
        </FormItem>
        <FormItem label="密码" required>
          <InputPassword
            v-model:value="createForm.password"
            placeholder="请输入密码"
          />
          <div class="text-muted-foreground mt-1 text-xs">必填，6-20位</div>
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
      v-model:open="accountOpen"
      :footer="null"
      destroy-on-close
      title="账号列表"
      width="1100px"
    >
      <Form layout="inline" class="mb-4 gap-y-3">
        <FormItem label="支付方式">
          <Select
            v-model:value="accountSearchForm.paymentMethod"
            :options="PAYMENT_METHOD_FILTER_OPTIONS"
            class="w-40"
            placeholder="支付方式"
          />
        </FormItem>
        <FormItem>
          <Space>
            <Button type="primary" @click="handleAccountSearch">
              <template #icon>
                <IconifyIcon icon="lucide:search" />
              </template>
              搜索
            </Button>
            <Button @click="resetAccountSearch">
              <template #icon>
                <IconifyIcon icon="lucide:rotate-ccw" />
              </template>
              重置
            </Button>
          </Space>
        </FormItem>
      </Form>

      <Table
        :columns="accountColumns"
        :data-source="filteredAccounts"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :row-selection="{
          selectedRowKeys: selectedAccountKeys,
          onChange: onAccountSelectionChange,
        }"
        :scroll="{ x: 980 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <Switch
              :checked="record.status"
              size="small"
              @change="
                (checked) =>
                  onToggleAccountStatus(record as AssignedAccountRow, checked)
              "
            />
          </template>
          <template v-else-if="column.key === 'accountStatus'">
            <Tag :color="record.accountStatus ? 'green' : 'orange'">
              {{ record.accountStatus ? '启用' : '禁用' }}
            </Tag>
          </template>
        </template>
      </Table>
    </Modal>
  </Page>
</template>
