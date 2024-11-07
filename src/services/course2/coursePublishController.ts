// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /courseaudit/commit/${param0} */
export async function commitAudit(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.commitAuditParams,
  options?: { [key: string]: any },
) {
  const { courseId: param0, ...queryParams } = params;
  return request<any>(`/courseaudit/commit/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /coursepreview/${param0} */
export async function preview(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.previewParams,
  options?: { [key: string]: any },
) {
  const { courseId: param0, ...queryParams } = params;
  return request<API.BaseResponseCoursePreviewDto>(`/coursepreview/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
      courseLearnRecordDto: undefined,
      ...queryParams['courseLearnRecordDto'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /coursepublish/${param0} */
export async function coursepublish(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.coursepublishParams,
  options?: { [key: string]: any },
) {
  const { courseId: param0, ...queryParams } = params;
  return request<any>(`/coursepublish/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /r/coursepublish/${param0} */
export async function getCoursepublish(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCoursepublishParams,
  options?: { [key: string]: any },
) {
  const { courseId: param0, ...queryParams } = params;
  return request<API.BaseResponseCoursePublish>(`/r/coursepublish/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
