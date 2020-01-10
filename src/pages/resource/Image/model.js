import { getList } from '@/services/image';
import { message } from 'antd';

const Model = {
  namespace: 'resourceImage',
  state: {
    appendable: true,
    list: [],
  },
  effects: {
    *fetchAndAppend({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      if (!response.success) {
        message.error('加载失败！');
        return;
      }
      yield put({
        type: 'appendList',
        payload: response.data,
      });
    },
    *fetchAndPrepend({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      if (!response.success) {
        message.error('加载失败！');
        return;
      }
      yield put({
        type: 'prependList',
        payload: response.data,
      });
    },
  },
  reducers: {
    appendList(state, action) {
      const newList = [...state.list, ...action.payload];
      const appendable = !!(action.payload && action.payload.length);
      return { ...state, list: newList, appendable };
    },
    prependList(state, action) {
      const newList = [...action.payload, ...state.list];
      return { ...state, list: newList };
    },
    reset(state) {
      return { ...state, list: [], appendable: true };
    },
  },
};
export default Model;
