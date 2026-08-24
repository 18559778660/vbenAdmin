import { ref } from 'vue';

export type AssignUserRow = {
  assignedCount: number;
  id: number;
  nickname: string;
  username: string;
};

export type AssignedAccountRow = {
  accountStatus: boolean;
  channel: string;
  channelName: string;
  id: number;
  paymentMethod: string;
  remark: string;
  siteB: string;
  status: boolean;
  userId: number;
};

export const SEARCH_FIELD_OPTIONS = [
  { label: '账号', value: 'username' },
  { label: '昵称', value: 'nickname' },
];

export const PAYMENT_METHOD_FILTER_OPTIONS = [
  { label: '全部', value: '' },
  { label: '信用卡', value: 'card' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Antom', value: 'antom' },
];

export const mockAssignUserList = ref<AssignUserRow[]>([
  { id: 1, username: 'AQQQ', nickname: 'AQQQ', assignedCount: 85 },
  { id: 2, username: 'HMTopwin', nickname: 'HMTopwin', assignedCount: 65 },
  { id: 3, username: 'aswdwe', nickname: 'ces', assignedCount: 0 },
  { id: 4, username: 'distribution', nickname: '子账号', assignedCount: 4 },
]);

export const mockAssignedAccountList = ref<AssignedAccountRow[]>([
  {
    id: 187,
    userId: 1,
    channelName: 'TK34PP-内嵌收银台',
    status: true,
    accountStatus: true,
    siteB: 'www.mistralinnovations.com',
    channel: 'PROpay',
    remark: '重新打开',
    paymentMethod: 'paypal',
  },
  {
    id: 244,
    userId: 1,
    channelName: 'FMK149PP/ACDC',
    status: true,
    accountStatus: true,
    siteB: 'www.soleilth.com',
    channel: 'PROpay',
    remark: '重新打开',
    paymentMethod: 'paypal',
  },
  {
    id: 249,
    userId: 1,
    channelName: 'MK116PP-高级信用卡',
    status: true,
    accountStatus: true,
    siteB: 'www.mistralinnovations.com',
    channel: 'PRO_card',
    remark: '重新打开',
    paymentMethod: 'card',
  },
  {
    id: 217,
    userId: 1,
    channelName: 'MK120PP/高级',
    status: true,
    accountStatus: false,
    siteB: 'www.coveintl.com',
    channel: 'PRO_card',
    remark: '',
    paymentMethod: 'card',
  },
  {
    id: 207,
    userId: 1,
    channelName: 'MK120PP/高级',
    status: true,
    accountStatus: false,
    siteB: 'www.coveintl.com',
    channel: 'PRO_card',
    remark: '',
    paymentMethod: 'card',
  },
  {
    id: 198,
    userId: 1,
    channelName: 'MK120PP/高级',
    status: true,
    accountStatus: true,
    siteB: 'www.coveintl.com',
    channel: 'PRO_card',
    remark: '重新打开',
    paymentMethod: 'card',
  },
  {
    id: 195,
    userId: 1,
    channelName: 'MK120PP/高级',
    status: true,
    accountStatus: true,
    siteB: 'www.coveintl.com',
    channel: 'PRO_card',
    remark: '重新打开',
    paymentMethod: 'card',
  },
  {
    id: 689,
    userId: 1,
    channelName: 'MK273PPF/ACDC',
    status: true,
    accountStatus: true,
    siteB: 'lirowave.com',
    channel: 'PRO_card',
    remark: '重新打开',
    paymentMethod: 'card',
  },
  {
    id: 644,
    userId: 1,
    channelName: 'SUK31/blik',
    status: true,
    accountStatus: true,
    siteB: 'qortexco.com',
    channel: 'supay_wallet',
    remark: '',
    paymentMethod: 'card',
  },
  {
    id: 690,
    userId: 2,
    channelName: '蚂蚁10-蔡-球衣',
    status: true,
    accountStatus: true,
    siteB: 'opolelife.com',
    channel: 'antom',
    remark: '重新打开',
    paymentMethod: 'antom',
  },
  {
    id: 691,
    userId: 2,
    channelName: 'FMK149PP/ACDC',
    status: true,
    accountStatus: true,
    siteB: 'www.soleilth.com',
    channel: 'PROpay',
    remark: '重新打开',
    paymentMethod: 'paypal',
  },
  {
    id: 692,
    userId: 4,
    channelName: 'FMK149PP/ACDC',
    status: true,
    accountStatus: true,
    siteB: 'havetr.com',
    channel: 'PROpay',
    remark: '',
    paymentMethod: 'paypal',
  },
  {
    id: 693,
    userId: 4,
    channelName: 'MK84PP/acdc',
    status: true,
    accountStatus: true,
    siteB: 'www.havetr.com',
    channel: 'PRO_bancontact',
    remark: '重新打开',
    paymentMethod: 'card',
  },
  {
    id: 694,
    userId: 4,
    channelName: 'TK34PP-内嵌收银台',
    status: true,
    accountStatus: false,
    siteB: 'www.mistralinnovations.com',
    channel: 'PROpay',
    remark: '',
    paymentMethod: 'paypal',
  },
  {
    id: 695,
    userId: 4,
    channelName: 'MK116PP-高级信用卡',
    status: false,
    accountStatus: true,
    siteB: 'www.mistralinnovations.com',
    channel: 'PRO_card',
    remark: '重新打开',
    paymentMethod: 'card',
  },
]);

let nextUserId = 5;

export function nextUserIdValue() {
  const id = nextUserId;
  nextUserId += 1;
  return id;
}

export function remarkText(row: AssignUserRow) {
  if (row.assignedCount <= 0) {
    return '未分配账号';
  }
  return `分配账号 【${row.assignedCount}】 个`;
}

export function getUserAccounts(userId: number) {
  return mockAssignedAccountList.value.filter((item) => item.userId === userId);
}
