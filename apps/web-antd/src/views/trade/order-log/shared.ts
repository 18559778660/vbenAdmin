import type { OrderLogApi } from '#/api';

export type OrderLogType = OrderLogApi.Type;

export type OrderLogRow = OrderLogApi.OrderLog;

export const LOG_TYPE_LABELS: Record<OrderLogType, string> = {
  fail_log: '失败日志',
  log_record: '日志记录',
  fail_record: '失败记录',
};
