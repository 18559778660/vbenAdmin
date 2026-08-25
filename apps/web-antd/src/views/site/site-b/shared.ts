import { ref } from 'vue';

export type SiteBGatewayRow = {
  accountBound: boolean;
  accountEnabled: boolean;
  channelName: string;
  id: number;
  paymentMode: 'checkout' | 'embedded' | 'local';
  remark: string;
  siteId: number;
  status: boolean;
};

export const PAYMENT_MODE_LABELS: Record<
  SiteBGatewayRow['paymentMode'],
  string
> = {
  local: '本地支付',
  embedded: '系统内嵌',
  checkout: '收银台',
};

export const PAYMENT_MODE_COLORS: Record<
  SiteBGatewayRow['paymentMode'],
  string
> = {
  local: 'text-orange-500',
  embedded: 'text-cyan-600',
  checkout: 'text-primary',
};

export function accountStatusText(row: SiteBGatewayRow) {
  if (!row.accountBound) {
    return '未绑定账号';
  }
  return `已绑定账号 | ${row.accountEnabled ? '启用' : '禁用'}`;
}

export function accountStatusClass(row: SiteBGatewayRow) {
  if (!row.accountBound) {
    return 'text-red-500';
  }
  return row.accountEnabled ? 'text-green-600' : 'text-orange-500';
}

export type SiteBRow = {
  account: string;
  channel: string;
  channelEnabled: boolean;
  createdAt: string;
  createdBy: string;
  domain: string;
  framework: string;
  host: string;
  id: number;
  isFtp: boolean;
  linkAddress: string;
  password: string;
  platform: string;
  remark: string;
  runDirectory: string;
  status: boolean;
  updatedAt: string;
  updatedBy: string;
};

export const STATUS_FILTER_OPTIONS = [
  { label: '全部', value: '' },
  { label: '启用', value: '1' },
  { label: '停用', value: '0' },
];

export const PLATFORM_FILTER_OPTIONS = [
  { label: '全部', value: '' },
  { label: 'stripe', value: 'stripe' },
  { label: 'pp', value: 'pp' },
];

export const PLATFORM_OPTIONS = [
  { label: 'stripe', value: 'stripe' },
  { label: 'pp', value: 'pp' },
];

export const FRAMEWORK_OPTIONS = [
  { label: '其他', value: '其他' },
  { label: 'shopyy', value: 'shopyy' },
  { label: 'shopify', value: 'shopify' },
];

export const FTP_OPTIONS = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];

