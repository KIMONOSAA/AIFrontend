// @ts-ignore
/* eslint-disable */


import { request } from '@umijs/max';
const baseUrl = '/auth';
import { getHeaders } from '@/global';
/** 此处后端没有提供注释 POST /auth/add */
export async function addUser(body: API.UserAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>(`${baseUrl}/auth/add`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/authentication */
export async function getAuthentication(
  body: API.UserAuthenticationRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseAuthentianResponse>(`${baseUrl}/auth/authentication`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 此处后端没有提供注释 POST /auth/add/point */
export async function addPoint(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addPointParams,
  options?: { [key: string]: any },
) {
  return request<boolean>(`${baseUrl}/auth/add/point`, {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
/** 此处后端没有提供注释 POST /auth/delete */
export async function deleteUser(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/auth/delete`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/findemail */
export async function findByEmail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.findByEmailParams,
  options?: { [key: string]: any },
) {
  return request<API.UserLocalDto>(`${baseUrl}/auth/findemail`, {
    method: 'POST',
    params: {
      ...params,
    },
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /auth/get */
export async function getUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseUser>(`${baseUrl}/auth/get`, {
    method: 'GET',
    headers: getHeaders(),
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /auth/get/login */
export async function getLoginUser(options?: { [key: string]: any }) {
  return request<API.BaseResponseUser>(`${baseUrl}/auth/get/login`, {
    method: 'GET',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /auth/get/points */
export async function getPoints(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>(`${baseUrl}/auth/get/points`, {
    method: 'GET',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/gobalget/login */
export async function gobalGetLoginUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GobalGetLoginUserParams,
  options?: { [key: string]: any },
) {
  return request<API.UserDto>(`${baseUrl}/auth/gobalget/login`, {
    method: 'POST',
    params: {
      ...params,
    },
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/insert */
export async function insertUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.insertUserParams,
  options?: { [key: string]: any },
) {
  return request<number>(`${baseUrl}/auth/insert`, {
    method: 'POST',
    params: {
      ...params,
      user: undefined,
      ...params['user'],
    },
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/isAdmin */
export async function isAdmin(options?: { [key: string]: any }) {
  return request<boolean>(`${baseUrl}/auth/isAdmin`, {
    method: 'POST',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/list/page */
export async function listUserByPage(body: API.UserQueryRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageUser>(`${baseUrl}/auth/list/page`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /auth/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.BaseResponseString>(`${baseUrl}/auth/logout`, {
    method: 'GET',
    headers: getHeaders(),
    ...(options || {}),
  });
}



/** 此处后端没有提供注释 POST /auth/sign */
export async function userSign(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userSignParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/auth/sign`, {
    method: 'POST',
    params: {
      ...params,
    },
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /auth/signCount */
export async function getSignUserCount(options?: { [key: string]: any }) {
  return request<API.BaseResponseInteger>(`${baseUrl}/auth/signCount`, {
    method: 'GET',
    ...(options || {}),
    headers: getHeaders(),
  });
}

/** 此处后端没有提供注释 POST /auth/update */
export async function updateUser(body: API.UserUpdateRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/auth/update`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}


/** 此处后端没有提供注释 POST /auth/vip */
export async function settingUserIsVip(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>(`${baseUrl}/auth/vip`, {
    method: 'POST',
    ...(options || {}),
    headers: getHeaders(),
  });
}
//888
/** 此处后端没有提供注释 POST /auth/verificationEmail */
export async function checkVerificationEmail(
  body: API.UserEmailVerificationRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString>(`${baseUrl}/auth/verificationEmail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/publish */
export async function getPublishEvent(
  body: API.UserPublishEventRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong>(`${baseUrl}/auth/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 此处后端没有提供注释 POST /auth/register */
export async function register(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  // params: API.registerParams,
  body: FormData,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong>(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // params: {
    //   ...params,
    // },
    data: body,
    ...(options || {}),
  });
}
//8