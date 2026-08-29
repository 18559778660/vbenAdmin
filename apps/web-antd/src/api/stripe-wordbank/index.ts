import { requestClient } from '#/api/request';

export namespace StripeWordBankApi {
  export interface WordBankItem {
    id: number;
    name: string;
    usageCount: number;
    configItem: string;
  }

  export interface ListParams {
    configItem?: string;
  }

  export interface CreatePayload {
    name: string;
    configItem: string;
  }

  export interface UpdatePayload {
    configItem: string;
  }
}

export async function getStripeWordBankList(
  params?: StripeWordBankApi.ListParams,
) {
  return requestClient.get<StripeWordBankApi.WordBankItem[]>(
    '/stripe-word-banks',
    { params },
  );
}

export async function createStripeWordBank(
  data: StripeWordBankApi.CreatePayload,
) {
  return requestClient.post<StripeWordBankApi.WordBankItem>(
    '/stripe-word-banks',
    data,
  );
}

export async function updateStripeWordBank(
  id: number,
  data: StripeWordBankApi.UpdatePayload,
) {
  return requestClient.put<StripeWordBankApi.WordBankItem>(
    `/stripe-word-banks/${id}`,
    data,
  );
}

export async function deleteStripeWordBank(id: number) {
  return requestClient.delete(`/stripe-word-banks/${id}`);
}
