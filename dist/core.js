import 'fs';
import crypto3 from 'crypto';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

// src/core/constants.ts
var EnumPaymentMethod = {
  // BANK: 'bank',
  VNPAY: "vnpay",
  MOMO: "momo"
};
function ignoreLogger() {
}
function consoleLogger(data, symbol = "log") {
  if (typeof console[symbol] === "function") {
    console[symbol](data);
  }
}

// src/common/services/logger.service.ts
var LoggerService = class {
  isEnabled = false;
  loggerFn = ignoreLogger;
  /**
   * Khởi tạo dịch vụ logger
   * @en Initialize logger service
   *
   * @param isEnabled - Cho phép log hay không
   * @en @param isEnabled - Enable logging or not
   *
   * @param customLoggerFn - Hàm logger tùy chỉnh
   * @en @param customLoggerFn - Custom logger function
   */
  constructor(isEnabled = false, customLoggerFn) {
    this.isEnabled = isEnabled;
    this.loggerFn = customLoggerFn || (isEnabled ? consoleLogger : ignoreLogger);
  }
  /**
   * Ghi log dữ liệu
   * @en Log data
   *
   * @param data - Dữ liệu cần log
   * @en @param data - Data to log
   *
   * @param options - Tùy chọn log
   * @en @param options - Logging options
   *
   * @param methodName - Tên phương thức gọi log
   * @en @param methodName - Method name that calls the log
   */
  log(data, options, methodName) {
    if (!this.isEnabled) return;
    const logData = { ...data };
    if (methodName) {
      Object.assign(logData, { method: methodName, createdAt: /* @__PURE__ */ new Date() });
    }
    if (options?.logger && "fields" in options.logger) {
      const { type, fields } = options.logger;
      for (const key of Object.keys(logData)) {
        const keyAssert = key;
        if (type === "omit" && fields.includes(keyAssert) || type === "pick" && !fields.includes(keyAssert)) {
          delete logData[keyAssert];
        }
      }
    }
    (options?.logger?.loggerFn || this.loggerFn)(logData);
  }
};

// src/common/utils/http.util.ts
function resolveUrlString(host, path) {
  let trimmedHost = host.trim();
  let trimmedPath = path.trim();
  while (trimmedHost.endsWith("/") || trimmedHost.endsWith("\\")) {
    trimmedHost = trimmedHost.slice(0, -1);
  }
  while (trimmedPath.startsWith("/") || trimmedPath.startsWith("\\")) {
    trimmedPath = trimmedPath.slice(1);
  }
  return `${trimmedHost}/${trimmedPath}`;
}

// src/momo/constants/api-endpoint.constant.ts
var MOMO_GATEWAY_SANDBOX_HOST = "https://test-payment.momo.vn";
var MOMO_GATEWAY_PRODUCTION_HOST = "https://payment.momo.vn";
var CREATE_PAYMENT_ENDPOINT = "/v2/gateway/api/create";
var QUERY_TRANSACTION_ENDPOINT = "/v2/gateway/api/query";
var REFUND_TRANSACTION_ENDPOINT = "/v2/gateway/api/refund";
var GET_BANK_LIST_ENDPOINT = "/v2/gateway/api/bankcodes";

// src/momo/constants/request-type.constant.ts
var MOMO_PARTNER_CODE = "MOMO";

