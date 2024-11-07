// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
const baseUrl = '/dictionary';
/** 此处后端没有提供注释 GET /dictionary/all */
export async function queryAll(options?: { [key: string]: any }) {
  return request<API.Dictionary[]>(`${baseUrl}/dictionary/all`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /dictionary/code/${param0} */
export async function getByCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getByCodeParams,
  options?: { [key: string]: any },
) {
  const { code: param0, ...queryParams } = params;
  return request<API.Dictionary>(`${baseUrl}/dictionary/code/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
