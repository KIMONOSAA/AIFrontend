// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { getHeaders } from '@/global';
const baseUrl = '/practice';
/** 此处后端没有提供注释 POST /add/answer */
//向后端发送答题结果的请求。
export async function addQuestionResult(
  body: API.AnswerAddResultRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>(`${baseUrl}/add/answer`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /add/answer/result */
//将整体的答题结果提交给后端，用于提交总体答题结果
export async function addQuestionResultOverall(
  body: API.AnswerAllResultRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBiResponse>(`${baseUrl}/add/answer/result`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /add/question */
//添加 AI 题目数据。
export async function addAiMasterData(body: {}, options?: { [key: string]: any }) {
  return request<any>(`${baseUrl}/add/question`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /list/question */
//通过分页查询获取问题数据。
export async function listQuestionDataByPage(
  body: API.QuestionQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageQuestion>(`${baseUrl}/list/question`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}
