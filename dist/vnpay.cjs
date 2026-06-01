'use strict';

require('fs');
var crypto2 = require('crypto');
var dayjs = require('dayjs');
var timezone = require('dayjs/plugin/timezone.js');
var utc = require('dayjs/plugin/utc.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var crypto2__default = /*#__PURE__*/_interopDefault(crypto2);
var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);
var timezone__default = /*#__PURE__*/_interopDefault(timezone);
var utc__default = /*#__PURE__*/_interopDefault(utc);

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

// src/vnpay/constants/response-map.constant.ts
var WRONG_CHECKSUM_KEY = "WRONG_CHECKSUM_KEY";
var RESPONSE_MAP = /* @__PURE__ */ new Map([
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
var TRANSACTION_STATUS_RESPONSE_MAP = /* @__PURE__ */ new Map([
  ["00", { vn: "Giao d\u1ECBch thanh to\xE1n th\xE0nh c\xF4ng", en: "Payment transaction successful" }],
  ["01", { vn: "Giao d\u1ECBch ch\u01B0a ho\xE0n t\u1EA5t", en: "Transaction not completed" }],
  [
    "02",
    {
      vn: "Giao d\u1ECBch b\u1ECB l\u1ED7i",
      en: "Transaction error"
    }
  ],
  [
    "04",
    {
      vn: "Giao d\u1ECBch \u0111\u1EA3o (Kh\xE1ch h\xE0ng \u0111\xE3 b\u1ECB tr\u1EEB ti\u1EC1n t\u1EA1i Ng\xE2n h\xE0ng nh\u01B0ng GD ch\u01B0a th\xE0nh c\xF4ng \u1EDF VNPAY)",
      en: "Transaction reverse (Customer has been deducted money at the Bank but the transaction is not successful at VNPAY)"
    }
  ],
  [
    "05",
    {
      vn: "VNPAY \u0111ang x\u1EED l\xFD giao d\u1ECBch n\xE0y (GD ho\xE0n ti\u1EC1n)",
      en: "VNPAY is processing this transaction (refund)"
    }
  ],
  [
    "06",
    {
      vn: "VNPAY \u0111\xE3 g\u1EEDi y\xEAu c\u1EA7u ho\xE0n ti\u1EC1n sang Ng\xE2n h\xE0ng (GD ho\xE0n ti\u1EC1n)",
      en: "VNPAY has sent a refund request to the Bank (refund)"
    }
  ],
  [
    "07",
    {
      vn: "Giao d\u1ECBch b\u1ECB nghi ng\u1EDD gian l\u1EADn",
      en: "Transaction suspected of fraud"
    }
  ],
  [
    "09",
    {
      vn: "GD Ho\xE0n tr\u1EA3 b\u1ECB t\u1EEB ch\u1ED1i",
      en: "Refund transaction is rejected"
    }
  ],
  [WRONG_CHECKSUM_KEY, { vn: "Sai checksum", en: "Wrong checksum" }]
]);

// src/vnpay/constants/api-endpoint.constant.ts
var VNPAY_GATEWAY_SANDBOX_HOST = "https://sandbox.vnpayment.vn";
var PAYMENT_ENDPOINT = "paymentv2/vpcpay.html";
var QUERY_DR_REFUND_ENDPOINT = "merchant_webapi/api/transaction";
var GET_BANK_LIST_ENDPOINT = "qrpayauth/api/merchant/get_bank_list";

// src/vnpay/constants/ipn-result-for-vnpay.constant.ts
var IpnSuccess = {
  RspCode: "00",
  Message: "Confirm Success"
};
var IpnOrderNotFound = {
  RspCode: "01",
  Message: "Order not found"
};
var InpOrderAlreadyConfirmed = {
  RspCode: "02",
  Message: "Order already confirmed"
};
var IpnIpProhibited = {
  RspCode: "03",
  Message: "IP prohibited"
};
var IpnInvalidAmount = {
  RspCode: "04",
  Message: "Invalid amount"
};
var IpnFailChecksum = {
  RspCode: "97",
  Message: "Fail checksum"
};
var IpnUnknownError = {
  RspCode: "99",
  Message: "Unknown error"
};

// src/vnpay/constants/regex.constant.ts
var numberRegex = /^[0-9]+$/;

// src/vnpay/constants/index.ts
var VNP_VERSION = "2.1.0";
var VNP_DEFAULT_COMMAND = "pay";
var CURR_CODE_VND = "VND";

// src/vnpay/enums/product-code.enum.ts
var ProductCode = /* @__PURE__ */ ((ProductCode2) => {
  ProductCode2["Food_Consumption"] = "100000";
  ProductCode2["Phone_Tablet"] = "110000";
  ProductCode2["ElectricAppliance"] = "120000";
  ProductCode2["Computers_OfficeEquipment"] = "130000";
  ProductCode2["Electronics_Sound"] = "140000";
  ProductCode2["Books_Newspapers_Magazines"] = "150000";
  ProductCode2["Sports_Picnics"] = "160000";
  ProductCode2["Hotel_Tourism"] = "170000";
  ProductCode2["Cuisine"] = "180000";
  ProductCode2["Entertainment_Training"] = "190000";
  ProductCode2["Fashion"] = "200000";
  ProductCode2["Health_Beauty"] = "210000";
  ProductCode2["Mother_Baby"] = "220000";
  ProductCode2["KitchenUtensils"] = "230000";
  ProductCode2["Vehicle"] = "240000";
  ProductCode2["Pay"] = "250000";
  ProductCode2["AirlineTickets"] = "250007";
  ProductCode2["CardCode"] = "260000";
  ProductCode2["Pharmacy_MedicalServices"] = "270000";
  ProductCode2["Other"] = "other";
  return ProductCode2;
})(ProductCode || {});

// src/vnpay/enums/index.ts
var UrlService = /* @__PURE__ */ ((UrlService2) => {
  UrlService2["sandbox"] = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  return UrlService2;
})(UrlService || {});
var HashAlgorithm = /* @__PURE__ */ ((HashAlgorithm2) => {
  HashAlgorithm2["SHA256"] = "SHA256";
  HashAlgorithm2["SHA512"] = "SHA512";
  HashAlgorithm2["MD5"] = "MD5";
  return HashAlgorithm2;
})(HashAlgorithm || {});
var VnpCurrCode = /* @__PURE__ */ ((VnpCurrCode2) => {
  VnpCurrCode2["VND"] = "VND";
  return VnpCurrCode2;
})(VnpCurrCode || {});
var VnpLocale = /* @__PURE__ */ ((VnpLocale2) => {
  VnpLocale2["VN"] = "vn";
  VnpLocale2["EN"] = "en";
  return VnpLocale2;
})(VnpLocale || {});
var VnpCardType = /* @__PURE__ */ ((VnpCardType2) => {
  VnpCardType2["ATM"] = "ATM";
  VnpCardType2["QRCODE"] = "QRCODE";
  return VnpCardType2;
})(VnpCardType || {});
var VnpTransactionType = /* @__PURE__ */ ((VnpTransactionType2) => {
  VnpTransactionType2["PAYMENT"] = "01";
  VnpTransactionType2["FULL_REFUND"] = "02";
  VnpTransactionType2["PARTIAL_REFUND"] = "03";
  return VnpTransactionType2;
})(VnpTransactionType || {});
var RefundTransactionType = /* @__PURE__ */ ((RefundTransactionType2) => {
  RefundTransactionType2["FULL_REFUND"] = "02";
  RefundTransactionType2["PARTIAL_REFUND"] = "03";
  return RefundTransactionType2;
})(RefundTransactionType || {});

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
dayjs__default.default.extend(utc__default.default);
dayjs__default.default.extend(timezone__default.default);
function getDateInGMT7(date) {
  const inputDate = date ?? /* @__PURE__ */ new Date();
  const utcDate = dayjs__default.default.utc(inputDate);
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
function parseDate(dateNumber, tz = "local") {
  const dateString = dateNumber.toString();
  const _parseInt = Number.parseInt;
  const year = _parseInt(dateString.slice(0, 4));
  const month = _parseInt(dateString.slice(4, 6)) - 1;
  const day = _parseInt(dateString.slice(6, 8));
  const hour = _parseInt(dateString.slice(8, 10));
  const minute = _parseInt(dateString.slice(10, 12));
  const second = _parseInt(dateString.slice(12, 14));
  const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
  switch (tz) {
    case "utc": {
      return dayjs__default.default.utc(formattedDate).toDate();
    }
    case "gmt7": {
      const localDate = new Date(year, month, day, hour, minute, second);
      const utcTime = dayjs__default.default.utc(localDate);
      return utcTime.add(7, "hour").toDate();
    }
    // biome-ignore lint/complexity/noUselessSwitchCase: still good to readable
    case "local":
    default:
      return new Date(year, month, day, hour, minute, second);
  }
}
function isValidVnpayDateFormat(date) {
  const dateString = date.toString();
  const regex = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])([01][0-9]|2[0-3])[0-5][0-9][0-5][0-9]$/;
  return regex.test(dateString);
}
function generateRandomString(length, options) {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  if (options?.onlyNumber) {
    characters = "0123456789";
  }
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += `${characters[Math.random() * charactersLength | 0]}`;
  }
  return result;
}
function getResponseByStatusCode(responseCode = "", locale = "vn" /* VN */, responseMap = RESPONSE_MAP) {
  const respondText = responseMap.get(responseCode) ?? responseMap.get("default");
  return respondText[locale];
}
function hash(secret, data, algorithm) {
  return crypto2__default.default.createHmac(algorithm, secret).update(data.toString()).digest("hex");
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
  return crypto2__default.default.createHmac(hashAlgorithm, secureSecret).update(Buffer.from(data, bufferEncode)).digest("hex");
}
function verifySecureHash({
  secureSecret,
  data,
  hashAlgorithm,
  receivedHash
}) {
  const calculatedHash = crypto2__default.default.createHmac(hashAlgorithm, secureSecret).update(Buffer.from(data, "utf-8")).digest("hex");
  return calculatedHash === receivedHash;
}

