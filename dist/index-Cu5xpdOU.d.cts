import { V as VNPayConfig, D as DefaultConfig, B as BuildPaymentUrlLogger, a as BuildPaymentUrl, b as BuildPaymentUrlOptions, c as VerifyReturnUrlLogger, R as ReturnQueryFromVNPay, d as VerifyReturnUrlOptions, e as VerifyReturnUrl, f as VerifyIpnCallLogger, g as VerifyIpnCallOptions, h as VerifyIpnCall, Q as QueryDrResponseLogger, i as QueryDr, j as QueryDrResponseOptions, k as QueryDrResponse, l as RefundResponseLogger, m as Refund, n as RefundOptions, o as RefundResponse, p as VnpLocale, H as HashAlgorithm, G as GlobalConfig, q as BodyRequestQueryDr, E as EndpointConfig, P as ProductCode, r as QueryDrResponseFromVNPay, s as RefundResponseFromVNPay, t as RefundTransactionType, u as ResultVerified, U as UrlService, v as VnpCardType, w as VnpCurrCode, x as VnpTransactionType } from './verify-ipn-call.type-Dy2aVTQf.cjs';
import { BinaryLike } from 'crypto';

type Bank = {
    /**
     * Mã ngân hàng
     *
     * @en Bank code
     */
    bank_code: string;
    /**
     * Tên ngân hàng
     *
     * @en Bank name
     */
    bank_name: string;
    /**
     * Đường dẫn logo của ngân hàng
     *
     * @en Logo link
     */
    logo_link: string;
    bank_type: number;
    display_order: number;
};

/**
 * Lớp hỗ trợ thanh toán qua VNPay
 * @en VNPay class to support VNPay payment
 * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
 *
 * @example
 * import { VNPay } from 'vnpay';
 *
 * const vnpay = new VNPay({
 *     vnpayHost: 'https://sandbox.vnpayment.vn',
 *     tmnCode: 'TMNCODE',
 *     secureSecret: 'SERCRET',
 *     testMode: true, // optional
 *     hashAlgorithm: 'SHA512', // optional
 *     // Using new endpoints configuration
 *     endpoints: {
 *       paymentEndpoint: 'paymentv2/vpcpay.html',
 *       queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
 *       getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
 *     }
 * });
 *
 * const tnx = '12345678'; // Generate your own transaction code
 * const urlString = vnpay.buildPaymentUrl({
 *     vnp_Amount: 100000,
 *     vnp_IpAddr: '192.168.0.1',
 *     vnp_ReturnUrl: 'http://localhost:8888/order/vnpay_return',
 *     vnp_TxnRef: tnx,
 *     vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
 * }),
 *
 */
