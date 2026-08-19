import { ref } from 'vue';

export type CardBinRow = {
  bank: string;
  bin: string;
  brand: string;
  cardType: string;
  country: string;
  id: number;
  status: boolean;
  updatedAt: string;
};

export type CurrencyRow = {
  code: string;
  id: number;
  name: string;
  sort: number;
  status: boolean;
  symbol: string;
  updatedAt: string;
};

export type CountryRow = {
  code: string;
  id: number;
  name: string;
  nameEn: string;
  status: boolean;
  updatedAt: string;
};

export const CARD_BRAND_LABELS: Record<string, string> = {
  visa: 'Visa',
  mastercard: '万事达',
  jcb: 'JCB',
  amex: 'American Express',
  unionpay: '银联',
};

export const CARD_TYPE_LABELS: Record<string, string> = {
  credit: '信用卡',
  debit: '借记卡',
  prepaid: '预付卡',
};

export const COUNTRY_OPTIONS = [
  { label: '美国', value: 'US' },
  { label: '中国', value: 'CN' },
  { label: '英国', value: 'GB' },
  { label: '日本', value: 'JP' },
  { label: '德国', value: 'DE' },
  { label: '法国', value: 'FR' },
];

export function toOptions(map: Record<string, string>) {
  return Object.entries(map).map(([value, label]) => ({ label, value }));
}

export function countryLabel(code: string) {
  return COUNTRY_OPTIONS.find((item) => item.value === code)?.label || code;
}

export function nowText() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export const mockCardBinList = ref<CardBinRow[]>([
  {
    id: 1,
    bin: '411111',
    brand: 'visa',
    cardType: 'credit',
    bank: 'Chase',
    country: 'US',
    status: true,
    updatedAt: '2026-08-01 10:00:00',
  },
  {
    id: 2,
    bin: '555555',
    brand: 'mastercard',
    cardType: 'credit',
    bank: 'Citibank',
    country: 'US',
    status: true,
    updatedAt: '2026-08-02 11:20:00',
  },
  {
    id: 3,
    bin: '622202',
    brand: 'unionpay',
    cardType: 'debit',
    bank: '工商银行',
    country: 'CN',
    status: true,
    updatedAt: '2026-08-03 09:12:00',
  },
]);

export const mockCurrencyList = ref<CurrencyRow[]>([
  {
    id: 1,
    code: 'USD',
    name: '美元',
    symbol: '$',
    sort: 1,
    status: true,
    updatedAt: '2026-08-01 10:00:00',
  },
  {
    id: 2,
    code: 'EUR',
    name: '欧元',
    symbol: '€',
    sort: 2,
    status: true,
    updatedAt: '2026-08-01 10:00:00',
  },
  {
    id: 3,
    code: 'CNY',
    name: '人民币',
    symbol: '¥',
    sort: 3,
    status: true,
    updatedAt: '2026-08-01 10:00:00',
  },
  {
    id: 4,
    code: 'GBP',
    name: '英镑',
    symbol: '£',
    sort: 4,
    status: true,
    updatedAt: '2026-08-01 10:00:00',
  },
]);

export const mockCountryList = ref<CountryRow[]>([
  {
    id: 1,
    code: 'US',
    name: '美国',
    nameEn: 'United States',
    status: true,
    updatedAt: '2026-08-01 10:00:00',
  },
  {
    id: 2,
    code: 'CN',
    name: '中国',
    nameEn: 'China',
    status: true,
    updatedAt: '2026-08-01 10:00:00',
  },
  {
    id: 3,
    code: 'GB',
    name: '英国',
    nameEn: 'United Kingdom',
    status: true,
    updatedAt: '2026-08-01 10:00:00',
  },
  {
    id: 4,
    code: 'JP',
    name: '日本',
    nameEn: 'Japan',
    status: true,
    updatedAt: '2026-08-01 10:00:00',
  },
]);

let nextCardBinId = 4;
let nextCurrencyId = 5;
let nextCountryId = 5;

export function createCardBin(payload: Omit<CardBinRow, 'id' | 'updatedAt'>) {
  const row: CardBinRow = {
    ...payload,
    id: nextCardBinId++,
    updatedAt: nowText(),
  };
  mockCardBinList.value.unshift(row);
  return row;
}

export function updateCardBin(id: number, payload: Partial<CardBinRow>) {
  const row = mockCardBinList.value.find((item) => item.id === id);
  if (!row) {
    return null;
  }
  Object.assign(row, payload, { updatedAt: nowText() });
  return row;
}

export function createCurrency(payload: Omit<CurrencyRow, 'id' | 'updatedAt'>) {
  const row: CurrencyRow = {
    ...payload,
    id: nextCurrencyId++,
    updatedAt: nowText(),
  };
  mockCurrencyList.value.unshift(row);
  return row;
}

export function updateCurrency(id: number, payload: Partial<CurrencyRow>) {
  const row = mockCurrencyList.value.find((item) => item.id === id);
  if (!row) {
    return null;
  }
  Object.assign(row, payload, { updatedAt: nowText() });
  return row;
}

export function createCountry(payload: Omit<CountryRow, 'id' | 'updatedAt'>) {
  const row: CountryRow = {
    ...payload,
    id: nextCountryId++,
    updatedAt: nowText(),
  };
  mockCountryList.value.unshift(row);
  return row;
}

export function updateCountry(id: number, payload: Partial<CountryRow>) {
  const row = mockCountryList.value.find((item) => item.id === id);
  if (!row) {
    return null;
  }
  Object.assign(row, payload, { updatedAt: nowText() });
  return row;
}
