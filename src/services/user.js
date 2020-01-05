import request from '@/utils/request';

const baseUrl = '/api/user';

export async function register(params) {
  return request(`${baseUrl}/register`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
export async function login(params) {
  return request(`${baseUrl}/login`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
export async function reset(params) {
  return request(`${baseUrl}/reset`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
export async function logout() {
  return request(`${baseUrl}/logout`, {
    method: 'POST',
  });
}
export async function updatePassword(params) {
  return request(`${baseUrl}/password`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
export async function unbindPhone(params) {
  return request(`${baseUrl}/unbind`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
export async function bindPhone(params) {
  return request(`${baseUrl}/bind`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
export async function get() {
  return request(baseUrl);
}
export async function update(params) {
  return request(baseUrl, {
    method: 'PUT',
    data: params,
    requestType: 'form',
  });
}