declare class VNPay {
    private readonly globalConfig;
    private readonly hashAlgorithm;
    private readonly loggerService;
    private readonly paymentService;
    private readonly verificationService;
    private readonly queryService;
    /**
     * Khởi tạo đối tượng VNPay
     * @en Initialize VNPay instance
     *
     * @param {VNPayConfig} config - VNPay configuration
     */
    constructor({ vnpayHost, queryDrAndRefundHost, vnp_Version, vnp_CurrCode, vnp_Locale, testMode, paymentEndpoint, endpoints, ...config }: VNPayConfig);
    /**
     * Lấy cấu hình mặc định của VNPay
     * @en Get default config of VNPay
     *
     * @returns {DefaultConfig} Cấu hình mặc định
     * @en @returns {DefaultConfig} Default configuration
     */
    get defaultConfig(): DefaultConfig;
    /**
     * Lấy danh sách ngân hàng được hỗ trợ bởi VNPay
     * @en Get list of banks supported by VNPay
     *
     * @returns {Promise<Bank[]>} Danh sách ngân hàng
     * @en @returns {Promise<Bank[]>} List of banks
     */
    getBankList(): Promise<Bank[]>;
    /**
     * Phương thức xây dựng, tạo thành url thanh toán của VNPay
     * @en Build the payment url
     *
     * @param {BuildPaymentUrl} data - Dữ liệu thanh toán cần thiết để tạo URL
     * @en @param {BuildPaymentUrl} data - Payment data required to create URL
     *
     * @param {BuildPaymentUrlOptions<LoggerFields>} options - Tùy chọn bổ sung
     * @en @param {BuildPaymentUrlOptions<LoggerFields>} options - Additional options
     *
     * @returns {string} URL thanh toán
     * @en @returns {string} Payment URL
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#tao-url-thanh-toan
     */
    buildPaymentUrl<LoggerFields extends keyof BuildPaymentUrlLogger>(data: BuildPaymentUrl, options?: BuildPaymentUrlOptions<LoggerFields>): Promise<string>;
    /**
     * Phương thức xác thực tính đúng đắn của các tham số trả về từ VNPay
     * @en Method to verify the return url from VNPay
     *
     * @param {ReturnQueryFromVNPay} query - Đối tượng dữ liệu trả về từ VNPay
     * @en @param {ReturnQueryFromVNPay} query - The object of data returned from VNPay
     *
     * @param {VerifyReturnUrlOptions<LoggerFields>} options - Tùy chọn để xác thực
     * @en @param {VerifyReturnUrlOptions<LoggerFields>} options - Options for verification
     *
     * @returns {VerifyReturnUrl} Kết quả xác thực
     * @en @returns {VerifyReturnUrl} Verification result
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-returnurl
     */
    verifyReturnUrl<LoggerFields extends keyof VerifyReturnUrlLogger>(query: ReturnQueryFromVNPay, options?: VerifyReturnUrlOptions<LoggerFields>): VerifyReturnUrl;
    /**
     * Phương thức xác thực tính đúng đắn của lời gọi ipn từ VNPay
     *
     * Sau khi nhận được lời gọi, hệ thống merchant cần xác thực dữ liệu nhận được từ VNPay,
     * kiểm tra đơn hàng có hợp lệ không, kiểm tra số tiền thanh toán có đúng không.
     *
     * Sau đó phản hồi lại VNPay kết quả xác thực thông qua các `IpnResponse`
     *
     * @en Method to verify the ipn call from VNPay
     *
     * After receiving the call, the merchant system needs to verify the data received from VNPay,
     * check if the order is valid, check if the payment amount is correct.
     *
     * Then respond to VNPay the verification result through `IpnResponse`
     *
     * @param {ReturnQueryFromVNPay} query - Đối tượng dữ liệu từ VNPay qua IPN
     * @en @param {ReturnQueryFromVNPay} query - The object of data from VNPay via IPN
     *
     * @param {VerifyIpnCallOptions<LoggerFields>} options - Tùy chọn để xác thực
     * @en @param {VerifyIpnCallOptions<LoggerFields>} options - Options for verification
     *
     * @returns {VerifyIpnCall} Kết quả xác thực
     * @en @returns {VerifyIpnCall} Verification result
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-ipn-url
     */
    verifyIpnCall<LoggerFields extends keyof VerifyIpnCallLogger>(query: ReturnQueryFromVNPay, options?: VerifyIpnCallOptions<LoggerFields>): VerifyIpnCall;
    /**
     * Đây là API để hệ thống merchant truy vấn kết quả thanh toán của giao dịch tại hệ thống VNPAY.
     * @en This is the API for the merchant system to query the payment result of the transaction at the VNPAY system.
     *
     * @param {QueryDr} query - Dữ liệu truy vấn kết quả thanh toán
     * @en @param {QueryDr} query - The data to query payment result
     *
     * @param {QueryDrResponseOptions<LoggerFields>} options - Tùy chọn truy vấn
     * @en @param {QueryDrResponseOptions<LoggerFields>} options - Query options
     *
     * @returns {Promise<QueryDrResponse>} Kết quả truy vấn từ VNPay sau khi đã xác thực
     * @en @returns {Promise<QueryDrResponse>} Query result from VNPay after verification
     * @see https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#truy-van-ket-qua-thanh-toan-PAY
     */
    queryDr<LoggerFields extends keyof QueryDrResponseLogger>(query: QueryDr, options?: QueryDrResponseOptions<LoggerFields>): Promise<QueryDrResponse>;
    /**
     * Đây là API để hệ thống merchant gửi yêu cầu hoàn tiền cho giao dịch qua hệ thống Cổng thanh toán VNPAY.
     * @en This is the API for the merchant system to refund the transaction at the VNPAY system.
     *
     * @param {Refund} data - Dữ liệu yêu cầu hoàn tiền
     * @en @param {Refund} data - The data to request refund
     *
     * @param {RefundOptions<LoggerFields>} options - Tùy chọn hoàn tiền
     * @en @param {RefundOptions<LoggerFields>} options - Refund options
     *
     * @returns {Promise<RefundResponse>} Kết quả hoàn tiền từ VNPay sau khi đã xác thực
     * @en @returns {Promise<RefundResponse>} Refund result from VNPay after verification
     * @see https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#hoan-tien-thanh-toan-PAY
     */
    refund<LoggerFields extends keyof RefundResponseLogger>(data: Refund, options?: RefundOptions<LoggerFields>): Promise<RefundResponse>;
}

