import router from 'umi/router';
import { updatePassword, unbindPhone, bindPhone } from '@/services/user';
import { update } from '@/services/userInfo';
import { message } from 'antd';
import province from './geographic/province.json';
import city from './geographic/city.json';

const Model = {
  namespace: 'accountSettings',
  state: {
    province: [],
    city: [],
    isLoading: false,
  },
  effects: {
    *fetchProvince(_, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield put({
        type: 'setProvince',
        payload: province,
      });
    },

    *fetchCity({ payload }, { put }) {
      const cityOfProvince = city[payload];
      yield put({
        type: 'setCity',
        payload: cityOfProvince,
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

    *unbindPhone({ payload }, { call }) {
      const response = yield call(unbindPhone, payload);
      if (response.success) {
        message.success('解绑手机成功！');
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

    changeLoading(state, action) {
      return { ...state, isLoading: action.payload };
    },
  },
};

export default Model;