// src/momo/constants/response-code.constant.ts
var MomoResponseCode = {
  SUCCESS: 0,
  // Thành công
  SYSTEM_MAINTENANCE: 10,
  // Hệ thống đang được bảo trì
  ACCESS_DENIED: 11,
  // Truy cập bị từ chối
  UNSUPPORTED_API_VERSION: 12,
  // Phiên bản API không được hỗ trợ cho yêu cầu này
  BUSINESS_AUTHENTICATION_FAILED: 13,
  // Xác thực doanh nghiệp thất bại
  INVALID_REQUEST: 20,
  // Yêu cầu sai định dạng
  INVALID_AMOUNT_CHECK: 21,
  // Yêu cầu kiểm tra số tiền giao dịch không hợp lệ
  INVALID_PAYMENT_DATA: 22,
  // Dữ liệu/ thông tin thanh toán không hợp lệ
  INVALID_PARAMETER: 40,
  // Request bị từ chối vì tham số không hợp lệ
  DUPLICATE_ORDER_ID: 41,
  // orderId bị trùng
  ORDER_ID_NOT_FOUND_OR_INVALID: 42,
  // orderId không hợp lệ hoặc không được tìm thấy
  CONFLICT_REQUEST: 43,
  // Yêu cầu bị từ chối vì xung đột trong quá trình xử lý giao dịch
  DUPLICATE_ITEM_ID: 45,
  // Trùng itemId
  INVALID_DATA_IN_LIST: 47,
  // Yêu cầu bị từ chối vì thông tin không hợp lệ trong danh sách dữ liệu
  QR_CREATE_FAILED: 98,
  // QR Code tạo không thành công
  UNKNOWN_ERROR: 99,
  // Lỗi không xác định
  TRANSACTION_CREATED_WAITING_USER: 1e3,
  // Giao dịch đã được khởi tạo, chờ người dùng thanh toán
  INSUFFICIENT_BALANCE: 1001,
  // Giao dịch thất bại do tài khoản người dùng không đủ tiền
  DECLINED_BY_ISSUER: 1002,
  // Giao dịch bị từ chối do nhà phát hành tài khoản thanh toán
  CANCELLED_BY_MERCHANT_OR_TIMEOUT: 1003,
  // Giao dịch bị hủy bởi doanh nghiệp hoặc do timeout
  EXCEED_USER_AMOUNT_LIMIT: 1004,
  // Giao dịch thất bại do số tiền thanh toán vượt quá hạn mức
  QR_EXPIRED: 1005,
  // Giao dịch thất bại do QR code đã hết hạn
  USER_REJECTED_PAYMENT: 1006,
  // Giao dịch thất bại do người dùng từ chối xác nhận thanh toán
  ACCOUNT_NOT_EXIST_OR_SUSPENDED: 1007,
  // Tài khoản không tồn tại hoặc đang tạm ngưng
  CANCELLED_BY_PARTNER: 1017,
  // Giao dịch bị hủy bởi đối tác
  INVALID_PROMOTION_RULE: 1026,
  // Giao dịch không hợp lệ theo thể lệ chương trình khuyến mãi
  REFUND_FAILED: 1080,
  // Giao dịch hoàn tiền thất bại
  REFUND_DECLINED_OR_EXCEED_ORIGINAL: 1081,
  // Giao dịch hoàn tiền bị từ chối / vượt quá số tiền cho phép
  REFUND_NOT_SUPPORTED: 1088,
  // Giao dịch hoàn tiền bị từ chối vì không được hỗ trợ
  INVALID_ORDER_GROUP_ID: 2019,
  // Yêu cầu bị từ chối vì orderGroupId không hợp lệ
  ACCOUNT_LOCKED: 4001,
  // Giao dịch bị từ chối do tài khoản người dùng đang bị khóa
  ACCOUNT_NOT_VERIFIED: 4002,
  // Giao dịch bị từ chối do tài khoản người dùng chưa được xác thực
  USER_LOGIN_FAILED: 4100,
  // Giao dịch thất bại do người dùng không đăng nhập thành công
  TRANSACTION_PROCESSING: 7e3,
  // Giao dịch đang được xử lý
  TRANSACTION_PROCESSING_BY_PROVIDER: 7002,
  // Giao dịch đang được xử lý bởi nhà cung cấp thanh toán
  FINAL_SUCCESS: 9e3
  // Giao dịch đã được xác nhận thành công
};
var RESPONSE_MAP = /* @__PURE__ */ new Map([
  [
    MomoResponseCode.SUCCESS,
    {
      ["vi" /* VI */]: "Giao d\u1ECBch th\xE0nh c\xF4ng",
      ["en" /* EN */]: "Transaction successful"
    }
  ],
  [
    MomoResponseCode.SYSTEM_MAINTENANCE,
    {
      ["vi" /* VI */]: "H\u1EC7 th\u1ED1ng \u0111ang \u0111\u01B0\u1EE3c b\u1EA3o tr\xEC",
      ["en" /* EN */]: "System under maintenance"
    }
  ],
  [
    MomoResponseCode.ACCESS_DENIED,
    {
      ["vi" /* VI */]: "Truy c\u1EADp b\u1ECB t\u1EEB ch\u1ED1i",
      ["en" /* EN */]: "Access denied"
    }
  ],
  [
    MomoResponseCode.UNSUPPORTED_API_VERSION,
    {
      ["vi" /* VI */]: "Phi\xEAn b\u1EA3n API kh\xF4ng \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3 cho y\xEAu c\u1EA7u n\xE0y",
      ["en" /* EN */]: "API version is not supported for this request"
    }
  ],
  [
    MomoResponseCode.BUSINESS_AUTHENTICATION_FAILED,
    {
      ["vi" /* VI */]: "X\xE1c th\u1EF1c doanh nghi\u1EC7p th\u1EA5t b\u1EA1i",
      ["en" /* EN */]: "Business authentication failed"
    }
  ],
  [
    MomoResponseCode.INVALID_REQUEST,
    {
      ["vi" /* VI */]: "Y\xEAu c\u1EA7u sai \u0111\u1ECBnh d\u1EA1ng",
      ["en" /* EN */]: "Invalid request format"
    }
  ],
  [
    MomoResponseCode.INVALID_AMOUNT_CHECK,
    {
      ["vi" /* VI */]: "Y\xEAu c\u1EA7u ki\u1EC3m tra s\u1ED1 ti\u1EC1n giao d\u1ECBch kh\xF4ng h\u1EE3p l\u1EC7",
      ["en" /* EN */]: "Invalid transaction amount check request"
    }
  ],
  [
    MomoResponseCode.INVALID_PAYMENT_DATA,
    {
      ["vi" /* VI */]: "D\u1EEF li\u1EC7u/th\xF4ng tin thanh to\xE1n kh\xF4ng h\u1EE3p l\u1EC7",
      ["en" /* EN */]: "Invalid payment data"
    }
  ],
  [
    MomoResponseCode.INVALID_PARAMETER,
    {
      ["vi" /* VI */]: "Request b\u1ECB t\u1EEB ch\u1ED1i v\xEC tham s\u1ED1 kh\xF4ng h\u1EE3p l\u1EC7",
      ["en" /* EN */]: "Request rejected due to invalid parameter"
    }
  ],
  [
    MomoResponseCode.DUPLICATE_ORDER_ID,
    {
      ["vi" /* VI */]: "M\xE3 \u0111\u01A1n h\xE0ng (orderId) b\u1ECB tr\xF9ng",
      ["en" /* EN */]: "Duplicate orderId"
    }
  ],
  [
    MomoResponseCode.ORDER_ID_NOT_FOUND_OR_INVALID,
    {
      ["vi" /* VI */]: "orderId kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c kh\xF4ng \u0111\u01B0\u1EE3c t\xECm th\u1EA5y",
      ["en" /* EN */]: "orderId is invalid or not found"
    }
  ],
  [
    MomoResponseCode.CONFLICT_REQUEST,
    {
      ["vi" /* VI */]: "Y\xEAu c\u1EA7u b\u1ECB t\u1EEB ch\u1ED1i v\xEC xung \u0111\u1ED9t trong qu\xE1 tr\xECnh x\u1EED l\xFD giao d\u1ECBch",
      ["en" /* EN */]: "Request rejected due to processing conflict"
    }
  ],
  [
    MomoResponseCode.DUPLICATE_ITEM_ID,
    {
      ["vi" /* VI */]: "Tr\xF9ng itemId",
      ["en" /* EN */]: "Duplicate itemId"
    }
  ],
  [
    MomoResponseCode.INVALID_DATA_IN_LIST,
    {
      ["vi" /* VI */]: "Th\xF4ng tin kh\xF4ng h\u1EE3p l\u1EC7 trong danh s\xE1ch d\u1EEF li\u1EC7u",
      ["en" /* EN */]: "Invalid data in list"
    }
  ],
  [
    MomoResponseCode.QR_CREATE_FAILED,
    {
      ["vi" /* VI */]: "QR Code t\u1EA1o kh\xF4ng th\xE0nh c\xF4ng",
      ["en" /* EN */]: "QR Code creation failed"
    }
  ],
  [
    MomoResponseCode.UNKNOWN_ERROR,
    {
      ["vi" /* VI */]: "L\u1ED7i kh\xF4ng x\xE1c \u0111\u1ECBnh",
      ["en" /* EN */]: "Unknown error"
    }
  ],
  [
    MomoResponseCode.TRANSACTION_CREATED_WAITING_USER,
    {
      ["vi" /* VI */]: "Giao d\u1ECBch \u0111\xE3 \u0111\u01B0\u1EE3c kh\u1EDFi t\u1EA1o, ch\u1EDD ng\u01B0\u1EDDi d\xF9ng thanh to\xE1n",
      ["en" /* EN */]: "Transaction created, waiting for user payment"
    }
  ],
  [
    MomoResponseCode.INSUFFICIENT_BALANCE,
    {
      ["vi" /* VI */]: "T\xE0i kho\u1EA3n ng\u01B0\u1EDDi d\xF9ng kh\xF4ng \u0111\u1EE7 s\u1ED1 d\u01B0",
      ["en" /* EN */]: "Insufficient balance"
    }
  ],
  [
    MomoResponseCode.DECLINED_BY_ISSUER,
    {
      ["vi" /* VI */]: "Giao d\u1ECBch b\u1ECB t\u1EEB ch\u1ED1i do nh\xE0 ph\xE1t h\xE0nh t\xE0i kho\u1EA3n thanh to\xE1n",
      ["en" /* EN */]: "Transaction declined by issuer"
    }
  ],
  [
    MomoResponseCode.CANCELLED_BY_MERCHANT_OR_TIMEOUT,
    {
      ["vi" /* VI */]: "Giao d\u1ECBch b\u1ECB h\u1EE7y b\u1EDFi doanh nghi\u1EC7p ho\u1EB7c do h\u1EBFt th\u1EDDi gian (timeout)",
      ["en" /* EN */]: "Transaction cancelled by merchant or timed out"
    }
  ],
  [
    MomoResponseCode.EXCEED_USER_AMOUNT_LIMIT,
    {
      ["vi" /* VI */]: "S\u1ED1 ti\u1EC1n thanh to\xE1n v\u01B0\u1EE3t qu\xE1 h\u1EA1n m\u1EE9c c\u1EE7a ng\u01B0\u1EDDi d\xF9ng",
      ["en" /* EN */]: "Payment amount exceeds user limit"
    }
  ],
  [
    MomoResponseCode.QR_EXPIRED,
    {
      ["vi" /* VI */]: "QR code \u0111\xE3 h\u1EBFt h\u1EA1n",
      ["en" /* EN */]: "QR code expired"
    }
  ],
  [
    MomoResponseCode.USER_REJECTED_PAYMENT,
    {
      ["vi" /* VI */]: "Ng\u01B0\u1EDDi d\xF9ng t\u1EEB ch\u1ED1i x\xE1c nh\u1EADn thanh to\xE1n",
      ["en" /* EN */]: "User rejected payment"
    }
  ],
  [
    MomoResponseCode.ACCOUNT_NOT_EXIST_OR_SUSPENDED,
    {
      ["vi" /* VI */]: "T\xE0i kho\u1EA3n kh\xF4ng t\u1ED3n t\u1EA1i ho\u1EB7c \u0111ang t\u1EA1m ng\u01B0ng",
      ["en" /* EN */]: "Account does not exist or is suspended"
    }
  ],
  [
    MomoResponseCode.CANCELLED_BY_PARTNER,
    {
      ["vi" /* VI */]: "Giao d\u1ECBch b\u1ECB h\u1EE7y b\u1EDFi \u0111\u1ED1i t\xE1c",
      ["en" /* EN */]: "Transaction cancelled by partner"
    }
  ],
  [
    MomoResponseCode.INVALID_PROMOTION_RULE,
    {
      ["vi" /* VI */]: "Giao d\u1ECBch kh\xF4ng h\u1EE3p l\u1EC7 theo th\u1EC3 l\u1EC7 ch\u01B0\u01A1ng tr\xECnh khuy\u1EBFn m\xE3i",
      ["en" /* EN */]: "Transaction invalid under promotion rules"
    }
  ],
  [
    MomoResponseCode.REFUND_FAILED,
    {
      ["vi" /* VI */]: "Giao d\u1ECBch ho\xE0n ti\u1EC1n th\u1EA5t b\u1EA1i",
      ["en" /* EN */]: "Refund failed"
    }
  ],
  [
    MomoResponseCode.REFUND_DECLINED_OR_EXCEED_ORIGINAL,
    {
      ["vi" /* VI */]: "Giao d\u1ECBch ho\xE0n ti\u1EC1n b\u1ECB t\u1EEB ch\u1ED1i ho\u1EB7c v\u01B0\u1EE3t qu\xE1 s\u1ED1 ti\u1EC1n cho ph\xE9p",
      ["en" /* EN */]: "Refund declined or exceeds allowed/original amount"
    }
  ],
  [
    MomoResponseCode.REFUND_NOT_SUPPORTED,
    {
      ["vi" /* VI */]: "Giao d\u1ECBch ho\xE0n ti\u1EC1n kh\xF4ng \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3",
      ["en" /* EN */]: "Refund not supported"
    }
  ],
  [
    MomoResponseCode.INVALID_ORDER_GROUP_ID,
    {
      ["vi" /* VI */]: "orderGroupId kh\xF4ng h\u1EE3p l\u1EC7",
      ["en" /* EN */]: "Invalid orderGroupId"
    }
  ],
  [
    MomoResponseCode.ACCOUNT_LOCKED,
    {
      ["vi" /* VI */]: "T\xE0i kho\u1EA3n ng\u01B0\u1EDDi d\xF9ng \u0111ang b\u1ECB kh\xF3a",
      ["en" /* EN */]: "User account is locked"
    }
  ],
  [
    MomoResponseCode.ACCOUNT_NOT_VERIFIED,
    {
      ["vi" /* VI */]: "T\xE0i kho\u1EA3n ng\u01B0\u1EDDi d\xF9ng ch\u01B0a \u0111\u01B0\u1EE3c x\xE1c th\u1EF1c",
      ["en" /* EN */]: "User account not verified"
    }
  ],
  [
    MomoResponseCode.USER_LOGIN_FAILED,
    {
      ["vi" /* VI */]: "Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng \u0111\u0103ng nh\u1EADp th\xE0nh c\xF4ng",
      ["en" /* EN */]: "User login failed"
    }
  ],
  [
    MomoResponseCode.TRANSACTION_PROCESSING,
    {
      ["vi" /* VI */]: "Giao d\u1ECBch \u0111ang \u0111\u01B0\u1EE3c x\u1EED l\xFD",
      ["en" /* EN */]: "Transaction is processing"
    }
  ],
  [
    MomoResponseCode.TRANSACTION_PROCESSING_BY_PROVIDER,
    {
      ["vi" /* VI */]: "Giao d\u1ECBch \u0111ang \u0111\u01B0\u1EE3c x\u1EED l\xFD b\u1EDFi nh\xE0 cung c\u1EA5p thanh to\xE1n",
      ["en" /* EN */]: "Transaction is processing by payment provider"
    }
  ],
  [
    MomoResponseCode.FINAL_SUCCESS,
    {
      ["vi" /* VI */]: "Giao d\u1ECBch \u0111\xE3 \u0111\u01B0\u1EE3c x\xE1c nh\u1EADn th\xE0nh c\xF4ng",
      ["en" /* EN */]: "Transaction has been finally confirmed as successful"
    }
  ]
]);
function generateSignature(secretKey, rawSignature) {
  return crypto3.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
}
function buildPaymentRawSignature(data) {
  const { accessKey, amount, extraData, ipnUrl, orderId, orderInfo, partnerCode, redirectUrl, requestId, requestType } = data;
  return "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
}
function buildQueryRawSignature(data) {
  const { accessKey, orderId, partnerCode, requestId } = data;
  return "accessKey=" + accessKey + "&orderId=" + orderId + "&partnerCode=" + partnerCode + "&requestId=" + requestId;
}
function buildRefundRawSignature(data) {
  const { accessKey, amount, description = "", orderId, partnerCode, requestId, transId } = data;
  return "accessKey=" + accessKey + "&amount=" + amount + "&description=" + description + "&orderId=" + orderId + "&partnerCode=" + partnerCode + "&requestId=" + requestId + "&transId=" + transId;
}
function verifySignature(data, secretKey) {
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature
  } = data;
  const rawSignature = "accessKey=" + (data.accessKey || "") + "&amount=" + amount + "&extraData=" + extraData + "&message=" + message + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&orderType=" + orderType + "&partnerCode=" + partnerCode + "&payType=" + payType + "&requestId=" + requestId + "&responseTime=" + responseTime + "&resultCode=" + resultCode + "&transId=" + transId;
  const calculatedSignature = generateSignature(secretKey, rawSignature);
  return calculatedSignature === signature;
}
function generateOrderId(partnerCode = "MOMO") {
  return partnerCode + (/* @__PURE__ */ new Date()).getTime();
}
function getResponseByStatusCode(responseCode = 0, locale = "vi" /* VI */, responseMap = RESPONSE_MAP) {
  const respondText = responseMap.get(responseCode);
  return respondText[locale];
}

