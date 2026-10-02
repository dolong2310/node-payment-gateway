/**
 * Query string ZaloPay gắn vào redirectUrl sau khi thanh toán
 * @en Query string ZaloPay appends to redirectUrl after payment
 */
export type ReturnQueryFromZaloPay = {
  appid: string | number;
  apptransid: string;
  pmcid: string | number;
  bankcode: string;
  amount: string | number;
  discountamount: string | number;
  status: string | number; // 1: thành công, khác: thất bại
  checksum: string;
};
