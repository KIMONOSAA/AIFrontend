// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
const baseUrl = '/content';
import { getHeaders } from '@/global';
/** 此处后端没有提供注释 POST /content/add/ai/role */
export async function addAiRole(body: API.AIRoleAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>(`${baseUrl}/content/add/ai/role`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /content/check/ai/role */
export async function checkAiRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkAIRoleParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/content/check/ai/role`, {
    method: 'GET',
    headers: getHeaders(),
    params: {
      ...params,
      checkRequest: undefined,
      ...params['checkRequest'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /content/delete/ai/role */
export async function deleteAiRole(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/content/delete/ai/role`, {
    method: 'DELETE',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /content/list/aiRole/ai/role */
export async function listAiRoleByPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listAiRoleByPageParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageAIRole>(`${baseUrl}/content/list/aiRole/ai/role`, {
    method: 'GET',
    headers: getHeaders(),
    params: {
      ...params,
      aiRoleQueryRequest: undefined,
      ...params['aiRoleQueryRequest'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /content/reject/ai/role */
export async function rejectAiRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.rejectAIRoleParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/content/reject/ai/role`, {
    method: 'GET',
    headers: getHeaders(),
    params: {
      ...params,
      checkRequest: undefined,
      ...params['checkRequest'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /content/update/ai/role */
export async function updateAiRole(
  body: API.AIRoleUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/content/update/ai/role`, {
    method: 'PUT',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}