// src/momo/core/momo-payment.service.ts
var PaymentService = class {
  config;
  defaultConfig;
  logger;
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.defaultConfig = {
      partnerCode: config.partnerCode,
      storeName: config.storeName || "Test",
      storeId: config.storeId || "MomoTestStore",
      requestType: config.requestType,
      lang: config.lang
    };
  }
  async buildPaymentUrl(data, options) {
    const {
      amount,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData = "",
      requestType = this.defaultConfig.requestType,
      orderId = generateOrderId(this.config.partnerCode),
      requestId = orderId
    } = data;
    const dataToBuild = {
      ...this.defaultConfig,
      ...data
    };
    const rawSignature = buildPaymentRawSignature({
      accessKey: this.config.accessKey,
      amount,
      extraData,
      ipnUrl,
      orderId,
      orderInfo,
      partnerCode: this.config.partnerCode,
      redirectUrl,
      requestId,
      requestType
    });
    const signature = generateSignature(this.config.secretKey, rawSignature);
    const requestBody = JSON.stringify({ ...dataToBuild, signature });
    const url = `https://${this.config.hostname}${this.config.createPaymentEndpoint}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: requestBody
      });
      const data2 = await response.json();
      const data2Log = {
        createdAt: /* @__PURE__ */ new Date(),
        method: "buildPaymentUrl",
        paymentUrl: options?.withHash && redirectUrl ? redirectUrl.toString() : (() => {
          if (!redirectUrl) return "";
          const cloneUrl = new URL(redirectUrl.toString());
          cloneUrl.searchParams.delete("vnp_SecureHash");
          return cloneUrl.toString();
        })(),
        ...dataToBuild
      };
      this.logger.log(data2Log, options, "buildPaymentUrl");
      return data2.payUrl;
    } catch (error) {
      throw error;
    }
  }
};

// src/momo/core/momo-query.service.ts
var QueryService = class {
  config;
  logger;
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
  }
  async queryDr(query, options) {
    const { orderId, requestId = generateOrderId(this.config.partnerCode) } = query;
    const rawSignature = buildQueryRawSignature({
      accessKey: this.config.accessKey,
      orderId,
      partnerCode: this.config.partnerCode,
      requestId
    });
    const signature = generateSignature(this.config.secretKey, rawSignature);
    const requestBody = JSON.stringify({
      partnerCode: this.config.partnerCode,
      requestId,
      orderId,
      lang: this.config.lang || "vi" /* VI */,
      signature
    });
    const url = `https://${this.config.hostname}${this.config.queryTransactionEndpoint}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: requestBody
      });
      const data = await response.json();
      let outputResults = {
        isVerified: true,
        isSuccess: data.resultCode === MomoResponseCode.SUCCESS,
        ...data
        // message: getResponseByStatusCode(data.resultCode, this.config.locale),
      };
      const data2Log = {
        createdAt: /* @__PURE__ */ new Date(),
        method: "queryDr",
        ...outputResults
      };
      this.logger.log(data2Log, options, "queryDr");
      return outputResults;
    } catch (error) {
      throw error;
    }
  }
  async refund(data, options) {
    const { orderId, amount, transId, description = "", requestId = generateOrderId(this.config.partnerCode) } = data;
    const rawSignature = buildRefundRawSignature({
      accessKey: this.config.accessKey,
      amount,
      description,
      orderId,
      partnerCode: this.config.partnerCode,
      requestId,
      transId
    });
    const signature = generateSignature(this.config.secretKey, rawSignature);
    const requestBody = JSON.stringify({
      partnerCode: this.config.partnerCode,
      requestId,
      orderId,
      amount,
      transId,
      lang: this.config.lang || "vi" /* VI */,
      description,
      signature
    });
    const url = `https://${this.config.hostname}${this.config.refundTransactionEndpoint}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: requestBody
      });
      const data2 = await response.json();
      let outputResults = {
        isVerified: true,
        isSuccess: data2.resultCode === MomoResponseCode.SUCCESS,
        ...data2,
        message: getResponseByStatusCode(data2.resultCode, this.config.lang)
      };
      const data2Log = {
        createdAt: /* @__PURE__ */ new Date(),
        method: "refund",
        ...outputResults
      };
      this.logger.log(data2Log, options, "refund");
      return outputResults;
    } catch (error) {
      throw error;
    }
  }
};

// src/momo/core/momo-verification.service.ts
var VerificationService = class {
  config;
  logger;
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
  }
  verifyReturnUrl(query, options) {
    const { ...cloneQuery } = query;
    const isVerified = verifySignature({ ...query, accessKey: this.config.accessKey }, this.config.secretKey);
    let outputResults = {
      isVerified,
      isSuccess: cloneQuery.resultCode === MomoResponseCode.SUCCESS,
      message: getResponseByStatusCode(cloneQuery.resultCode, this.config.lang) || cloneQuery.message
    };
    if (!isVerified) {
      outputResults = {
        ...outputResults,
        message: "Wrong checksum"
      };
    }
    const result = {
      ...cloneQuery,
      ...outputResults
    };
    const data2Log = {
      createdAt: /* @__PURE__ */ new Date(),
      method: "verifyReturnUrl",
      ...result
    };
    this.logger.log(data2Log, options, "verifyReturnUrl");
    return result;
  }
  verifyIpnCall(query, options) {
    const silentOptions = { logger: { loggerFn: ignoreLogger } };
    const result = this.verifyReturnUrl(query, silentOptions);
    const data2Log = {
      createdAt: /* @__PURE__ */ new Date(),
      method: "verifyIpnCall",
      ...result,
      ...options?.withHash ? { signature: query.signature } : {}
    };
    this.logger.log(data2Log, options, "verifyIpnCall");
    return result;
  }
};

// src/momo/core/index.ts
var Momo = class {
  globalConfig;
  // Service instances
  loggerService;
  paymentService;
  verificationService;
  queryService;
  constructor({
    partnerCode = MOMO_PARTNER_CODE,
    accessKey,
    secretKey,
    testMode = false,
    storeName = "Test",
    storeId = "MomoTestStore",
    requestType = "payWithMethod" /* PAY_WITH_METHOD */,
    enableLog = false,
    loggerFn,
    ...config
  }) {
    const hostname = testMode ? MOMO_GATEWAY_SANDBOX_HOST.replace("https://", "") : MOMO_GATEWAY_PRODUCTION_HOST.replace("https://", "");
    this.globalConfig = {
      partnerCode,
      accessKey,
      secretKey,
      hostname,
      storeName,
      storeId,
      requestType,
      createPaymentEndpoint: CREATE_PAYMENT_ENDPOINT,
      queryTransactionEndpoint: QUERY_TRANSACTION_ENDPOINT,
      refundTransactionEndpoint: REFUND_TRANSACTION_ENDPOINT,
      ...config
    };
    this.loggerService = new LoggerService(enableLog, loggerFn);
    this.paymentService = new PaymentService(this.globalConfig, this.loggerService);
    this.verificationService = new VerificationService(this.globalConfig, this.loggerService);
    this.queryService = new QueryService(this.globalConfig, this.loggerService);
  }
  async getBankList() {
    const url = resolveUrlString(
      this.globalConfig.testMode ? MOMO_GATEWAY_SANDBOX_HOST : MOMO_GATEWAY_PRODUCTION_HOST,
      GET_BANK_LIST_ENDPOINT
    );
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch bank list: HTTP ${response.status}`);
    }
    const bankList = await response.json();
    return bankList;
  }
  buildPaymentUrl(data, options) {
    return this.paymentService.buildPaymentUrl(data, options);
  }
  verifyReturnUrl(query, options) {
    return this.verificationService.verifyReturnUrl(query, options);
  }
  verifyIpnCall(query, options) {
    return this.verificationService.verifyIpnCall(query, options);
  }
  async queryDr(query, options) {
    return this.queryService.queryDr(query, options);
  }
  async refund(data, options) {
    return this.queryService.refund(data, options);
  }
};

