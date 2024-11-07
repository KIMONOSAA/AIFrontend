// @ts-ignore
/* eslint-disable */

// generatePayCode(body: API.AddOrderDto)：
// 作用：该函数用于向后端请求生成支付代码，通常在用户提交订单后调用。
// 使用时机：在用户确认订单并准备进行支付时调用。

// requestPay(params: API.requestPayParams)：
// 作用：该函数用于请求支付，通常在用户生成支付代码后调用。
// 使用时机：在获取到支付代码后，用户点击支付按钮时调用该接口，以开始支付过程。

// paynotify(options?: { [key: string]: any })：
// 作用：该函数用于处理支付通知，通常用于后端向前端发送支付状态的通知。
// 使用时机：此接口通常不需要主动调用，而是由后端在支付状态变化时（如支付成功或失败）自动调用，以通知前端。


// payresult(params: API.payresultParams)：
// 作用：该函数用于请求支付结果，允许用户查询支付的状态。
// 使用时机：在用户进行支付后，可以定期或在用户主动请求时调用此接口，以获取支付的最新状态。


import { request } from '@umijs/max';
import { getHeaders } from '@/global';
const baseUrl = '/order';
/** 此处后端没有提供注释 POST /generatepaycode */
// 该函数用于向后端请求生成支付代码。
export async function generatePayCode(body: API.AddOrderDto, options?: { [key: string]: any }) {
  return request<API.BaseResponsePayRecordDto>(`${baseUrl}/generatepaycode`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /paynotify */
//: 该函数用于处理支付通知。
export async function paynotify(options?: { [key: string]: any }) {
  return request<any>(`${baseUrl}/paynotify`, {
    method: 'POST',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /payresult */
//该函数用于请求支付结果。
export async function payresult(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.payresultParams,
  options?: { [key: string]: any },
) {
  return request<API.PayRecordDto>(`${baseUrl}/payresult`, {
    method: 'POST',
    params: {
      ...params,
    },
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /requestpay */
//该函数用于请求支付。
export async function requestPay(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.requestPayParams,
  options?: { [key: string]: any },
) {
  return request<any>(`${baseUrl}/requestpay`, {
    method: 'GET',
    params: {
      ...params,
    },
    headers: getHeaders(),
    ...(options || {}),
  });
}
