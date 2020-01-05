import router from 'umi/router';
import { message } from 'antd';
import { stringify } from 'querystring';
import { logout, get } from '@/services/user';
import { sendCode } from '@/services/sms';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *sendCode({ payload }, { call }) {
      yield call(sendCode, payload);
    },

    *logout(_, { call, put }) {
      const response = yield call(logout);
      if (response.success) {
        yield put({
          type: 'saveCurrentUser',
          payload: {},
        });
        router.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      } else {
        message.error(response.msg);
      }
    },

    *getUser(_, { call, put }) {
      const response = yield call(get);
      if (response.success) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return {...state, currentUser: action.payload };
    },
  },
};
export default UserModel;
