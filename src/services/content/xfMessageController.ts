// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
const baseUrl = '/content';
import { getHeaders } from '@/global';
/** 此处后端没有提供注释 GET /content/test/xf */
export async function test(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.testParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>(`${baseUrl}/content/test/xf`, {
    method: 'GET',
    headers: getHeaders(),
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