// src/vnpay/constants/response-map.constant.ts
var WRONG_CHECKSUM_KEY = "WRONG_CHECKSUM_KEY";
var RESPONSE_MAP2 = /* @__PURE__ */ new Map([
  ["00", { vn: "Giao d\u1ECBch th\xE0nh c\xF4ng", en: "Approved" }],
  ["01", { vn: "Giao d\u1ECBch \u0111\xE3 t\u1ED3n t\u1EA1i", en: "Transaction is already exist" }],
  [
    "02",
    {
      vn: "Merchant kh\xF4ng h\u1EE3p l\u1EC7 (ki\u1EC3m tra l\u1EA1i vnp_TmnCode)",
      en: "Invalid merchant (check vnp_TmnCode value)"
    }
  ],
  [
    "03",
    {
      vn: "D\u1EEF li\u1EC7u g\u1EEDi sang kh\xF4ng \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng",
      en: "Sent data is not in the right format"
    }
  ],
  [
    "04",
    {
      vn: "Kh\u1EDFi t\u1EA1o GD kh\xF4ng th\xE0nh c\xF4ng do Website \u0111ang b\u1ECB t\u1EA1m kho\xE1",
      en: "Payment website is not available"
    }
  ],
  [
    "05",
    {
      vn: "Giao d\u1ECBch kh\xF4ng th\xE0nh c\xF4ng do: Qu\xFD kh\xE1ch nh\u1EADp sai m\u1EADt kh\u1EA9u thanh to\xE1n qu\xE1 s\u1ED1 l\u1EA7n quy \u0111\u1ECBnh. Xin qu\xFD kh\xE1ch vui l\xF2ng th\u1EF1c hi\u1EC7n l\u1EA1i giao d\u1ECBch",
      en: "Transaction failed: Too many wrong password input"
    }
  ],
  [
    "06",
    {
      vn: "Giao d\u1ECBch kh\xF4ng th\xE0nh c\xF4ng do Qu\xFD kh\xE1ch nh\u1EADp sai m\u1EADt kh\u1EA9u x\xE1c th\u1EF1c giao d\u1ECBch (OTP). Xin qu\xFD kh\xE1ch vui l\xF2ng th\u1EF1c hi\u1EC7n l\u1EA1i giao d\u1ECBch.",
      en: "Transaction failed: Wrong OTP input"
    }
  ],
  [
    "07",
    {
      vn: "Tr\u1EEB ti\u1EC1n th\xE0nh c\xF4ng. Giao d\u1ECBch b\u1ECB nghi ng\u1EDD (li\xEAn quan t\u1EDBi l\u1EEBa \u0111\u1EA3o, giao d\u1ECBch b\u1EA5t th\u01B0\u1EDDng). \u0110\u1ED1i v\u1EDBi giao d\u1ECBch n\xE0y c\u1EA7n merchant x\xE1c nh\u1EADn th\xF4ng qua merchant admin: T\u1EEB ch\u1ED1i/\u0110\u1ED3ng \xFD giao d\u1ECBch",
      en: "This transaction is suspicious"
    }
  ],
  [
    "08",
    {
      vn: "Giao d\u1ECBch kh\xF4ng th\xE0nh c\xF4ng do: H\u1EC7 th\u1ED1ng Ng\xE2n h\xE0ng \u0111ang b\u1EA3o tr\xEC. Xin qu\xFD kh\xE1ch t\u1EA1m th\u1EDDi kh\xF4ng th\u1EF1c hi\u1EC7n giao d\u1ECBch b\u1EB1ng th\u1EBB/t\xE0i kho\u1EA3n c\u1EE7a Ng\xE2n h\xE0ng n\xE0y.",
      en: "Transaction failed: The banking system is under maintenance. Please do not temporarily make transactions by card / account of this Bank."
    }
  ],
  [
    "09",
    {
      vn: "Giao d\u1ECBch kh\xF4ng th\xE0nh c\xF4ng do: Th\u1EBB/T\xE0i kho\u1EA3n c\u1EE7a kh\xE1ch h\xE0ng ch\u01B0a \u0111\u0103ng k\xFD d\u1ECBch v\u1EE5 InternetBanking t\u1EA1i ng\xE2n h\xE0ng.",
      en: "Transaction failed: Cards / accounts of customer who has not yet registered for Internet Banking service."
    }
  ],
  [
    "10",
    {
      vn: "Giao d\u1ECBch kh\xF4ng th\xE0nh c\xF4ng do: Kh\xE1ch h\xE0ng x\xE1c th\u1EF1c th\xF4ng tin th\u1EBB/t\xE0i kho\u1EA3n kh\xF4ng \u0111\xFAng qu\xE1 3 l\u1EA7n",
      en: "Transaction failed: Customer incorrectly validate the card / account information more than 3 times"
    }
  ],
  [
    "11",
    {
      vn: "Giao d\u1ECBch kh\xF4ng th\xE0nh c\xF4ng do: \u0110\xE3 h\u1EBFt h\u1EA1n ch\u1EDD thanh to\xE1n. Xin qu\xFD kh\xE1ch vui l\xF2ng th\u1EF1c hi\u1EC7n l\u1EA1i giao d\u1ECBch.",
      en: "Transaction failed: Pending payment is expired. Please try again."
    }
  ],
  [
    "24",
    {
      vn: "Giao d\u1ECBch kh\xF4ng th\xE0nh c\xF4ng do: Kh\xE1ch h\xE0ng h\u1EE7y giao d\u1ECBch",
      en: "Transaction canceled"
    }
  ],
  [
    "51",
    {
      vn: "Giao d\u1ECBch kh\xF4ng th\xE0nh c\xF4ng do: T\xE0i kho\u1EA3n c\u1EE7a qu\xFD kh\xE1ch kh\xF4ng \u0111\u1EE7 s\u1ED1 d\u01B0 \u0111\u1EC3 th\u1EF1c hi\u1EC7n giao d\u1ECBch.",
      en: "Transaction failed: Your account is not enough balance to make the transaction."
    }
  ],
  [
    "65",
    {
      vn: "Giao d\u1ECBch kh\xF4ng th\xE0nh c\xF4ng do: T\xE0i kho\u1EA3n c\u1EE7a Qu\xFD kh\xE1ch \u0111\xE3 v\u01B0\u1EE3t qu\xE1 h\u1EA1n m\u1EE9c giao d\u1ECBch trong ng\xE0y.",
      en: "Transaction failed: Your account has exceeded the daily limit."
    }
  ],
  [
    "75",
    {
      vn: "Ng\xE2n h\xE0ng thanh to\xE1n \u0111ang b\u1EA3o tr\xEC",
      en: "Banking system is under maintenance"
    }
  ],
  [WRONG_CHECKSUM_KEY, { vn: "Sai checksum", en: "Wrong checksum" }],
  ["default", { vn: "Giao d\u1ECBch th\u1EA5t b\u1EA1i", en: "Failure" }]
]);
var QUERY_DR_RESPONSE_MAP = /* @__PURE__ */ new Map([
  ["00", { vn: "Y\xEAu c\u1EA7u th\xE0nh c\xF4ng", en: "Success" }],
  [
    "02",
    {
      vn: "M\xE3 \u0111\u1ECBnh danh k\u1EBFt n\u1ED1i kh\xF4ng h\u1EE3p l\u1EC7 (ki\u1EC3m tra l\u1EA1i TmnCode)",
      en: "Invalid connection identifier (check TmnCode)"
    }
  ],
  [
    "03",
    {
      vn: "D\u1EEF li\u1EC7u g\u1EEDi sang kh\xF4ng \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng",
      en: "Sent data is not in the right format"
    }
  ],
  [
    "91",
    {
      vn: "Kh\xF4ng t\xECm th\u1EA5y giao d\u1ECBch y\xEAu c\u1EA7u",
      en: "Transaction not found for request"
    }
  ],
  [
    "94",
    {
      vn: "Y\xEAu c\u1EA7u tr\xF9ng l\u1EB7p, duplicate request trong th\u1EDDi gian gi\u1EDBi h\u1EA1n c\u1EE7a API",
      en: "Duplicate request within the time limit of the API"
    }
  ],
  [
    "97",
    {
      vn: "Checksum kh\xF4ng h\u1EE3p l\u1EC7",
      en: "Invalid checksum"
    }
  ],
  [
    "99",
    {
      vn: "C\xE1c l\u1ED7i kh\xE1c (l\u1ED7i c\xF2n l\u1EA1i, kh\xF4ng c\xF3 trong danh s\xE1ch m\xE3 l\u1ED7i \u0111\xE3 li\u1EC7t k\xEA)",
      en: "Other errors (remaining errors, not in the list of error codes listed)"
    }
  ],
  [WRONG_CHECKSUM_KEY, { vn: "Sai checksum", en: "Wrong checksum" }],
  ["default", { vn: "Giao d\u1ECBch th\u1EA5t b\u1EA1i", en: "Failure" }]
]);
var REFUND_RESPONSE_MAP = /* @__PURE__ */ new Map([
  ["00", { vn: "Y\xEAu c\u1EA7u th\xE0nh c\xF4ng", en: "Success" }],
  [
    "02",
    {
      vn: "M\xE3 \u0111\u1ECBnh danh k\u1EBFt n\u1ED1i kh\xF4ng h\u1EE3p l\u1EC7 (ki\u1EC3m tra l\u1EA1i TmnCode)",
      en: "Invalid connection identifier (check TmnCode)"
    }
  ],
  [
    "03",
    {
      vn: "D\u1EEF li\u1EC7u g\u1EEDi sang kh\xF4ng \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng",
      en: "Sent data is not in the right format"
    }
  ],
  [
    "91",
    {
      vn: "Kh\xF4ng t\xECm th\u1EA5y giao d\u1ECBch y\xEAu c\u1EA7u ho\xE0n tr\u1EA3",
      en: "Transaction not found for request refund"
    }
  ],
  [
    "94",
    {
      vn: "Giao d\u1ECBch \u0111\xE3 \u0111\u01B0\u1EE3c g\u1EEDi y\xEAu c\u1EA7u ho\xE0n ti\u1EC1n tr\u01B0\u1EDBc \u0111\xF3. Y\xEAu c\u1EA7u n\xE0y VNPAY \u0111ang x\u1EED l\xFD",
      en: "The transaction has been sent a refund request before. VNPAY is processing this request"
    }
  ],
  [
    "95",
    {
      vn: "Giao d\u1ECBch n\xE0y kh\xF4ng th\xE0nh c\xF4ng b\xEAn VNPAY. VNPAY t\u1EEB ch\u1ED1i x\u1EED l\xFD y\xEAu c\u1EA7u",
      en: "This transaction is not successful from VNPAY. VNPAY refuses to process the request"
    }
  ],
  [
    "97",
    {
      vn: "Checksum kh\xF4ng h\u1EE3p l\u1EC7",
      en: "Invalid checksum"
    }
  ],
  [
    "99",
    {
      vn: "C\xE1c l\u1ED7i kh\xE1c (l\u1ED7i c\xF2n l\u1EA1i, kh\xF4ng c\xF3 trong danh s\xE1ch m\xE3 l\u1ED7i \u0111\xE3 li\u1EC7t k\xEA)",
      en: "Other errors (remaining errors, not in the list of error codes listed)"
    }
  ],
  [WRONG_CHECKSUM_KEY, { vn: "Sai checksum", en: "Wrong checksum" }],
  ["default", { vn: "Giao d\u1ECBch th\u1EA5t b\u1EA1i", en: "Failure" }]
]);

