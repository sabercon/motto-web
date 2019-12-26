import request from '@/utils/request';

export async function register(params) {
  return request('/api/user/register', {
    method: 'POST',
    data: params,
  });
}
export async function login(params) {
  return request('/api/user/login', {
    method: 'POST',
    data: params,
  });
}
export async function reset(params) {
  return request('/api/user/reset', {
    method: 'POST',
    data: params,
  });
}
export async function logout() {
  return request('/api/user/logout');
}
export async function sendSmsCode({ status, phone }) {
  return request(`/api/user/sms/${status}/${phone}`);
}
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}