declare const WRONG_CHECKSUM_KEY = "WRONG_CHECKSUM_KEY";
declare const RESPONSE_MAP: Map<string, Record<VnpLocale, string>>;
declare const QUERY_DR_RESPONSE_MAP: Map<string, Record<VnpLocale, string>>;
declare const REFUND_RESPONSE_MAP: Map<string, Record<VnpLocale, string>>;
declare const TRANSACTION_STATUS_RESPONSE_MAP: Map<string, Record<VnpLocale, string>>;

declare const VNPAY_GATEWAY_SANDBOX_HOST = "https://sandbox.vnpayment.vn";
declare const PAYMENT_ENDPOINT = "paymentv2/vpcpay.html";
declare const QUERY_DR_REFUND_ENDPOINT = "merchant_webapi/api/transaction";
declare const GET_BANK_LIST_ENDPOINT = "qrpayauth/api/merchant/get_bank_list";

/**
 * The response must to be sent to VNPAY after receiving the IPN request
 */
type IpnResponse = {
    RspCode: string;
    Message: string;
};
declare const IpnSuccess: IpnResponse;
declare const IpnOrderNotFound: IpnResponse;
declare const InpOrderAlreadyConfirmed: IpnResponse;
declare const IpnIpProhibited: IpnResponse;
declare const IpnInvalidAmount: IpnResponse;
declare const IpnFailChecksum: IpnResponse;
declare const IpnUnknownError: IpnResponse;

declare const numberRegex: RegExp;

declare const VNP_VERSION = "2.1.0";
declare const VNP_DEFAULT_COMMAND = "pay";
declare const CURR_CODE_VND = "VND";

declare function getDateInGMT7(date?: Date): Date;
/**
 * Định dạng lại ngày theo định dạng của VNPay, mặc định là yyyyMMddHHmmss
 * @en Format date to VNPay format, default is yyyyMMddHHmmss
 *
 * @param date date to format
 * @param format format of date
 * @returns formatted date
 */
declare function dateFormat(date: Date, format?: string): number;
/**
 * Parse a vnpay date format number to date
 * @param dateNumber An vnpay date format number
 * @returns Date
 */
declare function parseDate(dateNumber: number | string, tz?: 'utc' | 'local' | 'gmt7'): Date;
/**
 * Validate if the date is match with format `yyyyMMddHHmmss` or not
 * @param date The date to be validated
 * @returns True if the date is valid, false otherwise
 */
declare function isValidVnpayDateFormat(date: number): boolean;
declare function generateRandomString(length: number, options?: {
    onlyNumber?: boolean;
}): string;
/**
 * Lấy thông tin response theo mã response
 * @en Get response message by response code
 *
 * @param responseCode response code from VNPay
 * @param locale locale of response text
 * @param responseMap map of response code and response text if you want to custom
 * @returns message of response code
 */
