import { LoggerData, LoggerOptions } from '../../common/types/logger.type';
import { ResultVerified } from './common.type';
import { ReturnQueryFromZaloPay } from './return-from-zalopay.type';

export type VerifyReturnUrl = ResultVerified & ReturnQueryFromZaloPay;

export type VerifyReturnUrlLogger = LoggerData<
  {
    createdAt: Date;
  } & VerifyReturnUrl
>;

export type VerifyReturnUrlOptions<Fields extends keyof VerifyReturnUrlLogger> = {
  withHash?: boolean;
} & LoggerOptions<VerifyReturnUrlLogger, Fields>;
