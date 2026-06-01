import { M as MomoLocale, a as MomoConfig, B as BuildPaymentUrlLogger, b as BuildPaymentUrl, c as BuildPaymentUrlOptions, V as VerifyReturnUrlLogger, R as ReturnQueryFromMomo, d as VerifyReturnUrlOptions, e as VerifyReturnUrl, f as VerifyIpnCallLogger, g as VerifyIpnCallOptions, h as VerifyIpnCall, Q as QueryDrResponseLogger, i as QueryDr, j as QueryDrResponseOptions, k as QueryDrResponse, l as RefundResponseLogger, m as Refund, n as RefundOptions, o as RefundResponse, G as GlobalConfig, p as BodyRequestQueryDr, q as BodyRequestRefund, r as BuildPaymentUrlResponse, D as DefaultConfig, s as QueryDrResponseFromMomo, t as RefundResponseFromMomo, u as RequestType, v as ResultVerified } from './verify-ipn-call.type-CTQ6HQn_.js';

declare const MOMO_GATEWAY_SANDBOX_HOST = "https://test-payment.momo.vn";
declare const MOMO_GATEWAY_PRODUCTION_HOST = "https://payment.momo.vn";
declare const CREATE_PAYMENT_ENDPOINT = "/v2/gateway/api/create";
declare const QUERY_TRANSACTION_ENDPOINT = "/v2/gateway/api/query";
declare const REFUND_TRANSACTION_ENDPOINT = "/v2/gateway/api/refund";
declare const CONFIRM_TRANSACTION_ENDPOINT = "/v2/gateway/api/confirm";
declare const GET_BANK_LIST_ENDPOINT = "/v2/gateway/api/bankcodes";

declare const BANK_CODES: readonly ["KLB", "STB", "IBKHN", "BIDV", "VRB", "KEBHANAHCM", "SHB", "PBVN", "DBS", "VARB", "CFC", "MB", "VB", "EIB", "VNPTMONEY", "SGB", "CAKE", "PGB", "NVB", "HSBC", "STANDARD", "TCB", "IVB", "VCB", "KEBHANAHN", "SVB", "KBHN", "LPB", "PVCB", "ABB", "CBB", "KBHCM", "HDB", "TPB", "VPB", "Ubank", "WOO", "MBV", "VTLMONEY", "SEAB", "IBKHCM", "COB", "MSB", "ACB", "NASB", "CIMB", "VCCB", "KBankHCM", "CTG", "UOB", "HLB", "NAB", "VIB", "BVB", "OCB", "TIMO", "NonghyupBankHN", "MAFC", "SCB", "VAB", "GPB", "CITI", "VBSP", "PVcomBankPay", "BNPPARIBASHN", "BNPPARIBASHCM", "CUBHCM", "BIDC", "SVFC", "BOCHK", "VikkiHDBANK", "Umee", "Liobank", "MVAS", "MCREDIT", "MoMo"];
type BankCodeType = (typeof BANK_CODES)[number];

declare const MOMO_PARTNER_CODE = "MOMO";

declare const MomoResponseCode: {
    readonly SUCCESS: 0;
    readonly SYSTEM_MAINTENANCE: 10;
    readonly ACCESS_DENIED: 11;
    readonly UNSUPPORTED_API_VERSION: 12;
    readonly BUSINESS_AUTHENTICATION_FAILED: 13;
    readonly INVALID_REQUEST: 20;
    readonly INVALID_AMOUNT_CHECK: 21;
    readonly INVALID_PAYMENT_DATA: 22;
    readonly INVALID_PARAMETER: 40;
    readonly DUPLICATE_ORDER_ID: 41;
    readonly ORDER_ID_NOT_FOUND_OR_INVALID: 42;
    readonly CONFLICT_REQUEST: 43;
    readonly DUPLICATE_ITEM_ID: 45;
    readonly INVALID_DATA_IN_LIST: 47;
    readonly QR_CREATE_FAILED: 98;
    readonly UNKNOWN_ERROR: 99;
    readonly TRANSACTION_CREATED_WAITING_USER: 1000;
    readonly INSUFFICIENT_BALANCE: 1001;
    readonly DECLINED_BY_ISSUER: 1002;
    readonly CANCELLED_BY_MERCHANT_OR_TIMEOUT: 1003;
    readonly EXCEED_USER_AMOUNT_LIMIT: 1004;
    readonly QR_EXPIRED: 1005;
    readonly USER_REJECTED_PAYMENT: 1006;
    readonly ACCOUNT_NOT_EXIST_OR_SUSPENDED: 1007;
    readonly CANCELLED_BY_PARTNER: 1017;
    readonly INVALID_PROMOTION_RULE: 1026;
    readonly REFUND_FAILED: 1080;
    readonly REFUND_DECLINED_OR_EXCEED_ORIGINAL: 1081;
    readonly REFUND_NOT_SUPPORTED: 1088;
    readonly INVALID_ORDER_GROUP_ID: 2019;
    readonly ACCOUNT_LOCKED: 4001;
    readonly ACCOUNT_NOT_VERIFIED: 4002;
    readonly USER_LOGIN_FAILED: 4100;
    readonly TRANSACTION_PROCESSING: 7000;
    readonly TRANSACTION_PROCESSING_BY_PROVIDER: 7002;
    readonly FINAL_SUCCESS: 9000;
};
declare const RESPONSE_MAP: Map<number, Record<MomoLocale, string>>;

