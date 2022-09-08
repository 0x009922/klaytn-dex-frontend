import { TokenImpl, TokenAmount, Trade, Pair, Wei } from '@/core'
import { BestTradePropsBase } from '@/core/entities/Trade'
import { TokensPair, TokenType } from '@/utils/pair'
import { MaybeRef } from '@vueuse/core'
import { ComputedRef } from 'vue'

interface UseTradeProps {
  tokens: TokensPair<TokenImpl | null>
  pairs: MaybeRef<Pair[] | null>
  amount: MaybeRef<{
    for: TokenType
    wei: Wei
  } | null>
}

export type UseTradeResult =
  | {
      kind: 'empty'
    }
  | {
      kind: 'exist'
      trade: Trade
    }

const MAX_HOPS = 4

const MAX_NUM_RESULTS = 5

export function useTrade(props: UseTradeProps): ComputedRef<UseTradeResult | null> {
  return computed(() => {
    const pairs = unref(props.pairs)
    const { tokenA: inputToken, tokenB: outputToken } = props.tokens
    const { for: amountFor, wei: amountWei } = unref(props.amount) ?? {}

    if (!pairs || !inputToken || !outputToken || !amountWei || !amountFor) return null

    const baseProps: BestTradePropsBase = { pairs, maxHops: MAX_HOPS, maxNumResults: MAX_NUM_RESULTS }

    try {
      const trades =
        amountFor === 'tokenB'
          ? Trade.bestTrade({
              tradeType: 'exact-in',
              amountIn: TokenAmount.fromWei(inputToken, amountWei),
              tokenOut: outputToken,
              ...baseProps,
            })
          : Trade.bestTrade({
              tradeType: 'exact-out',
              amountOut: TokenAmount.fromWei(outputToken, amountWei),
              tokenIn: inputToken,
              ...baseProps,
            })

      const trade = trades.at(0)

      if (!trade) return { kind: 'empty' }

      return {
        trade,
        kind: 'exist',
      }
    } catch (err) {
      console.error('Failed to compute trade:', err)
      return { kind: 'empty' }
    }
  })
}
