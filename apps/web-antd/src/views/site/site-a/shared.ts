import { ref } from 'vue';

export type SiteAStatus = 'audited' | 'disabled' | 'pending';

export type SiteARow = {
  createdAt: string;
  createdBy: string;
  domain: string;
  framework: string;
  id: number;
  merchant: string;
  status: SiteAStatus;
  updatedAt: string;
  updatedBy: string;
};

export const STATUS_FILTER_OPTIONS = [
  { label: '全部', value: '' },
  { label: '已审核', value: 'audited' },
  { label: '待审核', value: 'pending' },
  { label: '禁用', value: 'disabled' },
];

export const STATUS_LABELS: Record<SiteAStatus, string> = {
  audited: '已审核',
  pending: '待审核',
  disabled: '禁用',
};

export const STATUS_COLORS: Record<SiteAStatus, string> = {
  audited: 'green',
  pending: 'blue',
  disabled: 'orange',
};

export const MERCHANT_OPTIONS = [
  { label: '全部', value: '' },
  { label: 'tie', value: 'tie' },
  { label: 'L杰', value: 'L杰' },
  { label: 'tie88', value: 'tie88' },
  { label: 'demo', value: 'demo' },
];

export const MERCHANT_FORM_OPTIONS = [
  { label: 'tie', value: 'tie' },
  { label: 'L杰', value: 'L杰' },
  { label: 'tie88', value: 'tie88' },
  { label: 'demo', value: 'demo' },
];

export const FRAMEWORK_OPTIONS = [
  { label: 'shopyy', value: 'shopyy' },
  { label: '0', value: '0' },
  { label: 'shopify', value: 'shopify' },
  { label: 'woocommerce', value: 'woocommerce' },
];

export const mockSiteAList = ref<SiteARow[]>([
  {
    id: 16_125,
    merchant: 'tie',
    domain: 'www.fi-eu.top',
    framework: 'shopyy',
    status: 'audited',
    createdAt: '2026-08-06 16:14:55',
    createdBy: 'WIN0143',
    updatedAt: '2026-08-06 16:14:55',
    updatedBy: 'WIN0143',
  },
  {
    id: 16_124,
    merchant: 'tie',
    domain: 'fl-eu.top',
    framework: 'shopyy',
    status: 'audited',
    createdAt: '2026-08-06 16:14:54',
    createdBy: 'WIN0143',
    updatedAt: '2026-08-06 16:14:54',
    updatedBy: 'WIN0143',
  },
  {
    id: 16_123,
    merchant: 'L杰',
    domain: 'a.',
    framework: '0',
    status: 'audited',
    createdAt: '2026-08-06 16:14:53',
    createdBy: 'admin',
    updatedAt: '2026-08-06 16:14:53',
    updatedBy: 'admin',
  },
  {
    id: 16_121,
    merchant: 'tie88',
    domain: 'ba-shs.shop',
    framework: 'shopyy',
    status: 'audited',
    createdAt: '2026-08-06 16:14:51',
    createdBy: 'root',
    updatedAt: '2026-08-06 16:14:51',
    updatedBy: 'root',
  },
  {
    id: 16_118,
    merchant: 'demo',
    domain: 'shop-demo.example.com',
    framework: 'shopify',
    status: 'pending',
    createdAt: '2026-08-05 10:22:18',
    createdBy: 'admin',
    updatedAt: '2026-08-05 10:22:18',
    updatedBy: 'admin',
  },
  {
    id: 16_115,
    merchant: 'tie',
    domain: 'old-site.example.net',
    framework: 'shopyy',
    status: 'disabled',
    createdAt: '2026-08-01 09:11:07',
    createdBy: 'WIN0143',
    updatedAt: '2026-08-04 14:30:22',
    updatedBy: 'admin',
  },
]);

let nextSiteAId = 16_126;

export function nextSiteAIdValue() {
  const id = nextSiteAId;
  nextSiteAId += 1;
  return id;
}

export function nowText() {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function domainHref(domain: string) {
  if (!domain || domain === 'a.') return '';
  const normalized = domain.startsWith('http') ? domain : `https://${domain}`;
  return normalized;
}
