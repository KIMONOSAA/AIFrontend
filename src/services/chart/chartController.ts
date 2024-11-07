// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
const baseUrl = '/chart';
import { getHeaders } from '@/global';
/** 此处后端没有提供注释 POST /chart/add */
export async function addChart(body: API.ChartAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/chart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /chart/Bi */
export async function getAccuracyChartById(options?: { [key: string]: any }) {
  return request<API.BaseResponseAccuracyChart>(`${baseUrl}/chart/Bi`, {
    method: 'GET',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/delete */
export async function deleteChart(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/chart/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/edit */
export async function editChart(body: API.ChartEditRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/chart/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/gen/couzi/async */
export async function getChartDataForCouZi(
  body: API.GouZiAdditionalMessages,
  options?: { [key: string]: any },
) {
  return request<string>('/chart/gen/couzi/async', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/gen/rabbit/async */
export async function genChartByAiRabbitMq(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.genChartByAIRabbitMQParams,
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBiResponse>('/chart/gen/rabbit/async', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
      genChartByAI: undefined,
      ...params['genChartByAI'],
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /chart/get */
export async function getChartById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChartByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseChart>('/chart/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/list/admin/page */
export async function listChartAdminByPage(
  body: API.ChartQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageChart>('/chart/list/admin/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/list/chart/page */
export async function listChartUserByPage(
  body: API.ChartQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageChart>('/chart/list/chart/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/my/list/page */
export async function listMyChartByPage(
  body: API.ChartQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageChart>('/chart/my/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/my/list/practice/page */
export async function listMyPracticeByPage(
  body: API.PracticeRecordRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePagePracticeRecordPro>(`${baseUrl}/chart/my/list/practice/page`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/update */
export async function updateChart(body: API.ChartUpdateRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/chart/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
