"use client"

/**
 * 세금 관련 상수
 * @constant
 */
const TAX_CONSTANTS = {
  SIMPLE_DEPOSIT: {
    GENERAL_TAX_RATE: 0.14,
    ADDITIONAL_TAX_RATE: 0.014,
    PRIVILEGED_TAX_RATE: 0.09,
    PRIVILEGED_ADDITIONAL_TAX_RATE: 0.005,
  },
  MONTHLY_SAVINGS: {
    TAX_RATE: 0.154,
    PRIVILEGED_TAX_RATE: 0.095,
  },
}

/**
 * 세금 계산 유틸리티
 * @param {number} beforeTax - 세전 이자 금액
 * @param {'general'|'privileged'} type - 세금 유형
 * @returns {number} 세후 이자 금액
 */
function calculateTaxedInterest(beforeTax: number, type: "general" | "privileged" = "general"): number {
  const constants = TAX_CONSTANTS.SIMPLE_DEPOSIT

  if (type === "general") {
    const generalTax = cutWon(
      cutWon(beforeTax * constants.GENERAL_TAX_RATE) + cutWon(beforeTax * constants.ADDITIONAL_TAX_RATE),
    )
    return beforeTax - generalTax
  } else {
    const privilegedTax = cutWon(
      cutWon(beforeTax * constants.PRIVILEGED_TAX_RATE) + cutWon(beforeTax * constants.PRIVILEGED_ADDITIONAL_TAX_RATE),
    )
    return beforeTax - privilegedTax
  }
}

/**
 * 단리 예금 계산
 * @param {number} period - 예금 기간 (개월)
 * @param {number} money - 예치금
 * @param {number} rate - 연간 이자율
 * @param {'0'|'1'} depositType - 예금 방식 (0: 복리, 1: 단리)
 * @returns {Array<Object>} 예금 계산 결과
 */
export function calculateDeposit(period: number, money: number, rate: number, depositType: "0" | "1") {
  let beforeTax = 0
  let result = []

  period = parseInt(String(period))
  money = parseInt(String(money))

  // 단리 계산
  if (depositType === "1") {
    beforeTax = parseInt(String(((money * (rate / 100)) / 12) * period))

    // 일반 과세
    const generalAfterTax = calculateTaxedInterest(beforeTax, "general")
    result.push({
      title: "일반",
      b_interest: Math.floor(beforeTax),
      a_interest: Math.floor(generalAfterTax),
      total_money: Math.floor(money + generalAfterTax),
      sum_mon: Math.floor(money + generalAfterTax - generalAfterTax),
    })

    // 비과세
    result.push({
      title: "비과세",
      b_interest: Math.floor(beforeTax),
      a_interest: Math.floor(beforeTax),
      total_money: Math.floor(money + beforeTax),
      sum_mon: Math.floor(money + beforeTax - beforeTax),
    })
  }
  // 복리 계산
  else {
    beforeTax = parseInt(String(money * Math.pow(1 + rate / 100 / 12, period))) - money

    // 일반 과세
    const generalAfterTax = calculateTaxedInterest(beforeTax, "general")
    result.push({
      title: "일반",
      b_interest: Math.floor(beforeTax),
      a_interest: Math.floor(generalAfterTax),
      total_money: Math.floor(money + generalAfterTax),
      sum_mon: Math.floor(money + generalAfterTax - generalAfterTax),
    })

    // 비과세
    result.push({
      title: "비과세",
      b_interest: Math.floor(beforeTax),
      a_interest: Math.floor(beforeTax),
      total_money: Math.floor(money + beforeTax),
      sum_mon: Math.floor(money + beforeTax - beforeTax),
    })
  }

  return result
}

/**
 * 월납입식 적금 계산
 * @param {number} period - 적금 기간
 * @param {number} money - 월 납입금
 * @param {number} rate - 연간 이자율
 * @returns {Array<Object>} 적금 계산 결과
 */
