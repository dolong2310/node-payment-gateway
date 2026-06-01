# @longdoo/node-payment-gateway

English | [Tiếng Việt](README.vi.md)

Vietnam payment gateway library for Node.js and TypeScript. It currently supports VNPay and MoMo, with helpers for creating payment URLs, verifying return/IPN callbacks, querying transaction status, refunding transactions, fetching bank lists, and logging payment operations.

This package is not an official VNPay or MoMo SDK. Always validate orders, amounts, transaction status, and business state in your own system before confirming a payment.

## Installation

```bash
npm install @longdoo/node-payment-gateway
```

Runtime requirement: Node.js 18 or newer is recommended because the package uses the built-in `fetch` API.

## Exports

```ts
import { PaymentFactory, EnumPaymentMethod } from '@longdoo/node-payment-gateway';
import { VNPay } from '@longdoo/node-payment-gateway/vnpay';
import { Momo } from '@longdoo/node-payment-gateway/momo';
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

Both `VNPay` and `Momo` expose:

- `buildPaymentUrl(data, options?)`
- `verifyReturnUrl(query, options?)`
- `verifyIpnCall(query, options?)`
- `queryDr(query, options?)`
- `refund(data, options?)`
- `getBankList()`

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