// src/vnpay/constants/api-endpoint.constant.ts
var VNPAY_GATEWAY_SANDBOX_HOST = "https://sandbox.vnpayment.vn";
var PAYMENT_ENDPOINT = "paymentv2/vpcpay.html";
var QUERY_DR_REFUND_ENDPOINT = "merchant_webapi/api/transaction";
var GET_BANK_LIST_ENDPOINT2 = "qrpayauth/api/merchant/get_bank_list";

// src/vnpay/constants/regex.constant.ts
var numberRegex = /^[0-9]+$/;

// src/vnpay/constants/index.ts
var VNP_VERSION = "2.1.0";
var VNP_DEFAULT_COMMAND = "pay";
dayjs.extend(utc);
dayjs.extend(timezone);
function getDateInGMT7(date) {
  const inputDate = /* @__PURE__ */ new Date();
  const utcDate = dayjs.utc(inputDate);
  return new Date(utcDate.add(7, "hour").valueOf());
}
function dateFormat(date, format = "yyyyMMddHHmmss") {
  const pad = (n) => (n < 10 ? `0${n}` : n).toString();
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  return Number(
    format.replace("yyyy", year.toString()).replace("MM", month).replace("dd", day).replace("HH", hour).replace("mm", minute).replace("ss", second)
  );
}
function isValidVnpayDateFormat(date) {
  const dateString = date.toString();
  const regex = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])([01][0-9]|2[0-3])[0-5][0-9][0-5][0-9]$/;
  return regex.test(dateString);
}
function getResponseByStatusCode2(responseCode = "", locale = "vn" /* VN */, responseMap = RESPONSE_MAP2) {
  const respondText = responseMap.get(responseCode) ?? responseMap.get("default");
  return respondText[locale];
}
function hash(secret, data, algorithm) {
  return crypto3.createHmac(algorithm, secret).update(data.toString()).digest("hex");
}
function buildPaymentUrlSearchParams(data) {
  const params = new URLSearchParams();
  const sortedKeys = Object.keys(data).sort();
  for (const key of sortedKeys) {
    if (data[key] !== void 0 && data[key] !== null && data[key] !== "") {
      params.append(key, String(data[key]));
    }
  }
  return params;
}
function createPaymentUrl({ config, data }) {
  const paymentEndpoint = config.endpoints?.paymentEndpoint || config.paymentEndpoint;
  const redirectUrl = new URL(resolveUrlString(config.vnpayHost, paymentEndpoint));
  const searchParams = buildPaymentUrlSearchParams(data);
  redirectUrl.search = searchParams.toString();
  return redirectUrl;
}
function calculateSecureHash({
  secureSecret,
  data,
  hashAlgorithm,
  bufferEncode
}) {
  return crypto3.createHmac(hashAlgorithm, secureSecret).update(Buffer.from(data, bufferEncode)).digest("hex");
}
function verifySecureHash({
  secureSecret,
  data,
  hashAlgorithm,
  receivedHash
}) {
  const calculatedHash = crypto3.createHmac(hashAlgorithm, secureSecret).update(Buffer.from(data, "utf-8")).digest("hex");
  return calculatedHash === receivedHash;
}

