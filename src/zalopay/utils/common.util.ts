import crypto from 'crypto';
import { RESPONSE_MAP, RETURN_CODE_MAP, ZaloPayReturnCode } from '../constants';
import { ZaloPayLocale } from '../enums';
import { BodyRequestCreateOrder, BodyRequestRefund, ReturnQueryFromZaloPay, ZaloPayCallbackBody } from '../types';

const VN_TIMEZONE_OFFSET_MS = 7 * 60 * 60 * 1000;
const APP_TRANS_ID_PREFIX_REGEX = /^\d{6}_/;

/**
 * Tạo mac HMAC-SHA256 cho ZaloPay
 * @en Generate HMAC-SHA256 mac for ZaloPay
 *
 * @param {string} key - key1 hoặc key2 do ZaloPay cấp
 * @param {string} data - Chuỗi dữ liệu cần ký
 * @returns {string} - mac dạng hex
 */
export function generateMac(key: string, data: string): string {
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

/**
 * So sánh 2 chuỗi mac an toàn (chống timing attack)
 * @en Compare two mac strings in constant time
 */
export function isMacEqual(expected: string, received: string): boolean {
  if (typeof expected !== 'string' || typeof received !== 'string') return false;
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

/**
 * Lấy tiền tố ngày yymmdd theo giờ Việt Nam (GMT+7)
 * @en Get yymmdd date prefix in Vietnam timezone (GMT+7)
 */
export function getVnDatePrefix(date: Date = new Date()): string {
  const vnDate = new Date(date.getTime() + VN_TIMEZONE_OFFSET_MS);
  const yy = String(vnDate.getUTCFullYear()).slice(-2);
  const mm = String(vnDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(vnDate.getUTCDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

/**
 * Tạo app_trans_id đúng định dạng yymmdd_xxx.
 * Giữ nguyên nếu orderId đã có tiền tố yymmdd_, tự sinh nếu bỏ trống.
 * @en Build app_trans_id in yymmdd_xxx format. Keeps orderId as is if it already has the prefix.
 */
export function generateAppTransId(orderId?: string, date: Date = new Date()): string {
  if (orderId && APP_TRANS_ID_PREFIX_REGEX.test(orderId)) return orderId;
  return `${getVnDatePrefix(date)}_${orderId || date.getTime()}`;
}

/**
 * Tạo m_refund_id đúng định dạng yymmdd_appid_xxx
 * @en Build m_refund_id in yymmdd_appid_xxx format
 */
export function generateRefundId(appId: number | string, date: Date = new Date()): string {
  const random = crypto.randomInt(0, 1000).toString().padStart(3, '0');
  return `${getVnDatePrefix(date)}_${appId}_${date.getTime()}${random}`;
}

/**
 * Chuỗi dữ liệu ký mac cho API tạo đơn (key1)
 * @en Mac data for create order API (key1)
 */
export function buildCreateOrderMacData(
  data: Pick<BodyRequestCreateOrder, 'app_id' | 'app_trans_id' | 'app_user' | 'amount' | 'app_time' | 'embed_data' | 'item'>,
): string {
  const { app_id, app_trans_id, app_user, amount, app_time, embed_data, item } = data;
  return [app_id, app_trans_id, app_user, amount, app_time, embed_data, item].join('|');
}

/**
 * Chuỗi dữ liệu ký mac cho API truy vấn đơn (key1)
 * @en Mac data for query order API (key1)
 */
export function buildQueryOrderMacData(appId: number, appTransId: string, key1: string): string {
  return [appId, appTransId, key1].join('|');
}

/**
 * Chuỗi dữ liệu ký mac cho API hoàn tiền (key1)
 * @en Mac data for refund API (key1)
 */
export function buildRefundMacData(
  data: Pick<BodyRequestRefund, 'app_id' | 'zp_trans_id' | 'amount' | 'refund_fee_amount' | 'description' | 'timestamp'>,
): string {
  const { app_id, zp_trans_id, amount, refund_fee_amount, description, timestamp } = data;
  const hasRefundFee = refund_fee_amount !== undefined && refund_fee_amount !== null;

  return (
    hasRefundFee
      ? [app_id, zp_trans_id, amount, refund_fee_amount, description, timestamp]
      : [app_id, zp_trans_id, amount, description, timestamp]
  ).join('|');
}

/**
 * Chuỗi dữ liệu ký mac cho API truy vấn hoàn tiền (key1)
 * @en Mac data for query refund API (key1)
 */
export function buildQueryRefundMacData(appId: number, mRefundId: string, timestamp: number): string {
  return [appId, mRefundId, timestamp].join('|');
}

/**
 * Chuỗi dữ liệu ký mac cho API lấy danh sách ngân hàng (key1)
 * @en Mac data for get bank list API (key1)
 */
export function buildBankListMacData(appId: number, reqTime: number): string {
  return [appId, reqTime].join('|');
}

/**
 * Xác thực checksum trên redirectUrl (key2)
 * @en Verify redirect checksum (key2)
 */
export function verifyRedirectChecksum(query: ReturnQueryFromZaloPay, key2: string): boolean {
  if (!query) return false;
  const { appid, apptransid, pmcid, bankcode, amount, discountamount, status, checksum } = query;
  const data = [appid, apptransid, pmcid, bankcode, amount, discountamount, status].join('|');
  return isMacEqual(generateMac(key2, data), checksum);
}

/**
 * Xác thực mac của callback (key2)
 * @en Verify callback mac (key2)
 */
export function verifyCallbackMac(body: Pick<ZaloPayCallbackBody, 'data' | 'mac'>, key2: string): boolean {
  if (!body || typeof body.data !== 'string') return false;
  return isMacEqual(generateMac(key2, body.data), body.mac);
}

/**
 * Lấy message theo sub_return_code / return_code
 * @en Get message by sub_return_code / return_code
 */
export function getResponseByStatusCode(
  returnCode: number,
  subReturnCode?: number,
  locale: ZaloPayLocale = ZaloPayLocale.VI,
  fallback = '',
): string {
  const subText = returnCode !== ZaloPayReturnCode.SUCCESS ? RESPONSE_MAP.get(Number(subReturnCode)) : undefined;
  const text = subText ?? RETURN_CODE_MAP.get(Number(returnCode));
  return text?.[locale] ?? fallback;
}
