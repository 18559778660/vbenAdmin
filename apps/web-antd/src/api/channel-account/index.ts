import { requestClient } from '#/api/request';

export namespace ChannelAccountApi {
  export interface ChannelAccount {
    id: number;
    channelId: number;
    channel: string;
    siteBId: number;
    siteB: string;
    accountNo: string;
    alias: string;
    remark: string;
    paymentMethod: string;
    groupNames: string[];
    assignedUser: string;
    totalReceived: number;
    status: boolean;
    resetTimezone: string;
    resetHour: number;
    dailyOrderLimit: number;
    dailyAmountLimit: number;
    dailyRecvCount: number;
    dailyRecvAmount: number;
    interceptMode: string;
    interceptCurrency: string;
    interceptMax: number;
    interceptMin: number;
    amountLimitMode: string;
    calcCurrency: string;
    currencies: string[];
    allowCountries: string[];
    preferCountries: string[];
    disableCountries: string[];
    allowCardTypes: string[];
    disableCardTypes: string[];
    disableCardBrands: string[];
    payFrequency: number;
    successCountLimit: number;
    maxSuccessCount: number;
    successMode: string;
    sort: number;
    appId: string;
    merchantId: string;
    webSecret: string;
    privateKey: string;
    environment: string;
    unpaidClosed: boolean;
    restrictedClosed: boolean;
    cannotOpenAt8: boolean;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  }

  export interface ListParams {
    id?: number;
    channelId?: number;
    channelName?: string;
    alias?: string;
    remark?: string;
    groupId?: number;
    assignedUser?: string;
    createdFrom?: string;
    createdTo?: string;
    listFilter?: '' | 'closed8' | 'restricted' | 'unpaid';
  }

  export interface CreatePayload {
    channelId: number;
    siteBId: number;
    accountNo: string;
    alias?: string;
    status?: boolean;
    resetHour?: number;
    dailyOrderLimit?: number;
    dailyAmountLimit?: number;
    calcCurrency?: string;
    currencies?: string[];
    preferCountries?: string[];
    disableCountries?: string[];
    sort?: number;
    appId?: string;
    webSecret?: string;
    privateKey?: string;
    remark?: string;
  }

  export interface UpdatePayload {
    accountNo: string;
    alias?: string;
    status?: boolean;
    siteBId: number;
    sort?: number;
    appId?: string;
    merchantId?: string;
    webSecret?: string;
    privateKey?: string;
    environment?: string;
    remark?: string;
  }

  export interface UpdateLimitsPayload {
    resetHour?: number;
    dailyAmountLimit?: number;
    currencies?: string[];
    successCountLimit?: number;
    allowCountries?: string[];
    amountLimitMode?: string;
    interceptMax?: number;
    allowCardTypes?: string[];
    disableCardBrands?: string[];
    dailyOrderLimit?: number;
    maxSuccessCount?: number;
    payFrequency?: number;
    preferCountries?: string[];
    disableCountries?: string[];
    calcCurrency?: string;
    interceptMin?: number;
    disableCardTypes?: string[];
  }
}

/** 通道账号列表 */
export async function getChannelAccountList(
  params?: ChannelAccountApi.ListParams,
) {
  return requestClient.get<ChannelAccountApi.ChannelAccount[]>(
    '/channel-accounts',
    { params },
  );
}

/** 新增通道账号 */
export async function createChannelAccount(
  data: ChannelAccountApi.CreatePayload,
) {
  return requestClient.post<ChannelAccountApi.ChannelAccount>(
    '/channel-accounts',
    data,
  );
}

/** 编辑通道账号 */
export async function updateChannelAccount(
  id: number,
  data: ChannelAccountApi.UpdatePayload,
) {
  return requestClient.put<ChannelAccountApi.ChannelAccount>(
    `/channel-accounts/${id}`,
    data,
  );
}

/** 更新限制配置 */
export async function updateChannelAccountLimits(
  id: number,
  data: ChannelAccountApi.UpdateLimitsPayload,
) {
  return requestClient.put<ChannelAccountApi.ChannelAccount>(
    `/channel-accounts/${id}/limits`,
    data,
  );
}

/** 更新通道账号状态 */
export async function setChannelAccountStatus(id: number, status: boolean) {
  return requestClient.put<ChannelAccountApi.ChannelAccount>(
    `/channel-accounts/${id}/status`,
    { status },
  );
}