export function calculateMonthlyInstallment(period: number, money: number, rate: number) {
  let beforeTax = 0
  let tmp = 0

  period = parseInt(String(period))
  money = parseInt(String(money))

  for (let i = 1; i <= period; i++) {
    tmp = money * (period - i + 1) * (rate / 100 / 12)
    beforeTax += tmp
  }

  beforeTax = parseInt(String(beforeTax))

  // 일반 과세
  const generalAfterTax = beforeTax - cutWon(beforeTax * TAX_CONSTANTS.MONTHLY_SAVINGS.TAX_RATE)

  // 일반
  const result = [
    {
      title: "일반",
      b_interest: Math.floor(beforeTax),
      a_interest: Math.floor(generalAfterTax),
      total_money: Math.floor(money * period + generalAfterTax),
      sum_mon: Math.floor(money * period + generalAfterTax - generalAfterTax),
    },
    // 비과세
    {
      title: "비과세",
      b_interest: Math.floor(beforeTax),
      a_interest: Math.floor(beforeTax),
      total_money: Math.floor(money * period + beforeTax),
      sum_mon: Math.floor(money * period + beforeTax - beforeTax),
    },
  ]

  return result
}

/**
 * 소수점 아래 4번째 자리 절삭
 * @param {number} money - 절삭할 금액
 * @returns {number} 절삭된 금액
 */
export function cutWon(money: number): number {
  money = Number(money + 0.001)
  const chgstr = String(money)
  const retstr = chgstr.substring(0, chgstr.length - 1) + "0"
  return Number(retstr)
}

/**
 * 숫자에 천 단위 쉼표 추가
 * @param {string} money - 쉼표 추가할 금액 문자열
 * @returns {string} 쉼표가 추가된 금액 문자열
 */
export function addComma(money: string): string {
  const moneyN = Number(removeComma(money))
  if (moneyN === 0 || isNaN(moneyN)) return "0"

  return moneyN.toLocaleString("ko-KR")
}

/**
 * 쉼표 제거
 * @param {string} money - 쉼표 제거할 금액 문자열
 * @returns {string} 쉼표가 제거된 금액 문자열
 */
export function removeComma(money: string): string {
  return money.replace(/,/g, "")
}

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

/**
 * @description 쿠키에서 데이터 가져오기
 * @author 임광훈
 * @param name
 * @returns
 */
export const getCookie = (name: string) => {
  const cookies = document.cookie.split(";")
  const cookie = cookies.find((row) => row.startsWith(`${name}=`))
  return cookie ? JSON.parse(decodeURIComponent(cookie.split("=")[1])) : null
}

/**
 *  예금계산
 *  @param {number} period 예금 기간
 *  @param {number} money 예치금
 *  @param {number} rate 예금 이율
 *  @param {string} depositType 예금방법(1:단리,0:복리)
 *  @return {Object} 계산 결과 Obj
 */
export const fnCal1 = (
  period: number | string,
  money: number | string,
  rate: number,
  depositType: "1" | "0",
): object => {
  let result = []

  let model = {
    title: "", //구분
    sum_mon: "", //월납입액 합계
    b_interest: "", //이자(세금 전)
    a_interest: "", //이자(세금 후)
    total_money: "", //만기지급액
  }

  let before = 0 // 세전이자
  let after = 0 // 일반세후이자
  let primetaxmoney = 0 // 우대세금

  period = parseInt(period)
  money = parseInt(money)

  //단리 계산
  if (depositType == "1") {
    before = parseInt((money * (rate / 100)) / 12) // 세전이자
    after = before - cutWon(cutWon(before * 0.14) + cutWon(before * 0.014)) // 세후이자
    primetaxmoney = before - cutWon(cutWon(before * 0.09) + cutWon(before * 0.005)) // 세금우대

    //일반
    let title = "일반"
    let b_interest = Math.floor(before * period)
    let a_interest = Math.floor(after * period)
    let total_money = Math.floor(money + after * period)
    let sum_mon = Math.floor(total_money - a_interest)
    let model1 = {
      title,
      b_interest,
      a_interest,
      total_money,
      sum_mon,
    }
    result.push(model1)

    //비과세
    title = "비과세"
    b_interest = Math.floor(before * period)
    a_interest = Math.floor(before * period)
    total_money = Math.floor(money + before * period)
    sum_mon = Math.floor(total_money - a_interest)
    let model2 = {
      title,
      b_interest,
      a_interest,
      total_money,
      sum_mon,
    }
    result.push(model2)
  } else {
    before = parseInt(money * Math.pow(1 + rate / 100 / 12, period)) // 세전이자
    before = parseInt(before - money)
    after = before - cutWon(cutWon(before * 0.14) + cutWon(before * 0.014)) // 세후이자
    primetaxmoney = before - cutWon(cutWon(before * 0.09) + cutWon(before * 0.005)) // 세금우대

    //일반
    let title = "일반"
    let b_interest = Math.floor(before)
    let a_interest = Math.floor(after)
    let total_money = Math.floor(money + after)
    let sum_mon = Math.floor(total_money - a_interest)
    let model1 = {
      title,
      b_interest,
      a_interest,
      total_money,
      sum_mon,
    }
    result.push(model1)

    //비과세
    title = "비과세"
    b_interest = Math.floor(before)
    a_interest = Math.floor(before)
    total_money = Math.floor(money + before)
    sum_mon = Math.floor(total_money - a_interest)
    let model2 = {
      title,
      b_interest,
      a_interest,
      total_money,
      sum_mon,
    }
    result.push(model2)
  }

  return result
}

