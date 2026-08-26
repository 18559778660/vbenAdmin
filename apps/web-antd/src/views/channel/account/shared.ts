import { ref } from 'vue';

export type ChannelAccountRow = {
  accountNo: string;
  alias: string;
  allowCardTypes: string[];
  allowCountries: string[];
  amountLimitMode: string;
  appId: string;
  assignedUser: string;
  calcCurrency: string;
  cannotOpenAt8: boolean;
  channel: string;
  createdAt: string;
  currencies: string[];
  dailyAmountLimit: number;
  dailyOrderLimit: number;
  dailyRecvAmount: number;
  dailyRecvCount: number;
  disableCardBrands: string[];
  disableCardTypes: string[];
  disableCountries: string[];
  environment: string;
  groupName: string;
  id: number;
  interceptCurrency: string;
  interceptMax: number;
  interceptMin: number;
  interceptMode: string;
  maxSuccessCount: number;
  merchantId: string;
  payFrequency: number;
  paymentMethod: string;
  preferCountries: string[];
  privateKey: string;
  remark: string;
  resetHour: number;
  resetTimezone: string;
  restrictedClosed: boolean;
  siteB: string;
  sort: number;
  status: boolean;
  successCountLimit: number;
  successMode: string;
  totalReceived: number;
  unpaidClosed: boolean;
  webSecret: string;
};

export const ACCOUNT_LIMIT_MODE_LABELS: Record<string, string> = {
  reset: '重置',
  intercept: '拦截',
};

export const RESET_HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => ({
  label: `${hour}点`,
  value: hour,
}));

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: '信用卡',
  paypal: 'PayPal',
  antom: 'Antom',
};

export const GROUP_OPTIONS = [
  { label: '全部', value: '' },
  { label: '默认分组', value: 'default' },
  { label: '高优先级', value: 'high' },
];

export function groupLabel(value: string) {
  return GROUP_OPTIONS.find((item) => item.value === value)?.label || value;
}

export const USER_OPTIONS = [
  { label: '全部', value: '' },
  { label: 'admin', value: 'admin' },
  { label: 'ops01', value: 'ops01' },
  { label: '未分配', value: 'none' },
];

export const CHANNEL_OPTIONS = [
  { label: 'worldFirst', value: 'worldFirst' },
  { label: 'test', value: 'test' },
  { label: 'PRO_card', value: 'PRO_card' },
  { label: 'supay_card', value: 'supay_card' },
  { label: 'square', value: 'square' },
  { label: 'square_card', value: 'square_card' },
  { label: 'PRO_jump', value: 'PRO_jump' },
  { label: 'stripe', value: 'stripe' },
  { label: 'antom', value: 'antom' },
];

export const STATUS_OPTIONS = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
];

export const SITE_B_OPTIONS = [
  { label: 'www.havetr.com', value: 'www.havetr.com' },
  { label: '默认B站', value: 'default' },
  { label: '备用B站', value: 'backup' },
  { label: '暂不绑定', value: 'none' },
];

