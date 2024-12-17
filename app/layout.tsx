// app/layout.tsx
import { ReactNode } from "react"
import { Provider } from "react-redux"
import store from "./store" // Redux store 경로를 확인하세요
import CustomAlert from "./component/customAlert"

interface RootLayoutProps {
  children: ReactNode // children의 타입을 명시적으로 지정
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {children}
          <CustomAlert />
        </Provider>
      </body>
    </html>
  )
}
