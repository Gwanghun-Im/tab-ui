"use client"

/**
 * @description 문자열 textarea로 인코딩
 * @author 임광훈
 * @param str
 * @returns
 */
export const encodeHtmlEntities = (str: string) => {
  const textarea = document.createElement("textarea")
  textarea.innerHTML = str
  return textarea.textContent
}

/**
 * @description Json객체 textarea로 인코딩
 * @author 임광훈
 * @param data
 * @returns
 */
export const encodeJsonData = (data: any): any => {
  if (typeof data === "string") {
    return encodeHtmlEntities(data)
  } else if (Array.isArray(data)) {
    return data.map(encodeJsonData)
  } else if (typeof data === "object") {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value ? encodeJsonData(data) : value]))
  }
  return data
}
