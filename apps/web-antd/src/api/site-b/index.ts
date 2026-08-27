import { requestClient } from '#/api/request';

export namespace SiteBApi {
  export interface SiteB {
    id: number;
    domain: string;
    channel: string;
    channelEnabled: boolean;
    platformId: number;
    platform: string;
    platformName: string;
    framework: string;
    status: boolean;
    isFtp: boolean;
    host: string;
    account: string;
    password: string;
    linkAddress: string;
    runDirectory: string;
    remark: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  }

  export interface ListParams {
    id?: number;
    domain?: string;
    remark?: string;
    status?: '0' | '1' | '';
    platformId?: number;
  }

  export interface CreatePayload {
    domain: string;
    platformId: number;
    framework?: string;
    isFtp?: boolean;
    host?: string;
    account?: string;
    password?: string;
  }

  export interface UpdatePayload {
    host?: string;
    account?: string;
    password?: string;
  }
}

/** B 站列表 */
export async function getSiteBList(params?: SiteBApi.ListParams) {
  return requestClient.get<SiteBApi.SiteB[]>('/site-bs', { params });
}

/** 新增 B 站 */
export async function createSiteB(data: SiteBApi.CreatePayload) {
  return requestClient.post<SiteBApi.SiteB>('/site-bs', data);
}

/** 编辑 B 站 FTP 信息 */
export async function updateSiteB(id: number, data: SiteBApi.UpdatePayload) {
  return requestClient.put<SiteBApi.SiteB>(`/site-bs/${id}`, data);
}

/** 更新 B 站状态 */
export async function setSiteBStatus(id: number, status: boolean) {
  return requestClient.put<SiteBApi.SiteB>(`/site-bs/${id}/status`, { status });
}