type Bank = {
    napasCode: string;
    disburseCode: string;
    name: string;
    bankLogoUrl: string;
};
type BankList = Record<BankCodeType, Bank>;

declare class Momo {
    private readonly globalConfig;
    private readonly loggerService;
    private readonly paymentService;
    private readonly verificationService;
    private readonly queryService;
    constructor({ partnerCode, accessKey, secretKey, testMode, storeName, storeId, requestType, enableLog, loggerFn, ...config }: MomoConfig);
    getBankList(): Promise<BankList>;
    buildPaymentUrl<LoggerFields extends keyof BuildPaymentUrlLogger>(data: BuildPaymentUrl, options?: BuildPaymentUrlOptions<LoggerFields>): Promise<string>;
    verifyReturnUrl<LoggerFields extends keyof VerifyReturnUrlLogger>(query: ReturnQueryFromMomo, options?: VerifyReturnUrlOptions<LoggerFields>): VerifyReturnUrl;
    verifyIpnCall<LoggerFields extends keyof VerifyIpnCallLogger>(query: ReturnQueryFromMomo, options?: VerifyIpnCallOptions<LoggerFields>): VerifyIpnCall;
    queryDr<LoggerFields extends keyof QueryDrResponseLogger>(query: QueryDr, options?: QueryDrResponseOptions<LoggerFields>): Promise<QueryDrResponse>;
    refund<LoggerFields extends keyof RefundResponseLogger>(data: Refund, options?: RefundOptions<LoggerFields>): Promise<RefundResponse>;
}

/**
 * Tạo chữ ký HMAC-SHA256 cho Momo
 * @en Generate HMAC-SHA256 signature for Momo
 *
 * @param {string} secretKey - Secret key từ Momo
 * @param {string} rawSignature - Chuỗi raw signature cần mã hóa
 * @returns {string} - Chữ ký đã được mã hóa
 */
declare function generateSignature(secretKey: string, rawSignature: string): string;
/**
 * Xây dựng raw signature cho payment request
 * @en Build raw signature for payment request
 *
 * @param {Object} data - Dữ liệu để tạo signature
 * @returns {string} - Raw signature string
 */
declare function buildPaymentRawSignature(data: Omit<BuildPaymentUrl, 'lang' | 'autoCapture' | 'orderGroupId'> & Pick<GlobalConfig, 'partnerCode' | 'accessKey'>): string;
/**
 * Xây dựng raw signature cho query transaction
 * @en Build raw signature for query transaction
 *
 * @param {Object} data - Dữ liệu để tạo signature
 * @returns {string} - Raw signature string
 */
declare function buildQueryRawSignature(data: Pick<GlobalConfig, 'accessKey' | 'partnerCode'> & Pick<QueryDr, 'orderId' | 'requestId'>): string;
/**
 * Xây dựng raw signature cho refund transaction
 * @en Build raw signature for refund transaction
 *
 * @param {Object} data - Dữ liệu để tạo signature
 * @returns {string} - Raw signature string
 */
declare function buildRefundRawSignature(data: Pick<GlobalConfig, 'accessKey' | 'partnerCode'> & Pick<Refund, 'orderId' | 'requestId' | 'transId' | 'amount' | 'description'>): string;
/**
 * Xác thực signature từ Momo callback/IPN
 * @en Verify signature from Momo callback/IPN
 *
 * @param {Object} data - Dữ liệu từ Momo callback
 * @param {string} secretKey - Secret key từ Momo
 * @returns {boolean} - True nếu signature hợp lệ
 */
