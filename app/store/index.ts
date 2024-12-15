// app/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>; // RootState 타입 가져오기
export type AppDispatch = typeof store.dispatch; // Dispatch 타입 정의
export default store;