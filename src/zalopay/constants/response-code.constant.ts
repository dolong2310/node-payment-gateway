import { ZaloPayLocale } from '../enums';

// ZaloPay return_code
export const ZaloPayReturnCode = {
  SUCCESS: 1, // Thành công
  FAIL: 2, // Thất bại
  PROCESSING: 3, // Đang xử lý
} as const;

// ZaloPay sub_return_code thường gặp
export const ZaloPaySubReturnCode = {
  REFUND_PENDING: -1, // Yêu cầu hoàn tiền đang chờ duyệt
  INVALID_REFUND_TYPE: -2, // Loại hoàn tiền không hợp lệ
  REFUND_EXPIRED: -13, // Quá thời hạn hoàn tiền
  INVALID_REFUND_AMOUNT: -14, // Số tiền hoàn không hợp lệ
  PARTIAL_REFUND_NOT_SUPPORTED: -32, // Giao dịch không hỗ trợ hoàn tiền một phần
  TRANSACTION_EXPIRED: -54, // Giao dịch hết hạn
  INSUFFICIENT_BALANCE: -63, // Số dư ví không đủ
  DUPLICATE_APP_TRANS_ID: -68, // Trùng app_trans_id
  INVALID_APP_TRANS_ID: -92, // app_trans_id sai định dạng
  TRANSACTION_NOT_FOUND: -101, // Giao dịch không tồn tại
  BANK_ERROR: -217, // Lỗi hệ thống ngân hàng
  INVALID_PARAMETER: -401, // Tham số không hợp lệ
  INVALID_SIGNATURE: -402, // Sai thông tin app hoặc chữ ký
  RATE_LIMIT_EXCEEDED: -429, // Vượt quá giới hạn request
  SYSTEM_ERROR: -500, // Lỗi hệ thống
  SYSTEM_MAINTENANCE: -999, // Hệ thống đang bảo trì
} as const;

export const RESPONSE_MAP = new Map<number, Record<ZaloPayLocale, string>>([
  [
    ZaloPaySubReturnCode.REFUND_PENDING,
    {
      [ZaloPayLocale.VI]: 'Yêu cầu hoàn tiền đang chờ duyệt',
      [ZaloPayLocale.EN]: 'Refund request is pending approval',
    },
  ],
  [
    ZaloPaySubReturnCode.INVALID_REFUND_TYPE,
    {
      [ZaloPayLocale.VI]: 'Loại hoàn tiền không hợp lệ',
      [ZaloPayLocale.EN]: 'Invalid refund type',
    },
  ],
  [
    ZaloPaySubReturnCode.REFUND_EXPIRED,
    {
      [ZaloPayLocale.VI]: 'Quá thời hạn cho phép hoàn tiền',
      [ZaloPayLocale.EN]: 'Refund time limit exceeded',
    },
  ],
  [
    ZaloPaySubReturnCode.INVALID_REFUND_AMOUNT,
    {
      [ZaloPayLocale.VI]: 'Số tiền hoàn không hợp lệ',
      [ZaloPayLocale.EN]: 'Invalid refund amount',
    },
  ],
  [
    ZaloPaySubReturnCode.PARTIAL_REFUND_NOT_SUPPORTED,
    {
      [ZaloPayLocale.VI]: 'Giao dịch không hỗ trợ hoàn tiền một phần',
      [ZaloPayLocale.EN]: 'Partial refund is not supported for this transaction',
    },
  ],
  [
    ZaloPaySubReturnCode.TRANSACTION_EXPIRED,
    {
      [ZaloPayLocale.VI]: 'Giao dịch đã hết hạn',
      [ZaloPayLocale.EN]: 'The transaction is expired',
    },
  ],
  [
    ZaloPaySubReturnCode.INSUFFICIENT_BALANCE,
    {
      [ZaloPayLocale.VI]: 'Số dư ví không đủ',
      [ZaloPayLocale.EN]: 'Insufficient wallet balance',
    },
  ],
  [
    ZaloPaySubReturnCode.DUPLICATE_APP_TRANS_ID,
    {
      [ZaloPayLocale.VI]: 'Mã giao dịch (app_trans_id) bị trùng',
      [ZaloPayLocale.EN]: 'Duplicate app_trans_id',
    },
  ],
  [
    ZaloPaySubReturnCode.INVALID_APP_TRANS_ID,
    {
      [ZaloPayLocale.VI]: 'Mã giao dịch (app_trans_id) sai định dạng',
      [ZaloPayLocale.EN]: 'Invalid app_trans_id format',
    },
  ],
  [
    ZaloPaySubReturnCode.TRANSACTION_NOT_FOUND,
    {
      [ZaloPayLocale.VI]: 'Giao dịch không tồn tại',
      [ZaloPayLocale.EN]: 'Transaction does not exist',
    },
  ],
  [
    ZaloPaySubReturnCode.BANK_ERROR,
    {
      [ZaloPayLocale.VI]: 'Lỗi hệ thống ngân hàng',
      [ZaloPayLocale.EN]: 'Banking system error',
    },
  ],
  [
    ZaloPaySubReturnCode.INVALID_PARAMETER,
    {
      [ZaloPayLocale.VI]: 'Tham số không hợp lệ',
      [ZaloPayLocale.EN]: 'Invalid request parameters',
    },
  ],
  [
    ZaloPaySubReturnCode.INVALID_SIGNATURE,
    {
      [ZaloPayLocale.VI]: 'Sai thông tin ứng dụng hoặc chữ ký',
      [ZaloPayLocale.EN]: 'Invalid app credentials or signature',
    },
  ],
  [
    ZaloPaySubReturnCode.RATE_LIMIT_EXCEEDED,
    {
      [ZaloPayLocale.VI]: 'Vượt quá giới hạn số lượng request',
      [ZaloPayLocale.EN]: 'Rate limit exceeded',
    },
  ],
  [
    ZaloPaySubReturnCode.SYSTEM_ERROR,
    {
      [ZaloPayLocale.VI]: 'Lỗi hệ thống',
      [ZaloPayLocale.EN]: 'System error',
    },
  ],
  [
    ZaloPaySubReturnCode.SYSTEM_MAINTENANCE,
    {
      [ZaloPayLocale.VI]: 'Hệ thống đang bảo trì',
      [ZaloPayLocale.EN]: 'System under maintenance',
    },
  ],
]);

export const RETURN_CODE_MAP = new Map<number, Record<ZaloPayLocale, string>>([
  [
    ZaloPayReturnCode.SUCCESS,
    {
      [ZaloPayLocale.VI]: 'Giao dịch thành công',
      [ZaloPayLocale.EN]: 'Transaction successful',
    },
  ],
  [
    ZaloPayReturnCode.FAIL,
    {
      [ZaloPayLocale.VI]: 'Giao dịch thất bại',
      [ZaloPayLocale.EN]: 'Transaction failed',
    },
  ],
  [
    ZaloPayReturnCode.PROCESSING,
    {
      [ZaloPayLocale.VI]: 'Giao dịch đang được xử lý',
      [ZaloPayLocale.EN]: 'Transaction is processing',
    },
  ],
]);
