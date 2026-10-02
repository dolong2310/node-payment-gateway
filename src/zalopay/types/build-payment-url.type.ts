import { LoggerData, LoggerOptions } from '../../common/types/logger.type';
import { PreferredPaymentMethod } from '../enums';
import { BaseResponseFromZaloPay, ResultVerified } from './common.type';

export interface BuildPaymentUrl {
  amount: number; // Số tiền cần thanh toán (VND)
  description: string; // Mô tả đơn hàng, hiển thị trên app ZaloPay (tối đa 256 ký tự)

  appTransId?: string; // Mã đơn hàng; tự thêm tiền tố yymmdd_ (giờ VN) nếu thiếu, tự sinh nếu bỏ trống (tối đa 40 ký tự)
  appUser?: string; // Định danh người dùng (id/username/sđt), mặc định 'user'
  appTime?: number; // Thời gian tạo đơn (unix ms), mặc định Date.now()

  redirectUrl?: string; // URL chuyển trang sau khi thanh toán (gộp vào embed_data.redirecturl)
  callbackUrl?: string; // URL nhận callback server-to-server, mặc định lấy từ config

  embedData?: Record<string, unknown>; // Dữ liệu riêng của đơn hàng, thư viện tự JSON.stringify
  items?: Record<string, unknown>[]; // Danh sách sản phẩm, thư viện tự JSON.stringify
  bankCode?: string; // Mã ngân hàng / phương thức thanh toán (để trống để hiển thị tất cả)
  preferredPaymentMethod?: PreferredPaymentMethod[]; // Phương thức thanh toán ưu tiên hiển thị

  expireDurationSeconds?: number; // Thời gian hết hạn đơn (300 - 2.592.000 giây)
  title?: string;
  phone?: string;
  email?: string;
  address?: string;
  subAppId?: string;
}

export type BodyRequestCreateOrder = {
  app_id: number;
  app_user: string;
  app_trans_id: string;
  app_time: number;
  amount: number;
  item: string;
  embed_data: string;
  description: string;
  bank_code: string;
  callback_url?: string;
  expire_duration_seconds?: number;
  title?: string;
  phone?: string;
  email?: string;
  address?: string;
  sub_app_id?: string;
  mac: string;
};

export type CreateOrderResponseFromZaloPay = BaseResponseFromZaloPay & {
  order_url: string;
  zp_trans_token: string;
  order_token: string;
  qr_code: string;
};

export type CreateOrderResponse = Omit<ResultVerified, 'isVerified'> &
  CreateOrderResponseFromZaloPay & {
    app_trans_id: string; // Mã đơn hàng đã gửi cho ZaloPay, dùng để queryDr / đối soát callback
  };

export type BuildPaymentUrlLogger = LoggerData<
  {
    createdAt: Date;
    paymentUrl: string;
    mac?: string;
  } & Omit<BodyRequestCreateOrder, 'mac'> &
    CreateOrderResponse
>;

export type BuildPaymentUrlOptions<Fields extends keyof BuildPaymentUrlLogger> = {
  withHash?: boolean;
} & LoggerOptions<BuildPaymentUrlLogger, Fields>;
