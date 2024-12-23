import axios from "axios"
import { headers } from "next/headers"

export interface ApiResponseTypes {
  message: string
  messageCode: string
  data: any
  result: "SUCCESS" | "FAIL"
  bizException: boolean
}

export const FetchType = {
  DF: "default",
}
export type FetchTypes = (typeof FetchType)[keyof typeof FetchType]

export const defSet: {
  timeOut: number
  defaultUrl: string
} = {
  timeOut: 40000,
  defaultUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
}

export const setBaseOptions = (apiType: FetchTypes) => {
  const options = {
    apiType,
    headers: {},
    timeout: defSet.timeOut,
  }

  return options
}

export const setContentOptions = (options: any): any => {
  const contentType = options["contentType"] && options["contentType"].toUpperCase()
  if (!options["headers"]) options.headers = {}
  if (!options?.headers["Content-Type"]) {
    switch (contentType) {
      case "FORM":
        options.headers["Content-type"] = "application/x-www-form-urlencoded"
        break
      case "FILE":
        options.headers["Content-type"] = "multipart/form-data"
        break
      case "BLOB":
        options.headers["Content-type"] = "application/json;charset=UTF-8"
        break
      default:
        options.headers["Content-type"] = "application/json"
        break
    }
  }

  options.validateStatus = (status: number): boolean => {
    return status >= 200 && status < 500
  }

  return options
}

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

export const defaultApiService = axios.create({ ...setBaseOptions(FetchType.DF) })
