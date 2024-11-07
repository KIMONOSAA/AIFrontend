// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /preview/${param0} */
export async function getPlayUrlByMediaId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPlayUrlByMediaIdParams,
  options?: { [key: string]: any },
) {
  const { mediaId: param0, ...queryParams } = params;
  return request<string>(`/preview/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
