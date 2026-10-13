# 正式订单与预约服务接入

GitHub Pages 承载静态前端。运营方必须提供独立的 HTTPS 服务负责订单、预约、库存、场次和支付。

## 配置

在 `site/config.js` 中：

1. 填写 `bookingEndpoint` 和 `orderEndpoint`（HTTPS POST 地址）。
2. 将 `mode` 从 `demo` 改为 `live`。
3. 在 `content.js` 核对正式价格、款式、商品图、课程介绍及交付信息。
4. 填写公开合作邮箱 `contactEmail`。
5. 填入正式排期 `liveSchedule`，例如：

```js
liveSchedule: [
  { activityId: 'script', date: '2026-11-07', id: 'script-20261107-am', time: '09:30–11:30' },
  { activityId: 'spring', date: '2027-03-06', id: 'spring-20270306-am', time: '09:30–11:30' },
],
```

示例日期不代表真实排期；上线前需替换。正式模式不自动生成周末示例，只展示已配置且未过期的场次。

## POST 协议

请求包含 `Content-Type: application/json` 和 `Idempotency-Key`，重试使用相同编号。接口需支持来自门户域名的 CORS 预检和这两个请求头。

预约：

```json
{
  "requestId": "booking-uuid",
  "kind": "booking",
  "activityId": "script",
  "activityName": "芦荡茶影 · 春来谜局",
  "date": "2026-11-07",
  "slotId": "script-20261107-am",
  "group": "学生专场",
  "ageRange": "18–25 岁",
  "participants": 5,
  "format": "script",
  "contact": { "name": "联系人", "phone": "联系电话", "organization": "机构名" },
  "notes": "",
  "referenceAmount": 490,
  "currency": "CNY",
  "mode": "live"
}
```

订单使用 `kind: order`，`items` 为 `{id, variant, quantity}` 数组，`contact` 为 `{name, phone, address}`。

接口必须在服务端重新计算金额，并核验商品、款式、库存、年龄要求、场次、人数和系列课程日期。**不能信任前端传入的参考金额或状态**。

仅在服务真实持久化成功后返回 HTTP 2xx 和：

```json
{ "status": "pending", "reference": "运营方订单或预约编号" }
```

支持状态 `accepted`、`pending`、`confirmed`；仅 `confirmed` 展示“已确认”，其余展示“申请已收到”。未返回有效编号、HTTP 错误或超时，不显示成功。冲突用 HTTP 409。

## 在线支付

当前前端选择“提交后等待运营确认”，没有伪造支付二维码或支付链接。真实在线支付需要由商户后端创建支付订单，提供托管收银台，并使用支付服务端回调验证付款。

接入时需增加从服务响应中获取托管收银台 URL 的流程、付款状态查询与订单核销逻辑。支付密钥、商户私钥、回调验证和凭证只存于后端，禁止放到公开 `config.js` 或 GitHub 仓库。

## 上线验证

使用测试环境确认请求可达、异常提示、超时重试幂等、名额/库存冲突、服务金额核验和付款回调。确认后，再切换到生产接口并更新网站的演示文案。
