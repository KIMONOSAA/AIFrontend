// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
const baseUrl = '/content';
import { getHeaders } from '@/global';
/** 此处后端没有提供注释 POST /content/add/ai/result */
export async function addAiResultRecording(
  body: API.AIResultRecordingAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong>(`${baseUrl}/content/add/ai/result`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /content/delete/ai/result */
export async function deleteAiResultRecording(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/content/delete/ai/result`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /content/list/aiRole/ai/result */
export async function listAiResultRecordingByPage(
  body: API.AIRoleQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageAIResultRecording>(`${baseUrl}/content/list/aiRole/ai/result`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}
