import { requestClient } from '#/api/request';

export namespace MerchantApi {
  export interface Merchant {
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
    starred: boolean;
    nickname: string;
    avatar: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  }

  export interface MerchantOption {
    id: number;
    name: string;
    account: string;
  }

  export interface ListParams {
    name?: string;
    parentId?: number;
    status?: number;
    holdStatus?: number;
    mutualHoldStatus?: number;
  }

  export interface UpdatePayload {
    name?: string;
    contact?: string;
    parentId?: number;
    rateDiff?: number;
    holdRate?: number;
    mutualHoldRate?: number;
    confirmEmail?: number;
    auditSiteA?: 'auto' | 'manual';
    autoShip?: boolean;
    nickname?: string;
    password?: string;
    avatar?: string;
  }

  export interface UploadResult {
    url: string;
  }

  export interface CreatePayload {
    name: string;
    contact?: string;
    rateDiff?: number;
    holdRate?: number;
    mutualHoldRate?: number;
    confirmEmail?: number;
    auditSiteA?: 'auto' | 'manual';
    autoShip?: boolean;
  }
}

/** 限制模式编码 → 展示文案，后续扩展只加这里 */
export const MERCHANT_LIMIT_MODE_LABELS: Record<string, string> = {
  unified: '统一配置',
};

export function merchantLimitModeLabel(code?: string) {
  if (!code) {
    return MERCHANT_LIMIT_MODE_LABELS.unified;
  }
  return MERCHANT_LIMIT_MODE_LABELS[code] || code;
}

/** 商户列表 */
export async function getMerchantList(params?: MerchantApi.ListParams) {
  return requestClient.get<MerchantApi.Merchant[]>('/merchants', { params });
}

/** 上级下拉 */
export async function getMerchantOptions() {
  return requestClient.get<MerchantApi.MerchantOption[]>('/merchants/options');
}

/** 新建商户 */
export async function createMerchant(data: MerchantApi.CreatePayload) {
  return requestClient.post<MerchantApi.Merchant>('/merchants', data);
}

/** 设置星标 */
export async function setMerchantStarred(id: number, starred: boolean) {
  return requestClient.put<MerchantApi.Merchant>(`/merchants/${id}/star`, {
    starred,
  });
}

/** 启用/禁用 */
export async function setMerchantStatus(id: number, status: boolean) {
  return requestClient.put<MerchantApi.Merchant>(`/merchants/${id}/status`, {
    status,
  });
}

/** 编辑商户 / 用户信息 */
export async function updateMerchant(
  id: number,
  data: MerchantApi.UpdatePayload,
) {
  return requestClient.put<MerchantApi.Merchant>(`/merchants/${id}`, data);
}

/** 上传头像 */
export async function uploadMerchantAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file, file.name);
  return requestClient.post<MerchantApi.UploadResult>(
    '/upload/avatar',
    formData,
    {
      headers: {
        // 交给浏览器带 boundary，不要写成死的 multipart/form-data
        'Content-Type': undefined,
      },
    },
  );
}

export namespace MerchantGroupApi {
  export interface Merchant {
    id: number;
    name: string;
    account: string;
  }

  export interface Group {
    id: number;
    name: string;
    merchants: Merchant[];
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  }

  export interface ListParams {
    id?: number;
    name?: string;
  }

  export interface SavePayload {
    name: string;
    merchantIds: number[];
  }
}

/** 商户分组列表 */
export async function getMerchantGroupList(
  params?: MerchantGroupApi.ListParams,
) {
  return requestClient.get<MerchantGroupApi.Group[]>('/merchant-groups', {
    params,
  });
}

/** 新建商户分组 */
export async function createMerchantGroup(data: MerchantGroupApi.SavePayload) {
  return requestClient.post<MerchantGroupApi.Group>('/merchant-groups', data);
}

/** 编辑商户分组 */
export async function updateMerchantGroup(
  id: number,
  data: MerchantGroupApi.SavePayload,
) {
  return requestClient.put<MerchantGroupApi.Group>(
    `/merchant-groups/${id}`,
    data,
  );
}

/** 删除商户分组 */
export async function deleteMerchantGroup(id: number) {
  return requestClient.delete(`/merchant-groups/${id}`);
}