// src/vnpay/core/vnpay-payment.service.ts
var PaymentService2 = class {
  config;
  defaultConfig;
  logger;
  hashAlgorithm;
  bufferEncode = "utf-8";
  constructor(config, logger, hashAlgorithm) {
    this.config = config;
    this.hashAlgorithm = hashAlgorithm;
    this.logger = logger;
    this.defaultConfig = {
      vnp_TmnCode: config.tmnCode,
      vnp_Version: config.vnp_Version,
      vnp_CurrCode: config.vnp_CurrCode,
      vnp_Locale: config.vnp_Locale,
      vnp_Command: config.vnp_Command,
      vnp_OrderType: config.vnp_OrderType
    };
  }
  /**
   * Phương thức xây dựng, tạo thành url thanh toán của VNPay
   * @en Build the payment url
   *
   * @param {BuildPaymentUrl} data - Thông tin thanh toán
   * @en @param {BuildPaymentUrl} data - Payment information
   *
   * @param {BuildPaymentUrlOptions<LoggerFields>} options - Tùy chọn
   * @en @param {BuildPaymentUrlOptions<LoggerFields>} options - Options
   *
   * @returns {string} - URL thanh toán
   * @en @returns {string} - Payment URL
   */
  buildPaymentUrl(data, options) {
    const dataToBuild = {
      ...this.defaultConfig,
      ...data,
      // Multiply by 100 to follow VNPay standard
      vnp_Amount: data.vnp_Amount * 100
    };
    if (dataToBuild?.vnp_ExpireDate && !isValidVnpayDateFormat(dataToBuild.vnp_ExpireDate)) {
      throw new Error("Invalid vnp_ExpireDate format. Use `dateFormat` utility function to format it");
    }
    if (!isValidVnpayDateFormat(dataToBuild?.vnp_CreateDate ?? 0)) {
      const timeGMT7 = getDateInGMT7();
      dataToBuild.vnp_CreateDate = dateFormat(timeGMT7, "yyyyMMddHHmmss");
    }
    const redirectUrl = createPaymentUrl({
      config: this.config,
      data: dataToBuild
    });
    const signed = calculateSecureHash({
      secureSecret: this.config.secureSecret,
      data: redirectUrl.search.slice(1).toString(),
      hashAlgorithm: this.hashAlgorithm,
      bufferEncode: this.bufferEncode
    });
    redirectUrl.searchParams.append("vnp_SecureHash", signed);
    const data2Log = {
      createdAt: /* @__PURE__ */ new Date(),
      method: "buildPaymentUrl",
      paymentUrl: options?.withHash ? redirectUrl.toString() : (() => {
        const cloneUrl = new URL(redirectUrl.toString());
        cloneUrl.searchParams.delete("vnp_SecureHash");
        return cloneUrl.toString();
      })(),
      ...dataToBuild
    };
    this.logger.log(data2Log, options, "buildPaymentUrl");
    return redirectUrl.toString();
  }
};

// src/vnpay/core/vnpay-query.service.ts
var QueryService2 = class {
  config;
  logger;
  hashAlgorithm;
  bufferEncode = "utf-8";
  /**
   * Khởi tạo dịch vụ truy vấn
   * @en Initialize query service
   *
   * @param config - Cấu hình VNPay
   * @en @param config - VNPay configuration
   *
   * @param logger - Dịch vụ logger
   * @en @param logger - Logger service
   *
   * @param hashAlgorithm - Thuật toán băm
   * @en @param hashAlgorithm - Hash algorithm
   */
  constructor(config, logger, hashAlgorithm) {
    this.config = config;
    this.logger = logger;
    this.hashAlgorithm = hashAlgorithm;
  }
  /**
   * Đây là API để hệ thống merchant truy vấn kết quả thanh toán của giao dịch tại hệ thống VNPAY.
   * @en This is the API for the merchant system to query the payment result of the transaction at the VNPAY system.
   *
   * @param {QueryDr} query - Dữ liệu truy vấn kết quả thanh toán
   * @en @param {QueryDr} query - The data to query payment result
   *
   * @param {QueryDrResponseOptions<LoggerFields>} options - Tùy chọn
   * @en @param {QueryDrResponseOptions<LoggerFields>} options - Options
   *
   * @returns {Promise<QueryDrResponse>} Kết quả truy vấn
   * @en @returns {Promise<QueryDrResponse>} The query result
   */
  async queryDr(query, options) {
    const command = "querydr";
    const dataQuery = {
      vnp_Version: this.config.vnp_Version ?? VNP_VERSION,
      ...query
    };
    const queryEndpoint = this.config.endpoints.queryDrRefundEndpoint || QUERY_DR_REFUND_ENDPOINT;
    const url = new URL(resolveUrlString(this.config.queryDrAndRefundHost || this.config.vnpayHost, queryEndpoint));
    const stringToCreateHash = [
      dataQuery.vnp_RequestId,
      dataQuery.vnp_Version,
      command,
      this.config.tmnCode,
      dataQuery.vnp_TxnRef,
      dataQuery.vnp_TransactionDate,
      dataQuery.vnp_CreateDate,
      dataQuery.vnp_IpAddr,
      dataQuery.vnp_OrderInfo
    ].map(String).join("|").replace(/undefined/g, "");
    const requestHashed = hash(
      this.config.secureSecret,
      Buffer.from(stringToCreateHash, this.bufferEncode),
      this.hashAlgorithm
    );
    const body = {
      ...dataQuery,
      vnp_Command: command,
      vnp_TmnCode: this.config.tmnCode,
      vnp_SecureHash: requestHashed
    };
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    const message = getResponseByStatusCode2(
      responseData.vnp_ResponseCode?.toString() ?? "",
      this.config.vnp_Locale,
      QUERY_DR_RESPONSE_MAP
    );
    let outputResults = {
      isVerified: true,
      isSuccess: responseData.vnp_ResponseCode === "00" || responseData.vnp_ResponseCode === 0,
      message,
      ...responseData,
      vnp_Message: message
    };
    const stringToCreateHashOfResponse = [
      responseData.vnp_ResponseId,
      responseData.vnp_Command,
      responseData.vnp_ResponseCode,
      responseData.vnp_Message,
      this.config.tmnCode,
      responseData.vnp_TxnRef,
      responseData.vnp_Amount,
      responseData.vnp_BankCode,
      responseData.vnp_PayDate,
      responseData.vnp_TransactionNo,
      responseData.vnp_TransactionType,
      responseData.vnp_TransactionStatus,
      responseData.vnp_OrderInfo,
      responseData.vnp_PromotionCode,
      responseData.vnp_PromotionAmount
    ].map(String).join("|").replace(/undefined/g, "");
    const responseHashed = hash(
      this.config.secureSecret,
      Buffer.from(stringToCreateHashOfResponse, this.bufferEncode),
      this.hashAlgorithm
    );
    if (responseData?.vnp_SecureHash && responseHashed !== responseData.vnp_SecureHash) {
      outputResults = {
        ...outputResults,
        isVerified: false,
        message: getResponseByStatusCode2(WRONG_CHECKSUM_KEY, this.config.vnp_Locale, QUERY_DR_RESPONSE_MAP)
      };
    }
    const data2Log = {
      createdAt: /* @__PURE__ */ new Date(),
      method: "queryDr",
      ...outputResults
    };
    this.logger.log(data2Log, options, "queryDr");
    return outputResults;
  }
  /**
   * Đây là API để hệ thống merchant gửi yêu cầu hoàn tiền cho giao dịch qua hệ thống Cổng thanh toán VNPAY.
   * @en This is the API for the merchant system to refund the transaction at the VNPAY system.
   *
   * @param {Refund} data - Dữ liệu yêu cầu hoàn tiền
   * @en @param {Refund} data - The data to request refund
   *
   * @param {RefundOptions<LoggerFields>} options - Tùy chọn
   * @en @param {RefundOptions<LoggerFields>} options - Options
   *
   * @returns {Promise<RefundResponse>} Kết quả hoàn tiền
   * @en @returns {Promise<RefundResponse>} The refund result
   */
  async refund(data, options) {
    const vnp_Command = "refund";
    const DEFAULT_TRANSACTION_NO_IF_NOT_EXIST = "0";
    const dataQuery = {
      ...data,
      vnp_Command,
      vnp_Version: this.config.vnp_Version ?? VNP_VERSION,
      vnp_TmnCode: this.config.tmnCode,
      vnp_Amount: data.vnp_Amount * 100
    };
    const {
      vnp_Version,
      vnp_TmnCode,
      vnp_RequestId,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_TransactionNo = DEFAULT_TRANSACTION_NO_IF_NOT_EXIST,
      vnp_TransactionDate,
      vnp_CreateBy,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_OrderInfo
    } = dataQuery;
    const refundEndpoint = this.config.endpoints.queryDrRefundEndpoint || QUERY_DR_REFUND_ENDPOINT;
    const url = new URL(resolveUrlString(this.config.queryDrAndRefundHost || this.config.vnpayHost, refundEndpoint));
    const stringToHashOfRequest = [
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      dataQuery.vnp_Amount,
      vnp_TransactionNo,
      vnp_TransactionDate,
      vnp_CreateBy,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_OrderInfo
    ].map(String).join("|").replace(/undefined/g, "");
    const requestHashed = hash(
      this.config.secureSecret,
      Buffer.from(stringToHashOfRequest, this.bufferEncode),
      this.hashAlgorithm
    );
    const body = {
      ...dataQuery,
      vnp_SecureHash: requestHashed
    };
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    if (responseData?.vnp_Amount) {
      responseData.vnp_Amount = responseData.vnp_Amount / 100;
    }
    const message = getResponseByStatusCode2(
      responseData.vnp_ResponseCode?.toString() ?? "",
      data?.vnp_Locale ?? this.config.vnp_Locale,
      REFUND_RESPONSE_MAP
    );
    let outputResults = {
      isVerified: true,
      isSuccess: responseData.vnp_ResponseCode === "00" || responseData.vnp_ResponseCode === 0,
      message,
      ...responseData,
      vnp_Message: message
    };
    const stringToCreateHashOfResponse = [
      responseData.vnp_ResponseId,
      responseData.vnp_Command,
      responseData.vnp_ResponseCode,
      responseData.vnp_Message,
      responseData.vnp_TmnCode,
      responseData.vnp_TxnRef,
      responseData.vnp_Amount,
      responseData.vnp_BankCode,
      responseData.vnp_PayDate,
      responseData.vnp_TransactionNo,
      responseData.vnp_TransactionType,
      responseData.vnp_TransactionStatus,
      responseData.vnp_OrderInfo
    ].map(String).join("|").replace(/undefined/g, "");
    const responseHashed = hash(
      this.config.secureSecret,
      Buffer.from(stringToCreateHashOfResponse, this.bufferEncode),
      this.hashAlgorithm
    );
    if (responseData?.vnp_SecureHash && responseHashed !== responseData.vnp_SecureHash) {
      outputResults = {
        ...outputResults,
        isVerified: false,
        message: getResponseByStatusCode2(WRONG_CHECKSUM_KEY, this.config.vnp_Locale, REFUND_RESPONSE_MAP)
      };
    }
    const data2Log = {
      createdAt: /* @__PURE__ */ new Date(),
      method: "refund",
      ...outputResults
    };
    this.logger.log(data2Log, options, "refund");
    return outputResults;
  }
};

