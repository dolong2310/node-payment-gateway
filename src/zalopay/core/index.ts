import { LoggerService } from '../../common/services/logger.service';
import { resolveUrlString } from '../../common/utils/http.util';
import {
  CREATE_ORDER_ENDPOINT,
  GET_BANK_LIST_ENDPOINT,
  QUERY_ORDER_ENDPOINT,
  QUERY_REFUND_ENDPOINT,
  REFUND_ENDPOINT,
  ZALOPAY_GATEWAY_PRODUCTION_HOST,
  ZALOPAY_GATEWAY_SANDBOX_HOST,
  ZALOPAY_OPENAPI_PRODUCTION_HOST,
  ZALOPAY_OPENAPI_SANDBOX_HOST,
} from '../constants';
import { ZaloPayLocale } from '../enums';
import {
  BankList,
  BuildPaymentUrl,
  BuildPaymentUrlLogger,
  BuildPaymentUrlOptions,
  CreateOrderResponse,
  GlobalConfig,
  QueryDr,
  QueryDrResponse,
  QueryDrResponseLogger,
  QueryDrResponseOptions,
  QueryRefund,
  QueryRefundOptions,
  QueryRefundResponse,
  QueryRefundResponseLogger,
  Refund,
  RefundOptions,
  RefundResponse,
  RefundResponseLogger,
  ReturnQueryFromZaloPay,
  VerifyIpnCall,
  VerifyIpnCallLogger,
  VerifyIpnCallOptions,
  VerifyReturnUrl,
  VerifyReturnUrlLogger,
  VerifyReturnUrlOptions,
  ZaloPayCallbackBody,
  ZaloPayConfig,
} from '../types';
import { buildBankListMacData, generateMac } from '../utils';
import { postForm } from '../utils/request.util';
import { PaymentService } from './zalopay-payment.service';
import { QueryService } from './zalopay-query.service';
import { VerificationService } from './zalopay-verification.service';

/**
 * Lớp hỗ trợ thanh toán qua ZaloPay (API v2)
 * @en ZaloPay class to support ZaloPay payment (API v2)
 * @see https://docs.zalopay.vn/docs/guides/payment-acceptance/payment-gateway/intro/
 *
 * @example
 * const zalopay = new ZaloPay({
 *   appId: process.env.ZALOPAY_APP_ID!,
 *   key1: process.env.ZALOPAY_KEY1!,
 *   key2: process.env.ZALOPAY_KEY2!,
 *   testMode: true,
 * });
 *
 * const paymentUrl = await zalopay.buildPaymentUrl({
 *   appTransId: 'ORDER_1001',
 *   amount: 100000,
 *   description: 'Thanh toan don hang ORDER_1001',
 *   redirectUrl: 'https://example.com/payment/zalopay-return',
 *   callbackUrl: 'https://example.com/payment/zalopay-callback',
 * });
 */
export class ZaloPay {
  private readonly globalConfig: GlobalConfig;

  // Service instances
  private readonly loggerService: LoggerService;
  private readonly paymentService: PaymentService;
  private readonly verificationService: VerificationService;
  private readonly queryService: QueryService;

  constructor({
    appId,
    key1,
    key2,
    testMode = false,
    lang = ZaloPayLocale.VI,
    enableLog = false,
    loggerFn,
    openApiHost,
    gatewayHost,
    ...config
  }: ZaloPayConfig) {
    this.globalConfig = {
      ...config,
      appId: Number(appId),
      key1,
      key2,
      testMode,
      lang,
      openApiHost: openApiHost || (testMode ? ZALOPAY_OPENAPI_SANDBOX_HOST : ZALOPAY_OPENAPI_PRODUCTION_HOST),
      gatewayHost: gatewayHost || (testMode ? ZALOPAY_GATEWAY_SANDBOX_HOST : ZALOPAY_GATEWAY_PRODUCTION_HOST),
      createOrderEndpoint: config.createOrderEndpoint || CREATE_ORDER_ENDPOINT,
      queryOrderEndpoint: config.queryOrderEndpoint || QUERY_ORDER_ENDPOINT,
      refundEndpoint: config.refundEndpoint || REFUND_ENDPOINT,
      queryRefundEndpoint: config.queryRefundEndpoint || QUERY_REFUND_ENDPOINT,
      getBankListEndpoint: config.getBankListEndpoint || GET_BANK_LIST_ENDPOINT,
    };

    // Initialize services
    this.loggerService = new LoggerService(enableLog, loggerFn);

    this.paymentService = new PaymentService(this.globalConfig, this.loggerService);

    this.verificationService = new VerificationService(this.globalConfig, this.loggerService);

    this.queryService = new QueryService(this.globalConfig, this.loggerService);
  }

