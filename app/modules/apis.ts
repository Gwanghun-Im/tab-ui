"use client"

import { ApiResponseTypes, defaultApiService, setContentOptions, setRequestError } from "./api-base"

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

export const defaultFetchApiService = (options: any): Promise<ApiResponseTypes> =>
  defaultApiService(setContentOptions(options))
