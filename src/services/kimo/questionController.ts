// @ts-ignore
/* eslint-disable */
import { getHeaders } from '@/global';
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /question/add */
export async function addAiMasterData(body: {}, options?: { [key: string]: any }) {
  return request<any>('/question/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /question/list/question */
export async function listQuestionDataByPage(
  body: API.QuestionQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageQuestion>('/question/list/question', {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}
