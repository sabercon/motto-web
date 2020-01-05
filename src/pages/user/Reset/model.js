import { reset } from '@/services/user';
import router from 'umi/router';
import { message } from 'antd';

const Model = {
  namespace: 'reset',
  state: {},
  effects: {
    *submit({ payload }, { call }) {
      const response = yield call(reset, payload);
      if(response.success) {
        router.push({
          pathname: '/user/result',
          state: {
            type: 'reset',
            user: payload.phone,
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
