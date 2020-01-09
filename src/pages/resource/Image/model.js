import { getList } from '@/services/image';
import { message } from 'antd';

const Model = {
  namespace: 'resourceImage',
  state: {
    noMore: false,
    list: [],
  },
  effects: {
    *fetchMore({ payload },{ call, put }) {
      const response = yield call(getList, payload);
      if (!response.success) {
        message.error("加载失败！");
        return;
      }
      yield put({
        type: 'appendList',
        payload: response.data,
      });
    },
  },
  reducers: {
    appendList(state, action) {
      const newList = [...state.list, ...action.payload];
      const noMore = !!(!action.payload || action.length);
      return { ...state, list: newList, noMore };
    },
    reset(state) {
      return { ...state, list: [], noMore: false };
    },
  },
};
export default Model;
