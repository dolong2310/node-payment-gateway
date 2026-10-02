import { LoggerService } from '../../common/services/logger.service';
import { resolveUrlString } from '../../common/utils/http.util';
import { ZaloPayReturnCode } from '../constants';
import {
  BodyRequestQueryDr,
  BodyRequestQueryRefund,
  BodyRequestRefund,
  GlobalConfig,
  QueryDr,
  QueryDrResponse,
  QueryDrResponseFromZaloPay,
  QueryDrResponseLogger,
  QueryDrResponseOptions,
  QueryRefund,
  QueryRefundOptions,
  QueryRefundResponse,
  QueryRefundResponseFromZaloPay,
  QueryRefundResponseLogger,
  Refund,
  RefundOptions,
  RefundResponse,
  RefundResponseFromZaloPay,
  RefundResponseLogger,
} from '../types';
import {
  buildQueryOrderMacData,
  buildQueryRefundMacData,
  buildRefundMacData,
  generateMac,
  generateRefundId,
  getResponseByStatusCode,
} from '../utils';
import { postForm } from '../utils/request.util';

export class QueryService {
  private readonly config: GlobalConfig;
  private readonly logger: LoggerService;

  constructor(config: GlobalConfig, logger: LoggerService) {
    this.config = config;
    this.logger = logger;
  }

  public async queryDr<LoggerFields extends keyof QueryDrResponseLogger>(
    query: QueryDr,
    options?: QueryDrResponseOptions<LoggerFields>,
  ): Promise<QueryDrResponse> {
    const { app_trans_id } = query;

    const body: BodyRequestQueryDr = {
      app_id: this.config.appId,
      app_trans_id,
      mac: generateMac(this.config.key1, buildQueryOrderMacData(this.config.appId, app_trans_id, this.config.key1)),
    };

    const url = resolveUrlString(this.config.openApiHost, this.config.queryOrderEndpoint);

    const data = await postForm<QueryDrResponseFromZaloPay>(url, body);

    const outputResults: QueryDrResponse = {
      ...data,
      app_trans_id,
      isVerified: true,
      isSuccess: data.return_code === ZaloPayReturnCode.SUCCESS,
      isProcessing: data.return_code === ZaloPayReturnCode.PROCESSING || Boolean(data.is_processing),
      message: getResponseByStatusCode(
        data.return_code,
        data.sub_return_code,
        this.config.lang,
        data.sub_return_message || data.return_message,
      ),
    };

    const data2Log: QueryDrResponseLogger = {
      createdAt: new Date(),
      method: 'queryDr',
      ...outputResults,
    };

    this.logger.log(data2Log, options, 'queryDr');

    return outputResults;
  }

  public async refund<LoggerFields extends keyof RefundResponseLogger>(
    data: Refund,
    options?: RefundOptions<LoggerFields>,
  ): Promise<RefundResponse> {
    const {
      zp_trans_id,
      amount,
      description,
      refund_fee_amount,
      m_refund_id = generateRefundId(this.config.appId),
    } = data;

    const bodyWithoutMac: Omit<BodyRequestRefund, 'mac'> = {
      app_id: this.config.appId,
      m_refund_id,
      zp_trans_id: String(zp_trans_id),
      amount,
      refund_fee_amount,
      timestamp: Date.now(),
      description,
    };

    const mac = generateMac(this.config.key1, buildRefundMacData(bodyWithoutMac));

    const url = resolveUrlString(this.config.openApiHost, this.config.refundEndpoint);

    const response = await postForm<RefundResponseFromZaloPay>(url, { ...bodyWithoutMac, mac });

    const outputResults: RefundResponse = {
      ...response,
      m_refund_id,
      isVerified: true,
      isSuccess: response.return_code === ZaloPayReturnCode.SUCCESS,
      isProcessing: response.return_code === ZaloPayReturnCode.PROCESSING,
      message: getResponseByStatusCode(
        response.return_code,
        response.sub_return_code,
        this.config.lang,
        response.sub_return_message || response.return_message,
      ),
    };

    const data2Log: RefundResponseLogger = {
      createdAt: new Date(),
      method: 'refund',
      ...outputResults,
    };

    this.logger.log(data2Log, options, 'refund');

    return outputResults;
  }

  public async queryRefund<LoggerFields extends keyof QueryRefundResponseLogger>(
    query: QueryRefund,
    options?: QueryRefundOptions<LoggerFields>,
  ): Promise<QueryRefundResponse> {
    const { m_refund_id } = query;
    const timestamp = Date.now();

    const body: BodyRequestQueryRefund = {
      app_id: this.config.appId,
      m_refund_id,
      timestamp,
      mac: generateMac(this.config.key1, buildQueryRefundMacData(this.config.appId, m_refund_id, timestamp)),
    };

    const url = resolveUrlString(this.config.openApiHost, this.config.queryRefundEndpoint);

    const data = await postForm<QueryRefundResponseFromZaloPay>(url, body);

    const outputResults: QueryRefundResponse = {
      ...data,
      m_refund_id,
      isVerified: true,
      isSuccess: data.return_code === ZaloPayReturnCode.SUCCESS,
      isProcessing: data.return_code === ZaloPayReturnCode.PROCESSING,
      message: getResponseByStatusCode(
        data.return_code,
        data.sub_return_code,
        this.config.lang,
        data.sub_return_message || data.return_message,
      ),
    };

    const data2Log: QueryRefundResponseLogger = {
      createdAt: new Date(),
      method: 'queryRefund',
      ...outputResults,
    };

    this.logger.log(data2Log, options, 'queryRefund');

    return outputResults;
  }
}