/**
 *  적금계산 - 월
 *  @param {number} period 예금 기간
 *  @param {number} money 예치금
 *  @param {number} rate 예금 이율
 *  @return {Object}
 */
export const fnCal2 = (period: number, money: number, rate: number): object => {
  let result = []

  let model = {
    title: "", //구분
    sum_mon: "", //월납입액 합계
    b_interest: "", //이자(세금 전)
    a_interest: "", //이자(세금 후)
    total_money: "", //만기지급액
  }

  let before = 0 // 세전이자
  let after = 0 // 일반세후이자
  let primetaxmoney = 0 // 우대세금

  let tmp = 0
  let tax = 9.5

  period = parseInt(period)
  money = parseInt(money)

  for (let i = 1; i <= period; i++) {
    tmp = money * (period - i + 1) * (rate / 100 / 12)
    before += tmp
  }
  before = parseInt(before)
  after = before - cutWon(before * 0.154) // 세후이자
  primetaxmoney = before - cutWon(before * 0.095) // 세금우대

  //일반
  let title = "일반"
  let b_interest = Math.floor(before)
  let a_interest = Math.floor(after)
  let total_money = Math.floor(money * period + after)
  let sum_mon = Math.floor(total_money - a_interest)
  let model1 = {
    title,
    b_interest,
    a_interest,
    total_money,
    sum_mon,
  }
  result.push(model1)

  //비과세
  title = "비과세"
  b_interest = Math.floor(before)
  a_interest = Math.floor(before)
  total_money = Math.floor(money * period + before)
  sum_mon = Math.floor(total_money - a_interest)
  let model2 = {
    title,
    b_interest,
    a_interest,
    total_money,
    sum_mon,
  }
  result.push(model2)

  return result
}

/**
 *  적금계산 - 만기
 *  @param {number} period 예금 기간
 *  @param {number} money 예치금
 *  @param {number} rate 예금 이율
 *  @return {Object}
 */
export const fnCal3 = (period, money, rate) => {
  let result = []

  let model = {
    title: "", //구분
    sum_mon: "", //월납입액 합계
    b_interest: "", //이자(세금 전)
    a_interest: "", //이자(세금 후)
    total_money: "", //만기지급액
  }

  let before = 0 // 세전이자
  let after = 0 // 일반세후이자
  let primetaxmoney = 0 // 우대세금

  let tmp = 0
  let tmp1 = 0

  period = parseInt(period)
  money = parseInt(money)
  rate = new Number(rate)
  rate = rate / 100

  for (let i = 1; i <= period; i++) {
    tmp = (period - i + 1) * (rate / 100 / 12)
    before += tmp
  }

  tmp = money / (period + before)
  tmp1 = tmp * before

  before = Math.round(
    (money * (1 + rate / 12) * (1 - Math.pow(1 + rate / 12, period))) / (1 - (1 + rate / 12)) - money * period,
  )

  //비과세
  let title = "비과세"
  let b_interest = before
  let a_interest = before
  let total_money = Math.floor(money * period + before)
  let sum_mon = Math.floor(total_money - a_interest)
  let model2 = {
    title,
    b_interest,
    a_interest,
    total_money,
    sum_mon,
  }

  //일반
  title = "일반"
  b_interest = before
  a_interest = Math.round(before * (1 - 0.154))
  total_money = Math.floor(money * period + a_interest)
  sum_mon = Math.floor(total_money - a_interest)
  let model1 = {
    title,
    b_interest,
    a_interest,
    total_money,
    sum_mon,
  }

  result.push(model1)
  result.push(model2)

  return result
}

