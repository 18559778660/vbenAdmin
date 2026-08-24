import { ref } from 'vue';

export type ChannelGroupRow = {
  availableAccountCount: number;
  balance: number;
  code: string;
  collectRule: string;
  createdAt: string;
  createdBy: string;
  dailyAmountLimit: number;
  dailyOrderLimit: number;
  dailyRecvAmount: number;
  dailyRecvCount: number;
  failLimitCount: number;
  gateway: boolean;
  id: number;
  interceptCurrency: string;
  interceptMax: number;
  interceptMin: number;
  interceptMode: string;
  name: string;
  oldCustomerDays: number;
  payFrequencyDays: number;
  successLimitCount: number;
  totalAmount: number;
  updatedAt: string;
  updatedBy: string;
};

export type GroupAccountRow = {
  accountStatus: boolean;
  channel: string;
  channelName: string;
  groupId: number;
  id: number;
  paymentMethod: string;
  remark: string;
  siteB: string;
  status: string;
};

export const mockChannelGroupList = ref<ChannelGroupRow[]>([
  {
    id: 113,
    code: '11st',
    name: '11st',
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
    gateway: true,
    oldCustomerDays: 30,
    collectRule: 'random',
    payFrequencyDays: 1,
    failLimitCount: 3,
    successLimitCount: 1,
    availableAccountCount: 0,
    createdAt: '2026-08-10 14:22:18',
    createdBy: 'admin',
    updatedAt: '2026-08-20 09:15:42',
    updatedBy: 'admin',
  },
  {
    id: 112,
    code: 'a75blik',
    name: 'a75blik',
    totalAmount: 18_100,
    balance: 11_098.92,
    dailyOrderLimit: 0,
    dailyAmountLimit: 10_000,
    dailyRecvCount: 80,
    dailyRecvAmount: 5665.52,
    interceptMode: 'reset',
    interceptCurrency: 'USD',
    interceptMax: 0,
    interceptMin: 0,
    gateway: true,
    oldCustomerDays: 1,
    collectRule: 'random',
    payFrequencyDays: 1,
    failLimitCount: 3,
    successLimitCount: 1,
    availableAccountCount: 2,
    createdAt: '2026-08-08 11:03:55',
    createdBy: 'admin',
    updatedAt: '2026-08-19 16:48:11',
    updatedBy: 'liuadmin',
  },
  {
    id: 111,
    code: 'pp_card',
    name: 'pp_card小杰',
    totalAmount: 12_000,
    balance: 8450.5,
    dailyOrderLimit: 10,
    dailyAmountLimit: 5000,
    dailyRecvCount: 45,
    dailyRecvAmount: 3200,
    interceptMode: 'reset',
    interceptCurrency: 'USD',
    interceptMax: 150,
    interceptMin: 0,
    gateway: false,
    oldCustomerDays: 30,
    collectRule: 'round',
    payFrequencyDays: 0,
    failLimitCount: 5,
    successLimitCount: 2,
    availableAccountCount: 5,
    createdAt: '2026-07-28 08:40:03',
    createdBy: 'liuadmin',
    updatedAt: '2026-08-18 10:22:07',
    updatedBy: 'admin',
  },
  {
    id: 110,
    code: 'stripe_us',
    name: 'stripe美国组',
    totalAmount: 2000,
    balance: 0,
    dailyOrderLimit: 5,
    dailyAmountLimit: 2000,
    dailyRecvCount: 0,
    dailyRecvAmount: 0,
    interceptMode: 'reset',
    interceptCurrency: 'USD',
    interceptMax: 100,
    interceptMin: 0,
    gateway: true,
    oldCustomerDays: 7,
    collectRule: 'random',
    payFrequencyDays: 1,
    failLimitCount: 3,
    successLimitCount: 1,
    availableAccountCount: 0,
    createdAt: '2026-07-15 19:11:26',
    createdBy: 'admin',
    updatedAt: '2026-08-12 13:05:19',
    updatedBy: 'admin',
  },
]);

export const mockGroupAccountList = ref<GroupAccountRow[]>([
  {
    id: 644,
    groupId: 112,
    channelName: 'SUK31/blik',
    status: '',
    accountStatus: true,
    siteB: 'qortexco.com',
    channel: 'supay_wallet',
    remark: '',
    paymentMethod: 'card',
  },
  {
    id: 689,
    groupId: 112,
    channelName: '蚂蚁10-蔡-球衣',
    status: '',
    accountStatus: true,
    siteB: 'opolelife.com',
    channel: 'antom',
    remark: '重新打开',
    paymentMethod: 'antom',
  },
  {
    id: 687,
    groupId: 112,
    channelName: 'MK273PPF/ACDC',
    status: '',
    accountStatus: true,
    siteB: 'lirowave.com',
    channel: 'PRO_card',
    remark: '重新打开',
    paymentMethod: 'card',
  },
  {
    id: 686,
    groupId: 111,
    channelName: 'FMK267PPF/b',
    status: '',
    accountStatus: true,
    siteB: 'www.soleilth.com',
    channel: 'PRO_card',
    remark: '重新打开',
    paymentMethod: 'card',
  },
  {
    id: 685,
    groupId: 111,
    channelName: 'FMK149PP/ACDC',
    status: '',
    accountStatus: true,
    siteB: 'havetr.com',
    channel: 'PROpay',
    remark: '',
    paymentMethod: 'paypal',
  },
  {
    id: 684,
    groupId: 111,
    channelName: 'MK84PP/acdc',
    status: '',
    accountStatus: true,
    siteB: 'www.havetr.com',
    channel: 'PRO_bancontact',
    remark: '重新打开',
    paymentMethod: 'card',
  },
]);

export const PAYMENT_METHOD_FILTER_OPTIONS = [
  { label: '全部', value: '' },
  { label: '信用卡', value: 'card' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Antom', value: 'antom' },
];

export function money(value: number) {
  return value.toFixed(2);
}

export function nowText() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function remarkText(row: ChannelGroupRow) {
  if (row.availableAccountCount <= 0) {
    return '无可用账号';
  }
  return `可用账号 【${row.availableAccountCount}】 个`;
}

export function getGroupAccounts(groupId: number) {
  return mockGroupAccountList.value.filter((item) => item.groupId === groupId);
}
