import request from '@/utils/request';

export async function sendCode({ status, phone }) {
  return request(`/api/sms/${status}/${phone}`);
}