/**
 * bankCalcUtils
 *  대출계산기
 *  @param {number} loanType 대출 방법(0:원금만기일시상환,1:원금균등상환,2:원리금균등상환)
 *  @param {number} originMoney 대출원금
 *  @param {number} loanPeriod 대출기간
 *  @param {number} holdingPeriod 거치기간
 *  @param {number} loanRate 대출이율
 *  @return {Object}
 */
export const fnCal4 = (loanType, originMoney, loanPeriod, holdingPeriod, loanRate) => {
  loanRate = loanRate / 100
  originMoney = originMoney * 1
  loanPeriod = loanPeriod * 1
  holdingPeriod = holdingPeriod * 1
  loanRate = loanRate * 1

  let result = {
    //원금
    originMoney: originMoney,
    //빌린기간
    loanPeriod: loanPeriod,
    //거치기간
    holdingPeriod: holdingPeriod,
    //이자율
    loanRate: loanRate,
    //원금만기일시산환일 경우:월평균이자,원금균등상환일경우:월납입원금,원리금균등산환일경우:월상환금액
    repaymentMoney: 0,
    //총 이자액
    interestMoney: 0,
    //원금 및 총이자액 합계
    totalMoney: 0,
    /*
      index: 회차 - 1
      row.repaymentTotalMoney:상환금
      row.repaymentOriginMoney:납입원금
      row.repaymentInterestMoney:이자
      row.repaymentOriginMoneySum:납입원금누계
      row.remainMoney:잔금
      */
    table: [],
  }

  //계산결과
  let monthlyLoan = 0 //월상환금
  let totalInterest = 0 //총이자
  let loanAndInterest = 0 //원금및이자

  let interest = 0 //이자
  let repaymentOriginMoney = 0 //납입원금
  let repayment = 0 //상환금

  let originRepaymentTotal = 0 //납입원금 누계
  let remainMoney = originMoney //잔금

  for (let i = 0; i < loanPeriod; i++) {
    interest = calcInterest(loanType, i, originMoney, loanRate, remainMoney)
    totalInterest = totalInterest + interest

    if (loanType == "2") {
      repayment = calcRepayment(
        loanType,
        repaymentOriginMoney,
        interest,
        loanRate,
        loanPeriod,
        holdingPeriod,
        originMoney,
        i,
      )
      if (i >= holdingPeriod) {
        //거치기간 후부터 계산
        repaymentOriginMoney = calcOriginLoanMoney(
          loanType,
          i,
          loanPeriod,
          originMoney,
          holdingPeriod,
          repayment,
          interest,
        )
      }
    } else {
      if (i >= holdingPeriod) {
        //거치기간 후부터 계산
        repaymentOriginMoney = calcOriginLoanMoney(
          loanType,
          i,
          loanPeriod,
          originMoney,
          holdingPeriod,
          repayment,
          interest,
        )
      }
      repayment = calcRepayment(
        loanType,
        repaymentOriginMoney,
        interest,
        loanRate,
        loanPeriod,
        holdingPeriod,
        originMoney,
        i,
      )
    }
    originRepaymentTotal = originRepaymentTotal + repaymentOriginMoney
    remainMoney = originMoney - originRepaymentTotal

    const repaymentTotalMoney = Math.round(repayment)
    repaymentOriginMoney = Math.round(repaymentOriginMoney)
    const repaymentInterestMoney = Math.round(interest)
    const repaymentOriginMoneySum = Math.round(originRepaymentTotal)
    remainMoney = Math.round(remainMoney)
    let row = {
      repaymentTotalMoney,
      repaymentOriginMoney,
      repaymentInterestMoney,
      repaymentOriginMoneySum,
      remainMoney,
    }

    result.table.push(row)
  }

  if (loanType == "0") {
    monthlyLoan = totalInterest / loanPeriod
  } else if (loanType == "1") {
    monthlyLoan = repaymentOriginMoney / (loanPeriod - holdingPeriod)
  } else if (loanType == "2") {
    monthlyLoan = (repaymentOriginMoney * loanRate) / 12
    monthlyLoan = monthlyLoan * Math.pow(1 + loanRate / 12, loanPeriod - holdingPeriod)
    monthlyLoan = monthlyLoan / (Math.pow(1 + loanRate / 12, loanPeriod - holdingPeriod) - 1)
  }
  loanAndInterest = repaymentOriginMoney + totalInterest

  result.repaymentMoney = Math.round(monthlyLoan)
  result.interestMoney = Math.round(totalInterest)
  result.totalMoney = Math.round(loanAndInterest)

  return result
}

