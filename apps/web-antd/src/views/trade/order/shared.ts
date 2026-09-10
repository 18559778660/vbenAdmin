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

/** 订单详情弹窗结构（客户/地址/商品优先读下单快照） */
export interface OrderDetailPreview {
  orderNo: string;
  customerName: string;
  email: string;
  phone: string;
  orderStatus: string;
  returnMessage: string;
  billCountry: string;
  billState: string;
  billCity: string;
  billZip: string;
  billAddress: string;
  amountText: string;
  shipCountry: string;
  shipState: string;
  shipCity: string;
  shipZip: string;
  shipAddress: string;
  ip: string;
  payments: Array<{
    accountName: string;
    createdAt: string;
    key: string;
    payInfo: string;
    provider: string;
    siteB: string;
    status: string;
  }>;
  goods: Array<{
    key: string;
    link: string;
    name: string;
    price: string;
    quantity: number;
    size: string;
    sku: string;
    total: string;
  }>;
}

/** 详情「返回信息」：按订单状态展示，失败/取消才用 errorMessage。 */
function buildReturnMessage(order: OrderApi.Order): string {
  const err = order.errorMessage?.trim();
  switch (order.status) {
    case 'cancelled':
    case 'failed': {
      return err || '-';
    }
    case 'paid': {
      return 'paid (支付成功)';
    }
    case 'pending': {
      return 'payment redirect!';
    }
    default: {
      return '-';
    }
  }
}

function displayText(v?: null | string): string {
  const s = (v || '').trim();
  return s || '-';
}

function parseOrderGoods(raw?: string): OrderDetailPreview['goods'] {
  if (!raw?.trim()) {
    return [];
  }
  try {
    const list = JSON.parse(raw) as Array<{
      link?: string;
      name?: string;
      price?: string;
      qty?: number;
      sku?: string;
      total?: string;
    }>;
    if (!Array.isArray(list)) {
      return [];
    }
    return list.map((item, index) => ({
      key: `goods-${index}`,
      name: displayText(item?.name),
      link: (item?.link || '').trim(),
      sku: displayText(item?.sku),
      price: displayText(item?.price),
      quantity: Number(item?.qty) || 0,
      total: displayText(item?.total),
      size: '-',
    }));
  } catch {
    return [];
  }
}

export function buildOrderDetailPreview(
  order: OrderApi.Order,
): OrderDetailPreview {
  const returnMessage = buildReturnMessage(order);
  const goods = parseOrderGoods(order.orderGoods);
  return {
    orderNo: order.merchantOrder || order.id,
    customerName: displayText(order.customerName),
    email: displayText(order.customerEmail),
    phone: displayText(order.customerPhone),
    orderStatus: STATUS_LABELS[order.status] || order.status || '-',
    returnMessage,
    billCountry: displayText(order.billCountry),
    billState: displayText(order.billState),
    billCity: displayText(order.billCity),
    billZip: displayText(order.billZip),
    billAddress: displayText(order.billAddress),
    amountText: order.siteAmount || order.tradeAmount || '-',
    shipCountry: displayText(order.shipCountry),
    shipState: displayText(order.shipState),
    shipCity: displayText(order.shipCity),
    shipZip: displayText(order.shipZip),
    shipAddress: displayText(order.shipAddress),
    ip: displayText(order.customerIp),
    payments: [
      {
        key: 'pay-1',
        provider: order.provider || order.channel || 'stripe',
        status: STATUS_LABELS[order.status] || order.status || '-',
        payInfo: returnMessage,
        createdAt: order.createdAt || '-',
        accountName: order.accountName || '-',
        siteB: order.siteB || '-',
      },
    ],
    goods,
  };
}
