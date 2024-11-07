// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /course/record */
export async function updateCourseRecord(
  body: API.CourseLearnRecordTimeDto,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>('/course/record', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
