import { Wei } from '@/core'
import { Tab } from '@/types'
import { Serializer } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import rfdc from 'rfdc'
import { roundTo } from 'round-to'
import { JsonValue } from 'type-fest'
import { TokensPair } from './pair'

const reallyFastDeepClone = rfdc()

export function deepClone<T>(object: T): T {
  return reallyFastDeepClone(object)
}

export function arrayEquals<T>(a: T[], b: T[]): boolean {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index])
}

export function stringHashForHsl(str: string): number {
  return [...str].reduce((a, c) => {
    const h = c.charCodeAt(0) + ((a << 4) - a)
    return h % 360
  }, 0)
}

/**
 * Snake-case seems more suitable here
 */
export interface Rates {
  a_per_b: number
  b_per_a: number
}

export type RatesRounded = {
  [K in keyof Rates]: number
}

export function computeRates(pair: TokensPair<Wei>): Rates {
  const a_per_b = pair.tokenA.asBigNum.dividedBy(pair.tokenB.asBigNum).toNumber()
  const b_per_a = 1 / a_per_b
  return { a_per_b, b_per_a }
}

export function roundRates({ a_per_b, b_per_a }: Rates): RatesRounded {
  return {
    a_per_b: roundTo(a_per_b, 7),
    b_per_a: roundTo(b_per_a, 7),
  }
}

// export function computePriceImpact(midPrice: Price, inputAmount: TokenAmount, outputAmount: TokenAmount): Percent {
//   const feeCoefficient = new Fraction(1).plus(POOL_COMMISSION)
//   const exactQuote = TokenAmount.fromToken(
//     outputAmount.token,
//     midPrice
//       .toFraction()
//       .dividedBy(feeCoefficient)
//       .multipliedBy(inputAmount.toFraction())
//       .toFixed(outputAmount.currency.decimals) as WeiAsToken,
//   )
//   const slippage = exactQuote.minus(outputAmount).dividedBy(exactQuote)
//   return new Percent(slippage.numerator, slippage.denominator)
// }

/**
 * Serializer for {@link @vueuse/core#useLocalStorage()}
 */
export const JSON_SERIALIZER: Serializer<JsonValue> = {
  read: (raw) => JSON.parse(raw),
  write: (parsed) => JSON.stringify(parsed),
}

export function nonNullSet<T>(values: (null | undefined | T)[]): Set<T> {
  const set = new Set<T>()
  for (const val of values) {
    if (val !== null && val !== undefined) set.add(val)
  }
  return set
}

export function shortenStringInTheMiddle(string: string) {
  const stringLength = string.length
  return `${string.slice(2, 6)}...${string.slice(stringLength - 6, stringLength - 2)}`
}

export function makeTabsArray(data: string[]): Tab[] {
  return data.map((item) => ({
    id: item,
    label: item,
  }))
}

export function formatNumberWithCommas(value: string | number | BigNumber): string {
  return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}