declare function verifySignature(data: ReturnQueryFromMomo & Pick<GlobalConfig, 'accessKey'>, secretKey: string): boolean;
/**
 * Sắp xếp object theo key (dùng cho việc build query string)
 * @en Sort object by keys (used for building query strings)
 *
 * @param {Object} obj - Object cần sắp xếp
 * @returns {Object} - Object đã được sắp xếp
 */
declare function sortObject(obj: any): {};
/**
 * Generate unique orderId for Momo
 * @en Generate unique orderId for Momo
 *
 * @param {string} partnerCode - Partner code
 * @returns {string} - Unique order ID
 */
declare function generateOrderId(partnerCode?: string): string;
declare function getResponseByStatusCode(responseCode?: number, locale?: MomoLocale, responseMap?: Map<number, Record<MomoLocale, string>>): string;

type index_Bank = Bank;
type index_BankCodeType = BankCodeType;
type index_BankList = BankList;
declare const index_BodyRequestQueryDr: typeof BodyRequestQueryDr;
declare const index_BodyRequestRefund: typeof BodyRequestRefund;
declare const index_BuildPaymentUrl: typeof BuildPaymentUrl;
declare const index_BuildPaymentUrlLogger: typeof BuildPaymentUrlLogger;
declare const index_BuildPaymentUrlOptions: typeof BuildPaymentUrlOptions;
declare const index_BuildPaymentUrlResponse: typeof BuildPaymentUrlResponse;
declare const index_CONFIRM_TRANSACTION_ENDPOINT: typeof CONFIRM_TRANSACTION_ENDPOINT;
declare const index_CREATE_PAYMENT_ENDPOINT: typeof CREATE_PAYMENT_ENDPOINT;
declare const index_DefaultConfig: typeof DefaultConfig;
declare const index_GET_BANK_LIST_ENDPOINT: typeof GET_BANK_LIST_ENDPOINT;
declare const index_GlobalConfig: typeof GlobalConfig;
declare const index_MOMO_GATEWAY_PRODUCTION_HOST: typeof MOMO_GATEWAY_PRODUCTION_HOST;
declare const index_MOMO_GATEWAY_SANDBOX_HOST: typeof MOMO_GATEWAY_SANDBOX_HOST;
declare const index_MOMO_PARTNER_CODE: typeof MOMO_PARTNER_CODE;
type index_Momo = Momo;
declare const index_Momo: typeof Momo;
declare const index_MomoConfig: typeof MomoConfig;
declare const index_MomoLocale: typeof MomoLocale;
declare const index_MomoResponseCode: typeof MomoResponseCode;
declare const index_QUERY_TRANSACTION_ENDPOINT: typeof QUERY_TRANSACTION_ENDPOINT;
declare const index_QueryDr: typeof QueryDr;
declare const index_QueryDrResponse: typeof QueryDrResponse;
declare const index_QueryDrResponseFromMomo: typeof QueryDrResponseFromMomo;
declare const index_QueryDrResponseLogger: typeof QueryDrResponseLogger;
declare const index_QueryDrResponseOptions: typeof QueryDrResponseOptions;
declare const index_REFUND_TRANSACTION_ENDPOINT: typeof REFUND_TRANSACTION_ENDPOINT;
declare const index_RESPONSE_MAP: typeof RESPONSE_MAP;
declare const index_Refund: typeof Refund;
declare const index_RefundOptions: typeof RefundOptions;
declare const index_RefundResponse: typeof RefundResponse;
declare const index_RefundResponseFromMomo: typeof RefundResponseFromMomo;
declare const index_RefundResponseLogger: typeof RefundResponseLogger;
declare const index_RequestType: typeof RequestType;
declare const index_ResultVerified: typeof ResultVerified;
declare const index_ReturnQueryFromMomo: typeof ReturnQueryFromMomo;
declare const index_VerifyIpnCall: typeof VerifyIpnCall;
declare const index_VerifyIpnCallLogger: typeof VerifyIpnCallLogger;
declare const index_VerifyIpnCallOptions: typeof VerifyIpnCallOptions;
declare const index_VerifyReturnUrl: typeof VerifyReturnUrl;
declare const index_VerifyReturnUrlLogger: typeof VerifyReturnUrlLogger;
declare const index_VerifyReturnUrlOptions: typeof VerifyReturnUrlOptions;
declare const index_buildPaymentRawSignature: typeof buildPaymentRawSignature;
declare const index_buildQueryRawSignature: typeof buildQueryRawSignature;
declare const index_buildRefundRawSignature: typeof buildRefundRawSignature;
declare const index_generateOrderId: typeof generateOrderId;
declare const index_generateSignature: typeof generateSignature;
declare const index_getResponseByStatusCode: typeof getResponseByStatusCode;
declare const index_sortObject: typeof sortObject;
declare const index_verifySignature: typeof verifySignature;
declare namespace index {
  export { type index_Bank as Bank, type index_BankCodeType as BankCodeType, type index_BankList as BankList, index_BodyRequestQueryDr as BodyRequestQueryDr, index_BodyRequestRefund as BodyRequestRefund, index_BuildPaymentUrl as BuildPaymentUrl, index_BuildPaymentUrlLogger as BuildPaymentUrlLogger, index_BuildPaymentUrlOptions as BuildPaymentUrlOptions, index_BuildPaymentUrlResponse as BuildPaymentUrlResponse, index_CONFIRM_TRANSACTION_ENDPOINT as CONFIRM_TRANSACTION_ENDPOINT, index_CREATE_PAYMENT_ENDPOINT as CREATE_PAYMENT_ENDPOINT, index_DefaultConfig as DefaultConfig, index_GET_BANK_LIST_ENDPOINT as GET_BANK_LIST_ENDPOINT, index_GlobalConfig as GlobalConfig, index_MOMO_GATEWAY_PRODUCTION_HOST as MOMO_GATEWAY_PRODUCTION_HOST, index_MOMO_GATEWAY_SANDBOX_HOST as MOMO_GATEWAY_SANDBOX_HOST, index_MOMO_PARTNER_CODE as MOMO_PARTNER_CODE, index_Momo as Momo, index_MomoConfig as MomoConfig, index_MomoLocale as MomoLocale, index_MomoResponseCode as MomoResponseCode, index_QUERY_TRANSACTION_ENDPOINT as QUERY_TRANSACTION_ENDPOINT, index_QueryDr as QueryDr, index_QueryDrResponse as QueryDrResponse, index_QueryDrResponseFromMomo as QueryDrResponseFromMomo, index_QueryDrResponseLogger as QueryDrResponseLogger, index_QueryDrResponseOptions as QueryDrResponseOptions, index_REFUND_TRANSACTION_ENDPOINT as REFUND_TRANSACTION_ENDPOINT, index_RESPONSE_MAP as RESPONSE_MAP, index_Refund as Refund, index_RefundOptions as RefundOptions, index_RefundResponse as RefundResponse, index_RefundResponseFromMomo as RefundResponseFromMomo, index_RefundResponseLogger as RefundResponseLogger, index_RequestType as RequestType, index_ResultVerified as ResultVerified, index_ReturnQueryFromMomo as ReturnQueryFromMomo, index_VerifyIpnCall as VerifyIpnCall, index_VerifyIpnCallLogger as VerifyIpnCallLogger, index_VerifyIpnCallOptions as VerifyIpnCallOptions, index_VerifyReturnUrl as VerifyReturnUrl, index_VerifyReturnUrlLogger as VerifyReturnUrlLogger, index_VerifyReturnUrlOptions as VerifyReturnUrlOptions, index_buildPaymentRawSignature as buildPaymentRawSignature, index_buildQueryRawSignature as buildQueryRawSignature, index_buildRefundRawSignature as buildRefundRawSignature, index_generateOrderId as generateOrderId, index_generateSignature as generateSignature, index_getResponseByStatusCode as getResponseByStatusCode, index_sortObject as sortObject, index_verifySignature as verifySignature };
}

export { type Bank as B, CONFIRM_TRANSACTION_ENDPOINT as C, GET_BANK_LIST_ENDPOINT as G, MOMO_GATEWAY_PRODUCTION_HOST as M, QUERY_TRANSACTION_ENDPOINT as Q, REFUND_TRANSACTION_ENDPOINT as R, type BankCodeType as a, type BankList as b, CREATE_PAYMENT_ENDPOINT as c, MOMO_GATEWAY_SANDBOX_HOST as d, MOMO_PARTNER_CODE as e, Momo as f, MomoResponseCode as g, RESPONSE_MAP as h, index as i, buildPaymentRawSignature as j, buildQueryRawSignature as k, buildRefundRawSignature as l, generateOrderId as m, generateSignature as n, getResponseByStatusCode as o, sortObject as s, verifySignature as v };
