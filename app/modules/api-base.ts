import axios from "axios"
import { headers } from "next/headers"

export const defSet: {
  timeOut: number
  defaultUrl: string
} = {
  timeOut: 40000,
  defaultUrl: process.env.NEXT_PUBLIC_API_URL,
}

export const setBaseOptions = (option: object) => {
  const options = {
    ...option,
    headers: {},
    timeout: defSet.timeOut,
  }

  return options
}

export const defaultApiService = axios.create({ ...setBaseOptions({}) })

const axiosInstance = axios.create({
  baseURL: "https://api.example.com", // API의 기본 URL
})

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

const refreshToken = async (): Promise<string> => {
  // 실제 토큰 갱신 요청을 보내는 부분
  const response = await axios.post("/auth/refresh-token")
  const newToken = response.data.token
  // 새 토큰을 로컬 스토리지나 상태 관리 라이브러리에 저장
  localStorage.setItem("token", newToken)
  return newToken
}

// 응답 인터셉터
export const setRequestError = async (error: any) => {
  const originalRequest = error.config
  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      // 토큰 갱신 중이라면 대기
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          resolve(axiosInstance(originalRequest))
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const newToken = await refreshToken()
      isRefreshing = false
      onRefreshed(newToken)
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return axiosInstance(originalRequest)
    } catch (err) {
      isRefreshing = false
      return Promise.reject(err)
    }
  }
  return Promise.reject(error)
}

export default axiosInstance
