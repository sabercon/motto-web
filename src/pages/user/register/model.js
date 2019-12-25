import { register } from '@/services/user';

const Model = {
  namespace: 'userAndregister',
  state: {
    success: undefined,
    code: undefined,
    msg: undefined,
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(register, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
