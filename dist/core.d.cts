import { a as MomoConfig, b as BuildPaymentUrl, c as BuildPaymentUrlOptions, B as BuildPaymentUrlLogger, R as ReturnQueryFromMomo, e as VerifyReturnUrl, d as VerifyReturnUrlOptions, V as VerifyReturnUrlLogger, h as VerifyIpnCall, g as VerifyIpnCallOptions, f as VerifyIpnCallLogger, i as QueryDr, k as QueryDrResponse, j as QueryDrResponseOptions, Q as QueryDrResponseLogger, m as Refund, o as RefundResponse, n as RefundOptions, l as RefundResponseLogger } from './verify-ipn-call.type-CMD20B9V.cjs';
import { V as VNPayConfig, a as BuildPaymentUrl$1, b as BuildPaymentUrlOptions$1, B as BuildPaymentUrlLogger$1, R as ReturnQueryFromVNPay, e as VerifyReturnUrl$1, d as VerifyReturnUrlOptions$1, c as VerifyReturnUrlLogger$1, h as VerifyIpnCall$1, g as VerifyIpnCallOptions$1, f as VerifyIpnCallLogger$1, i as QueryDr$1, k as QueryDrResponse$1, j as QueryDrResponseOptions$1, Q as QueryDrResponseLogger$1, m as Refund$1, o as RefundResponse$1, n as RefundOptions$1, l as RefundResponseLogger$1 } from './verify-ipn-call.type-Dy2aVTQf.cjs';
import './logger.type-DB5EozMg.cjs';

/**
 * Payment Method Enum
 */
declare const EnumPaymentMethod: {
    readonly VNPAY: "vnpay";
    readonly MOMO: "momo";
};
type PaymentMethod = (typeof EnumPaymentMethod)[keyof typeof EnumPaymentMethod];

interface IPaymentProvider<T extends PaymentMethod> {
    buildPaymentUrl(data: BuildPaymentUrlInputMap[T], options?: BuildPaymentUrlOptionsMap[T]): Promise<string>;
    verifyReturnUrl(query: VerifyReturnUrlInputMap[T], options?: VerifyReturnUrlOptionsMap[T]): VerifyReturnUrlResultMap[T];
    verifyIpnCall(query: VerifyIpnCallInputMap[T], options?: VerifyIpnCallOptionsMap[T]): VerifyIpnCallResultMap[T];
    queryDr(query: QueryDrInputMap[T], options?: QueryDrOptionsMap[T]): QueryDrResultMap[T];
    refund(data: RefundInputMap[T], options?: RefundOptionsMap[T]): RefundResultMap[T];
}
interface PaymentProviderRegistry {
    [EnumPaymentMethod.MOMO]: {
        Config: MomoConfig;
        BuildPaymentUrlInput: BuildPaymentUrl;
        BuildPaymentUrlOptions: BuildPaymentUrlOptions<keyof BuildPaymentUrlLogger>;
        VerifyReturnUrlInput: ReturnQueryFromMomo;
        VerifyReturnUrlResult: VerifyReturnUrl;
        VerifyReturnUrlOptions: VerifyReturnUrlOptions<keyof VerifyReturnUrlLogger>;
        VerifyIpnCallInput: ReturnQueryFromMomo;
        VerifyIpnCallResult: VerifyIpnCall;
        VerifyIpnCallOptions: VerifyIpnCallOptions<keyof VerifyIpnCallLogger>;
        QueryDrInput: QueryDr;
        QueryDrResult: QueryDrResponse;
        QueryDrOptions: QueryDrResponseOptions<keyof QueryDrResponseLogger>;
        RefundInput: Refund;
        RefundResult: RefundResponse;
        RefundOptions: RefundOptions<keyof RefundResponseLogger>;
    };
    [EnumPaymentMethod.VNPAY]: {
        Config: VNPayConfig;
        BuildPaymentUrlInput: BuildPaymentUrl$1;
        BuildPaymentUrlOptions: BuildPaymentUrlOptions$1<keyof BuildPaymentUrlLogger$1>;
        VerifyReturnUrlInput: ReturnQueryFromVNPay;
        VerifyReturnUrlResult: VerifyReturnUrl$1;
        VerifyReturnUrlOptions: VerifyReturnUrlOptions$1<keyof VerifyReturnUrlLogger$1>;
        VerifyIpnCallInput: ReturnQueryFromVNPay;
        VerifyIpnCallResult: VerifyIpnCall$1;
        VerifyIpnCallOptions: VerifyIpnCallOptions$1<keyof VerifyIpnCallLogger$1>;
        QueryDrInput: QueryDr$1;
        QueryDrResult: QueryDrResponse$1;
        QueryDrOptions: QueryDrResponseOptions$1<keyof QueryDrResponseLogger$1>;
        RefundInput: Refund$1;
        RefundResult: RefundResponse$1;
        RefundOptions: RefundOptions$1<keyof RefundResponseLogger$1>;
    };
}
/**
 * Defines the required type slots that every payment provider must fill.
 * If a new provider is missing any slot, the compile-time validation below
 * will immediately produce an error.
 */
