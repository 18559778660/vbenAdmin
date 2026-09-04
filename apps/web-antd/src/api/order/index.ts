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

  export interface Summary {
    totalCount: number;
    unpaidCount: number;
    failedCount: number;
    successCount: number;
    payRate: string;
    successRate: string;
    totalRate: string;
    amountUsd: string;
  }
}

/** 订单列表 */
export async function getOrderList() {
  return requestClient.get<OrderApi.Order[]>('/orders');
}

/** 订单汇总栏 */
export async function getOrderSummary() {
  return requestClient.get<OrderApi.Summary>('/orders/summary');
}
