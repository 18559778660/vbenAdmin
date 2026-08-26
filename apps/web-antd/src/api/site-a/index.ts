import { requestClient } from '#/api/request';

export namespace SiteAApi {
  export type Status = 'audited' | 'disabled' | 'pending';

  export interface SiteA {
    id: number;
    merchantId: number;
    merchantName: string;
    domain: string;
    framework: string;
    status: Status;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  }

  export interface ListParams {
    merchantId?: number;
    domain?: string;
    status?: '' | Status;
  }

  export interface CreatePayload {
    merchantId: number;
    domain: string;
    framework: string;
  }

  export interface BatchStatusPayload {
    ids: number[];
    status: Status;
  }

  export interface BatchStatusResult {
    count: number;
  }
}

/** A 站列表 */
export async function getSiteAList(params?: SiteAApi.ListParams) {
  return requestClient.get<SiteAApi.SiteA[]>('/site-as', { params });
}

/** 新增 A 站 */
export async function createSiteA(data: SiteAApi.CreatePayload) {
  return requestClient.post<SiteAApi.SiteA>('/site-as', data);
}

/** 批量更新 A 站状态 */
export async function batchUpdateSiteAStatus(
  data: SiteAApi.BatchStatusPayload,
) {
  return requestClient.put<SiteAApi.BatchStatusResult>(
    '/site-as/batch-status',
    data,
  );
}
