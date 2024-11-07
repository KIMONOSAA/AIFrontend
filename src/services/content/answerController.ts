// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
const baseUrl = '/content';
import { getHeaders } from '@/global';
/** 此处后端没有提供注释 POST /content/add/answer */
export async function addQuestionResult(
  body: API.AnswerAddResultRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBiResponse>(`${baseUrl}/content/add/answer`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /content/r/r1 */
export async function r1(options?: { [key: string]: any }) {
  return request<string>(`${baseUrl}/content/r/r1`, {
    method: 'GET',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /content/r/r1 */
export async function r13(options?: { [key: string]: any }) {
  return request<string>(`${baseUrl}/content/r/r1`, {
    method: 'PUT',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /content/r/r1 */
export async function r12(options?: { [key: string]: any }) {
  return request<string>(`${baseUrl}/content/r/r1`, {
    method: 'POST',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /content/r/r1 */
export async function r15(options?: { [key: string]: any }) {
  return request<string>(`${baseUrl}/content/r/r1`, {
    method: 'DELETE',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /content/r/r1 */
export async function r14(options?: { [key: string]: any }) {
  return request<string>(`${baseUrl}/content/r/r1`, {
    method: 'PATCH',
    headers: getHeaders(),
    ...(options || {}),
  });
}
