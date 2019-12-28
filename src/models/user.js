import router from 'umi/router';
import { notification } from 'antd';
import { stringify } from 'querystring';
import { sendSmsCode, logout, getUser } from '@/services/user';
import { getUserInfo } from '@/services/userInfo';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetchCode({ payload }, { call }) {
      yield call(sendSmsCode, payload);
    },

    *logout(_, { call, put }) {
      const response = yield call(logout);
      if (response.success) {
        yield put({
          type: 'saveCurrentUser',
        });
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      } else {
        notification.error({
          message: `错误码 ${response.code}`,
          description: response.msg,
        });
      }
    },

    *getUser(_, { call, put }) {
      const basicResponse = yield call(getUser);
      const detailResponse = yield call(getUserInfo);
      if (basicResponse.success && detailResponse.success) {
        yield put({
          type: 'saveCurrentUser',
          payload: {...basicResponse.data, ...detailResponse.data},
        });
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return {...state, currentUser: action.payload || {} };
    },
  },
};
export default UserModel;
