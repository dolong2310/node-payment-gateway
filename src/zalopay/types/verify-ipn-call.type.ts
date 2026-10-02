import type { LoggerData, LoggerOptions } from '../../common/types/logger.type';
import type { ZaloPayCallbackData } from './callback.type';
import type { ResultVerified } from './common.type';

/**
 * Kết quả xác thực callback. Các field của data chỉ có khi `data` parse được.
 * @en Callback verification result. Data fields are only present when `data` can be parsed.
 */
export type VerifyIpnCall = ResultVerified &
  ZaloPayCallbackData & {
    type: number;
  };

export type VerifyIpnCallLogger = LoggerData<
  {
    createdAt: Date;
    mac?: string;
  } & VerifyIpnCall
>;

export type VerifyIpnCallOptions<Fields extends keyof VerifyIpnCallLogger> = {
  withHash?: boolean;
} & LoggerOptions<VerifyIpnCallLogger, Fields>;
