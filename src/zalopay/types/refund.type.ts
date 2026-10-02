import type { LoggerData, LoggerOptions } from '../../common/types/logger.type';
import { BaseResponseFromZaloPay, ResultVerified } from './common.type';

export type Refund = {
  zp_trans_id: string | number; // Mã giao dịch ZaloPay của đơn cần hoàn
  amount: number; // Số tiền hoàn (VND)
  description: string; // Lý do hoàn tiền
  refund_fee_amount?: number; // Phí hoàn tiền (nếu có)
  m_refund_id?: string; // Mã hoàn tiền dạng yymmdd_appid_xxx, tự sinh nếu bỏ trống
};

export type BodyRequestRefund = {
  app_id: number;
  m_refund_id: string;
  zp_trans_id: string;
  amount: number;
  refund_fee_amount?: number;
  timestamp: number;
  description: string;
  mac: string;
};

export type RefundResponseFromZaloPay = BaseResponseFromZaloPay & {
  refund_id: number;
};

export type RefundResponse = ResultVerified &
  RefundResponseFromZaloPay & {
    isProcessing: boolean;
    m_refund_id: string; // Lưu lại để gọi queryRefund
  };

export type RefundResponseLogger = LoggerData<
  {
    createdAt: Date;
  } & RefundResponse
>;

export type RefundOptions<Fields extends keyof RefundResponseLogger> = LoggerOptions<RefundResponseLogger, Fields>;

export type QueryRefund = {
  m_refund_id: string;
};

export type BodyRequestQueryRefund = QueryRefund & {
  app_id: number;
  timestamp: number;
  mac: string;
};

export type QueryRefundResponseFromZaloPay = BaseResponseFromZaloPay;

export type QueryRefundResponse = ResultVerified &
  QueryRefundResponseFromZaloPay & {
    isProcessing: boolean;
    m_refund_id: string;
  };

export type QueryRefundResponseLogger = LoggerData<
  {
    createdAt: Date;
  } & QueryRefundResponse
>;

export type QueryRefundOptions<Fields extends keyof QueryRefundResponseLogger> = LoggerOptions<
  QueryRefundResponseLogger,
  Fields
>;
