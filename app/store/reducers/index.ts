// app/store/reducers/index.ts
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import customAlert from "./customAlert";

// 리듀서를 결합
const rootReducer = combineReducers({
  user: userReducer,
  customAlert: customAlert,
});

export type RootState = ReturnType<typeof rootReducer>; // RootState 타입 정의
export default rootReducer;