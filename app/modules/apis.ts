"use client"

import { defaultApiService } from "./api-base"

defaultApiService.interceptors.request.use(
  config => { return config },
  error => () => {},
)

defaultApiService.interceptors.response.use(
  async config => {return config},
  async error => () => {},
)