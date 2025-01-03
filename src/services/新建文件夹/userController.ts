// @ts-ignore
/* eslint-disable */
import { getHeaders } from '@/global';
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /user/add */
export async function addUser(body: API.UserAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/user/add', {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/authentication */
export async function getAuthentication(
  body: API.UserAuthenticationRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseAuthentianResponse>('/user/authentication', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/delete */
export async function deleteUser(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/user/delete', {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/get */
export async function getUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseUser>('/user/get', {
    method: 'GET',
    headers: getHeaders(),
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/get/login */
export async function getLoginUser(options?: { [key: string]: any }) {
  return request<API.BaseResponseLoginUserVO>('/user/get/login', {
    method: 'GET',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/get/points */
export async function getPoints(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/user/get/points', {
    method: 'GET',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/get/vo */
export async function getUserVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserVOByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseUserVO>('/user/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/list/page */
export async function listUserByPage(body: API.UserQueryRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageUser>('/user/list/page', {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/list/page/vo */
export async function listUserVoByPage(
  body: API.UserQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageUserVO>('/user/list/page/vo', {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.BaseResponseString>('/user/logout', {
    method: 'GET',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/publish */
export async function getPublishEvent(
  body: API.UserPublishEventRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/user/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function register(body: FormData, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/user/register', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
/** 此处后端没有提供注释 POST /user/sign */
export async function userSign(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userSignParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/user/sign', {
    method: 'POST',
    params: {
      ...params,
    },
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/signCount */
export async function getSignUserCount(options?: { [key: string]: any }) {
  return request<API.BaseResponseInteger>('/user/signCount', {
    method: 'GET',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/update */
export async function updateUser(body: API.UserUpdateRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/user/update', {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/update/my */
export async function updateMyUser(
  body: API.UserUpdateMyRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/user/update/my', {
    method: 'POST',
    headers: getHeaders(),
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/verificationEmail */
export async function checkVerificationEmail(
  body: API.UserEmailVerificationRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString>('/user/verificationEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/vip */
export async function settingUserIsVip(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/user/vip', {
    method: 'POST',
    headers: getHeaders(),
    ...(options || {}),
  });
}
