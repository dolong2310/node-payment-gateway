# @longdoo/node-payment-gateway

English | [Tiếng Việt](README.vi.md)

Vietnam payment gateway library for Node.js and TypeScript. It currently supports VNPay, MoMo, and ZaloPay, with helpers for creating payment URLs, verifying return/IPN callbacks, querying transaction status, refunding transactions, fetching bank lists, and logging payment operations.

This package is not an official VNPay, MoMo, or ZaloPay SDK. Always validate orders, amounts, transaction status, and business state in your own system before confirming a payment.

## Installation

```bash
npm install @longdoo/node-payment-gateway
```

Runtime requirement: Node.js 18 or newer is recommended because the package uses the built-in `fetch` API.

## Exports

```ts
import { PaymentFactory, EnumPaymentMethod, VNPay, Momo, ZaloPay } from '@longdoo/node-payment-gateway';

// Or use a subpath for the full provider API (constants, utils, all types):
// import { VNPay } from '@longdoo/node-payment-gateway/vnpay';
// import { Momo } from '@longdoo/node-payment-gateway/momo';
// import { ZaloPay } from '@longdoo/node-payment-gateway/zalopay';
```

The package publishes both ESM and CommonJS builds, plus TypeScript declarations.

## VNPay Quick Start

```ts
import { VNPay, ProductCode, VnpLocale, dateFormat } from '@longdoo/node-payment-gateway/vnpay';

const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE!,
  secureSecret: process.env.VNPAY_SECURE_SECRET!,
  testMode: true,
  vnp_Locale: VnpLocale.VN,
});

const orderId = 'ORDER_1001';

const paymentUrl = await vnpay.buildPaymentUrl({
  vnp_Amount: 100000,
  vnp_IpAddr: '127.0.0.1',
  vnp_ReturnUrl: 'https://example.com/payment/vnpay-return',
  vnp_TxnRef: orderId,
  vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
  vnp_OrderType: ProductCode.Other,
  vnp_CreateDate: dateFormat(new Date()),
});

console.log(paymentUrl);
```

VNPay notes:

- Pass `vnp_Amount` in normal VND units. The library multiplies the amount by 100 when building the VNPay URL.
- `vnp_CreateDate` and `vnp_ExpireDate` use the `yyyyMMddHHmmss` format. Use `dateFormat()` when possible.
- `testMode: true` forces the VNPay sandbox host.

## Verify VNPay Return URL

```ts
import type { ReturnQueryFromVNPay } from '@longdoo/node-payment-gateway/vnpay';

const result = vnpay.verifyReturnUrl(req.query as ReturnQueryFromVNPay);

if (result.isVerified && result.isSuccess) {
  // Mark the order as paid after checking order id, amount, and current order state.
}
```

## Verify VNPay IPN

```ts
import {
  IpnFailChecksum,
  IpnInvalidAmount,
  IpnOrderNotFound,
  IpnSuccess,
  type ReturnQueryFromVNPay,
} from '@longdoo/node-payment-gateway/vnpay';

app.get('/payment/vnpay-ipn', async (req, res) => {
  const result = vnpay.verifyIpnCall(req.query as ReturnQueryFromVNPay);

  if (!result.isVerified) {
    return res.json(IpnFailChecksum);
  }

  const order = await findOrder(result.vnp_TxnRef);
  if (!order) {
    return res.json(IpnOrderNotFound);
  }

  if (order.amount !== result.vnp_Amount) {
    return res.json(IpnInvalidAmount);
  }

  await markOrderAsPaid(order.id);
  return res.json(IpnSuccess);
});
```

## MoMo Quick Start

