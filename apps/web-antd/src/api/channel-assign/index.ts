import { requestClient } from '#/api/request';

export namespace ChannelAssignApi {
  export interface AssignUser {
    id: number;
    username: string;
    nickname: string;
    assignedCount: number;
  }

  export interface ListParams {
    field?: string;
    keyword?: string;
  }

  export interface CreatePayload {
    username: string;
    nickname?: string;
    password: string;
  }

  export interface AssignedAccount {
    id: number;
    channelName: string;
    assigned: boolean;
    accountStatus: boolean;
    siteB: string;
    channel: string;
    remark: string;
    paymentMethod: string;
  }

  export interface AccountListParams {
    channelId?: number;
  }
}

export async function getAssignUserList(params?: ChannelAssignApi.ListParams) {
  return requestClient.get<ChannelAssignApi.AssignUser[]>('/assign-users', {
    params,
  });
}

export async function createAssignUser(data: ChannelAssignApi.CreatePayload) {
  return requestClient.post<ChannelAssignApi.AssignUser>('/assign-users', data);
}

export async function getAssignUserAccounts(
  userId: number,
  params?: ChannelAssignApi.AccountListParams,
) {
  return requestClient.get<ChannelAssignApi.AssignedAccount[]>(
    `/assign-users/${userId}/accounts`,
    { params },
  );
}

export async function setAssignUserAccountAssignment(
  userId: number,
  accountId: number,
  assigned: boolean,
) {
  return requestClient.put(
    `/assign-users/${userId}/accounts/${accountId}/assignment`,
    { assigned },
  );
}
