# @longdoo/node-payment-gateway

[English](README.md) | Tiếng Việt

Thư viện `payment gateway` Việt Nam cho Node.js và TypeScript. Hiện tại package hỗ trợ VNPay, MoMo và ZaloPay, bao gồm các helper để tạo `payment URL`, verify `Return URL`/`IPN callback`, query trạng thái transaction, refund transaction, lấy bank list và logging payment operation.

Package này không phải official SDK của VNPay, MoMo hoặc ZaloPay. Khi nhận callback, bạn vẫn cần tự validate order, amount, transaction status và business state trong system của bạn trước khi confirm payment.

## Cài đặt

```bash
npm install @longdoo/node-payment-gateway
```

Runtime nên dùng Node.js 18 trở lên vì package sử dụng built-in `fetch` API.

## Import

```ts
import { PaymentFactory, EnumPaymentMethod, VNPay, Momo, ZaloPay } from '@longdoo/node-payment-gateway';

// Or use a subpath for the full provider API (constants, utils, all types):
// import { VNPay } from '@longdoo/node-payment-gateway/vnpay';
// import { Momo } from '@longdoo/node-payment-gateway/momo';
// import { ZaloPay } from '@longdoo/node-payment-gateway/zalopay';
```

Package publish cả ESM, CommonJS và TypeScript declarations.

## Dùng nhanh VNPay

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

Lưu ý với VNPay:

- Truyền `vnp_Amount` theo đơn vị VND bình thường. Library sẽ tự nhân 100 khi build VNPay URL.
- `vnp_CreateDate` và `vnp_ExpireDate` dùng format `yyyyMMddHHmmss`. Nên dùng helper `dateFormat()`.
- `testMode: true` sẽ force VNPay sandbox host.

## Verify VNPay Return URL

```ts
import type { ReturnQueryFromVNPay } from '@longdoo/node-payment-gateway/vnpay';

const result = vnpay.verifyReturnUrl(req.query as ReturnQueryFromVNPay);

if (result.isVerified && result.isSuccess) {
  // Đánh dấu order đã paid sau khi check order id, amount và current order state.
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

## Dùng nhanh MoMo

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

Lưu ý với MoMo:

- `amount` dùng đơn vị VND bình thường.
- `requestId` nên unique cho mỗi request và hữu ích cho idempotency.
- `extraData` nên là base64 string. Nếu không cần extra data, truyền empty string.
- `testMode: true` dùng MoMo sandbox host.

## Verify MoMo Return URL hoặc IPN

```ts
import type { ReturnQueryFromMomo } from '@longdoo/node-payment-gateway/momo';

const returnResult = momo.verifyReturnUrl(req.query as ReturnQueryFromMomo);
const ipnResult = momo.verifyIpnCall(req.body as ReturnQueryFromMomo);

if (ipnResult.isVerified && ipnResult.isSuccess) {
  // Đánh dấu order đã paid sau khi check order id, amount và current order state.
}
```

## Dùng nhanh ZaloPay

```ts
import { ZaloPay } from '@longdoo/node-payment-gateway/zalopay';

const zalopay = new ZaloPay({
  appId: process.env.ZALOPAY_APP_ID!,
  key1: process.env.ZALOPAY_KEY1!,
  key2: process.env.ZALOPAY_KEY2!,
  callbackUrl: 'https://example.com/payment/zalopay-callback', // optional, mặc định cho mọi order
  testMode: true,
});

const order = await zalopay.createOrder({
  appTransId: 'ORDER_1001', // được gửi thành `yymmdd_ORDER_1001` (giờ Việt Nam)
  amount: 100000,
  description: 'Thanh toan don hang ORDER_1001',
  appUser: 'user_123',
  redirectUrl: 'https://example.com/payment/zalopay-return',
  items: [{ id: 'SKU_1', name: 'Ao thun', price: 100000, quantity: 1 }],
});

if (order.isSuccess) {
  // Lưu order.app_trans_id, sau đó redirect khách hàng tới order.order_url
}

