import request from '@/utils/request';

export async function register(params) {
  return request('/api/user/register', {
    method: 'POST',
    data: params,
    requestType: 'form'
  });
}
export async function login(params) {
  return request('/api/user/login', {
    method: 'POST',
    data: params,
    requestType: 'form'
  });
}
export async function reset(params) {
  return request('/api/user/reset', {
    method: 'POST',
    data: params,
    requestType: 'form'
  });
}
export async function logout() {
  return request('/api/user/logout', {
    method: 'POST',
  });
}
export async function updatePassword(params) {
  return request('/api/user/password', {
    method: 'POST',
    data: params,
    requestType: 'form'
  });
}
export async function unbindPhone(params) {
  return request('/api/user/unbind', {
    method: 'POST',
    data: params,
    requestType: 'form'
  });
}
export async function bindPhone(params) {
  return request('/api/user/bind', {
    method: 'POST',
    data: params,
    requestType: 'form'
  });
}
export async function sendSmsCode({ status, phone }) {
  return request(`/api/user/sms/${status}/${phone}`);
}
export async function getUser() {
  return request('/api/user');
}
