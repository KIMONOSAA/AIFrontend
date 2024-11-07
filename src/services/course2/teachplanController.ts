// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /teachplan */
export async function saveTeachplan(body: API.SaveTeachplanDto, options?: { [key: string]: any }) {
  return request<any>('/teachplan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /teachplan/${param0}/tree-nodes */
export async function getTreeNodes(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTreeNodesParams,
  options?: { [key: string]: any },
) {
  const { courseId: param0, ...queryParams } = params;
  return request<API.BaseResponseListTeachplanListDto>(`/teachplan/${param0}/tree-nodes`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /teachplan/association/media */
export async function associationMedia(
  body: API.BindTeachplanMediaDto,
  options?: { [key: string]: any },
) {
  return request<any>('/teachplan/association/media', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}