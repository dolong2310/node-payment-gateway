import { LoggerService } from '../../common/services/logger.service';
import { ZaloPayReturnCode } from '../constants';
import { ZaloPayLocale } from '../enums';
import {
  GlobalConfig,
  ReturnQueryFromZaloPay,
  VerifyIpnCall,
  VerifyIpnCallLogger,
  VerifyIpnCallOptions,
  VerifyReturnUrl,
  VerifyReturnUrlLogger,
  VerifyReturnUrlOptions,
  ZaloPayCallbackBody,
  ZaloPayCallbackData,
} from '../types';
import { getResponseByStatusCode, verifyCallbackMac, verifyRedirectChecksum } from '../utils';

const WRONG_CHECKSUM_MESSAGE: Record<ZaloPayLocale, string> = {
  [ZaloPayLocale.VI]: 'Sai chữ ký (checksum/mac)',
  [ZaloPayLocale.EN]: 'Wrong checksum',
};

export class VerificationService {
  private readonly config: GlobalConfig;
  private readonly logger: LoggerService;

  constructor(config: GlobalConfig, logger: LoggerService) {
    this.config = config;
    this.logger = logger;
  }

  public verifyReturnUrl<LoggerFields extends keyof VerifyReturnUrlLogger>(
    query: ReturnQueryFromZaloPay,
    options?: VerifyReturnUrlOptions<LoggerFields>,
  ): VerifyReturnUrl {
    const isVerified = verifyRedirectChecksum(query, this.config.key2);
    const isSuccess = Number(query?.status) === ZaloPayReturnCode.SUCCESS;

    const result: VerifyReturnUrl = {
      ...query,
      isVerified,
      isSuccess,
      message: isVerified
        ? getResponseByStatusCode(isSuccess ? ZaloPayReturnCode.SUCCESS : ZaloPayReturnCode.FAIL, undefined, this.config.lang)
        : WRONG_CHECKSUM_MESSAGE[this.config.lang],
    };

    const data2Log: VerifyReturnUrlLogger = {
      createdAt: new Date(),
      method: 'verifyReturnUrl',
      ...result,
    };

    if (!options?.withHash) {
      delete data2Log.checksum;
    }

    this.logger.log(data2Log, options, 'verifyReturnUrl');

    return result;
  }

  /**
   * Xác thực callback ZaloPay gửi tới callbackUrl.
   * ZaloPay chỉ gửi callback khi thanh toán thành công, nên `isSuccess` = mac hợp lệ và parse được data.
   * @en Verify the callback ZaloPay sends to callbackUrl.
   */
  public verifyIpnCall<LoggerFields extends keyof VerifyIpnCallLogger>(
    body: ZaloPayCallbackBody,
    options?: VerifyIpnCallOptions<LoggerFields>,
  ): VerifyIpnCall {
    const isVerified = verifyCallbackMac(body, this.config.key2);

    let callbackData = {} as ZaloPayCallbackData;
    try {
      callbackData = JSON.parse(body?.data) as ZaloPayCallbackData;
    } catch {
      // data không phải JSON hợp lệ
    }

    const isSuccess = isVerified && Boolean(callbackData?.app_trans_id);

    const result: VerifyIpnCall = {
      ...callbackData,
      type: Number(body?.type),
      isVerified,
      isSuccess,
      message: isVerified
        ? getResponseByStatusCode(isSuccess ? ZaloPayReturnCode.SUCCESS : ZaloPayReturnCode.FAIL, undefined, this.config.lang)
        : WRONG_CHECKSUM_MESSAGE[this.config.lang],
    };

    const data2Log: VerifyIpnCallLogger = {
      createdAt: new Date(),
      method: 'verifyIpnCall',
      ...result,
      ...(options?.withHash ? { mac: body?.mac } : {}),
    };

    this.logger.log(data2Log, options, 'verifyIpnCall');

    return result;
  }
}
