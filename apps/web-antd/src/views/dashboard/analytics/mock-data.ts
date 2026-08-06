export interface MetricItem {
  key: string;
  title: string;
  value: string;
  hint: string;
  tone?: 'danger' | 'default' | 'success' | 'warning';
}

export interface RankItem {
  name: string;
  value: number;
  extra?: string;
}

export interface ExceptionOrderItem {
  id: string;
  merchant: string;
  channel: string;
  amount: string;
  reason: string;
  time: string;
}

export interface QuickActionItem {
  title: string;
  path: string;
  icon: string;
}

/** 首页核心指标（mock） */
export const overviewMetrics: MetricItem[] = [
  {
    key: 'amount',
    title: '今日交易金额',
    value: '¥126,560',
    hint: '较昨日 +8.2%',
    tone: 'success',
  },
  {
    key: 'count',
    title: '今日支付笔数',
    value: '6,560',
    hint: '较昨日 +3.1%',
    tone: 'default',
  },
  {
    key: 'successRate',
    title: '支付成功率',
    value: '78.6%',
    hint: '较昨日 -1.4%',
    tone: 'warning',
  },
  {
    key: 'refund',
    title: '今日退款金额',
    value: '¥8,200',
    hint: '退款率 6.5%',
    tone: 'default',
  },
  {
    key: 'exception',
    title: '待处理异常订单',
    value: '23',
    hint: '需优先处理',
    tone: 'danger',
  },
  {
    key: 'risk',
    title: '风控拦截数',
    value: '57',
    hint: '今日累计',
    tone: 'warning',
  },
];

/** 近 24 小时整点标签 */
export const hours24 = Array.from({ length: 24 }).map(
  (_, i) => `${String(i).padStart(2, '0')}:00`,
);

/** 近 24 小时交易金额 */
export const amountTrend = [
  2200, 1800, 1500, 1200, 980, 1100, 2600, 4800, 6200, 7100, 6800, 7400, 8200,
  7900, 7600, 8100, 8600, 9200, 8800, 7500, 6100, 4800, 3600, 2800,
];

/** 近 24 小时支付成功率 */
export const successRateTrend = [
  72.1, 70.4, 68.9, 67.2, 66.8, 69.5, 74.2, 78.6, 81.2, 82.4, 80.1, 79.3, 78.8,
  77.9, 78.2, 79.5, 80.6, 81.1, 79.8, 78.4, 76.2, 74.8, 73.5, 72.9,
];

export const channelSuccessRank: RankItem[] = [
  { name: 'Stripe-US', value: 96.2, extra: '1,280 笔' },
  { name: 'PayPal-EU', value: 93.5, extra: '980 笔' },
  { name: 'Adyen-Asia', value: 91.8, extra: '860 笔' },
  { name: 'Worldpay-UK', value: 89.4, extra: '720 笔' },
  { name: 'Checkout-LATAM', value: 86.1, extra: '540 笔' },
];

export const channelFailRank: RankItem[] = [
  { name: 'LocalBank-IN', value: 18.6, extra: '210 笔失败' },
  { name: 'Wallet-BR', value: 15.2, extra: '168 笔失败' },
  { name: 'Card-SE', value: 12.8, extra: '142 笔失败' },
  { name: 'APM-TR', value: 11.4, extra: '96 笔失败' },
  { name: 'Crypto-Gate', value: 9.7, extra: '74 笔失败' },
];

export const exceptionOrders: ExceptionOrderItem[] = [
  {
    id: 'P20260805001',
    merchant: '星辰跨境',
    channel: 'Stripe-US',
    amount: '¥1,280.00',
    reason: '回调超时',
    time: '14:22:08',
  },
  {
    id: 'P20260805002',
    merchant: '蓝海数码',
    channel: 'PayPal-EU',
    amount: '€86.50',
    reason: '状态不一致',
    time: '13:58:41',
  },
  {
    id: 'P20260805003',
    merchant: '北极光商城',
    channel: 'Adyen-Asia',
    amount: '$240.00',
    reason: '通道拒付',
    time: '13:11:05',
  },
  {
    id: 'P20260805004',
    merchant: '远航贸易',
    channel: 'LocalBank-IN',
    amount: '¥560.00',
    reason: '风控人工复核',
    time: '12:46:19',
  },
  {
    id: 'P20260805005',
    merchant: '云端零售',
    channel: 'Worldpay-UK',
    amount: '£72.00',
    reason: '通知重试失败',
    time: '11:33:52',
  },
];

export const countryDistribution = [
  { name: '美国', value: 32_400 },
  { name: '英国', value: 18_600 },
  { name: '德国', value: 15_200 },
  { name: '日本', value: 12_800 },
  { name: '巴西', value: 9800 },
  { name: '其他', value: 21_760 },
];

export const currencyDistribution = [
  { name: 'USD', value: 48_200 },
  { name: 'EUR', value: 26_400 },
  { name: 'CNY', value: 18_960 },
  { name: 'GBP', value: 14_200 },
  { name: 'JPY', value: 10_800 },
  { name: '其他', value: 8000 },
];

export const merchantAmountRank: RankItem[] = [
  { name: '星辰跨境', value: 28_600 },
  { name: '蓝海数码', value: 21_400 },
  { name: '北极光商城', value: 18_900 },
  { name: '远航贸易', value: 15_200 },
  { name: '云端零售', value: 12_800 },
];

export const quickActions: QuickActionItem[] = [
  {
    title: '新增商户',
    path: '/quick-action/add-merchant',
    icon: 'lucide:user-plus',
  },
  {
    title: '新增通道',
    path: '/quick-action/add-channel',
    icon: 'lucide:plus-circle',
  },
  {
    title: '查看扣单列表',
    path: '/trade/hold',
    icon: 'lucide:hand',
  },
  {
    title: '导出今日订单',
    path: '/quick-action/export-today',
    icon: 'lucide:download',
  },
];
