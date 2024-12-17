import axios from "axios"
import { headers } from "next/headers"

export const defSet: {
  timeOut: number
} = {
  timeOut:40000
}

export const setBaseOptions = (option:object) => {
  const options = {
    ...option,
    headers: {},
    timeout: defSet.timeOut
  }

  return options
}

export const defaultApiService = axios.create({...setBaseOptions({})})