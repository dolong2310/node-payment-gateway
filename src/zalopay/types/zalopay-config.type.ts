import { ZaloPayLocale } from '../enums';

export interface ZaloPayConfig {
  appId: number | string; // app_id do ZaloPay cấp (Merchant Portal -> thông tin tích hợp)
  key1: string; // Key dùng để tạo mac khi gọi API (create, query, refund...)
  key2: string; // Key dùng để xác thực callback và redirect từ ZaloPay

  lang?: ZaloPayLocale; // Ngôn ngữ message trả về từ thư viện, mặc định vi
  callbackUrl?: string; // Callback URL mặc định cho mọi đơn hàng (có thể override khi tạo đơn)

  testMode?: boolean;
  enableLog?: boolean;
  loggerFn?: (data: unknown) => void;

  openApiHost?: string; // Override host API (mặc định theo testMode)
  gatewayHost?: string; // Override host gateway (dùng cho API lấy danh sách ngân hàng)

  createOrderEndpoint?: string;
  queryOrderEndpoint?: string;
  refundEndpoint?: string;
  queryRefundEndpoint?: string;
  getBankListEndpoint?: string;
}

export interface GlobalConfig extends ZaloPayConfig {
  appId: number;
  key1: string;
  key2: string;
  lang: ZaloPayLocale;
  testMode: boolean;
  openApiHost: string;
  gatewayHost: string;
  createOrderEndpoint: string;
  queryOrderEndpoint: string;
  refundEndpoint: string;
  queryRefundEndpoint: string;
  getBankListEndpoint: string;
}