declare function getResponseByStatusCode(responseCode?: string, locale?: VnpLocale, responseMap?: Map<string, Record<VnpLocale, string>>): string;
declare function hash(secret: string, data: BinaryLike | string | Buffer, algorithm: HashAlgorithm): string;

/**
 * Hàm tạo các parameter cho query string
 * @en Function to build payment URL search parameters
 */
declare function buildPaymentUrlSearchParams(data: Record<string, unknown>): URLSearchParams;
/**
 * Hàm tạo URL thanh toán dựa trên config và data
 * @en Function to create payment URL based on config and data
 */
declare function createPaymentUrl({ config, data }: {
    config: GlobalConfig;
    data: Record<string, unknown>;
}): URL;
/**
 * Hàm tính toán mã bảo mật
 * @en Function to calculate secure hash
 */
declare function calculateSecureHash({ secureSecret, data, hashAlgorithm, bufferEncode, }: {
    secureSecret: string;
    data: string;
    hashAlgorithm: HashAlgorithm;
    bufferEncode: BufferEncoding;
}): string;
/**
 * Hàm xác minh mã bảo mật
 * @en Function to verify secure hash
 */
declare function verifySecureHash({ secureSecret, data, hashAlgorithm, receivedHash, }: {
    secureSecret: string;
    data: string;
    hashAlgorithm: HashAlgorithm;
    receivedHash: string;
}): boolean;

