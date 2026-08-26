export type SiteAStatus = 'audited' | 'disabled' | 'pending';

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

export const FRAMEWORK_OPTIONS = [
  { label: 'woocommerce', value: 'woocommerce' },
  { label: 'shopyy', value: 'shopyy' },
];

export function domainHref(domain: string) {
  if (!domain || domain === 'a.') return '';
  const normalized = domain.startsWith('http') ? domain : `https://${domain}`;
  return normalized;
}
