import { LoggerService } from '../../common/services/logger.service';
import { resolveUrlString } from '../../common/utils/http.util';
import { ZaloPayReturnCode } from '../constants';
import {
  BodyRequestCreateOrder,
  BuildPaymentUrl,
  BuildPaymentUrlLogger,
  BuildPaymentUrlOptions,
  CreateOrderResponse,
  CreateOrderResponseFromZaloPay,
  GlobalConfig,
} from '../types';
import { buildCreateOrderMacData, generateAppTransId, generateMac, getResponseByStatusCode } from '../utils';
import { postForm } from '../utils/request.util';

const DEFAULT_APP_USER = 'user';

export class PaymentService {
  private readonly config: GlobalConfig;
  private readonly logger: LoggerService;

  constructor(config: GlobalConfig, logger: LoggerService) {
    this.config = config;
    this.logger = logger;
  }

  async createOrder<LoggerFields extends keyof BuildPaymentUrlLogger>(
    data: BuildPaymentUrl,
    options?: BuildPaymentUrlOptions<LoggerFields>,
    methodName = 'createOrder',
  ): Promise<CreateOrderResponse> {
    const {
      amount,
      description,
      appUser = DEFAULT_APP_USER,
      appTime = Date.now(),
      redirectUrl,
      callbackUrl = this.config.callbackUrl,
      embedData = {},
      items = [],
      bankCode = '',
      preferredPaymentMethod,
      expireDurationSeconds,
      title,
      phone,
      email,
      address,
      subAppId,
    } = data;

    const appTransId = generateAppTransId(data.appTransId);

    const embedDataToSend = {
      ...embedData,
      preferred_payment_method: preferredPaymentMethod ?? embedData.preferred_payment_method ?? [],
      ...(redirectUrl ? { redirecturl: redirectUrl } : {}),
    };

    const bodyWithoutMac: Omit<BodyRequestCreateOrder, 'mac'> = {
      app_id: this.config.appId,
      app_user: appUser,
      app_trans_id: appTransId,
      app_time: appTime,
      amount,
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embedDataToSend),
      description,
      bank_code: bankCode,
      callback_url: callbackUrl,
      expire_duration_seconds: expireDurationSeconds,
      title,
      phone,
      email,
      address,
      sub_app_id: subAppId,
    };

    // Generate mac with key1
    const mac = generateMac(this.config.key1, buildCreateOrderMacData(bodyWithoutMac));

    const url = resolveUrlString(this.config.openApiHost, this.config.createOrderEndpoint);

    const response = await postForm<CreateOrderResponseFromZaloPay>(url, { ...bodyWithoutMac, mac });

    const result: CreateOrderResponse = {
      ...response,
      app_trans_id: appTransId,
      isSuccess: response.return_code === ZaloPayReturnCode.SUCCESS,
      message: getResponseByStatusCode(
        response.return_code,
        response.sub_return_code,
        this.config.lang,
        response.sub_return_message || response.return_message,
      ),
    };

    const data2Log: BuildPaymentUrlLogger = {
      createdAt: new Date(),
      method: methodName,
      paymentUrl: response.order_url,
      ...bodyWithoutMac,
      ...result,
      ...(options?.withHash ? { mac } : {}),
    };

    this.logger.log(data2Log, options, methodName);

    return result;
  }

  async buildPaymentUrl<LoggerFields extends keyof BuildPaymentUrlLogger>(
    data: BuildPaymentUrl,
    options?: BuildPaymentUrlOptions<LoggerFields>,
  ): Promise<string> {
    const result = await this.createOrder(data, options, 'buildPaymentUrl');

    if (!result.isSuccess || !result.order_url) {
      throw new Error(
        `ZaloPay create order failed (return_code=${result.return_code}, sub_return_code=${result.sub_return_code}): ${result.message}`,
      );
    }

    return result.order_url;
  }
}
