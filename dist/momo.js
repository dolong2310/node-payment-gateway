import 'fs';
import crypto from 'crypto';

// src/common/utils/logger.util.ts
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
var CONFIRM_TRANSACTION_ENDPOINT = "/v2/gateway/api/confirm";
var GET_BANK_LIST_ENDPOINT = "/v2/gateway/api/bankcodes";

// src/momo/constants/request-type.constant.ts
var MOMO_PARTNER_CODE = "MOMO";

// src/momo/enums/index.ts
var RequestType = /* @__PURE__ */ ((RequestType2) => {
  RequestType2["CAPTURE_WALLET"] = "captureWallet";
  RequestType2["PAY_WITH_ATM"] = "payWithATM";
  RequestType2["PAY_WITH_CREDIT"] = "payWithCredit";
  RequestType2["PAY_WITH_METHOD"] = "payWithMethod";
  return RequestType2;
})(RequestType || {});
var MomoLocale = /* @__PURE__ */ ((MomoLocale2) => {
  MomoLocale2["VI"] = "vi";
  MomoLocale2["EN"] = "en";
  return MomoLocale2;
})(MomoLocale || {});

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
  return crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
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
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
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

export { CONFIRM_TRANSACTION_ENDPOINT, CREATE_PAYMENT_ENDPOINT, GET_BANK_LIST_ENDPOINT, MOMO_GATEWAY_PRODUCTION_HOST, MOMO_GATEWAY_SANDBOX_HOST, MOMO_PARTNER_CODE, Momo, MomoLocale, MomoResponseCode, QUERY_TRANSACTION_ENDPOINT, REFUND_TRANSACTION_ENDPOINT, RESPONSE_MAP, RequestType, buildPaymentRawSignature, buildQueryRawSignature, buildRefundRawSignature, generateOrderId, generateSignature, getResponseByStatusCode, sortObject, verifySignature };
//# sourceMappingURL=momo.js.map
//# sourceMappingURL=momo.js.map