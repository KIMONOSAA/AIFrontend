// @ts-ignore
/* eslint-disable */
import { getHeaders } from '@/global';
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /answer/add */
export async function addQuestionResult(
  body: API.AnswerAddResultRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBiResponse>('/answer/add', {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}
