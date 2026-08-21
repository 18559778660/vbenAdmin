import { ref } from 'vue';

export type ChannelAccountRow = {
  accountNo: string;
  alias: string;
  assignedUser: string;
  cannotOpenAt8: boolean;
  channel: string;
  createdAt: string;
  dailyAmountLimit: number;
  dailyOrderLimit: number;
  dailyRecvAmount: number;
  dailyRecvCount: number;
  disableCountries: string[];
  groupName: string;
  id: number;
  interceptCurrency: string;
  interceptMax: number;
  interceptMin: number;
  interceptMode: string;
  paymentMethod: string;
  preferCountries: string[];
  remark: string;
  resetHour: number;
  resetTimezone: string;
  restrictedClosed: boolean;
  status: boolean;
  successMode: string;
  totalReceived: number;
  unpaidClosed: boolean;
};

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
  { label: 'PRO_card', value: 'PRO_card' },
  { label: 'antom', value: 'antom' },
  { label: 'stripe_us', value: 'stripe_us' },
];

export const mockAccountList = ref<ChannelAccountRow[]>([
  {
    id: 491,
    channel: 'PRO_card',
    accountNo: 'MK84PPazdc',
    alias: 'pcard需绑卡支付 / pp_card小杰',
    remark: '主账号',
    paymentMethod: 'card',
    groupName: 'default',
    assignedUser: 'admin',
    totalReceived: 124_437.63,
    status: true,
    resetTimezone: '北美夏令时间',
    resetHour: 0,
    dailyOrderLimit: 0,
    dailyAmountLimit: 8000,
    dailyRecvCount: 7,
    dailyRecvAmount: 531.09,
    interceptMode: 'reset',
    interceptCurrency: 'USD',
    interceptMax: 150,
    interceptMin: 0,
    successMode: 'unlimited',
    disableCountries: ['IL'],
    preferCountries: [],
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
    successMode: 'unlimited',
    disableCountries: [],
    preferCountries: ['US', 'CA'],
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
    successMode: 'limited',
    disableCountries: ['CN', 'RU'],
    preferCountries: ['US'],
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