  /**
   * Lấy danh sách ngân hàng/phương thức thanh toán merchant được hỗ trợ
   * @en Get the list of banks/payment channels supported for the merchant
   */
  public async getBankList(): Promise<BankList> {
    const { appId, key1, gatewayHost, getBankListEndpoint } = this.globalConfig;
    const reqtime = Date.now();

    return postForm<BankList>(resolveUrlString(gatewayHost, getBankListEndpoint), {
      appid: appId,
      reqtime,
      mac: generateMac(key1, buildBankListMacData(appId, reqtime)),
    });
  }

  /**
   * Tạo đơn hàng và trả về toàn bộ response (order_url, zp_trans_token, order_token, qr_code...)
   * @en Create an order and return the full response
   */
  public createOrder<LoggerFields extends keyof BuildPaymentUrlLogger>(
    data: BuildPaymentUrl,
    options?: BuildPaymentUrlOptions<LoggerFields>,
  ): Promise<CreateOrderResponse> {
    return this.paymentService.createOrder(data, options);
  }

  /**
   * Tạo đơn hàng và trả về order_url để chuyển hướng người dùng. Throw Error nếu tạo đơn thất bại.
   * @en Create an order and return order_url. Throws if the order cannot be created.
   */
  public buildPaymentUrl<LoggerFields extends keyof BuildPaymentUrlLogger>(
    data: BuildPaymentUrl,
    options?: BuildPaymentUrlOptions<LoggerFields>,
  ): Promise<string> {
    return this.paymentService.buildPaymentUrl(data, options);
  }

  public verifyReturnUrl<LoggerFields extends keyof VerifyReturnUrlLogger>(
    query: ReturnQueryFromZaloPay,
    options?: VerifyReturnUrlOptions<LoggerFields>,
  ): VerifyReturnUrl {
    return this.verificationService.verifyReturnUrl(query, options);
  }

  public verifyIpnCall<LoggerFields extends keyof VerifyIpnCallLogger>(
    body: ZaloPayCallbackBody,
    options?: VerifyIpnCallOptions<LoggerFields>,
  ): VerifyIpnCall {
    return this.verificationService.verifyIpnCall(body, options);
  }

  public async queryDr<LoggerFields extends keyof QueryDrResponseLogger>(
    query: QueryDr,
    options?: QueryDrResponseOptions<LoggerFields>,
  ): Promise<QueryDrResponse> {
    return this.queryService.queryDr(query, options);
  }

  /**
   * Hoàn tiền (bất đồng bộ). Dùng `queryRefund` với `m_refund_id` trả về để biết kết quả cuối cùng.
   * @en Refund (asynchronous). Use `queryRefund` with the returned `m_refund_id` to get the final status.
   */
  public async refund<LoggerFields extends keyof RefundResponseLogger>(
    data: Refund,
    options?: RefundOptions<LoggerFields>,
  ): Promise<RefundResponse> {
    return this.queryService.refund(data, options);
  }

  public async queryRefund<LoggerFields extends keyof QueryRefundResponseLogger>(
    query: QueryRefund,
    options?: QueryRefundOptions<LoggerFields>,
  ): Promise<QueryRefundResponse> {
    return this.queryService.queryRefund(query, options);
  }
}
