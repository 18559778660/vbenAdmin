import type { OrderApi } from '#/api';

export type TradeOrderStatus = OrderApi.Status;

export const STATUS_LABELS: Record<TradeOrderStatus, string> = {
  created: '已创建',
  pending: '支付中',
  paid: '已支付',
  failed: '失败',
  cancelled: '已取消',
};

export const STATUS_COLORS: Record<TradeOrderStatus, string> = {
  created: 'default',
  pending: 'processing',
  paid: 'success',
  failed: 'error',
  cancelled: 'warning',
};

/** 搜索区下拉选项（静态预留，后续接接口） */
export const STATUS_FILTER_OPTIONS = [
  { label: '全部', value: '' },
  { label: '已创建', value: 'created' },
  { label: '支付中', value: 'pending' },
  { label: '已支付', value: 'paid' },
  { label: '失败', value: 'failed' },
  { label: '已取消', value: 'cancelled' },
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

/** 汇总栏默认空值 */
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

export const EMPTY_SUMMARY: TradeOrderSummary = {
  totalCount: 0,
  unpaidCount: 0,
  failedCount: 0,
  successCount: 0,
  payRate: '0%',
  successRate: '0%',
  totalRate: '0%',
  amountUsd: '0.00',
};

export type ToolbarTone = 'danger' | 'primary';

export interface ToolbarAction {
  key: string;
  label: string;
  tone: ToolbarTone;
  icon?: string;
  count?: number;
}

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
  { key: 'abnormal', label: '异常交易', tone: 'danger', count: 0 },
  { key: 'returnIntercept', label: '退回拦截', tone: 'danger', count: 0 },
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
  { key: 'failedCallback', label: '失败回调', tone: 'danger', count: 0 },
];
