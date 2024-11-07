// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { getHeaders } from '@/global';
const baseUrl = '/checkcode';
/** 此处后端没有提供注释 POST /checkcode/publish */
export async function getPublishEvent(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPublishEventParams,
  body: API.UserDto,
  options?: { [key: string]: any },
) {
  return request<any>(`${baseUrl}/checkcode/publish`, {
    method: 'POST',
    headers: getHeaders(),
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
