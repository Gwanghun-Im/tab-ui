// app/store/reducers/customAlertSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomAlertState {
  open:boolean
  title: string
  reLogin?: boolean
  message: string
  confirmText?: string
  cancleText?: string
  onConfirm?(): void
  onCancle?(): void
}

const initialState: CustomAlertState = {
  open: false,
  title: "",
  message: "",
  confirmText: "확인",
  cancleText: "취소"
};

const customAlertSlice = createSlice({
  name: "customAlert",
  initialState,
  reducers: {
    openAlert(state: CustomAlertState, action: PayloadAction<CustomAlertState>) {
      state.open = true
      state.title = action.payload.title
      state.reLogin = action.payload.reLogin
      state.message = action.payload.message
      state.confirmText = action.payload.confirmText
      state.onConfirm = action.payload.onConfirm
      state.onCancle = action.payload.onCancle
    },
    hideAlert(state: CustomAlertState) {
      state.open = false
    },
  },
});

// export const getCustomAlert = (state: any) => state.customAlert
export const { openAlert, hideAlert } = customAlertSlice.actions;
export default customAlertSlice.reducer;