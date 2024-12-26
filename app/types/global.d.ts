// lodash 모듈 타입 가져오기
import _ from "lodash"

// globalThis에 _를 추가
declare global {
  var _: typeof _
}

export {} // 모듈로 간주되도록 하기 위한 선언