type index_Bank = Bank;
declare const index_BodyRequestQueryDr: typeof BodyRequestQueryDr;
declare const index_BuildPaymentUrl: typeof BuildPaymentUrl;
declare const index_BuildPaymentUrlLogger: typeof BuildPaymentUrlLogger;
declare const index_BuildPaymentUrlOptions: typeof BuildPaymentUrlOptions;
declare const index_CURR_CODE_VND: typeof CURR_CODE_VND;
declare const index_DefaultConfig: typeof DefaultConfig;
declare const index_EndpointConfig: typeof EndpointConfig;
declare const index_GET_BANK_LIST_ENDPOINT: typeof GET_BANK_LIST_ENDPOINT;
declare const index_GlobalConfig: typeof GlobalConfig;
declare const index_HashAlgorithm: typeof HashAlgorithm;
declare const index_InpOrderAlreadyConfirmed: typeof InpOrderAlreadyConfirmed;
declare const index_IpnFailChecksum: typeof IpnFailChecksum;
declare const index_IpnInvalidAmount: typeof IpnInvalidAmount;
declare const index_IpnIpProhibited: typeof IpnIpProhibited;
declare const index_IpnOrderNotFound: typeof IpnOrderNotFound;
type index_IpnResponse = IpnResponse;
declare const index_IpnSuccess: typeof IpnSuccess;
declare const index_IpnUnknownError: typeof IpnUnknownError;
declare const index_PAYMENT_ENDPOINT: typeof PAYMENT_ENDPOINT;
declare const index_ProductCode: typeof ProductCode;
declare const index_QUERY_DR_REFUND_ENDPOINT: typeof QUERY_DR_REFUND_ENDPOINT;
declare const index_QUERY_DR_RESPONSE_MAP: typeof QUERY_DR_RESPONSE_MAP;
declare const index_QueryDr: typeof QueryDr;
declare const index_QueryDrResponse: typeof QueryDrResponse;
declare const index_QueryDrResponseFromVNPay: typeof QueryDrResponseFromVNPay;
declare const index_QueryDrResponseLogger: typeof QueryDrResponseLogger;
declare const index_QueryDrResponseOptions: typeof QueryDrResponseOptions;
declare const index_REFUND_RESPONSE_MAP: typeof REFUND_RESPONSE_MAP;
declare const index_RESPONSE_MAP: typeof RESPONSE_MAP;
declare const index_Refund: typeof Refund;
declare const index_RefundOptions: typeof RefundOptions;
declare const index_RefundResponse: typeof RefundResponse;
declare const index_RefundResponseFromVNPay: typeof RefundResponseFromVNPay;
declare const index_RefundResponseLogger: typeof RefundResponseLogger;
declare const index_RefundTransactionType: typeof RefundTransactionType;
declare const index_ResultVerified: typeof ResultVerified;
declare const index_ReturnQueryFromVNPay: typeof ReturnQueryFromVNPay;
declare const index_TRANSACTION_STATUS_RESPONSE_MAP: typeof TRANSACTION_STATUS_RESPONSE_MAP;
declare const index_UrlService: typeof UrlService;
declare const index_VNPAY_GATEWAY_SANDBOX_HOST: typeof VNPAY_GATEWAY_SANDBOX_HOST;
declare const index_VNP_DEFAULT_COMMAND: typeof VNP_DEFAULT_COMMAND;
declare const index_VNP_VERSION: typeof VNP_VERSION;
type index_VNPay = VNPay;
declare const index_VNPay: typeof VNPay;
declare const index_VNPayConfig: typeof VNPayConfig;
declare const index_VerifyIpnCall: typeof VerifyIpnCall;
declare const index_VerifyIpnCallLogger: typeof VerifyIpnCallLogger;
declare const index_VerifyIpnCallOptions: typeof VerifyIpnCallOptions;
declare const index_VerifyReturnUrl: typeof VerifyReturnUrl;
declare const index_VerifyReturnUrlLogger: typeof VerifyReturnUrlLogger;
declare const index_VerifyReturnUrlOptions: typeof VerifyReturnUrlOptions;
declare const index_VnpCardType: typeof VnpCardType;
declare const index_VnpCurrCode: typeof VnpCurrCode;
declare const index_VnpLocale: typeof VnpLocale;
declare const index_VnpTransactionType: typeof VnpTransactionType;
declare const index_WRONG_CHECKSUM_KEY: typeof WRONG_CHECKSUM_KEY;
declare const index_buildPaymentUrlSearchParams: typeof buildPaymentUrlSearchParams;
declare const index_calculateSecureHash: typeof calculateSecureHash;
declare const index_createPaymentUrl: typeof createPaymentUrl;
declare const index_dateFormat: typeof dateFormat;
declare const index_generateRandomString: typeof generateRandomString;
declare const index_getDateInGMT7: typeof getDateInGMT7;
declare const index_getResponseByStatusCode: typeof getResponseByStatusCode;
declare const index_hash: typeof hash;
declare const index_isValidVnpayDateFormat: typeof isValidVnpayDateFormat;
declare const index_numberRegex: typeof numberRegex;
declare const index_parseDate: typeof parseDate;
declare const index_verifySecureHash: typeof verifySecureHash;
declare namespace index {
  export { type index_Bank as Bank, index_BodyRequestQueryDr as BodyRequestQueryDr, index_BuildPaymentUrl as BuildPaymentUrl, index_BuildPaymentUrlLogger as BuildPaymentUrlLogger, index_BuildPaymentUrlOptions as BuildPaymentUrlOptions, index_CURR_CODE_VND as CURR_CODE_VND, index_DefaultConfig as DefaultConfig, index_EndpointConfig as EndpointConfig, index_GET_BANK_LIST_ENDPOINT as GET_BANK_LIST_ENDPOINT, index_GlobalConfig as GlobalConfig, index_HashAlgorithm as HashAlgorithm, index_InpOrderAlreadyConfirmed as InpOrderAlreadyConfirmed, index_IpnFailChecksum as IpnFailChecksum, index_IpnInvalidAmount as IpnInvalidAmount, index_IpnIpProhibited as IpnIpProhibited, index_IpnOrderNotFound as IpnOrderNotFound, type index_IpnResponse as IpnResponse, index_IpnSuccess as IpnSuccess, index_IpnUnknownError as IpnUnknownError, index_PAYMENT_ENDPOINT as PAYMENT_ENDPOINT, index_ProductCode as ProductCode, index_QUERY_DR_REFUND_ENDPOINT as QUERY_DR_REFUND_ENDPOINT, index_QUERY_DR_RESPONSE_MAP as QUERY_DR_RESPONSE_MAP, index_QueryDr as QueryDr, index_QueryDrResponse as QueryDrResponse, index_QueryDrResponseFromVNPay as QueryDrResponseFromVNPay, index_QueryDrResponseLogger as QueryDrResponseLogger, index_QueryDrResponseOptions as QueryDrResponseOptions, index_REFUND_RESPONSE_MAP as REFUND_RESPONSE_MAP, index_RESPONSE_MAP as RESPONSE_MAP, index_Refund as Refund, index_RefundOptions as RefundOptions, index_RefundResponse as RefundResponse, index_RefundResponseFromVNPay as RefundResponseFromVNPay, index_RefundResponseLogger as RefundResponseLogger, index_RefundTransactionType as RefundTransactionType, index_ResultVerified as ResultVerified, index_ReturnQueryFromVNPay as ReturnQueryFromVNPay, index_TRANSACTION_STATUS_RESPONSE_MAP as TRANSACTION_STATUS_RESPONSE_MAP, index_UrlService as UrlService, index_VNPAY_GATEWAY_SANDBOX_HOST as VNPAY_GATEWAY_SANDBOX_HOST, index_VNP_DEFAULT_COMMAND as VNP_DEFAULT_COMMAND, index_VNP_VERSION as VNP_VERSION, index_VNPay as VNPay, index_VNPayConfig as VNPayConfig, index_VerifyIpnCall as VerifyIpnCall, index_VerifyIpnCallLogger as VerifyIpnCallLogger, index_VerifyIpnCallOptions as VerifyIpnCallOptions, index_VerifyReturnUrl as VerifyReturnUrl, index_VerifyReturnUrlLogger as VerifyReturnUrlLogger, index_VerifyReturnUrlOptions as VerifyReturnUrlOptions, index_VnpCardType as VnpCardType, index_VnpCurrCode as VnpCurrCode, index_VnpLocale as VnpLocale, index_VnpTransactionType as VnpTransactionType, index_WRONG_CHECKSUM_KEY as WRONG_CHECKSUM_KEY, index_buildPaymentUrlSearchParams as buildPaymentUrlSearchParams, index_calculateSecureHash as calculateSecureHash, index_createPaymentUrl as createPaymentUrl, index_dateFormat as dateFormat, index_generateRandomString as generateRandomString, index_getDateInGMT7 as getDateInGMT7, index_getResponseByStatusCode as getResponseByStatusCode, index_hash as hash, index_isValidVnpayDateFormat as isValidVnpayDateFormat, index_numberRegex as numberRegex, index_parseDate as parseDate, index_verifySecureHash as verifySecureHash };
}

export { type Bank as B, CURR_CODE_VND as C, GET_BANK_LIST_ENDPOINT as G, InpOrderAlreadyConfirmed as I, PAYMENT_ENDPOINT as P, QUERY_DR_REFUND_ENDPOINT as Q, REFUND_RESPONSE_MAP as R, TRANSACTION_STATUS_RESPONSE_MAP as T, VNPAY_GATEWAY_SANDBOX_HOST as V, WRONG_CHECKSUM_KEY as W, IpnFailChecksum as a, IpnInvalidAmount as b, IpnIpProhibited as c, IpnOrderNotFound as d, type IpnResponse as e, IpnSuccess as f, IpnUnknownError as g, QUERY_DR_RESPONSE_MAP as h, index as i, RESPONSE_MAP as j, VNP_DEFAULT_COMMAND as k, VNP_VERSION as l, VNPay as m, buildPaymentUrlSearchParams as n, calculateSecureHash as o, createPaymentUrl as p, dateFormat as q, generateRandomString as r, getDateInGMT7 as s, getResponseByStatusCode as t, hash as u, isValidVnpayDateFormat as v, numberRegex as w, parseDate as x, verifySecureHash as y };
