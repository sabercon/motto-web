import { stringify } from 'querystring';
import router from 'umi/router';
import { login, logout, sendSmsCode } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { notification } from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.success) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        router.replace(redirect || '/');
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

    *logout(_, { call }) {
      const response = yield call(logout);
      if (response.success) {
        const { redirect } = getPageQuery(); // Note: There may be security issues, please note

        if (window.location.pathname !== '/user/login' && !redirect) {
          router.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          });
        }
      } else {
        notification.error({
          message: `错误码 ${response.code}`,
          description: response.msg,
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority('user'); // 目前没有权限管理，先采用默认值
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
