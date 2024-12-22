// components/atoms/Button.tsx
import React from "react"
import styles from "./Button.module.css"

type ButtonProps = {
  label: string // 버튼에 표시할 텍스트
  onClick?: () => void // 클릭 이벤트 핸들러
  variant?: "primary" | "secondary" | "tertiary" // 버튼 스타일
  disabled?: boolean // 버튼 비활성화 여부
  size?: "small" | "medium" | "large" // 버튼 크기
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = "primary", disabled = false, size = "medium" }) => {
  const classNames = `${styles.button} ${styles[variant]} ${styles[size]}`

  return (
    <button className={classNames} onClick={onClick} disabled={disabled} aria-disabled={disabled}>
      {label}
    </button>
  )
}

export default Button
