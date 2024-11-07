// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
const baseUrl = '/content';
import { getHeaders } from '@/global';
/** 此处后端没有提供注释 POST /content/add/ai/master/data */
export async function addAiMasterData1(
  body: API.AIMasterDataAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseAIMasterData>(`${baseUrl}/content/add/ai/master/data`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /content/delete/ai/master/data */
export async function deleteAiMasterData(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/content/delete/ai/master/data`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /content/list/aiRole/ai/master/data */
export async function listAiMasterDataByPage(
  body: API.AIMasterDataQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageAIMasterData>(`${baseUrl}/content/list/aiRole/ai/master/data`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}
