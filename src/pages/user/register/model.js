import { register } from '@/services/user';
import router from 'umi/router';
import { notification } from 'antd';

const Model = {
  namespace: 'register',
  state: {},
  effects: {
    *submit({ payload }, { call }) {
      const response = yield call(register, payload);
      if(response.success) {
        router.push({
          pathname: '/user/result',
          state: {
            type: 'register',
            user: payload.username,
          },
        });
      } else {
        notification.error({
          message: `错误码 ${response.code}`,
          description: response.msg,
        });
      }
    },
  },
  reducers: {},
};
export default Model;
