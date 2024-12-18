import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage를 사용
import { counterSlice } from './countSlice';
import memberReducer from './memberSlice';

// persist 설정
const persistConfig = {
  key: 'member', // 저장될 키 이름
  storage,
};

// memberReducer를 persistReducer로 감싸기
const persistedMemberReducer = persistReducer(persistConfig, memberReducer);

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    member: persistedMemberReducer, // 변경된 reducer 사용
  },
});

// Persistor 생성
export const persistor = persistStore(store);
