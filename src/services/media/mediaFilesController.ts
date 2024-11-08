// @ts-ignore
/* eslint-disable */
import { getHeaders } from '@/global';
import { request } from '@umijs/max';
const baseUrl = '/media';
/** 此处后端没有提供注释 POST /upload/coursefile */
export async function upload(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: FormData,
  options?: { [key: string]: any },
) {
  return request<API.UploadFileResultDto>(`${baseUrl}/upload/coursefile`, {
    method: 'POST',
    headers: getHeaders(),
    data: params,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /getPreviewUrl */
export async function getPreviewUrl(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPreviewUrlParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString>(`${baseUrl}/getPreviewUrl`, {
    method: 'GET',
    params: {
      ...params,
    },
    // headers: getHeaders(),
    ...(options || {}),
  });
}
