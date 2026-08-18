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
