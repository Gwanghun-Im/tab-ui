// app/store/reducers/index.ts
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

// 리듀서를 결합
const rootReducer = combineReducers({
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>; // RootState 타입 정의
export default rootReducer;