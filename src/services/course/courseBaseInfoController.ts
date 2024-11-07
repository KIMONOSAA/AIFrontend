// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { getHeaders } from '@/global';
const baseUrl = '/course';


/** 此处后端没有提供注释 POST /course/list/record */
export async function listCourseRecord(
  body: API.QueryCourseParamsDto,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageCourseLearnRecord>(`${baseUrl}/course/list/record`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}


//999
export async function createCourseBase(body: API.AddCourseDto, options?: { [key: string]: any }) {
  return request<API.BaseResponseCourseBaseInfoDto>(`${baseUrl}/add/course`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
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
  return request<API.BaseResponseCourseBaseInfoDto>(`${baseUrl}/course/${param0}`, {
    method: 'GET',
    headers: getHeaders(),
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /course/list */
export async function list(body: API.QueryCourseParamsDto, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageCourseBase>(`${baseUrl}/course/list`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /list/course/data */
export async function listAiMasterDataByPage(
  body: API.CoursePublishListDto,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageCourseBase>(`${baseUrl}/list/course/data`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /update/course */
export async function modifyCourseBase(body: API.EditCourseDto, options?: { [key: string]: any }) {
  return request<API.BaseResponseCourseBaseInfoDto>(`${baseUrl}/update/course`, {
    method: 'PUT',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}
