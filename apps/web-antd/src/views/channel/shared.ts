import { ref } from 'vue';

export type ChannelRow = {
  allowCardTypes: string[];
  allowCountries: string[];
  amountLimitMode: string;
  autoShip: boolean;
  balance: number;
  calcCurrency: string;
  channelCode: string;
  collectRule: string;
  countries: string[];
  createdAt: string;
  createdBy: string;
  currencies: string[];
  dailyAmountLimit: number;
  dailyOrderLimit: number;
  dailyRecvAmount: number;
  dailyRecvCount: number;
  disableBrandWords: string;
  disableCardBrands: string[];
  disableCardTypes: string[];
  disableCountries: string[];
  failAutoClose: number;
  failCount: number;
  gatewayUrl: string;
  id: number;
  interceptCurrency: string;
  interceptMax: number;
  interceptMin: number;
  interceptMode: string;
  mixers: string[];
  mutualHoldAmount: number;
  name: string;
  oldCustomerDays: number;
  orderNoMode: string;
  packageName: string;
  payCode: string;
  payFrequency: number;
  paymentMode: string;
  payParams: string;
  preferCountries: string[];
  productInfo: string;
  remark: string;
  returnIpWhitelist: string;
  returnKeywords: string;
  returnVerify: string;
  settleRate: number;
  shipRange: string;
  siteBGroup: string;
  sort: number;
  status: boolean;
  successCount: number;
  successMode: string;
  totalAmount: number;
  updatedAt: string;
  updatedBy: string;
};

export const PAYMENT_MODE_LABELS: Record<string, string> = {
  local: '本地支付',
  checkout: '收银台',
  embedded: '系统内嵌',
  direct: '收银台',
};

export const PAYMENT_MODE_COLORS: Record<string, string> = {
  local: 'text-orange-500',
  embedded: 'text-cyan-600',
  checkout: 'text-primary',
  direct: 'text-primary',
};

export const PAYMENT_MODE_OPTIONS = [
  { label: '本地支付', value: 'local' },
  { label: '收银台', value: 'checkout' },
  { label: '系统内嵌', value: 'embedded' },
];

export const INTERCEPT_MODE_LABELS: Record<string, string> = {
  reset: '重置',
  keep: '保持',
};

export const SUCCESS_MODE_LABELS: Record<string, string> = {
  unlimited: '不限制',
  limited: '限制',
};

export const ORDER_NO_MODE_LABELS: Record<string, string> = {
  site: '网站订单号',
  strip_suffix: '去后缀订单号',
};

export const PRODUCT_INFO_LABELS: Record<string, string> = {
  kezhan: '壳站信息',
  product: '产品数据',
  rebuild: '重组数据',
};

export const RETURN_VERIFY_LABELS: Record<string, string> = {
  verify: '验证',
  skip: '不验证',
};

export const AMOUNT_LIMIT_MODE_LABELS: Record<string, string> = {
  single: '单笔',
  intercept: '拦截',
};

export const CARD_BRAND_LABELS: Record<string, string> = {
  visa: 'Visa',
  mastercard: '万事达',
  jcb: 'JCB',
  amex: 'American Express',
  unionpay: '银联',
};

export const COLLECT_RULE_LABELS: Record<string, string> = {
  random: '随机',
  round: '轮询',
};

export const MIXER_OPTIONS = [
  { label: '账号池A', value: 'pool-a' },
  { label: '账号池B', value: 'pool-b' },
  { label: '账号池C', value: 'pool-c' },
];

export function toOptions(map: Record<string, string>) {
  return Object.entries(map).map(([value, label]) => ({ label, value }));
}

export function money(value: number) {
  return value.toFixed(2);
}

export function validateInterceptRange(min: number, max: number) {
  if (min > max) {
    return '限制最小金额不能高于限制最大金额';
  }
  return null;
}

export function resolveSuccessMode(
  payFrequency: number,
  successCount: number,
  failCount: number,
) {
  if (payFrequency > 0 && (successCount > 0 || failCount > 0)) {
    return 'limited';
  }
  return 'unlimited';
}

export function validateSuccessSetting(
  payFrequency: number,
  successCount: number,
  failCount: number,
) {
  const hasFrequency = payFrequency > 0;
  const hasCount = successCount > 0 || failCount > 0;
  if (hasFrequency && !hasCount) {
    return '成功设置需同时配置成功次数或失败次数';
  }
  if (hasCount && !hasFrequency) {
    return '成功设置需同时配置支付频率';
  }
  return null;
}

