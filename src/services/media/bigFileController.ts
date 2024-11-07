// @ts-ignore
/* eslint-disable */
import { getHeaders } from '@/global';
import { request } from '@umijs/max';
const baseUrl = '/media';
/** 此处后端没有提供注释 POST /list/media/data */
export async function listAiMasterDataByPage(
  body: API.BinFIleListDto,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageMediaFiles>(`${baseUrl}/list/media/data`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
  
}

/** 此处后端没有提供注释 GET /show */
export async function download(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.downloadParams,
  options?: { [key: string]: any },
) {
  return request<any>(`${baseUrl}/show`, {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /upload/checkchunk */
export async function checkchunk(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkchunkParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/upload/checkchunk`, {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /upload/checkfile */
export async function checkfile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkfileParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/upload/checkfile`, {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /upload/mergechunks */
export async function mergechunks(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.mergechunksParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>(`${baseUrl}/upload/mergechunks`, {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function uploadchunk(
  params: FormData, // 直接传入 FormData
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>(`${baseUrl}/upload/uploadchunk`, {
    method: 'POST',
    headers: getHeaders(),
    data: params, // 将 FormData 传递给 data
    ...(options || {}),
  });
}
