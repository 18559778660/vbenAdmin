export type StripeWordBankRow = {
  configItem: string;
  id: number;
  name: string;
  usageCount: number;
};

export const CONFIG_ITEM_OPTIONS = [
  { label: 'webhook链接', value: 'webhook链接' },
  { label: '回调路径', value: '回调路径' },
  { label: '目录', value: '目录' },
];
