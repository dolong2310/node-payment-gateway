// ZaloPay language (dùng cho message trả về từ thư viện)
export enum ZaloPayLocale {
  VI = 'vi',
  EN = 'en',
}

// Phương thức thanh toán ưu tiên hiển thị trên cổng ZaloPay (embed_data.preferred_payment_method)
export enum PreferredPaymentMethod {
  DOMESTIC_CARD = 'domestic_card', // Thẻ ATM nội địa
  ACCOUNT = 'account', // Tài khoản ngân hàng
  INTERNATIONAL_CARD = 'international_card', // Thẻ quốc tế
  ZALOPAY_WALLET = 'zalopay_wallet', // QR ví ZaloPay
  VIETQR = 'vietqr', // QR đa năng
  BNPL = 'bnpl', // Mua trước trả sau
}

// Mã kênh thanh toán (pmcid) ZaloPay trả về khi redirect / lấy danh sách ngân hàng
export enum PmcId {
  INTERNATIONAL_CARD = 36, // Visa/Master/JCB
  BANK_ACCOUNT = 37, // Tài khoản ngân hàng
  ZALOPAY_WALLET = 38, // Ví ZaloPay
  ATM = 39, // Thẻ ATM
  DEBIT_CARD = 41, // Visa/Master Debit
}
