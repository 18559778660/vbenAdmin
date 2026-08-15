<script lang="ts" setup>
import type { SystemMenuApi } from '#/api/system/menu';

import { computed, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  Button,
  Form,
  FormItem,
  Input,
  InputNumber,
  message,
  Modal,
  RadioButton,
  RadioGroup,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  TreeSelect,
} from 'ant-design-vue';

import {
  createMenu,
  deleteMenu,
  getMenuList,
  updateMenu,
} from '#/api/system/menu';

defineOptions({ name: 'PermissionMenu' });

const loading = ref(false);
const saving = ref(false);
const menus = ref<SystemMenuApi.SystemMenu[]>([]);
const modalOpen = ref(false);
const editingId = ref<null | number>(null);

const typeOptions = [
  { label: '目录', value: 0 },
  { label: '菜单', value: 1 },
  { label: '按钮', value: 2 },
];

const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
];

const form = reactive({
  parentId: 0,
  name: '',
  title: '',
  path: '',
  component: '',
  icon: '',
  authCode: '',
  type: 1,
  sort: 0,
  status: 1,
  hideInMenu: false,
  hideChildrenInMenu: false,
  affixTab: false,
});

const isEdit = computed(() => editingId.value !== null);

const parentTreeData = computed(() => {
  const mapNode = (nodes: SystemMenuApi.SystemMenu[]): any[] =>
    nodes
      .filter((item) => item.type !== 2)
      .map((item) => ({
        title: item.title,
        value: item.id,
        key: item.id,
        children: item.children?.length ? mapNode(item.children) : undefined,
      }));
  return [
    { title: '顶级菜单', value: 0, key: 0, children: mapNode(menus.value) },
  ];
});

const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: 220,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 90,
  },
  {
    title: '路由 Name',
    dataIndex: 'name',
    key: 'name',
    width: 160,
  },
  {
    title: '路径',
    dataIndex: 'path',
    key: 'path',
    width: 180,
  },
  {
    title: '组件',
    dataIndex: 'component',
    key: 'component',
    ellipsis: true,
  },
  {
    title: '权限码',
    dataIndex: 'authCode',
    key: 'authCode',
    width: 160,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 80,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 90,
  },
  {
    title: '操作',
    key: 'action',
    width: 220,
    fixed: 'right' as const,
  },
];

function typeLabel(type: number) {
  return typeOptions.find((item) => item.value === type)?.label ?? String(type);
}

function typeColor(type: number) {
  if (type === 0) return 'processing';
  if (type === 2) return 'error';
  return 'default';
}

