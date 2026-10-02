/**
 * Response phải trả về cho ZaloPay sau khi nhận callback
 * @en The response must be sent to ZaloPay after receiving the callback request
 */
export type IpnResponse = {
  return_code: number;
  return_message: string;
};

/**
 * Xử lý thành công
 * @en Callback processed successfully
 */
export const IpnSuccess: IpnResponse = {
  return_code: 1,
  return_message: 'success',
};

/**
 * Trùng giao dịch (app_trans_id/zp_trans_id đã được xử lý trước đó)
 * @en Duplicated transaction (already processed)
 */
export const IpnAlreadyConfirmed: IpnResponse = {
  return_code: 2,
  return_message: 'Order already confirmed',
};

/**
 * Sai mac, ZaloPay sẽ không callback lại
 * @en Invalid mac, ZaloPay will not retry
 */
export const IpnFailChecksum: IpnResponse = {
  return_code: -1,
  return_message: 'mac not equal',
};

/**
 * Lỗi phía merchant, ZaloPay sẽ callback lại (tối đa 3 lần)
 * @en Merchant error, ZaloPay will retry the callback (up to 3 times)
 */
export const IpnUnknownError: IpnResponse = {
  return_code: 0,
  return_message: 'Unknown error',
};
