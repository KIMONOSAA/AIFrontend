// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { getHeaders } from '@/global';
const baseUrl = '/course';
/** 此处后端没有提供注释 POST /course/whole/${param0} */
export async function getPreviewInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPreviewInfoParams,
  options?: { [key: string]: any },
) {
  const { courseId: param0, ...queryParams } = params;
  return request<API.BaseResponseCoursePreviewDto>(`${baseUrl}/course/whole/${param0}`, {
    method: 'POST',
    params: {
      ...queryParams,
      courseLearnRecordDto: undefined,
      ...queryParams['courseLearnRecordDto'],
    },
    headers: getHeaders(),
    ...(options || {}),
  });
}
