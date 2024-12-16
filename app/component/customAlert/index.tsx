"use client"

import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { hideAlert } from "@/app/store/reducers/customAlert"

const CustomAlert = () => {
  const dispatch = useAppDispatch()
  const {open, title, message, confirmText, cancleText, onConfirm, onCancle} = useAppSelector(state => state.customAlert)

  const handleConfirm = () => {
    onConfirm?.()
    dispatch(hideAlert())
  }

  const handleCancle = () => {
    onCancle?.()
    dispatch(hideAlert())
  }

  return (
    <>
      <div hidden={open}>
        <div className="header">{title}</div>
        <div className="message">{message}</div>
        <div className="footer">
          <div className="confirm" onClick={handleConfirm}>{confirmText}</div>
          <div className="cancle" onClick={handleCancle}>{cancleText}</div>
        </div>
      </div>
    </>
  )
}

export default CustomAlert