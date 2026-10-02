import { LoggerData, LoggerOptions } from '../../common/types/logger.type';
import { BaseResponseFromZaloPay, ResultVerified } from './common.type';

export type QueryDr = {
  app_trans_id: string;
};

export type BodyRequestQueryDr = QueryDr & {
  app_id: number;
  mac: string;
};

export type QueryDrResponseFromZaloPay = BaseResponseFromZaloPay & {
  is_processing: boolean;
  amount: number;
  discount_amount: number;
  zp_trans_id: number;
  server_time: number;
};

export type QueryDrResponse = ResultVerified &
  QueryDrResponseFromZaloPay & {
    isProcessing: boolean;
    app_trans_id: string;
  };

export type QueryDrResponseLogger = LoggerData<
  {
    createdAt: Date;
  } & QueryDrResponse
>;

export type QueryDrResponseOptions<Fields extends keyof QueryDrResponseLogger> = {
  withHash?: boolean;
} & LoggerOptions<QueryDrResponseLogger, Fields>;
