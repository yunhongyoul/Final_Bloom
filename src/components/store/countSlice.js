import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice( {
  name: 'counterSlice',
  initialState: {num: 1 },

  reducers: {
    up: (state, action) => {
    console.log(action);
      state.num = state.num + action.payload
    } ,
    down: (state, action) => {
      console.log(action);
      if (state.num > 1) {
        state.num = state.num - action.payload;
      }
    }
  }
});