import { requestClient } from '#/api/request';

export namespace CardTypeApi {
  export interface Prefix {
    start: string;
    end: string;
  }

  export interface CardType {
    id: number;
    code: string;
    name: string;
    nameLabel: string;
    lengths: number[];
    prefixes: Prefix[];
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  }

  export interface BrandOption {
    value: string;
    label: string;
  }

  export interface ListParams {
    field?: string;
    keyword?: string;
  }

  export interface SavePayload {
    code: string;
    name: string;
    lengths: number[];
    prefixes: Prefix[];
  }
}

export namespace CurrencyApi {
  export interface Currency {
    id: number;
    code: string;
    name: string;
    rate: number;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  }

  export interface Option {
    value: string;
    label: string;
  }

  export interface ListParams {
    field?: string;
    keyword?: string;
  }

  export interface SavePayload {
    code: string;
    rate: number;
  }
}

export namespace CountryApi {
  export interface Country {
    id: number;
    code: string;
    name: string;
    cardBinRatio: number;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  }

  export interface Option {
    value: string;
    label: string;
  }

  export interface ListParams {
    field?: string;
    keyword?: string;
  }

  export interface SavePayload {
    code: string;
    cardBinRatio: number;
  }
}

export async function getCardTypeList(params?: CardTypeApi.ListParams) {
  return requestClient.get<CardTypeApi.CardType[]>('/card-types', { params });
}

export async function getCardTypeBrands() {
  return requestClient.get<CardTypeApi.BrandOption[]>('/card-types/brands');
}

export async function createCardType(data: CardTypeApi.SavePayload) {
  return requestClient.post<CardTypeApi.CardType>('/card-types', data);
}

export async function updateCardType(
  id: number,
  data: CardTypeApi.SavePayload,
) {
  return requestClient.put<CardTypeApi.CardType>(`/card-types/${id}`, data);
}

export async function getCurrencyList(params?: CurrencyApi.ListParams) {
  return requestClient.get<CurrencyApi.Currency[]>('/currencies', { params });
}

export async function getCurrencyOptions() {
  return requestClient.get<CurrencyApi.Option[]>('/currencies/options');
}

export async function createCurrency(data: CurrencyApi.SavePayload) {
  return requestClient.post<CurrencyApi.Currency>('/currencies', data);
}

export async function updateCurrency(
  id: number,
  data: CurrencyApi.SavePayload,
) {
  return requestClient.put<CurrencyApi.Currency>(`/currencies/${id}`, data);
}

export async function deleteCurrency(id: number) {
  return requestClient.delete(`/currencies/${id}`);
}

export async function getCountryList(params?: CountryApi.ListParams) {
  return requestClient.get<CountryApi.Country[]>('/countries', { params });
}

export async function getCountryOptions() {
  return requestClient.get<CountryApi.Option[]>('/countries/options');
}

export async function createCountry(data: CountryApi.SavePayload) {
  return requestClient.post<CountryApi.Country>('/countries', data);
}

export async function updateCountry(id: number, data: CountryApi.SavePayload) {
  return requestClient.put<CountryApi.Country>(`/countries/${id}`, data);
}

export async function deleteCountry(id: number) {
  return requestClient.delete(`/countries/${id}`);
}
