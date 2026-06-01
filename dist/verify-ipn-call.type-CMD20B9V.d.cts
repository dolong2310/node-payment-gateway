import { L as LoggerData, a as LoggerOptions } from './logger.type-DB5EozMg.cjs';

declare enum RequestType {
    CAPTURE_WALLET = "captureWallet",// Thanh toán ví Momo
    PAY_WITH_ATM = "payWithATM",// Thanh toán qua thẻ ATM
    PAY_WITH_CREDIT = "payWithCredit",// Thanh toán qua thẻ tín dụng
    PAY_WITH_METHOD = "payWithMethod"
}
declare enum MomoLocale {
    VI = "vi",
    EN = "en"
}

interface MomoConfig {
    partnerCode: string;
    accessKey: string;
    secretKey: string;
    storeId: string;
    storeName: string;
    requestType: RequestType;
    lang: MomoLocale;
    testMode?: boolean;
    enableLog?: boolean;
    loggerFn?: (data: unknown) => void;
    hostname?: string;
    createPaymentEndpoint?: string;
    queryTransactionEndpoint?: string;
    refundTransactionEndpoint?: string;
}
interface GlobalConfig extends MomoConfig {
    partnerCode: string;
    accessKey: string;
    secretKey: string;
    hostname: string;
    storeName: string;
    storeId: string;
    requestType: RequestType;
    lang: MomoLocale;
    createPaymentEndpoint: string;
    queryTransactionEndpoint: string;
    refundTransactionEndpoint: string;
}

type DefaultConfig = Pick<GlobalConfig, 'partnerCode' | 'storeName' | 'storeId' | 'requestType' | 'lang'>;
type ResultVerified = {
    isSuccess: boolean;
    isVerified: boolean;
    message: string;
};

interface BuildPaymentUrl {
    subPartnerCode?: string;
    storeName?: string;
    requestId: string;
    requestType?: RequestType;
    amount: number;
    orderId: string;
    orderInfo: string;
    orderGroupId?: number;
    redirectUrl?: string;
    ipnUrl: string;
    extraData: string;
    items?: Items[];
    deliveryInfo?: deliveryInfo;
    userInfo?: userInfo;
    referenceId?: string;
    autoCapture?: boolean;
    lang?: MomoLocale;
}
type BuildPaymentUrlResponse = {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: number;
    responseTime: number;
    message: string;
    resultCode: number;
    payUrl: string;
    shortLink: string;
};
type BuildPaymentUrlLogger = LoggerData<{
    createdAt: Date;
    paymentUrl: string;
} & DefaultConfig & BuildPaymentUrl>;
type BuildPaymentUrlOptions<Fields extends keyof BuildPaymentUrlLogger> = {
    withHash?: boolean;
} & LoggerOptions<BuildPaymentUrlLogger, Fields>;
type Items = {
    id: string;
    name: string;
    description?: string;
    category?: string;
    imageUrl?: string;
    manufacturer?: string;
    price: number;
    currency: 'VND';
    quantity: number;
    unit?: string;
    totalPrice: number;
    taxAmount?: string;
};
type deliveryInfo = {
    deliveryAddress?: string;
    deliveryFee?: string;
    quantity?: string;
};
type userInfo = {
    name?: string;
    phoneNumber?: string;
    email?: string;
};

type QueryDr = {
    requestId: string;
    orderId: string;
};
type BodyRequestQueryDr = QueryDr & {
    partnerCode: string;
    signature: string;
    lang: MomoLocale;
};
type QueryDrResponseFromMomo = {
    requestId: string;
    orderId: string;
    extraData: string;
    amount: number;
    transId: number;
    payType: string;
    resultCode: number;
    refundTrans: string;
    message: string;
    responseTime: number;
    paymentOption: string;
    promotionInfo: {
        amount: number;
        amountSponsor: number;
        voucherId: string;
        voucherType: string;
        voucherName: string;
        merchantRate: string;
    };
};
type QueryDrResponse = QueryDrResponseFromMomo & ResultVerified;
type QueryDrResponseLogger = LoggerData<{
    createdAt: Date;
} & QueryDrResponse>;
type QueryDrResponseOptions<Fields extends keyof QueryDrResponseLogger> = {
    withHash?: boolean;
} & LoggerOptions<QueryDrResponseLogger, Fields>;

type Refund = {
    orderId: string;
    amount: number;
    transId: number;
    description: string;
    requestId: string;
};
type BodyRequestRefund = {
    partnerCode: string;
    lang: MomoLocale;
    signature: string;
};
type RefundResponseFromMomo = {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: number;
    transId: number;
    resultCode: number;
    message: string;
    responseTime: number;
};
type RefundResponse = ResultVerified & RefundResponseFromMomo;
type RefundResponseLogger = LoggerData<{
    createdAt: Date;
} & RefundResponse>;
type RefundOptions<Fields extends keyof RefundResponseLogger> = LoggerOptions<RefundResponseLogger, Fields>;

type ReturnQueryFromMomo = {
    orderType: string;
    amount: number;
    partnerCode: string;
    orderId: string;
    extraData: string;
    signature: string;
    transId: number;
    responseTime: number;
    resultCode: number;
    message: string;
    payType: string;
    requestId: string;
    orderInfo: string;
};

type VerifyReturnUrl = {
    isSuccess: boolean;
    isVerified: boolean;
    message: string;
} & ReturnQueryFromMomo;
type VerifyReturnUrlLogger = LoggerData<{
    createdAt: Date;
} & VerifyReturnUrl>;
type VerifyReturnUrlOptions<Fields extends keyof VerifyReturnUrlLogger> = {
    withHash?: boolean;
} & LoggerOptions<VerifyReturnUrlLogger, Fields>;

type VerifyIpnCall = VerifyReturnUrl;
type VerifyIpnCallLogger = LoggerData<{
    createdAt: Date;
} & VerifyIpnCall>;
type VerifyIpnCallOptions<Fields extends keyof VerifyIpnCallLogger> = {
    withHash?: boolean;
} & LoggerOptions<VerifyIpnCallLogger, Fields>;

export { type BuildPaymentUrlLogger as B, type DefaultConfig as D, type GlobalConfig as G, MomoLocale as M, type QueryDrResponseLogger as Q, type ReturnQueryFromMomo as R, type VerifyReturnUrlLogger as V, type MomoConfig as a, type BuildPaymentUrl as b, type BuildPaymentUrlOptions as c, type VerifyReturnUrlOptions as d, type VerifyReturnUrl as e, type VerifyIpnCallLogger as f, type VerifyIpnCallOptions as g, type VerifyIpnCall as h, type QueryDr as i, type QueryDrResponseOptions as j, type QueryDrResponse as k, type RefundResponseLogger as l, type Refund as m, type RefundOptions as n, type RefundResponse as o, type BodyRequestQueryDr as p, type BodyRequestRefund as q, type BuildPaymentUrlResponse as r, type QueryDrResponseFromMomo as s, type RefundResponseFromMomo as t, RequestType as u, type ResultVerified as v };
