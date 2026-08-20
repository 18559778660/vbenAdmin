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