// src/vnpay/core/vnpay-verification.service.ts
var VerificationService2 = class {
  config;
  logger;
  hashAlgorithm;
  constructor(config, logger, hashAlgorithm) {
    this.config = config;
    this.logger = logger;
    this.hashAlgorithm = hashAlgorithm;
  }
  /**
   * Phương thức xác thực tính đúng đắn của các tham số trả về từ VNPay
   * @en Method to verify the return url from VNPay
   *
   * @param {ReturnQueryFromVNPay} query - Đối tượng dữ liệu trả về từ VNPay
   * @en @param {ReturnQueryFromVNPay} query - The object of data return from VNPay
   *
   * @param {VerifyReturnUrlOptions<LoggerFields>} options - Tùy chọn
   * @en @param {VerifyReturnUrlOptions<LoggerFields>} options - Options
   *
   * @returns {VerifyReturnUrl} Kết quả xác thực
   * @en @returns {VerifyReturnUrl} The verification result
   */
  verifyReturnUrl(query, options) {
    const { vnp_SecureHash = "", vnp_SecureHashType, ...cloneQuery } = query;
    if (typeof cloneQuery?.vnp_Amount !== "number") {
      const isValidAmount = numberRegex.test(cloneQuery?.vnp_Amount ?? "");
      if (!isValidAmount) {
        throw new Error("Invalid amount");
      }
      cloneQuery.vnp_Amount = Number(cloneQuery.vnp_Amount);
    }
    const searchParams = buildPaymentUrlSearchParams(cloneQuery);
    const isVerified = verifySecureHash({
      secureSecret: this.config.secureSecret,
      data: searchParams.toString(),
      hashAlgorithm: this.hashAlgorithm,
      receivedHash: vnp_SecureHash
    });
    let outputResults = {
      isVerified,
      isSuccess: cloneQuery.vnp_ResponseCode === "00" || cloneQuery.vnp_ResponseCode === 0,
      message: getResponseByStatusCode2(cloneQuery.vnp_ResponseCode?.toString() ?? "", this.config.vnp_Locale)
    };
    if (!isVerified) {
      outputResults = {
        ...outputResults,
        message: "Wrong checksum"
      };
    }
    const result = {
      ...cloneQuery,
      ...outputResults,
      vnp_Amount: cloneQuery.vnp_Amount / 100
    };
    const data2Log = {
      createdAt: /* @__PURE__ */ new Date(),
      method: "verifyReturnUrl",
      ...result,
      vnp_SecureHash: options?.withHash ? vnp_SecureHash : void 0
    };
    this.logger.log(data2Log, options, "verifyReturnUrl");
    return result;
  }
  /**
   * Phương thức xác thực tính đúng đắn của lời gọi ipn từ VNPay
   *
   * Sau khi nhận được lời gọi, hệ thống merchant cần xác thực dữ liệu nhận được từ VNPay,
   * kiểm tra đơn hàng có hợp lệ không, kiểm tra số tiền thanh toán có đúng không.
   *
   * @en Method to verify the ipn url from VNPay
   *
   * After receiving the call, the merchant system needs to verify the data received from VNPay,
   * check if the order is valid, check if the payment amount is correct.
   *
   * @param {ReturnQueryFromVNPay} query - Đối tượng dữ liệu trả về từ VNPay
   * @en @param {ReturnQueryFromVNPay} query - The object of data return from VNPay
   *
   * @param {VerifyIpnCallOptions<LoggerFields>} options - Tùy chọn
   * @en @param {VerifyIpnCallOptions<LoggerFields>} options - Options
   *
   * @returns {VerifyIpnCall} Kết quả xác thực
   * @en @returns {VerifyIpnCall} The verification result
   */
  verifyIpnCall(query, options) {
    const hash2 = query.vnp_SecureHash;
    const silentOptions = { logger: { loggerFn: ignoreLogger } };
    const result = this.verifyReturnUrl(query, silentOptions);
    const data2Log = {
      createdAt: /* @__PURE__ */ new Date(),
      method: "verifyIpnCall",
      ...result,
      ...options?.withHash ? { vnp_SecureHash: hash2 } : {}
    };
    this.logger.log(data2Log, options, "verifyIpnCall");
    return result;
  }
};

