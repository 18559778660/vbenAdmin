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

export const STATUS_FILTER_OPTIONS = [
  { label: '全部', value: '' },
  { label: '启用', value: '1' },
  { label: '停用', value: '0' },
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

export const DEFAULT_RUN_DIRECTORY = 'deal';

/** 网关列表仍为静态 mock，后续接通道绑定后再改 */
export const mockSiteBGatewayList = ref<SiteBGatewayRow[]>([
  {
    id: 1,
    siteId: 1,
    channelName: 'stripe_card',
    status: true,
    accountBound: false,
    accountEnabled: false,
    paymentMode: 'local',
    remark: '',
  },
  {
    id: 2,
    siteId: 1,
    channelName: 'jh_stripe',
    status: true,
    accountBound: false,
    accountEnabled: false,
    paymentMode: 'embedded',
    remark: '',
  },
  {
    id: 3,
    siteId: 1,
    channelName: 'stripe',
    status: true,
    accountBound: true,
    accountEnabled: true,
    paymentMode: 'checkout',
    remark: '',
  },
]);

export function channelText(row: { channel: string; channelEnabled: boolean }) {
  return `${row.channel} | ${row.channelEnabled ? '启用' : '停用'}`;
}

export function ftpLabel(isFtp: boolean) {
  return isFtp ? '是' : '否';
}

export function getSiteGateways(siteId: number) {
  return mockSiteBGatewayList.value.filter((item) => item.siteId === siteId);
}
