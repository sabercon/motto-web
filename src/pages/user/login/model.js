import router from 'umi/router';
import { login } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    type: undefined,
    msg: undefined,
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response.success) {
        yield put({
          type: 'changeLoginStatus',
          payload: {status: 'OK', type: payload.type},
        });
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
        yield put({
          type: 'changeLoginStatus',
          payload: {status: 'error', type: payload.type, msg: response.msg},
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority('user'); // 目前没有权限管理，先采用默认值
      return { ...state, ...payload };
    },
  },
};
export default Model;
