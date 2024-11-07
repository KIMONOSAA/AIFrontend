// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /add/course */
export async function createCourseBase(body: API.AddCourseDto, options?: { [key: string]: any }) {
  return request<API.BaseResponseCourseBaseInfoDto>('/add/course', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /course/${param0} */
export async function getCourseBaseById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCourseBaseByIdParams,
  options?: { [key: string]: any },
) {
  const { courseId: param0, ...queryParams } = params;
  return request<API.BaseResponseCourseBaseInfoDto>(`/course/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /course/list */
export async function list(body: API.QueryCourseParamsDto, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageCourseBase>('/course/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /list/course/data */
export async function listAiMasterDataByPage(
  body: API.CoursePublishListDto,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageCourseBase>('/list/course/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /update/course */
export async function modifyCourseBase(body: API.EditCourseDto, options?: { [key: string]: any }) {
  return request<API.BaseResponseCourseBaseInfoDto>('/update/course', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
