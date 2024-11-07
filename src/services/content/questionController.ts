// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
const baseUrl = '/content';
import { getHeaders } from '@/global';
/** 此处后端没有提供注释 POST /content/add/question */
export async function addAiMasterData(body: {}, options?: { [key: string]: any }) {
  return request<any>(`${baseUrl}/content/add/question`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /content/list/question */
export async function listQuestionDataByPage(
  body: API.QuestionQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageQuestion>(`${baseUrl}/content/list/question`, {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}