// src/vnpay/core/index.ts
var VNPay = class {
  globalConfig;
  hashAlgorithm;
  // Service instances
  loggerService;
  paymentService;
  verificationService;
  queryService;
  /**
   * Khởi tạo đối tượng VNPay
   * @en Initialize VNPay instance
   *
   * @param {VNPayConfig} config - VNPay configuration
   */
  constructor({
    vnpayHost = VNPAY_GATEWAY_SANDBOX_HOST,
    queryDrAndRefundHost = VNPAY_GATEWAY_SANDBOX_HOST,
    vnp_Version = VNP_VERSION,
    vnp_CurrCode = "VND" /* VND */,
    vnp_Locale = "vn" /* VN */,
    testMode = false,
    paymentEndpoint = PAYMENT_ENDPOINT,
    endpoints = {},
    ...config
  }) {
    if (testMode) {
      vnpayHost = VNPAY_GATEWAY_SANDBOX_HOST;
      queryDrAndRefundHost = VNPAY_GATEWAY_SANDBOX_HOST;
    }
    this.hashAlgorithm = config?.hashAlgorithm ?? "SHA512" /* SHA512 */;
    const initializedEndpoints = {
      paymentEndpoint: endpoints.paymentEndpoint || paymentEndpoint,
      queryDrRefundEndpoint: endpoints.queryDrRefundEndpoint || QUERY_DR_REFUND_ENDPOINT,
      getBankListEndpoint: endpoints.getBankListEndpoint || GET_BANK_LIST_ENDPOINT2
    };
    this.globalConfig = {
      vnpayHost,
      vnp_Version,
      vnp_CurrCode,
      vnp_Locale,
      vnp_OrderType: "other" /* Other */,
      vnp_Command: VNP_DEFAULT_COMMAND,
      paymentEndpoint: initializedEndpoints.paymentEndpoint,
      endpoints: initializedEndpoints,
      queryDrAndRefundHost,
      ...config
    };
    this.loggerService = new LoggerService(config?.enableLog ?? false, config?.loggerFn);
    this.paymentService = new PaymentService2(this.globalConfig, this.loggerService, this.hashAlgorithm);
    this.verificationService = new VerificationService2(this.globalConfig, this.loggerService, this.hashAlgorithm);
    this.queryService = new QueryService2(this.globalConfig, this.loggerService, this.hashAlgorithm);
  }
  /**
   * Lấy cấu hình mặc định của VNPay
   * @en Get default config of VNPay
   *
   * @returns {DefaultConfig} Cấu hình mặc định
   * @en @returns {DefaultConfig} Default configuration
   */
  get defaultConfig() {
    return {
      vnp_TmnCode: this.globalConfig.tmnCode,
      vnp_Version: this.globalConfig.vnp_Version,
      vnp_CurrCode: this.globalConfig.vnp_CurrCode,
      vnp_Locale: this.globalConfig.vnp_Locale,
      vnp_Command: this.globalConfig.vnp_Command,
      vnp_OrderType: this.globalConfig.vnp_OrderType
    };
  }
  /**
   * Lấy danh sách ngân hàng được hỗ trợ bởi VNPay
   * @en Get list of banks supported by VNPay
   *
   * @returns {Promise<Bank[]>} Danh sách ngân hàng
   * @en @returns {Promise<Bank[]>} List of banks
   */
  async getBankList() {
    const response = await fetch(
      resolveUrlString(
        this.globalConfig.vnpayHost ?? VNPAY_GATEWAY_SANDBOX_HOST,
        this.globalConfig.endpoints.getBankListEndpoint
      ),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `tmn_code=${this.globalConfig.tmnCode}`
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch bank list: HTTP ${response.status}`);
    }
    const bankList = await response.json();
    for (const bank of bankList) {
      const logoPath = bank.logo_link && bank.logo_link.startsWith("/") ? bank.logo_link.slice(1) : bank.logo_link;
      bank.logo_link = resolveUrlString(this.globalConfig.vnpayHost ?? VNPAY_GATEWAY_SANDBOX_HOST, logoPath);
    }
    return bankList;
  }
  /**
   * Phương thức xây dựng, tạo thành url thanh toán của VNPay
   * @en Build the payment url
   *
   * @param {BuildPaymentUrl} data - Dữ liệu thanh toán cần thiết để tạo URL
   * @en @param {BuildPaymentUrl} data - Payment data required to create URL
   *
   * @param {BuildPaymentUrlOptions<LoggerFields>} options - Tùy chọn bổ sung
   * @en @param {BuildPaymentUrlOptions<LoggerFields>} options - Additional options
   *
   * @returns {string} URL thanh toán
   * @en @returns {string} Payment URL
   * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#tao-url-thanh-toan
   */
  buildPaymentUrl(data, options) {
    return Promise.resolve(this.paymentService.buildPaymentUrl(data, options));
  }
  /**
   * Phương thức xác thực tính đúng đắn của các tham số trả về từ VNPay
   * @en Method to verify the return url from VNPay
   *
   * @param {ReturnQueryFromVNPay} query - Đối tượng dữ liệu trả về từ VNPay
   * @en @param {ReturnQueryFromVNPay} query - The object of data returned from VNPay
   *
   * @param {VerifyReturnUrlOptions<LoggerFields>} options - Tùy chọn để xác thực
   * @en @param {VerifyReturnUrlOptions<LoggerFields>} options - Options for verification
   *
   * @returns {VerifyReturnUrl} Kết quả xác thực
   * @en @returns {VerifyReturnUrl} Verification result
   * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-returnurl
   */
  verifyReturnUrl(query, options) {
    return this.verificationService.verifyReturnUrl(query, options);
  }
  /**
   * Phương thức xác thực tính đúng đắn của lời gọi ipn từ VNPay
   *
   * Sau khi nhận được lời gọi, hệ thống merchant cần xác thực dữ liệu nhận được từ VNPay,
   * kiểm tra đơn hàng có hợp lệ không, kiểm tra số tiền thanh toán có đúng không.
   *
   * Sau đó phản hồi lại VNPay kết quả xác thực thông qua các `IpnResponse`
   *
   * @en Method to verify the ipn call from VNPay
   *
   * After receiving the call, the merchant system needs to verify the data received from VNPay,
   * check if the order is valid, check if the payment amount is correct.
   *
   * Then respond to VNPay the verification result through `IpnResponse`
   *
   * @param {ReturnQueryFromVNPay} query - Đối tượng dữ liệu từ VNPay qua IPN
   * @en @param {ReturnQueryFromVNPay} query - The object of data from VNPay via IPN
   *
   * @param {VerifyIpnCallOptions<LoggerFields>} options - Tùy chọn để xác thực
   * @en @param {VerifyIpnCallOptions<LoggerFields>} options - Options for verification
   *
   * @returns {VerifyIpnCall} Kết quả xác thực
   * @en @returns {VerifyIpnCall} Verification result
   * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-ipn-url
   */
  verifyIpnCall(query, options) {
    return this.verificationService.verifyIpnCall(query, options);
  }
  /**
   * Đây là API để hệ thống merchant truy vấn kết quả thanh toán của giao dịch tại hệ thống VNPAY.
   * @en This is the API for the merchant system to query the payment result of the transaction at the VNPAY system.
   *
   * @param {QueryDr} query - Dữ liệu truy vấn kết quả thanh toán
   * @en @param {QueryDr} query - The data to query payment result
   *
   * @param {QueryDrResponseOptions<LoggerFields>} options - Tùy chọn truy vấn
   * @en @param {QueryDrResponseOptions<LoggerFields>} options - Query options
   *
   * @returns {Promise<QueryDrResponse>} Kết quả truy vấn từ VNPay sau khi đã xác thực
   * @en @returns {Promise<QueryDrResponse>} Query result from VNPay after verification
   * @see https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#truy-van-ket-qua-thanh-toan-PAY
   */
  async queryDr(query, options) {
    return this.queryService.queryDr(query, options);
  }
  /**
   * Đây là API để hệ thống merchant gửi yêu cầu hoàn tiền cho giao dịch qua hệ thống Cổng thanh toán VNPAY.
   * @en This is the API for the merchant system to refund the transaction at the VNPAY system.
   *
   * @param {Refund} data - Dữ liệu yêu cầu hoàn tiền
   * @en @param {Refund} data - The data to request refund
   *
   * @param {RefundOptions<LoggerFields>} options - Tùy chọn hoàn tiền
   * @en @param {RefundOptions<LoggerFields>} options - Refund options
   *
   * @returns {Promise<RefundResponse>} Kết quả hoàn tiền từ VNPay sau khi đã xác thực
   * @en @returns {Promise<RefundResponse>} Refund result from VNPay after verification
   * @see https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#hoan-tien-thanh-toan-PAY
   */
  async refund(data, options) {
    return this.queryService.refund(data, options);
  }
};

// src/core/service.ts
var PROVIDER_FACTORIES = {
  [EnumPaymentMethod.VNPAY]: (config) => new VNPay(config),
  [EnumPaymentMethod.MOMO]: (config) => new Momo(config)
};
var PaymentFactory = class {
  paymentProvider;
  constructor(type, config) {
    this.paymentProvider = this.getProvider(type, config);
  }
  getProvider(type, config) {
    const factory = PROVIDER_FACTORIES[type];
    return factory(config);
  }
  buildPaymentUrl(data, options) {
    return this.paymentProvider.buildPaymentUrl(data, options);
  }
  verifyReturnUrl(query, options) {
    return this.paymentProvider.verifyReturnUrl(query, options);
  }
  verifyIpnCall(query, options) {
    return this.paymentProvider.verifyIpnCall(query, options);
  }
  queryDr(query, options) {
    return this.paymentProvider.queryDr(query, options);
  }
  refund(data, options) {
    return this.paymentProvider.refund(data, options);
  }
};

export { EnumPaymentMethod, PaymentFactory };
//# sourceMappingURL=core.js.map
//# sourceMappingURL=core.js.map