import { requestClient } from '#/api/request';

export namespace OrderLogApi {
  export type Type = 'fail_log' | 'fail_record' | 'log_record';

  export interface OrderLog {
    id: number;
    orderId: string;
    merchantId: number;
    merchantName: string;
    orderNo: string;
    type: Type;
    remark: string;
    createdAt: string;
  }

  export interface ListParams {
    merchantId?: number;
    orderNo?: string;
    createdFrom?: string;
    createdTo?: string;
  }
}

/** 订单日志列表 */
export async function getOrderLogList(params?: OrderLogApi.ListParams) {
  return requestClient.get<OrderLogApi.OrderLog[]>('/order-logs', { params });
}
