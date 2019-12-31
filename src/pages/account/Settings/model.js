import router from 'umi/router';
import { updatePassword, unbindPhone, bindPhone } from '@/services/user';
import { update } from '@/services/userInfo';
import { message } from 'antd';
import provinces from './geographic/province.json';
import cities from './geographic/city.json';

const Model = {
  namespace: 'accountSettings',
  state: {
    province: [],
    city: [],
    currentStep: 'unbind',
  },
  effects: {
    *fetchProvince(_, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield put({
        type: 'setProvince',
        payload: provinces,
      });
    },

    *fetchCity({ payload }, { put }) {
      const city = cities[payload];
      yield put({
        type: 'setCity',
        payload: city,
      });
    },

    *update({ payload }, { call, put }) {
      const response = yield call(update, payload);
      if (response.success) {
        message.success('更新成功！');
        yield put({
          type: 'user/getUser',
        });
      }
    },

    *updatePassword({ payload }, { call }) {
      const response = yield call(updatePassword, payload);
      if (response.success) {
        message.success('修改密码成功，请重新登录');
        router.push('/user/login');
      } else {
        message.error(response.msg);
      }
    },

    *unbindPhone({ payload }, { call, put }) {
      const response = yield call(unbindPhone, payload);
      if (response.success) {
        message.success('解绑手机成功！');
        yield put({
          type: 'changeCurrentStep',
          payload: 'bind',
        });
      } else {
        message.error(response.msg);
      }
    },

    *bindPhone({ payload }, { call, put }) {
      const response = yield call(bindPhone, payload);
      if (response.success) {
        message.success('绑定手机成功！');
        yield put({
          type: 'user/getUser',
        });
        yield put({
          type: 'changeCurrentStep',
          payload: 'result',
        });
      } else {
        message.error(response.msg);
      }
    },
  },
  reducers: {
    setProvince(state, action) {
      return { ...state, province: action.payload };
    },

    setCity(state, action) {
      return { ...state, city: action.payload };
    },

    changeCurrentStep(state, { payload }) {
      return { ...state, currentStep: payload };
    },
  },
};

export default Model;
