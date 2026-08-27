import { requestClient } from '#/api/request';

export namespace ChannelApi {
  export interface Channel {
    id: number;
    name: string;
    platformId: number;
    platform: string;
    platformName: string;
    packageName: string;
    packageUrl: string;
    totalAmount: number;
    balance: number;
    dailyOrderLimit: number;
    dailyAmountLimit: number;
    dailyRecvCount: number;
    dailyRecvAmount: number;
    interceptMode: string;
    interceptCurrency: string;
    interceptMax: number;
    interceptMin: number;
    status: boolean;
    paymentMode: string;
    gatewayUrl: string;
    successMode: string;
    countries: string[];
    currencies: string[];
    remark: string;
    settleRate: number;
    siteBGroup: string;
    channelCode: string;
    payCode: string;
    orderNoMode: string;
    productInfo: string;
    returnVerify: string;
    oldCustomerDays: number;
    payParams: string;
    returnIpWhitelist: string;
    payFrequency: number;
    failCount: number;
    successCount: number;
    failAutoClose: number;
    mutualHoldAmount: number;
    amountLimitMode: string;
    calcCurrency: string;
    allowCountries: string[];
    preferCountries: string[];
    disableCountries: string[];
    allowCardTypes: string[];
    disableCardTypes: string[];
    disableCardBrands: string[];
    mixers: string[];
    collectRule: string;
    shipRange: string;
    sort: number;
    autoShip: boolean;
    returnKeywords: string;
    disableBrandWords: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  }

  export interface ListParams {
    id?: number;
    name?: string;
  }

  export interface PlatformOption {
    id: number;
    code: string;
    label: string;
  }

  export interface CreatePayload {
    name: string;
    platformId: number;
    paymentMode?: string;
    siteBGroup?: string;
    orderNoMode?: string;
    settleRate?: number;
    payParams?: string;
    productInfo?: string;
    channelCode?: string;
    payCode?: string;
    returnVerify?: string;
    oldCustomerDays?: number;
    returnIpWhitelist?: string;
  }

  export interface UpdatePayload {
    name: string;
    payCode?: string;
    paymentMode?: string;
    mixers?: string[];
    settleRate?: number;
    remark?: string;
    returnIpWhitelist?: string;
    disableBrandWords?: string;
    collectRule?: string;
    shipRange?: string;
    orderNoMode?: string;
    sort?: number;
    productInfo?: string;
    returnVerify?: string;
    oldCustomerDays?: number;
    autoShip?: boolean;
    returnKeywords?: string;
  }

  export interface LimitsPayload {
    channelCode?: string;
    dailyAmountLimit?: number;
    payFrequency?: number;
    failCount?: number;
    amountLimitMode?: string;
    interceptMax?: number;
    currencies?: string[];
    allowCountries?: string[];
    allowCardTypes?: string[];
    disableCardBrands?: string[];
    dailyOrderLimit?: number;
    mutualHoldAmount?: number;
    successCount?: number;
    failAutoClose?: number;
    calcCurrency?: string;
    interceptMin?: number;
    preferCountries?: string[];
    disableCountries?: string[];
    disableCardTypes?: string[];
  }
}

export async function getChannelList(params?: ChannelApi.ListParams) {
  return requestClient.get<ChannelApi.Channel[]>('/channels', { params });
}

/** 通道平台分类下拉 */
export async function getChannelPlatformOptions() {
  return requestClient.get<ChannelApi.PlatformOption[]>('/channels/platforms');
}

export async function createChannel(data: ChannelApi.CreatePayload) {
  return requestClient.post<ChannelApi.Channel>('/channels', data);
}

export async function updateChannel(
  id: number,
  data: ChannelApi.UpdatePayload,
) {
  return requestClient.put<ChannelApi.Channel>(`/channels/${id}`, data);
}

export async function updateChannelLimits(
  id: number,
  data: ChannelApi.LimitsPayload,
) {
  return requestClient.put<ChannelApi.Channel>(`/channels/${id}/limits`, data);
}

export async function setChannelStatus(id: number, status: boolean) {
  return requestClient.put<ChannelApi.Channel>(`/channels/${id}/status`, {
    status,
  });
}

export async function uploadChannelPackage(id: number, file: File) {
  const formData = new FormData();
  formData.append('file', file, file.name);
  return requestClient.post<ChannelApi.Channel>(
    `/channels/${id}/package`,
    formData,
    {
      headers: {
        'Content-Type': undefined,
      },
    },
  );
}

export async function downloadChannelPackage(id: number) {
  return requestClient.download<Blob>(`/channels/${id}/package`);
}
