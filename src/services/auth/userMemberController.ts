// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
const baseUrl = '/auth';
import { getHeaders } from '@/global';
/** 此处后端没有提供注释 POST /auth/list/page/member */
export async function listUserMemberByPage(
  body: API.PageRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageUserMember>(`${baseUrl}/auth/list/page/member`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
