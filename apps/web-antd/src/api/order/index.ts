import { requestClient } from '#/api/request';

export namespace OrderApi {
  export type Status = 'cancelled' | 'created' | 'failed' | 'paid' | 'pending';

  export interface Order {
    id: string;
    merchantId: number;
    merchantName: string;
    merchantOrder: string;
    merchantSite: string;
    providerRef: string;
    siteBId: number;
    siteB: string;
    channel: string;
    channelAccountId: number;
    accountName: string;
    provider: string;
    amount: number;
    currency: string;
    siteAmount: string;
    tradeAmount: string;
    fee: string;
    usdDiff: string;
    status: Status;
    errorMessage?: string;
    createdAt: string;
    updatedAt: string;
  }
}

/** 订单列表 */
export async function getOrderList() {
  return requestClient.get<OrderApi.Order[]>('/orders');
}
