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
    feeAmount?: number;
    usdDiff: string;
    status: Status;
    errorMessage?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerIp?: string;
    billCountry?: string;
    billState?: string;
    billCity?: string;
    billZip?: string;
    billAddress?: string;
    shipCountry?: string;
    shipState?: string;
    shipCity?: string;
    shipZip?: string;
    shipAddress?: string;
    orderGoods?: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface ListParams {
    merchantId?: number;
    email?: string;
    phone?: string;
    ip?: string;
    orderNo?: string;
    siteA?: string;
    status?: '' | Status;
    payMethod?: string;
    accountId?: number;
    siteB?: string;
    createdFrom?: string;
    createdTo?: string;
    country?: string;
    currency?: string;
    minAmount?: string;
    maxAmount?: string;
    transactionNo?: string;
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
export async function getOrderList(params?: OrderApi.ListParams) {
  return requestClient.get<OrderApi.Order[]>('/orders', { params });
}

/** 订单汇总栏 */
export async function getOrderSummary() {
  return requestClient.get<OrderApi.Summary>('/orders/summary');
}
