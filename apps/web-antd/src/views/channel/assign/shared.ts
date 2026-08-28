export type AssignUserRow = {
  assignedCount: number;
  id: number;
  nickname: string;
  username: string;
};

export type AssignedAccountRow = {
  accountStatus: boolean;
  assigned: boolean;
  channel: string;
  channelName: string;
  id: number;
  paymentMethod: string;
  remark: string;
  siteB: string;
};

export const SEARCH_FIELD_OPTIONS = [
  { label: '账号', value: 'username' },
  { label: '昵称', value: 'nickname' },
];

export function remarkText(row: AssignUserRow) {
  if (row.assignedCount <= 0) {
    return '未分配账号';
  }
  return `分配账号 【${row.assignedCount}】 个`;
}
