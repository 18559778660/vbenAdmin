export type TradeOrderStatus =
  | 'created'
  | 'failed'
  | 'paid'
  | 'pending'
  | 'refunded';

export interface TradeOrderRow {
  id: string;
  merchantName: string;
  orderNo: string;
  transactionNo: string;
  siteB: string;
  channel: string;
  accountName: string;
  siteAmount: string;
  tradeAmount: string;
  fee: string;
  usdDiff: string;
  status: TradeOrderStatus;
}

export const STATUS_LABELS: Record<TradeOrderStatus, string> = {
  created: '已创建',
  pending: '支付中',
  paid: '已支付',
  failed: '失败',
  refunded: '已退款',
};

export const STATUS_COLORS: Record<TradeOrderStatus, string> = {
  created: 'default',
  pending: 'processing',
  paid: 'success',
  failed: 'error',
  refunded: 'warning',
};

export const STATUS_FILTER_OPTIONS = [
  { label: '全部', value: '' },
  { label: '已创建', value: 'created' },
  { label: '支付中', value: 'pending' },
  { label: '已支付', value: 'paid' },
  { label: '失败', value: 'failed' },
  { label: '已退款', value: 'refunded' },
];

export const CUSTOMER_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '新客', value: 'new' },
  { label: '老客', value: 'old' },
];

export const PAY_METHOD_OPTIONS = [
  { label: '全部', value: '' },
  { label: 'stripe', value: 'stripe' },
  { label: 'card', value: 'card' },
];

export const SHIP_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '未发货', value: 'unshipped' },
  { label: '已发货', value: 'shipped' },
  { label: '已签收', value: 'delivered' },
];

export const CARD_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '信用卡', value: 'credit' },
  { label: '借记卡', value: 'debit' },
];

/** 静态下拉选项，后续接接口 */
export const MERCHANT_OPTIONS = [
  { label: 'C53', value: 'C53' },
  { label: 'C12', value: 'C12' },
  { label: 'C88', value: 'C88' },
  { label: 'WIN00012', value: 'WIN00012' },
];

export const ACCOUNT_OPTIONS = [
  { label: '启用-FMS-110-战斧-瞿建军 ST-mingletrad.com', value: '1' },
  { label: 'test_stripe', value: '2' },
  { label: 'ST-demo-account-01', value: '3' },
];

export const SITE_B_OPTIONS = [
  { label: 'mingletrad.com', value: 'mingletrad.com' },
  { label: 'lidl1099.zenshop.cn', value: 'lidl1099.zenshop.cn' },
  { label: 'shop-demo.com', value: 'shop-demo.com' },
];

/** 静态汇总统计，后续接接口 */
export interface TradeOrderSummary {
  totalCount: number;
  unpaidCount: number;
  failedCount: number;
  successCount: number;
  payRate: string;
  successRate: string;
  totalRate: string;
  amountUsd: string;
}

export const MOCK_SUMMARY: TradeOrderSummary = {
  totalCount: 906,
  unpaidCount: 224,
  failedCount: 179,
  successCount: 503,
  payRate: '75.28%',
  successRate: '73.75%',
  totalRate: '55.52%',
  amountUsd: '31947.43',
};

export type ToolbarTone = 'danger' | 'primary';

export interface ToolbarAction {
  key: string;
  label: string;
  tone: ToolbarTone;
  icon?: string;
  count?: number;
}

/** 工具栏按钮（静态） */
export const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    key: 'batchRefund',
    label: '批量退款',
    tone: 'danger',
    icon: 'lucide:undo-2',
  },
  {
    key: 'export',
    label: '订单导出',
    tone: 'primary',
    icon: 'lucide:download',
  },
  { key: 'abnormal', label: '异常交易', tone: 'danger', count: 44 },
  { key: 'returnIntercept', label: '退回拦截', tone: 'danger', count: 49 },
  { key: 'multiChannel', label: '多通道成功', tone: 'primary' },
  { key: 'merchantStats', label: '商户统计', tone: 'primary' },
  { key: 'siteStats', label: '网站统计', tone: 'primary' },
  { key: 'countryStats', label: '国家统计', tone: 'primary' },
  { key: 'channelStats', label: '通道统计', tone: 'primary' },
  { key: 'accountStats', label: '账号统计', tone: 'primary' },
  { key: 'siteBStats', label: 'B站统计', tone: 'primary' },
  { key: 'cardBinStats', label: '卡头统计', tone: 'primary' },
  { key: 'cardBinPreview', label: '卡头预览', tone: 'primary' },
  { key: 'cardBinUnique', label: '卡头去重', tone: 'primary' },
  { key: 'payTrend', label: '支付趋势', tone: 'primary' },
  { key: 'failedCallback', label: '失败回调', tone: 'danger', count: 1 },
];

/** 静态示例数据，后续接真实接口时替换 */
export const MOCK_ORDERS: TradeOrderRow[] = [
  {
    id: '1',
    merchantName: '|-- C53',
    orderNo: '1788487251275551228769922988',
    transactionNo: '',
    siteB: 'mingletrad.com',
    channel: 'stripe',
    accountName: '启用-FMS-110-战斧-瞿建军 ST-mingletrad.com',
    siteAmount: 'USD 9.99',
    tradeAmount: 'USD 9.99',
    fee: '0.00',
    usdDiff: '9.99',
    status: 'pending',
  },
  {
    id: '2',
    merchantName: '|-- C53',
    orderNo: 'pc_1788422057109896400',
    transactionNo: 'cs_test_a1KWAPuhtaY00OJMSrOpNV',
    siteB: 'mingletrad.com',
    channel: 'stripe',
    accountName: '启用-FMS-110-战斧-瞿建军 ST-mingletrad.com',
    siteAmount: 'EUR 1.00',
    tradeAmount: 'EUR 1.00',
    fee: '0.00',
    usdDiff: '1.08',
    status: 'paid',
  },
  {
    id: '3',
    merchantName: '|-- WIN00012',
    orderNo: '122040-35579725_29703',
    transactionNo: '',
    siteB: 'lidl1099.zenshop.cn',
    channel: 'test_stripe',
    accountName: 'test_stripe',
    siteAmount: 'EUR 1.00',
    tradeAmount: 'EUR 1.00',
    fee: '0.00',
    usdDiff: '1.08',
    status: 'failed',
  },
  {
    id: '4',
    merchantName: '|-- C12',
    orderNo: 'pc_1788416959325529500',
    transactionNo: 'pi_3UBU9UC37lhzkO351jep0OVD',
    siteB: 'shop-demo.com',
    channel: 'stripe',
    accountName: 'ST-demo-account-01',
    siteAmount: 'USD 29.90',
    tradeAmount: 'USD 29.90',
    fee: '0.87',
    usdDiff: '29.90',
    status: 'paid',
  },
  {
    id: '5',
    merchantName: '|-- C88',
    orderNo: 'pc_1788401122334455600',
    transactionNo: '',
    siteB: 'example-store.com',
    channel: 'stripe',
    accountName: 'ST-example-store',
    siteAmount: 'USD 59.00',
    tradeAmount: 'USD 59.00',
    fee: '0.00',
    usdDiff: '59.00',
    status: 'created',
  },
];
