// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /auth/permission */
export async function getUserPermissions(
  body: API.UserPermissionDto,
  options?: { [key: string]: any },
) {
  return request<API.Permissions[]>('/auth/permission', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
