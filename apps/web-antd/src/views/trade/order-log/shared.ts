export type OrderLogType = 'fail_log' | 'fail_record' | 'log_record';

export interface OrderLogRow {
  id: number;
  orderId: number;
  merchantName: string;
  orderNo: string;
  type: OrderLogType;
  remark: string;
  createdAt: string;
}

export const LOG_TYPE_LABELS: Record<OrderLogType, string> = {
  fail_log: '失败日志',
  log_record: '日志记录',
  fail_record: '失败记录',
};

export const MERCHANT_OPTIONS = [
  { label: 'C53', value: 'C53' },
  { label: 'C12', value: 'C12' },
  { label: 'WIN00012', value: 'WIN00012' },
];

/** 静态示例数据，后续接真实接口时替换 */
export const MOCK_ORDER_LOGS: OrderLogRow[] = [
  {
    id: 14_280_956,
    orderId: 999_637,
    merchantName: 'C53',
    orderNo: '1788487251275551228769922988',
    type: 'fail_log',
    remark: '更新订单状态',
    createdAt: '2026-09-04 10:00:54',
  },
  {
    id: 14_280_955,
    orderId: 999_637,
    merchantName: 'C53',
    orderNo: '1788487251275551228769922988',
    type: 'log_record',
    remark:
      '开始跳转链接:{"code":2,"pay_code":2,"pay_skip_url":"https://checkout.stripe.com/c/pay/cs_test_xxx","pay_html_type":1}',
    createdAt: '2026-09-04 10:00:53',
  },
  {
    id: 14_280_954,
    orderId: 999_637,
    merchantName: 'C53',
    orderNo: '1788487251275551228769922988',
    type: 'log_record',
    remark: '通道编号 [381] 验证通过',
    createdAt: '2026-09-04 10:00:52',
  },
  {
    id: 14_280_953,
    orderId: 999_637,
    merchantName: 'C53',
    orderNo: '1788487251275551228769922988',
    type: 'log_record',
    remark: '通道编号 [381] 验证开始',
    createdAt: '2026-09-04 10:00:52',
  },
  {
    id: 14_280_952,
    orderId: 999_636,
    merchantName: 'C53',
    orderNo: '1788487251275551228769922987',
    type: 'fail_record',
    remark: '支付超时未完成',
    createdAt: '2026-09-04 09:58:12',
  },
  {
    id: 14_280_951,
    orderId: 999_635,
    merchantName: 'C12',
    orderNo: 'pc_1788422057109896400',
    type: 'log_record',
    remark: 'Stripe webhook 验签成功，订单标记已支付',
    createdAt: '2026-09-04 09:55:01',
  },
  {
    id: 14_280_950,
    orderId: 999_635,
    merchantName: 'C12',
    orderNo: 'pc_1788422057109896400',
    type: 'log_record',
    remark: '异步通知A站成功',
    createdAt: '2026-09-04 09:55:02',
  },
  {
    id: 14_280_949,
    orderId: 999_634,
    merchantName: 'WIN00012',
    orderNo: '122040-35579725_29703',
    type: 'fail_log',
    remark: '商户密钥无效',
    createdAt: '2026-09-04 09:40:18',
  },
];
