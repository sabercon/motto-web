import request from '@/utils/request';

export async function update(params) {
  return request('/api/userInfo', {
    method: 'PUT',
    data: params,
    requestType: 'form'
  });
}
export async function getUserInfo() {
  return request('/api/userInfo');
}