```ts
import { Momo, MomoLocale, RequestType } from '@longdoo/node-payment-gateway/momo';

const momo = new Momo({
  partnerCode: process.env.MOMO_PARTNER_CODE!,
  accessKey: process.env.MOMO_ACCESS_KEY!,
  secretKey: process.env.MOMO_SECRET_KEY!,
  storeId: 'MyStore',
  storeName: 'My Store',
  requestType: RequestType.PAY_WITH_METHOD,
  lang: MomoLocale.VI,
  testMode: true,
});

const orderId = 'ORDER_1001';

const paymentUrl = await momo.buildPaymentUrl({
  requestId: `REQ_${Date.now()}`,
  orderId,
  amount: 100000,
  orderInfo: `Thanh toan don hang ${orderId}`,
  redirectUrl: 'https://example.com/payment/momo-return',
  ipnUrl: 'https://example.com/payment/momo-ipn',
  extraData: Buffer.from(JSON.stringify({ orderId })).toString('base64'),
});

console.log(paymentUrl);
```

MoMo notes:

- `amount` is sent in normal VND units.
- `requestId` should be unique for each request and is useful for idempotency.
- `extraData` should be a base64 string. Use an empty string if you do not need extra data.
- `testMode: true` uses the MoMo sandbox host.

## Verify MoMo Return URL or IPN

```ts
import type { ReturnQueryFromMomo } from '@longdoo/node-payment-gateway/momo';

const returnResult = momo.verifyReturnUrl(req.query as ReturnQueryFromMomo);
const ipnResult = momo.verifyIpnCall(req.body as ReturnQueryFromMomo);

if (ipnResult.isVerified && ipnResult.isSuccess) {
  // Mark the order as paid after checking order id, amount, and current order state.
}
```

## ZaloPay Quick Start

```ts
import { ZaloPay } from '@longdoo/node-payment-gateway/zalopay';

const zalopay = new ZaloPay({
  appId: process.env.ZALOPAY_APP_ID!,
  key1: process.env.ZALOPAY_KEY1!,
  key2: process.env.ZALOPAY_KEY2!,
  callbackUrl: 'https://example.com/payment/zalopay-callback', // optional default for every order
  testMode: true,
});

const order = await zalopay.createOrder({
  appTransId: 'ORDER_1001', // sent as `yymmdd_ORDER_1001` (Vietnam time)
  amount: 100000,
  description: 'Thanh toan don hang ORDER_1001',
  appUser: 'user_123',
  redirectUrl: 'https://example.com/payment/zalopay-return',
  items: [{ id: 'SKU_1', name: 'T-shirt', price: 100000, quantity: 1 }],
});

if (order.isSuccess) {
  // Save order.app_trans_id, then redirect the customer to order.order_url
}

// Or only get the payment URL (throws if ZaloPay rejects the order):
const paymentUrl = await zalopay.buildPaymentUrl({ amount: 100000, description: 'Thanh toan don hang' });
```

ZaloPay notes:

- `app_trans_id` must be `yymmdd_xxx` in Vietnam time (GMT+7). The library adds the prefix if missing and generates one if `appTransId` is omitted. Always store `order.app_trans_id`.
- `amount` is sent in normal VND units.
- `embedData` and `items` are plain objects; the library stringifies them and signs the exact strings. `redirectUrl` is merged into `embed_data.redirecturl`.
- `key1` signs API requests, `key2` verifies the callback and the redirect checksum.
- `testMode: true` uses `sb-openapi.zalopay.vn`; otherwise `openapi.zalopay.vn`.

## Verify ZaloPay Redirect

```ts
import type { ReturnQueryFromZaloPay } from '@longdoo/node-payment-gateway/zalopay';

const result = zalopay.verifyReturnUrl(req.query as unknown as ReturnQueryFromZaloPay);

if (result.isVerified && result.isSuccess) {
  // Only show the result page. Update the order from the callback (or queryDr).
}
```

## Handle ZaloPay Callback

ZaloPay sends a `POST` JSON body `{ data, mac, type }` to `callbackUrl` only when the payment succeeds.