// src/vnpay/core/vnpay-payment.service.ts
var PaymentService = class {
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
var QueryService = class {
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
    const message = getResponseByStatusCode(
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
        message: getResponseByStatusCode(WRONG_CHECKSUM_KEY, this.config.vnp_Locale, QUERY_DR_RESPONSE_MAP)
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
    const message = getResponseByStatusCode(
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
        message: getResponseByStatusCode(WRONG_CHECKSUM_KEY, this.config.vnp_Locale, REFUND_RESPONSE_MAP)
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
var VerificationService = class {
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
      message: getResponseByStatusCode(cloneQuery.vnp_ResponseCode?.toString() ?? "", this.config.vnp_Locale)
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
      getBankListEndpoint: endpoints.getBankListEndpoint || GET_BANK_LIST_ENDPOINT
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
    this.paymentService = new PaymentService(this.globalConfig, this.loggerService, this.hashAlgorithm);
    this.verificationService = new VerificationService(this.globalConfig, this.loggerService, this.hashAlgorithm);
    this.queryService = new QueryService(this.globalConfig, this.loggerService, this.hashAlgorithm);
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

exports.CURR_CODE_VND = CURR_CODE_VND;
exports.GET_BANK_LIST_ENDPOINT = GET_BANK_LIST_ENDPOINT;
exports.HashAlgorithm = HashAlgorithm;
exports.InpOrderAlreadyConfirmed = InpOrderAlreadyConfirmed;
exports.IpnFailChecksum = IpnFailChecksum;
exports.IpnInvalidAmount = IpnInvalidAmount;
exports.IpnIpProhibited = IpnIpProhibited;
exports.IpnOrderNotFound = IpnOrderNotFound;
exports.IpnSuccess = IpnSuccess;
exports.IpnUnknownError = IpnUnknownError;
exports.PAYMENT_ENDPOINT = PAYMENT_ENDPOINT;
exports.ProductCode = ProductCode;
exports.QUERY_DR_REFUND_ENDPOINT = QUERY_DR_REFUND_ENDPOINT;
exports.QUERY_DR_RESPONSE_MAP = QUERY_DR_RESPONSE_MAP;
exports.REFUND_RESPONSE_MAP = REFUND_RESPONSE_MAP;
exports.RESPONSE_MAP = RESPONSE_MAP;
exports.RefundTransactionType = RefundTransactionType;
exports.TRANSACTION_STATUS_RESPONSE_MAP = TRANSACTION_STATUS_RESPONSE_MAP;
exports.UrlService = UrlService;
exports.VNPAY_GATEWAY_SANDBOX_HOST = VNPAY_GATEWAY_SANDBOX_HOST;
exports.VNP_DEFAULT_COMMAND = VNP_DEFAULT_COMMAND;
exports.VNP_VERSION = VNP_VERSION;
exports.VNPay = VNPay;
exports.VnpCardType = VnpCardType;
exports.VnpCurrCode = VnpCurrCode;
exports.VnpLocale = VnpLocale;
exports.VnpTransactionType = VnpTransactionType;
exports.WRONG_CHECKSUM_KEY = WRONG_CHECKSUM_KEY;
exports.buildPaymentUrlSearchParams = buildPaymentUrlSearchParams;
exports.calculateSecureHash = calculateSecureHash;
exports.createPaymentUrl = createPaymentUrl;
exports.dateFormat = dateFormat;
exports.generateRandomString = generateRandomString;
exports.getDateInGMT7 = getDateInGMT7;
exports.getResponseByStatusCode = getResponseByStatusCode;
exports.hash = hash;
exports.isValidVnpayDateFormat = isValidVnpayDateFormat;
exports.numberRegex = numberRegex;
exports.parseDate = parseDate;
exports.verifySecureHash = verifySecureHash;
//# sourceMappingURL=vnpay.cjs.map
//# sourceMappingURL=vnpay.cjs.map