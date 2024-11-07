// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
// import { request } from '@umijs/max';
const baseUrl = '/auth';
import { getHeaders } from '@/global';
/** 此处后端没有提供注释 POST /auth/findalluser */
export async function findAllValidTokenByUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.findAllValidTokenByUserParams,
  options?: { [key: string]: any },
) {
  return request<API.Token[]>(`${baseUrl}/auth/findalluser`, {
    method: 'POST',
    params: {
      ...params,
    },
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/findtoken */
export async function findByToken(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.findByTokenParams,
  options?: { [key: string]: any },
) {
  return request<API.Token>(`${baseUrl}/auth/findtoken`, {
    method: 'POST',
    params: {
      ...params,
    },
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/revoketoken */
export async function getRevokeAllUserToken(body: API.UserDto, options?: { [key: string]: any }) {
  return request<any>(`${baseUrl}/auth/revoketoken`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/savetoken */
export async function getSaveUserToken(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSaveUserTokenParams,
  body: API.UserDto,
  options?: { [key: string]: any },
) {
  return request<any>(`${baseUrl}/auth/savetoken`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
