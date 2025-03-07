import { describe, test, expect } from 'vitest'
import { computeFeesByAmounts } from './utils'
import { WHITELIST_TOKENS, Wei, Percent } from '@/core'

describe('Compute fees', () => {
  test('Single swap', () => {
    const path = WHITELIST_TOKENS.slice(0, 2)
    const amounts = [new Wei(1000), new Wei(2000)]

    expect(computeFeesByAmounts({ amounts, path, commission: new Percent(3, 1000) })).toMatchInlineSnapshot(`
      [
        {
          "fee": "3",
          "pair": [
            {
              "address": "0x73365f8f27de98d7634be67a167f229b32e7bf6c",
              "decimals": 18,
              "name": "KLAY",
              "symbol": "KLAY",
            },
            {
              "address": "0x42f127458246b1db8d8a58d31a22b307408439e4",
              "decimals": 18,
              "name": "DEX Token",
              "symbol": "DEX",
            },
          ],
        },
      ]
    `)
  })

  test('Multi-step swap', () => {
    const path = WHITELIST_TOKENS.slice(0, 3)
    const amounts = [new Wei(1000), new Wei(2000), new Wei(3000)]

    expect(computeFeesByAmounts({ amounts, path, commission: new Percent(1, 10) })).toMatchInlineSnapshot(`
      [
        {
          "fee": "100",
          "pair": [
            {
              "address": "0x73365f8f27de98d7634be67a167f229b32e7bf6c",
              "decimals": 18,
              "name": "KLAY",
              "symbol": "KLAY",
            },
            {
              "address": "0x42f127458246b1db8d8a58d31a22b307408439e4",
              "decimals": 18,
              "name": "DEX Token",
              "symbol": "DEX",
            },
          ],
        },
        {
          "fee": "200",
          "pair": [
            {
              "address": "0x42f127458246b1db8d8a58d31a22b307408439e4",
              "decimals": 18,
              "name": "DEX Token",
              "symbol": "DEX",
            },
            {
              "address": "0xb9920BD871e39C6EF46169c32e7AC4C698688881",
              "decimals": 18,
              "name": "Mercury",
              "symbol": "MER",
            },
          ],
        },
      ]
    `)
  })

  test("Throws an error if the amounts count doesn't match the path's length", () => {
    expect(() =>
      computeFeesByAmounts({ amounts: [], path: WHITELIST_TOKENS.slice(0, 3), commission: new Percent(0) }),
    ).toThrow()
  })
})