interface PaymentProviderShape {
    Config: object;
    BuildPaymentUrlInput: object;
    BuildPaymentUrlOptions: object;
    VerifyReturnUrlInput: object;
    VerifyReturnUrlResult: object;
    VerifyReturnUrlOptions: object;
    VerifyIpnCallInput: object;
    VerifyIpnCallResult: object;
    VerifyIpnCallOptions: object;
    QueryDrInput: object;
    QueryDrResult: object;
    QueryDrOptions: object;
    RefundInput: object;
    RefundResult: object;
    RefundOptions: object;
}
type ExtractFromRegistry<Slot extends keyof PaymentProviderShape> = {
    [K in PaymentMethod]: PaymentProviderRegistry[K][Slot];
};
type PaymentConfigMap = ExtractFromRegistry<'Config'>;
type BuildPaymentUrlInputMap = ExtractFromRegistry<'BuildPaymentUrlInput'>;
type BuildPaymentUrlOptionsMap = ExtractFromRegistry<'BuildPaymentUrlOptions'>;
type VerifyReturnUrlInputMap = ExtractFromRegistry<'VerifyReturnUrlInput'>;
type VerifyReturnUrlResultMap = ExtractFromRegistry<'VerifyReturnUrlResult'>;
type VerifyReturnUrlOptionsMap = ExtractFromRegistry<'VerifyReturnUrlOptions'>;
type VerifyIpnCallInputMap = ExtractFromRegistry<'VerifyIpnCallInput'>;
type VerifyIpnCallResultMap = ExtractFromRegistry<'VerifyIpnCallResult'>;
type VerifyIpnCallOptionsMap = ExtractFromRegistry<'VerifyIpnCallOptions'>;
type QueryDrInputMap = ExtractFromRegistry<'QueryDrInput'>;
type QueryDrResultMap = ExtractFromRegistry<'QueryDrResult'>;
type QueryDrOptionsMap = ExtractFromRegistry<'QueryDrOptions'>;
type RefundInputMap = ExtractFromRegistry<'RefundInput'>;
type RefundResultMap = ExtractFromRegistry<'RefundResult'>;
type RefundOptionsMap = ExtractFromRegistry<'RefundOptions'>;

declare class PaymentFactory<T extends PaymentMethod = PaymentMethod> {
    private paymentProvider;
    constructor(type: T, config: PaymentConfigMap[T]);
    private getProvider;
    buildPaymentUrl(data: BuildPaymentUrlInputMap[T], options?: BuildPaymentUrlOptionsMap[T]): Promise<string>;
    verifyReturnUrl(query: VerifyReturnUrlInputMap[T], options?: VerifyReturnUrlOptionsMap[T]): VerifyReturnUrlResultMap[T];
    verifyIpnCall(query: VerifyIpnCallInputMap[T], options?: VerifyIpnCallOptionsMap[T]): VerifyIpnCallResultMap[T];
    queryDr(query: QueryDrInputMap[T], options?: QueryDrOptionsMap[T]): QueryDrResultMap[T];
    refund(data: RefundInputMap[T], options?: RefundOptionsMap[T]): RefundResultMap[T];
}

export { type BuildPaymentUrlInputMap, type BuildPaymentUrlOptionsMap, EnumPaymentMethod, type IPaymentProvider, type PaymentConfigMap, PaymentFactory, type PaymentMethod, type PaymentProviderRegistry, type PaymentProviderShape, type QueryDrInputMap, type QueryDrOptionsMap, type QueryDrResultMap, type RefundInputMap, type RefundOptionsMap, type RefundResultMap, type VerifyIpnCallInputMap, type VerifyIpnCallOptionsMap, type VerifyIpnCallResultMap, type VerifyReturnUrlInputMap, type VerifyReturnUrlOptionsMap, type VerifyReturnUrlResultMap };