```ts
import {
  IpnAlreadyConfirmed,
  IpnFailChecksum,
  IpnSuccess,
  IpnUnknownError,
  type ZaloPayCallbackBody,
} from '@longdoo/node-payment-gateway/zalopay';

app.post('/payment/zalopay-callback', express.json(), async (req, res) => {
  try {
    const result = zalopay.verifyIpnCall(req.body as ZaloPayCallbackBody);

    if (!result.isVerified) {
      return res.json(IpnFailChecksum); // ZaloPay will not retry
    }

    const order = await findOrderByAppTransId(result.app_trans_id);
    if (order.status === 'paid') {
      return res.json(IpnAlreadyConfirmed);
    }

    await markOrderAsPaid(order.id, { zpTransId: result.zp_trans_id, amount: result.amount });
    return res.json(IpnSuccess);
  } catch {
    return res.json(IpnUnknownError); // ZaloPay retries the callback (up to 3 times)
  }
});
```

If no callback arrives, poll `queryDr` (about once a minute) until the order expires:

```ts
const status = await zalopay.queryDr({ app_trans_id: '250210_ORDER_1001' });
// status.isSuccess -> paid, status.isProcessing -> still waiting, otherwise failed
```

## ZaloPay Refund

Refunds are asynchronous: call `refund`, keep `m_refund_id`, then check it with `queryRefund`.

```ts
const refund = await zalopay.refund({
  zp_trans_id: '250210000000123',
  amount: 50000,
  description: 'Refund ORDER_1001',
});

const refundStatus = await zalopay.queryRefund({ m_refund_id: refund.m_refund_id });
```

## PaymentFactory

Use `PaymentFactory` when you want to choose the provider dynamically while keeping one method surface.

```ts
import { EnumPaymentMethod, PaymentFactory } from '@longdoo/node-payment-gateway';

const gateway = new PaymentFactory(EnumPaymentMethod.VNPAY, {
  tmnCode: process.env.VNPAY_TMN_CODE!,
  secureSecret: process.env.VNPAY_SECURE_SECRET!,
  testMode: true,
});

const paymentUrl = await gateway.buildPaymentUrl({
  vnp_Amount: 100000,
  vnp_IpAddr: '127.0.0.1',
  vnp_ReturnUrl: 'https://example.com/payment/vnpay-return',
  vnp_TxnRef: 'ORDER_1001',
  vnp_OrderInfo: 'Thanh toan don hang ORDER_1001',
});
```

## Other APIs

`VNPay`, `Momo`, and `ZaloPay` all expose:

- `buildPaymentUrl(data, options?)`
- `verifyReturnUrl(query, options?)`
- `verifyIpnCall(query, options?)`
- `queryDr(query, options?)`
- `refund(data, options?)`
- `getBankList()`

`ZaloPay` also exposes `createOrder(data, options?)` (full response with `order_url`, `zp_trans_token`, `qr_code`) and `queryRefund(query, options?)`. Its `verifyIpnCall` takes the callback body `{ data, mac, type }`.

## Logging

Enable built-in logging with `enableLog: true`, or pass a custom `loggerFn`.

```ts
const vnpayWithLog = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE!,
  secureSecret: process.env.VNPAY_SECURE_SECRET!,
  enableLog: true,
  loggerFn: (data) => {
    console.log('[payment]', data);
  },
});
```

Per-call logger options can log all fields, omit fields, or pick only selected fields.

```ts
await vnpayWithLog.buildPaymentUrl(
  {
    vnp_Amount: 100000,
    vnp_IpAddr: '127.0.0.1',
    vnp_ReturnUrl: 'https://example.com/payment/vnpay-return',
    vnp_TxnRef: 'ORDER_1001',
    vnp_OrderInfo: 'Thanh toan don hang ORDER_1001',
  },
  {
    withHash: false,
    logger: {
      type: 'omit',
      fields: ['paymentUrl'],
    },
  },
);
```

## Development

```bash
npm install
npm run build
```

`prepublishOnly` runs the build before publishing to npm.
