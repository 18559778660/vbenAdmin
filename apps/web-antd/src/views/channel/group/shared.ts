import { ref } from 'vue';

export type ChannelGroupRow = {
  availableAccountCount: number;
  balance: number;
  code: string;
  createdAt: string;
  createdBy: string;
  gateway: boolean;
  id: number;
  name: string;
  oldCustomerDays: number;
  totalAmount: number;
  updatedAt: string;
  updatedBy: string;
};

export const mockChannelGroupList = ref<ChannelGroupRow[]>([
  {
    id: 113,
    code: '11st',
    name: '11st',
    totalAmount: 0,
    balance: 0,
    gateway: true,
    oldCustomerDays: 30,
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
    totalAmount: 5000,
    balance: 3181.02,
    gateway: true,
    oldCustomerDays: 1,
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
    gateway: false,
    oldCustomerDays: 30,
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
    gateway: true,
    oldCustomerDays: 7,
    availableAccountCount: 0,
    createdAt: '2026-07-15 19:11:26',
    createdBy: 'admin',
    updatedAt: '2026-08-12 13:05:19',
    updatedBy: 'admin',
  },
]);

let nextGroupId = 114;

export function nextGroupIdValue() {
  const id = nextGroupId;
  nextGroupId += 1;
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

export function remarkText(row: ChannelGroupRow) {
  if (row.availableAccountCount <= 0) {
    return '无可用账号';
  }
  return `可用账号 【${row.availableAccountCount}】 个`;
}
