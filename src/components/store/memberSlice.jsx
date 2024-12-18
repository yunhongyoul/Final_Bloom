import { createSlice } from "@reduxjs/toolkit";

export const memberSlice = createSlice({
  name: "member",
  initialState: {
    isLogged: false,
    role: "",
    userId: "",
    name: "", // 사용자 이름 필드
    authToken: "",
  },
  reducers: {
    login: (state, action) => {
      console.log("액션 데이터:", action.payload); // 액션 데이터 확인
      state.isLogged = true;
      state.role = action.payload.user.role;
      state.userId = action.payload.user.id;
      state.name = action.payload.user.name; // 사용자 이름 저장
      state.authToken = action.payload.token;
    },
    logout: (state) => {
      state.isLogged = false;
      state.role = "";
      state.userId = "";
      state.name = ""; // 초기화
      state.authToken = "";
    },
  },
});

export const { login, logout } = memberSlice.actions;
export default memberSlice.reducer;
