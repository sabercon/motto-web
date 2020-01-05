import request from '@/utils/request';

const baseUrl = '/api/img';

export async function save(params) {
  return request(baseUrl, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
export async function del({ id }) {
  return request(`${baseUrl}/${id}`, {
    method: 'DELETE',
  });
}
export async function list(params) {
  return request(baseUrl, { params });
}
