import { requestClient } from '#/api/request';

export namespace SystemMenuApi {
  export interface SystemMenu {
    id: number;
    parentId: number;
    name: string;
    title: string;
    path: string;
    component?: string;
    icon?: string;
    authCode?: string;
    type: number;
    sort: number;
    status: number;
    meta?: Record<string, any>;
    children?: SystemMenu[];
  }

  export type MenuPayload = Omit<SystemMenu, 'children' | 'id'>;
}

/** 菜单树列表 */
export async function getMenuList() {
  return requestClient.get<SystemMenuApi.SystemMenu[]>('/system/menu/list');
}

/** 路由 Name 是否已存在 */
export async function isMenuNameExists(name: string, id?: number) {
  return requestClient.get<boolean>('/system/menu/name-exists', {
    params: { id, name },
  });
}

/** 路径是否已存在 */
export async function isMenuPathExists(path: string, id?: number) {
  return requestClient.get<boolean>('/system/menu/path-exists', {
    params: { id, path },
  });
}

/** 创建菜单 */
export async function createMenu(data: SystemMenuApi.MenuPayload) {
  return requestClient.post('/system/menu', data);
}

/** 更新菜单 */
export async function updateMenu(id: number, data: SystemMenuApi.MenuPayload) {
  return requestClient.put(`/system/menu/${id}`, data);
}

/** 删除菜单 */
export async function deleteMenu(id: number) {
  return requestClient.delete(`/system/menu/${id}`);
}