export const mockAccountList = ref<ChannelAccountRow[]>([
  {
    id: 491,
    channel: 'PRO_card',
    accountNo: 'MK84PP/acdc',
    alias: 'havetr.com',
    remark: '重新打开',
    paymentMethod: 'card',
    groupName: 'default',
    assignedUser: 'admin',
    totalReceived: 124_437.63,
    status: true,
    resetTimezone: '北京时间',
    resetHour: 0,
    dailyOrderLimit: 0,
    dailyAmountLimit: 8000,
    dailyRecvCount: 7,
    dailyRecvAmount: 531.09,
    interceptMode: 'reset',
    interceptCurrency: 'USD',
    interceptMax: 150,
    interceptMin: 0,
    amountLimitMode: 'reset',
    calcCurrency: 'USD',
    currencies: [],
    allowCountries: [],
    allowCardTypes: [],
    disableCardTypes: [],
    disableCardBrands: [],
    payFrequency: 0,
    successCountLimit: 0,
    maxSuccessCount: 0,
    successMode: 'unlimited',
    disableCountries: ['IL'],
    preferCountries: [],
    sort: 0,
    appId:
      'AR3owxYj9Xcy6F3rwn45t_b07_R9WtGy4aAer5yCnYli5zOy56YDbPZrZ3_AjdL_Ddg40lT2cwMgstVo',
    merchantId: '',
    webSecret: '18K25823E2849902A',
    privateKey:
      'EMKHiWJeK9csY6XZ2l_-zfcOpPpWchD_oZv2VxHOL68C1tM40ta453IIzjIvJ6R3ZbsALqq0rCKIu2Ca',
    environment: 'live',
    siteB: 'www.havetr.com',
    unpaidClosed: false,
    restrictedClosed: false,
    cannotOpenAt8: false,
    createdAt: '2026-08-12 10:21:08',
  },
  {
    id: 492,
    channel: 'antom',
    accountNo: 'AT92KL8mnp',
    alias: 'antom备用',
    remark: '',
    paymentMethod: 'antom',
    groupName: 'high',
    assignedUser: 'ops01',
    totalReceived: 18_260.4,
    status: true,
    resetTimezone: '北京时间',
    resetHour: 0,
    dailyOrderLimit: 20,
    dailyAmountLimit: 3000,
    dailyRecvCount: 3,
    dailyRecvAmount: 420,
    interceptMode: 'keep',
    interceptCurrency: 'USD',
    interceptMax: 80,
    interceptMin: 1,
    amountLimitMode: 'intercept',
    calcCurrency: 'USD',
    currencies: ['USD'],
    allowCountries: [],
    allowCardTypes: [],
    disableCardTypes: [],
    disableCardBrands: [],
    payFrequency: 0,
    successCountLimit: 0,
    maxSuccessCount: 0,
    successMode: 'unlimited',
    disableCountries: [],
    preferCountries: ['US', 'CA'],
    sort: 0,
    appId: '',
    merchantId: '',
    webSecret: '',
    privateKey: '',
    environment: 'live',
    siteB: 'default',
    unpaidClosed: false,
    restrictedClosed: false,
    cannotOpenAt8: true,
    createdAt: '2026-08-15 09:03:44',
  },
  {
    id: 493,
    channel: 'stripe_us',
    accountNo: 'ST11QWzxcv',
    alias: 'stripe测试',
    remark: '已限额关闭',
    paymentMethod: 'card',
    groupName: 'default',
    assignedUser: 'none',
    totalReceived: 960.12,
    status: false,
    resetTimezone: '北美夏令时间',
    resetHour: 0,
    dailyOrderLimit: 5,
    dailyAmountLimit: 500,
    dailyRecvCount: 0,
    dailyRecvAmount: 0,
    interceptMode: 'reset',
    interceptCurrency: 'USD',
    interceptMax: 50,
    interceptMin: 0,
    amountLimitMode: 'reset',
    calcCurrency: 'USD',
    currencies: [],
    allowCountries: [],
    allowCardTypes: [],
    disableCardTypes: [],
    disableCardBrands: [],
    payFrequency: 0,
    successCountLimit: 0,
    maxSuccessCount: 0,
    successMode: 'limited',
    disableCountries: ['CN', 'RU'],
    preferCountries: ['US'],
    sort: 0,
    appId: '',
    merchantId: '',
    webSecret: '',
    privateKey: '',
    environment: 'sandbox',
    siteB: 'none',
    unpaidClosed: false,
    restrictedClosed: true,
    cannotOpenAt8: false,
    createdAt: '2026-08-18 16:40:11',
  },
]);

let nextAccountId = 494;

export function nextAccountIdValue() {
  const id = nextAccountId;
  nextAccountId += 1;
  return id;
}

export function money(value: number) {
  return value.toFixed(2);
}

export function nowText() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