// Hoặc chỉ lấy payment URL (throw Error nếu ZaloPay từ chối tạo order):
const paymentUrl = await zalopay.buildPaymentUrl({ amount: 100000, description: 'Thanh toan don hang' });
```

Lưu ý với ZaloPay:

- `app_trans_id` bắt buộc dạng `yymmdd_xxx` theo giờ Việt Nam (GMT+7). Thư viện tự thêm prefix nếu thiếu và tự sinh nếu không truyền `appTransId`. Luôn lưu lại `order.app_trans_id`.
- `amount` truyền theo đơn vị VND bình thường.
- `embedData` và `items` truyền object; thư viện tự stringify và ký đúng chuỗi đó. `redirectUrl` được gộp vào `embed_data.redirecturl`.
- `key1` dùng ký request gọi API, `key2` dùng verify callback và checksum redirect.
- `testMode: true` dùng `sb-openapi.zalopay.vn`, ngược lại dùng `openapi.zalopay.vn`.

## Verify ZaloPay Redirect

```ts
import type { ReturnQueryFromZaloPay } from '@longdoo/node-payment-gateway/zalopay';

const result = zalopay.verifyReturnUrl(req.query as unknown as ReturnQueryFromZaloPay);

if (result.isVerified && result.isSuccess) {
  // Chỉ hiển thị trang kết quả. Cập nhật order dựa trên callback (hoặc queryDr).
}
```

## Xử lý ZaloPay Callback

ZaloPay gửi `POST` JSON `{ data, mac, type }` tới `callbackUrl`, chỉ khi thanh toán thành công.

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
      return res.json(IpnFailChecksum); // ZaloPay sẽ không callback lại
    }

    const order = await findOrderByAppTransId(result.app_trans_id);
    if (order.status === 'paid') {
      return res.json(IpnAlreadyConfirmed);
    }

    await markOrderAsPaid(order.id, { zpTransId: result.zp_trans_id, amount: result.amount });
    return res.json(IpnSuccess);
  } catch {
    return res.json(IpnUnknownError); // ZaloPay sẽ callback lại (tối đa 3 lần)
  }
});
```

Nếu không nhận được callback, gọi `queryDr` định kỳ (khoảng 1 phút/lần) cho tới khi order hết hạn:

```ts
const status = await zalopay.queryDr({ app_trans_id: '250210_ORDER_1001' });
// status.isSuccess -> đã thanh toán, status.isProcessing -> đang chờ, còn lại -> thất bại
```

## Hoàn tiền ZaloPay

Refund là bất đồng bộ: gọi `refund`, lưu `m_refund_id`, sau đó kiểm tra bằng `queryRefund`.

```ts
const refund = await zalopay.refund({
  zp_trans_id: '250210000000123',
  amount: 50000,
  description: 'Hoan tien ORDER_1001',
});

const refundStatus = await zalopay.queryRefund({ m_refund_id: refund.m_refund_id });
```

## PaymentFactory

Dùng `PaymentFactory` khi bạn muốn chọn provider động nhưng giữ cùng method surface.

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

## API khác

`VNPay`, `Momo` và `ZaloPay` đều expose:

- `buildPaymentUrl(data, options?)`
- `verifyReturnUrl(query, options?)`
- `verifyIpnCall(query, options?)`
- `queryDr(query, options?)`
- `refund(data, options?)`
- `getBankList()`

`ZaloPay` có thêm `createOrder(data, options?)` (trả về full response gồm `order_url`, `zp_trans_token`, `qr_code`) và `queryRefund(query, options?)`. `verifyIpnCall` của ZaloPay nhận callback body `{ data, mac, type }`.

## Logging

Bật logging bằng `enableLog: true`, hoặc truyền custom `loggerFn`.

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

Ở từng method call, logger options có thể log all fields, omit fields hoặc pick selected fields.

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

`prepublishOnly` sẽ chạy build trước khi publish lên npm.
