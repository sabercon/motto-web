import { register, sendSmsCode } from '@/services/user';
import router from 'umi/router';
import { notification } from 'antd';

const Model = {
  namespace: 'userAndregister',
  state: {},
  effects: {
    *submit({ payload }, { call }) {
      const response = yield call(register, payload);
      if(response.success) {
        router.push({
          pathname: '/user/registerResult',
          state: {
            username: payload.username,
          },
        });
      } else {
        notification.error({
          message: `错误码 ${response.code}`,
          description: response.msg,
        });
      }
    },
    *fetchCode({ payload }, { call }) {
      yield call(sendSmsCode, payload);
    },
  },
  reducers: {},
};
export default Model;
