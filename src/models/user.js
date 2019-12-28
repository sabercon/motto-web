import router from 'umi/router';
import { notification } from 'antd';
import { stringify } from 'querystring';
import { sendSmsCode, logout, queryCurrent, query as queryUsers } from '@/services/user';
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

    *logout(_, { call }) {
      const response = yield call(logout);
      if (response.success) {
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

    *getUserInfo(_, { call, put }) {
      const response = yield call(getUserInfo);
      if (response.success) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      } else {
        notification.error({
          message: `错误码 ${response.code}`,
          description: response.msg,
        });
      }
    },
    
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
