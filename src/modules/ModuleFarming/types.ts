import { Address, WeiAsToken } from '@/core'
import BigNumber from 'bignumber.js'
import { PercentageRate, PoolId, TokenPriceInUSD } from '../ModuleEarnShared/types'
export * from '../ModuleEarnShared/types'

export interface Pool {
  id: PoolId
  name: string
  pairId: Address
  staked: WeiAsToken<BigNumber>
  earned: WeiAsToken<BigNumber>
  balance: WeiAsToken<BigNumber>
  annualPercentageRate: PercentageRate
  lpAnnualPercentageRate: PercentageRate
  stakeTokenPrice: TokenPriceInUSD
  liquidity: WeiAsToken<BigNumber>
  multiplier: BigNumber
  createdAtBlock: number
}

export const Sorting = {
  Default: 'default',
  Liquidity: 'liquidity',
  AnnualPercentageRate: 'annualPercentageRate',
  Multiplier: 'multiplier',
  Earned: 'earned',
  Latest: 'latest',
} as const

export type Sorting = typeof Sorting[keyof typeof Sorting]
