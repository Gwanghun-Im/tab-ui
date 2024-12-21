"use client"

import { defaultApiService, setRequestError } from "./api-base"

defaultApiService.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => setRequestError,
)

defaultApiService.interceptors.response.use(
  async (config) => {
    return config
  },
  async (error) => () => {},
)
