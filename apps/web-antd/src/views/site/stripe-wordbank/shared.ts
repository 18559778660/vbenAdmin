import { ref } from 'vue';

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

export const mockStripeWordBankList = ref<StripeWordBankRow[]>([
  { id: 137, name: '/hook', usageCount: 20, configItem: 'webhook链接' },
  {
    id: 136,
    name: '/hook-confirm',
    usageCount: 20,
    configItem: 'webhook链接',
  },
  {
    id: 135,
    name: '/pay-webhook',
    usageCount: 20,
    configItem: 'webhook链接',
  },
  {
    id: 134,
    name: '/hook/payment',
    usageCount: 20,
    configItem: 'webhook链接',
  },
  { id: 133, name: '/pay-hook', usageCount: 20, configItem: 'webhook链接' },
  {
    id: 132,
    name: '/checkout-hook',
    usageCount: 18,
    configItem: 'webhook链接',
  },
  { id: 131, name: '/stripe-callback', usageCount: 15, configItem: '回调路径' },
]);

let nextWordBankId = 138;

export function nextWordBankIdValue() {
  const id = nextWordBankId;
  nextWordBankId += 1;
  return id;
}
