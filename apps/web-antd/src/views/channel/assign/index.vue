<script lang="ts" setup>
import type { AssignedAccountRow, AssignUserRow } from './shared';

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

import { getChannelList } from '#/api/channel';
import {
  createAssignUser,
  getAssignUserAccounts,
  getAssignUserList,
  setAssignUserAccountAssignment,
} from '#/api/channel-assign';

import { remarkText, SEARCH_FIELD_OPTIONS } from './shared';

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
  channelId: undefined as number | undefined,
});

const accountApplied = reactive({
  channelId: undefined as number | undefined,
});

const loading = ref(false);
const saving = ref(false);
const createOpen = ref(false);
const accountOpen = ref(false);
const viewingUserId = ref<null | number>(null);
const list = ref<AssignUserRow[]>([]);
const accountList = ref<AssignedAccountRow[]>([]);
const accountLoading = ref(false);
const assignmentSavingId = ref<null | number>(null);

const channelOptions = ref<{ label: string; value: number }[]>([]);

const channelFilterOptions = computed(() => [
  { label: '全部', value: undefined },
  ...channelOptions.value,
]);

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
  { title: '状态', key: 'assigned', width: 80 },
  { title: '账号状态', key: 'accountStatus', width: 100 },
  { title: 'B站', dataIndex: 'siteB', key: 'siteB', width: 160 },
  { title: '通道', dataIndex: 'channel', key: 'channel', width: 140 },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 120 },
];

const filteredList = computed(() => list.value);

const filteredAccounts = computed(() => accountList.value);

async function loadChannelOptions() {
  try {
    const rows = await getChannelList();
    channelOptions.value = rows.map((row) => ({
      label: row.name,
      value: row.id,
    }));
  } catch {
    channelOptions.value = [];
  }
}

async function loadList() {
  loading.value = true;
  try {
    list.value = await getAssignUserList({
      field: applied.field,
      keyword: applied.keyword.trim() || undefined,
    });
  } catch (error) {
    list.value = [];
    message.error(error instanceof Error ? error.message : '加载列表失败');
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  applied.field = searchForm.field;
  applied.keyword = searchForm.keyword;
  void loadList();
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

async function handleCreateSave() {
  if (!validateCreateForm()) return;
  saving.value = true;
  try {
    await createAssignUser({
      username: createForm.username.trim(),
      nickname: createForm.nickname.trim() || undefined,
      password: createForm.password,
    });
    createOpen.value = false;
    message.success('已新增');
    await loadList();
  } catch (error) {
    message.error(error instanceof Error ? error.message : '新增失败');
  } finally {
    saving.value = false;
  }
}

function onViewAccounts(row: AssignUserRow) {
  viewingUserId.value = row.id;
  accountSearchForm.channelId = undefined;
  accountApplied.channelId = undefined;
  accountOpen.value = true;
  void loadAssignAccounts();
}

async function loadAssignAccounts() {
  if (!viewingUserId.value) return;
  accountLoading.value = true;
  try {
    accountList.value = await getAssignUserAccounts(viewingUserId.value, {
      channelId: accountApplied.channelId,
    });
  } catch (error) {
    accountList.value = [];
    message.error(error instanceof Error ? error.message : '加载账号列表失败');
  } finally {
    accountLoading.value = false;
  }
}

async function handleAssignmentChange(
  record: AssignedAccountRow,
  checked: boolean,
) {
  if (!viewingUserId.value) {
    return;
  }
  assignmentSavingId.value = record.id;
  try {
    await setAssignUserAccountAssignment(
      viewingUserId.value,
      record.id,
      checked,
    );
    record.assigned = checked;
    message.success(checked ? '已分配给当前子账号' : '已取消分配');
    await loadList();
  } catch (error) {
    message.error(error instanceof Error ? error.message : '操作失败');
  } finally {
    assignmentSavingId.value = null;
  }
}

function handleAccountSearch() {
  accountApplied.channelId = accountSearchForm.channelId;
  void loadAssignAccounts();
}

function resetAccountSearch() {
  accountSearchForm.channelId = undefined;
  accountApplied.channelId = undefined;
  void loadAssignAccounts();
}

onMounted(() => {
  void loadChannelOptions();
  void loadList();
});
</script>

<template>
  <Page auto-content-height>
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
        <FormItem label="通道">
          <Select
            v-model:value="accountSearchForm.channelId"
            :options="channelFilterOptions"
            allow-clear
            class="w-48"
            placeholder="通道"
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
        :loading="accountLoading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :scroll="{ x: 980 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'assigned'">
            <Switch
              :checked="record.assigned"
              :loading="assignmentSavingId === record.id"
              size="small"
              @change="
                (checked) =>
                  handleAssignmentChange(
                    record as AssignedAccountRow,
                    Boolean(checked),
                  )
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
