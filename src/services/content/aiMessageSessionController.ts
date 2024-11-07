// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
const baseUrl = '/content';
import { getHeaders } from '@/global';
/** 此处后端没有提供注释 POST /content/add/ai/message */
export async function addAiMessageSession(
  body: API.AIMessageSessionAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong>(`${baseUrl}/content/add/ai/message`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /content/delete */
export async function deleteAiMessageSession(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/content/delete`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /content/list/aiRole */
export async function listAiMessageSessionByPage(
  body: API.AIMessageSessionQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageAIMessageSession>(`${baseUrl}/content/list/aiRole`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /content/update */
export async function updateAiMessageSession(
  body: API.AIMessageSessionUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/content/update`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}
