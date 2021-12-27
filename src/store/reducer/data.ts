import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import DATA from '@/data/layers';
import STYLES from '@/data/styles';
import { pathSearch } from '@/utils';
export const defaultStatus = { scalable: false, resizable: false, warpable: false };
export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    layers: DATA,
    styles: STYLES,
    status: defaultStatus,
    currentItem: {
      // containerRef: null,
      // targetRef: null,
      // labelRef: null,
      node: {},
      // style: {},
      // editStatus: 'scalable', // 'scalable' | 'resizable' | 'warpable'
    },
  },
  reducers: {
    setLayers: (state, action) => {
      state.layers = action.payload;
    },
    setStyles: (state, action) => {
      const { type, value } = action.payload;
      state.styles = value;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setCurrentItem: (state, action) => {
      const _data = action.payload;
      state.currentItem = _data;
      state.status = {
        ...state.status,
        scalable: true,
      };
    },
  },
});

export const { setLayers, setStyles, setStatus, setCurrentItem } = dataSlice.actions;
export const getReducerData = (state: { [x: string]: any }) => state;
export default dataSlice.reducer;
