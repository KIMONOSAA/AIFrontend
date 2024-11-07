// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /list/media/data */
export async function listAiMasterDataByPage(
  body: API.BinFIleListDto,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageMediaFiles>('/list/media/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
  return request<any>('/show', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /show */
export async function download3(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.download3Params,
  options?: { [key: string]: any },
) {
  return request<any>('/show', {
    method: 'PUT',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /show */
export async function download2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.download2Params,
  options?: { [key: string]: any },
) {
  return request<any>('/show', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /show */
export async function download5(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.download5Params,
  options?: { [key: string]: any },
) {
  return request<any>('/show', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /show */
export async function download4(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.download4Params,
  options?: { [key: string]: any },
) {
  return request<any>('/show', {
    method: 'PATCH',
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
  return request<API.BaseResponseBoolean>('/upload/checkchunk', {
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
  return request<API.BaseResponseBoolean>('/upload/checkfile', {
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
  return request<API.BaseResponse>('/upload/mergechunks', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /upload/uploadchunk */
export async function uploadchunk(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadchunkParams,
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>('/upload/uploadchunk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