export function nowText() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function baseRow(
  partial: Partial<ChannelRow> & Pick<ChannelRow, 'id' | 'name'>,
): ChannelRow {
  return {
    packageName: '',
    totalAmount: 0,
    balance: 0,
    dailyOrderLimit: 0,
    dailyAmountLimit: 0,
    dailyRecvCount: 0,
    dailyRecvAmount: 0,
    interceptMode: 'reset',
    interceptCurrency: 'USD',
    interceptMax: 0,
    interceptMin: 0,
    status: true,
    paymentMode: 'local',
    gatewayUrl: '',
    successMode: 'unlimited',
    countries: [],
    currencies: [],
    remark: '',
    settleRate: 0,
    siteBGroup: '',
    channelCode: '',
    payCode: '',
    orderNoMode: 'site',
    productInfo: 'kezhan',
    returnVerify: 'verify',
    oldCustomerDays: 30,
    payParams: '',
    returnIpWhitelist: '',
    payFrequency: 0,
    failCount: 0,
    successCount: 0,
    failAutoClose: 0,
    mutualHoldAmount: 0,
    amountLimitMode: 'single',
    calcCurrency: 'USD',
    allowCountries: [],
    preferCountries: [],
    disableCountries: [],
    allowCardTypes: [],
    disableCardTypes: [],
    disableCardBrands: [],
    mixers: [],
    collectRule: 'random',
    shipRange: '40-50',
    sort: 1,
    autoShip: true,
    returnKeywords: '',
    disableBrandWords: '',
    updatedBy: 'admin',
    updatedAt: nowText(),
    createdBy: 'admin',
    createdAt: nowText(),
    ...partial,
  };
}

export const mockChannelList = ref<ChannelRow[]>([
  baseRow({
    id: 53,
    name: 'antom',
    packageName: 'antom.zip',
    paymentMode: 'local',
    gatewayUrl: '',
    remark: '2026/06/18 重新更新压缩包',
    channelCode: 'antom',
    payCode: 'antom',
    productInfo: 'kezhan',
    oldCustomerDays: 3,
    returnKeywords: 'no matched settlement contract can be found.',
    shipRange: '40-50',
    sort: 1,
    collectRule: 'random',
    autoShip: true,
    returnVerify: 'verify',
    orderNoMode: 'site',
    updatedBy: 'liuadmin',
    updatedAt: '2024-07-23 09:23:43',
    createdBy: 'liuadmin',
    createdAt: '2024-02-11 22:02',
  }),
  baseRow({
    id: 12,
    name: 'stripe-us',
    packageName: 'stripe-us.zip',
    totalAmount: 12_800,
    balance: 3560,
    dailyOrderLimit: 200,
    dailyAmountLimit: 5000,
    dailyRecvCount: 80,
    dailyRecvAmount: 21_000,
    interceptMode: 'keep',
    interceptMax: 2000,
    interceptMin: 10,
    paymentMode: 'checkout',
    successMode: 'limited',
    countries: ['US', 'GB'],
    currencies: ['USD', 'EUR'],
    remark: '美国站主通道',
    settleRate: 97,
    channelCode: 'stripe-us',
    payCode: 'stripe',
    updatedBy: 'admin',
    updatedAt: '2026-08-18 15:20:11',
    createdBy: 'admin',
    createdAt: '2026-03-02 10:18',
  }),
  baseRow({
    id: 8,
    name: 'paypal-eu',
    status: false,
    paymentMode: 'checkout',
    gatewayUrl: '',
    interceptCurrency: 'EUR',
    countries: ['GB'],
    currencies: ['EUR'],
    channelCode: 'paypal-eu',
    payCode: 'paypal',
    updatedBy: 'admin',
    updatedAt: '2026-06-01 09:00:00',
    createdBy: 'admin',
    createdAt: '2026-01-08 18:30',
  }),
]);

let nextId = 54;

export function getChannelById(id: number) {
  return mockChannelList.value.find((item) => item.id === id);
}

export function createChannel(
  payload: Omit<
    ChannelRow,
    'createdAt' | 'createdBy' | 'id' | 'updatedAt' | 'updatedBy'
  >,
) {
  const time = nowText();
  const row: ChannelRow = {
    ...payload,
    id: nextId++,
    createdAt: time,
    createdBy: 'admin',
    updatedAt: time,
    updatedBy: 'admin',
  };
  mockChannelList.value.unshift(row);
  return row;
}

export function updateChannel(id: number, payload: Partial<ChannelRow>) {
  const row = getChannelById(id);
  if (!row) {
    return null;
  }
  Object.assign(row, payload, {
    updatedAt: nowText(),
    updatedBy: 'admin',
  });
  return row;
}