async function loadMenus() {
  loading.value = true;
  try {
    menus.value = await getMenuList();
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.parentId = 0;
  form.name = '';
  form.title = '';
  form.path = '';
  form.component = '';
  form.icon = '';
  form.authCode = '';
  form.type = 1;
  form.sort = 0;
  form.status = 1;
  form.hideInMenu = false;
  form.hideChildrenInMenu = false;
  form.affixTab = false;
}

function openCreate(parentId = 0) {
  editingId.value = null;
  resetForm();
  form.parentId = parentId;
  modalOpen.value = true;
}

function openEdit(row: SystemMenuApi.SystemMenu) {
  editingId.value = row.id;
  form.parentId = row.parentId ?? 0;
  form.name = row.name;
  form.title = row.title;
  form.path = row.path ?? '';
  form.component = row.component ?? '';
  form.icon = row.icon ?? '';
  form.authCode = row.authCode ?? '';
  form.type = row.type;
  form.sort = row.sort ?? 0;
  form.status = row.status ?? 1;
  form.hideInMenu = !!row.meta?.hideInMenu;
  form.hideChildrenInMenu = !!row.meta?.hideChildrenInMenu;
  form.affixTab = !!row.meta?.affixTab;
  modalOpen.value = true;
}

function onParentChange(value: null | number | string | undefined) {
  form.parentId = Number(value ?? 0);
}

function buildPayload(): SystemMenuApi.MenuPayload {
  const meta: Record<string, any> = {};
  if (form.hideInMenu) meta.hideInMenu = true;
  if (form.hideChildrenInMenu) meta.hideChildrenInMenu = true;
  if (form.affixTab) meta.affixTab = true;
  return {
    parentId: form.parentId || 0,
    name: form.name.trim(),
    title: form.title.trim(),
    path: form.path.trim(),
    component: form.type === 1 ? form.component.trim() : '',
    icon: form.icon.trim(),
    authCode: form.authCode.trim(),
    type: form.type,
    sort: form.sort,
    status: form.status,
    meta,
  };
}

async function handleSave() {
  if (!form.name.trim() || !form.title.trim()) {
    message.warning('请填写路由 Name 和标题');
    return;
  }
  saving.value = true;
  try {
    const payload = buildPayload();
    if (editingId.value) {
      await updateMenu(editingId.value, payload);
      message.success('更新成功');
    } else {
      await createMenu(payload);
      message.success('创建成功');
    }
    modalOpen.value = false;
    await loadMenus();
  } finally {
    saving.value = false;
  }
}

function handleDelete(row: SystemMenuApi.SystemMenu) {
  Modal.confirm({
    title: '确认删除',
    content: `确定删除菜单「${row.title}」吗？有子菜单时无法删除。`,
    okType: 'danger',
    async onOk() {
      await deleteMenu(row.id);
      message.success('删除成功');
      await loadMenus();
    },
  });
}

function onEditClick(record: Record<string, any>) {
  openEdit(record as SystemMenuApi.SystemMenu);
}

function onDeleteClick(record: Record<string, any>) {
  handleDelete(record as SystemMenuApi.SystemMenu);
}

function onAppendClick(record: Record<string, any>) {
  openCreate(Number(record.id) || 0);
}

onMounted(loadMenus);
</script>

<template>
  <Page
    auto-content-height
    description="维护侧边栏菜单，改完后重新登录或刷新即可生效"
  >
    <div class="bg-card rounded-lg p-4">
      <div class="mb-4 flex justify-end">
        <Button type="primary" @click="openCreate(0)">新增菜单</Button>
      </div>

      <Table
        :columns="columns"
        :data-source="menus"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1200 }"
        children-column-name="children"
        default-expand-all-rows
        row-key="id"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <div class="flex items-center gap-2">
              <IconifyIcon
                v-if="record.icon"
                :icon="record.icon"
                class="size-4"
              />
              <span>{{ record.title }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'type'">
            <Tag :color="typeColor(record.type)">
              {{ typeLabel(record.type) }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="record.status === 1 ? 'success' : 'default'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Space>
              <Button
                v-if="record.type !== 2"
                size="small"
                type="link"
                @click="onAppendClick(record)"
              >
                新增下级
              </Button>
              <Button size="small" type="link" @click="onEditClick(record)">
                编辑
              </Button>
              <Button
                danger
                size="small"
                type="link"
                @click="onDeleteClick(record)"
              >
                删除
              </Button>
            </Space>
          </template>
        </template>
      </Table>
    </div>

    <Modal
      v-model:open="modalOpen"
      :confirm-loading="saving"
      :title="isEdit ? '编辑菜单' : '新增菜单'"
      destroy-on-close
      width="640px"
      @ok="handleSave"
    >
      <Form class="mt-4" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <FormItem label="类型" required>
          <RadioGroup v-model:value="form.type" button-style="solid">
            <RadioButton
              v-for="item in typeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </RadioButton>
          </RadioGroup>
        </FormItem>
        <FormItem label="上级菜单">
          <TreeSelect
            v-model:value="form.parentId"
            :tree-data="parentTreeData"
            allow-clear
            class="w-full"
            placeholder="选择上级，默认顶级"
            tree-default-expand-all
            @change="onParentChange"
          />
        </FormItem>
        <FormItem label="路由 Name" required>
          <Input
            v-model:value="form.name"
            placeholder="如 ChannelList，需唯一"
          />
        </FormItem>
        <FormItem label="标题" required>
          <Input v-model:value="form.title" placeholder="侧边栏显示标题" />
        </FormItem>
        <FormItem v-if="form.type !== 2" label="路径">
          <Input v-model:value="form.path" placeholder="如 /channel/list" />
        </FormItem>
        <FormItem v-if="form.type === 1" label="组件">
          <Input
            v-model:value="form.component"
            placeholder="如 /permission/menu/index"
          />
        </FormItem>
        <FormItem v-if="form.type !== 2" label="图标">
          <Input v-model:value="form.icon" placeholder="如 lucide:menu" />
        </FormItem>
        <FormItem label="权限码">
          <Input
            v-model:value="form.authCode"
            placeholder="如 system:menu:list"
          />
        </FormItem>
        <FormItem label="排序">
          <InputNumber v-model:value="form.sort" class="w-full" />
        </FormItem>
        <FormItem label="状态">
          <Select
            v-model:value="form.status"
            :options="statusOptions"
            class="w-full"
          />
        </FormItem>
        <FormItem v-if="form.type !== 2" label="隐藏菜单">
          <Switch v-model:checked="form.hideInMenu" />
        </FormItem>
        <FormItem v-if="form.type === 0" label="隐藏子菜单">
          <Switch v-model:checked="form.hideChildrenInMenu" />
        </FormItem>
        <FormItem v-if="form.type === 1" label="固定标签">
          <Switch v-model:checked="form.affixTab" />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