export const mockSiteBList = ref<SiteBRow[]>([
  {
    id: 605,
    domain: 'kovret.com',
    channel: 'stripe',
    channelEnabled: true,
    platform: 'stripe',
    framework: '其他',
    status: true,
    linkAddress: 'ftp://-@',
    runDirectory: 'spot_trade',
    remark: '',
    updatedBy: 'admin',
    updatedAt: '2026-08-04 15:37:58',
    createdBy: 'admin',
    createdAt: '2026-08-04 15:37:58',
    isFtp: true,
    host: '',
    account: '',
    password: '',
  },
  {
    id: 604,
    domain: 'haltrixltd.com',
    channel: 'stripe',
    channelEnabled: true,
    platform: 'stripe',
    framework: '其他',
    status: true,
    linkAddress: 'ftp://-@',
    runDirectory: 'settlement',
    remark: '',
    updatedBy: 'admin',
    updatedAt: '2026-08-04 15:36:12',
    createdBy: 'admin',
    createdAt: '2026-08-04 15:36:12',
    isFtp: true,
    host: '',
    account: '',
    password: '',
  },
  {
    id: 603,
    domain: 'thalynne.com',
    channel: 'stripe',
    channelEnabled: true,
    platform: 'stripe',
    framework: '其他',
    status: true,
    linkAddress: 'ftp://-@',
    runDirectory: 'agreement',
    remark: '',
    updatedBy: 'admin',
    updatedAt: '2026-08-04 15:34:41',
    createdBy: 'admin',
    createdAt: '2026-08-04 15:34:41',
    isFtp: true,
    host: '',
    account: '',
    password: '',
  },
  {
    id: 602,
    domain: 'nexovial.com',
    channel: 'stripe',
    channelEnabled: true,
    platform: 'stripe',
    framework: '其他',
    status: true,
    linkAddress: 'ftp://-@',
    runDirectory: 'sales_order',
    remark: '',
    updatedBy: 'admin',
    updatedAt: '2026-08-04 15:33:08',
    createdBy: 'admin',
    createdAt: '2026-08-04 15:33:08',
    isFtp: true,
    host: '',
    account: '',
    password: '',
  },
  {
    id: 601,
    domain: 'veltrion.com',
    channel: 'stripe',
    channelEnabled: true,
    platform: 'stripe',
    framework: '其他',
    status: true,
    linkAddress: 'ftp://-@',
    runDirectory: 'swap',
    remark: '',
    updatedBy: 'admin',
    updatedAt: '2026-08-04 15:31:55',
    createdBy: 'admin',
    createdAt: '2026-08-04 15:31:55',
    isFtp: true,
    host: '',
    account: '',
    password: '',
  },
  {
    id: 600,
    domain: 'orivanta.com',
    channel: 'stripe',
    channelEnabled: true,
    platform: 'stripe',
    framework: '其他',
    status: true,
    linkAddress: 'ftp://-@',
    runDirectory: 'online_order',
    remark: '',
    updatedBy: 'admin',
    updatedAt: '2026-08-04 15:30:22',
    createdBy: 'admin',
    createdAt: '2026-08-04 15:30:22',
    isFtp: true,
    host: '',
    account: '',
    password: '',
  },
  {
    id: 599,
    domain: 'zenithcore.com',
    channel: 'stripe',
    channelEnabled: false,
    platform: 'stripe',
    framework: '其他',
    status: true,
    linkAddress: 'ftp://-@',
    runDirectory: 'barter',
    remark: '',
    updatedBy: 'admin',
    updatedAt: '2026-08-04 15:28:47',
    createdBy: 'admin',
    createdAt: '2026-08-04 15:28:47',
    isFtp: true,
    host: '',
    account: '',
    password: '',
  },
  {
    id: 598,
    domain: 'paylink-demo.com',
    channel: 'pp',
    channelEnabled: true,
    platform: 'pp',
    framework: '其他',
    status: true,
    linkAddress: 'ftp://-@',
    runDirectory: 'deal',
    remark: '',
    updatedBy: 'admin',
    updatedAt: '2026-08-04 15:27:15',
    createdBy: 'admin',
    createdAt: '2026-08-04 15:27:15',
    isFtp: true,
    host: '',
    account: '',
    password: '',
  },
  {
    id: 597,
    domain: 'code-sync.example.com',
    channel: 'stripe',
    channelEnabled: true,
    platform: 'stripe',
    framework: '其他',
    status: true,
    linkAddress: 'ftp://-@',
    runDirectory: 'deal',
    remark: '2026-08-06 16:01:02: 代码版本一致',
    updatedBy: 'admin',
    updatedAt: '2026-08-06 16:01:02',
    createdBy: 'admin',
    createdAt: '2026-08-01 10:15:30',
    isFtp: true,
    host: '',
    account: '',
    password: '',
  },
]);

export const mockSiteBGatewayList = ref<SiteBGatewayRow[]>([
  {
    id: 1,
    siteId: 605,
    channelName: 'stripe_card',
    status: true,
    accountBound: false,
    accountEnabled: false,
    paymentMode: 'local',
    remark: '',
  },
  {
    id: 2,
    siteId: 605,
    channelName: 'jh_stripe',
    status: true,
    accountBound: false,
    accountEnabled: false,
    paymentMode: 'embedded',
    remark: '',
  },
  {
    id: 3,
    siteId: 605,
    channelName: 'stripe_klarna',
    status: true,
    accountBound: false,
    accountEnabled: false,
    paymentMode: 'checkout',
    remark: '',
  },
  {
    id: 4,
    siteId: 605,
    channelName: 'stripe',
    status: true,
    accountBound: true,
    accountEnabled: true,
    paymentMode: 'checkout',
    remark: '',
  },
  {
    id: 5,
    siteId: 604,
    channelName: 'stripe',
    status: true,
    accountBound: true,
    accountEnabled: true,
    paymentMode: 'checkout',
    remark: '',
  },
  {
    id: 6,
    siteId: 604,
    channelName: 'stripe_card',
    status: true,
    accountBound: false,
    accountEnabled: false,
    paymentMode: 'local',
    remark: '',
  },
  {
    id: 7,
    siteId: 598,
    channelName: 'pp_checkout',
    status: true,
    accountBound: false,
    accountEnabled: false,
    paymentMode: 'checkout',
    remark: '',
  },
]);

let nextSiteBId = 606;

export function nextSiteBIdValue() {
  const id = nextSiteBId;
  nextSiteBId += 1;
  return id;
}

export function nowText() {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function channelText(row: SiteBRow) {
  return `${row.channel} | ${row.channelEnabled ? '启用' : '停用'}`;
}

export function ftpLabel(isFtp: boolean) {
  return isFtp ? '是' : '否';
}

export function buildLinkAddress(
  isFtp: boolean,
  host: string,
  account: string,
) {
  if (!isFtp) return '';
  const hostText = host.trim() || '-';
  const accountText = account.trim() || '-';
  return `ftp://${accountText}@${hostText}`;
}

export function defaultRunDirectory(platform: string) {
  return platform === 'stripe' ? '' : 'deal';
}

export function getSiteGateways(siteId: number) {
  return mockSiteBGatewayList.value.filter((item) => item.siteId === siteId);
}
