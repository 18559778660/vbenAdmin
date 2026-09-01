export type ChannelGroupRow = {
  allowCardTypes: string[];
  allowCountries: string[];
  autoShip: boolean;
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
  disableCardBrands: string[];
  disableCardTypes: string[];
  disableCountries: string[];
  failLimitCount: number;
  gatewayUrl: string;
  id: number;
  interceptCurrency: string;
  interceptMax: number;
  interceptMin: number;
  interceptMode: string;
  memberCount: number;
  name: string;
  oldCustomerDays: number;
  payFrequencyDays: number;
  preferCountries: string[];
  successLimitCount: number;
  totalAmount: number;
  updatedAt: string;
  updatedBy: string;
};

export type GroupAccountRow = {
  accountStatus: boolean;
  channel: string;
  channelName: string;
  id: number;
  inGroup: boolean;
  paymentMethod: string;
  remark: string;
  siteB: string;
};

export function money(value: number) {
  return value.toFixed(2);
}

export function remarkText(row: ChannelGroupRow) {
  if (row.availableAccountCount <= 0) {
    return '无可用账号';
  }
  return `可用账号 【${row.availableAccountCount}】 个`;
}

export function shipModeText(autoShip: boolean) {
  return autoShip ? '自动发货' : '手动发货';
}