/**
 * 이자계산 로직
 * @param {string} loanType 대출 방법(0:원금만기일시상환,1:원금균등상환,2:원리금균등상환)
 * @param {string} i 대출 개월수
 * @param {string} originMoney 원금
 * @param {string} loanRate 대출 이율
 * @param {string} remainLoan 남은 대출금액
 * @return {number} 이달에 발생한 이자
 */
export const calcInterest = (loanType, i, originMoney, loanRate, remainLoan) => {
  //이자
  let result = 0
  if (loanType == "0") {
    //원금만기일시상환
    //$I$8*$J$26/12
    result = (originMoney * loanRate) / 12
  } else if (loanType == "1") {
    //원금균등상환
    if (i == 0) {
      //$I$8*$J$26/12
      result = (originMoney * loanRate) / 12
    } else {
      //N28*$J$26/12
      result = (remainLoan * loanRate) / 12
    }
  } else if (loanType == "2") {
    //원리금균등상환
    if (i == 0) {
      //$I$8*$J$26/12
      result = (originMoney * loanRate) / 12
    } else {
      //N28*$J$26/12
      result = (remainLoan * loanRate) / 12
    }
  }
  return result
}

/**
 *    납입원금 계산
 * @param {string} loanType 대출 방법(0:원금만기일시상환,1:원금균등상환,2:원리금균등상환)
 * @param {string} i 대출 개월수
 * @param {string} loanPeriod 대출기간
 * @param {string} originMoney 원금
 * @param {string} holdingPeriod 거치기간
 * @param {string} repaymentMoney 상환금액
 * @param {string} interest 이자
 * @return {number} 납입한 원금
 */
export const calcOriginLoanMoney = (loanType, i, loanPeriod, originMoney, holdingPeriod, repaymentMoney, interest) => {
  let result = 0
  if (loanType == "0") {
    //원금만기일시상환
    if (i == loanPeriod - 1) {
      //마지막라인인경우
      result = originMoney
    }
  } else if (loanType == "1") {
    //원금균등상환
    //$I$8/($I$11-$I$14)
    result = originMoney / (loanPeriod - holdingPeriod)
  } else if (loanType == "2") {
    //원리금균등상환
    result = repaymentMoney - interest
  }
  return result
}

/**
 *    상환금 계산
 * @param {string} loanType 대출 방법(0:원금만기일시상환,1:원금균등상환,2:원리금균등상환)
 * @param {string} repaymentOriginMoney 상환 원금
 * @param {string} interest 대출 이자
 * @param {string} loanRate 대출 이율
 * @param {string} loanPeriod 대출기간
 * @param {string} holdingPeriod 거치기간
 * @param {string} originMoney 원금
 * @param {string} i 대출 개월수
 * @return {number} 상환할 금액
 */
export const calcRepayment = (
  loanType,
  repaymentOriginMoney,
  interest,
  loanRate,
  loanPeriod,
  holdingPeriod,
  originMoney,
  i,
) => {
  let result = 0

  repaymentOriginMoney = repaymentOriginMoney * 1
  interest = interest * 1
  loanRate = loanRate * 1
  loanPeriod = loanPeriod * 1
  holdingPeriod = holdingPeriod * 1
  originMoney = originMoney * 1

  if (loanType == "0") {
    //원금만기일시상환
    result = repaymentOriginMoney + interest
  } else if (loanType == "1") {
    //원금균등상환
    result = repaymentOriginMoney + interest
  } else if (loanType == "2") {
    //원리금균등상환
    if (i >= holdingPeriod) {
      //거치기간 후부터 계산
      //($I$8*$J$26/12*(1+$J$26/12)^($I$11-$I$14))/((1+$J$26/12)^($I$11-$I$14)-1)
      result = ((originMoney * loanRate) / 12) * Math.pow(1 + loanRate / 12, loanPeriod - holdingPeriod)
      result = result / (Math.pow(1 + loanRate / 12, loanPeriod - holdingPeriod) - 1)
    } else {
      result = repaymentOriginMoney + interest
    }
  }
  return result
}
