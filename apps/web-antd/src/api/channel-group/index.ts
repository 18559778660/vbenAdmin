import { requestClient } from '#/api/request';

export namespace ChannelGroupApi {
  export interface ChannelGroup {
    id: number;
    code: string;
    name: string;
    totalAmount: number;
    balance: number;
    dailyOrderLimit: number;
    dailyAmountLimit: number;
    dailyRecvCount: number;
    dailyRecvAmount: number;
    payFrequencyDays: number;
    failLimitCount: number;
    successLimitCount: number;
    interceptMode: string;
    interceptCurrency: string;
    interceptMax: number;
    interceptMin: number;
    oldCustomerDays: number;
    preferCountries: string[];
    disableCountries: string[];
    allowCountries: string[];
    allowCardTypes: string[];
    disableCardTypes: string[];
    disableCardBrands: string[];
    collectRule: string;
    autoShip: boolean;
    availableAccountCount: number;
    gatewayUrl: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  }

  export interface ListParams {
    id?: number;
    code?: string;
  }

  export interface CreatePayload {
    name: string;
    code: string;
    oldCustomerDays?: number;
    payFrequencyDays?: number;
    failLimitCount?: number;
    successLimitCount?: number;
    interceptMode?: string;
    interceptCurrency?: string;
    interceptMax?: number;
    interceptMin?: number;
    dailyOrderLimit?: number;
    dailyAmountLimit?: number;
    preferCountries?: string[];
    disableCountries?: string[];
    disableCardBrands?: string[];
    disableCardTypes?: string[];
    allowCountries?: string[];
    allowCardTypes?: string[];
    collectRule?: string;
    autoShip?: boolean;
  }

  export interface UpdatePayload {
    oldCustomerDays?: number;
    payFrequencyDays?: number;
    failLimitCount?: number;
    successLimitCount?: number;
    interceptMode?: string;
    interceptCurrency?: string;
    interceptMax?: number;
    interceptMin?: number;
    dailyOrderLimit?: number;
    dailyAmountLimit?: number;
    preferCountries?: string[];
    disableCountries?: string[];
    disableCardBrands?: string[];
    disableCardTypes?: string[];
    allowCountries?: string[];
    allowCardTypes?: string[];
    collectRule?: string;
    autoShip?: boolean;
  }

  export interface GroupAccount {
    id: number;
    channelName: string;
    inGroup: boolean;
    accountStatus: boolean;
    siteB: string;
    channel: string;
    remark: string;
    paymentMethod: string;
  }

  export interface GroupAccountListParams {
    channelId?: number;
  }
}

export async function getChannelGroupList(params?: ChannelGroupApi.ListParams) {
  return requestClient.get<ChannelGroupApi.ChannelGroup[]>('/channel-groups', {
    params,
  });
}

export async function createChannelGroup(data: ChannelGroupApi.CreatePayload) {
  return requestClient.post<ChannelGroupApi.ChannelGroup>(
    '/channel-groups',
    data,
  );
}

export async function updateChannelGroup(
  id: number,
  data: ChannelGroupApi.UpdatePayload,
) {
  return requestClient.put<ChannelGroupApi.ChannelGroup>(
    `/channel-groups/${id}`,
    data,
  );
}

export async function getChannelGroupAccounts(
  groupId: number,
  params?: ChannelGroupApi.GroupAccountListParams,
) {
  return requestClient.get<ChannelGroupApi.GroupAccount[]>(
    `/channel-groups/${groupId}/accounts`,
    { params },
  );
}

export async function setChannelGroupAccountMembership(
  groupId: number,
  accountId: number,
  inGroup: boolean,
) {
  return requestClient.put(
    `/channel-groups/${groupId}/accounts/${accountId}/membership`,
    { inGroup },
  );
}
