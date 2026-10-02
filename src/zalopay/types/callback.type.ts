/**
 * Body ZaloPay gửi tới callbackUrl (POST, application/json)
 * @en Body ZaloPay sends to callbackUrl (POST, application/json)
 */
export type ZaloPayCallbackBody = {
  data: string; // Chuỗi JSON của ZaloPayCallbackData
  mac: string; // HMAC-SHA256(key2, data)
  type: number | string; // 1: Order
};

export type ZaloPayCallbackData = {
  app_id: number;
  app_trans_id: string;
  app_time: number;
  app_user: string;
  amount: number;
  embed_data: string;
  item: string;
  zp_trans_id: number;
  server_time: number;
  channel: number;
  merchant_user_id: string;
  user_fee_amount: number;
  discount_amount: number;
};
