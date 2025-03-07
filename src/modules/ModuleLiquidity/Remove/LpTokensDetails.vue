<script setup lang="ts">
import { buildPair, TOKEN_TYPES } from '@/utils/pair'
import { storeToRefs } from 'pinia'
import { LP_TOKEN_DECIMALS } from '@/core'
import { formatCurrency } from '@/utils/composable.currency-input'
import cssRows from '../../ModuleTradeShared/rows.module.scss'

const store = useLiquidityRmStore()
const {
  selectedTokensData,
  pairReserves,
  pairUserBalance,
  selectedTokensSymbols: symbols,
  formattedPoolShare,
} = storeToRefs(store)

const formattedReserves = computed(() => {
  const reserves = unref(pairReserves)
  const tokensData = unref(selectedTokensData)
  if (!reserves || !tokensData) return null
  return buildPair((type) => {
    const wei = reserves[type === 'tokenA' ? 'reserve0' : 'reserve1']
    const data = tokensData[type]!
    return formatCurrency({ amount: wei.decimals(data) })
  })
})

const formattedPoolTokens = computed(() => {
  const wei = unref(pairUserBalance)
  if (!wei) return null
  return formatCurrency({ amount: wei.decimals({ decimals: LP_TOKEN_DECIMALS }) })
})
</script>

<template>
  <KlayCollapse v-if="symbols">
    <template #head>
      <h3 class="py-2">
        LP tokens details
      </h3>
    </template>
    <template #main>
      <div class="space-y-4 pb-2 pt-4">
        <div
          v-for="token in TOKEN_TYPES"
          :key="token"
          :class="cssRows.rowMd"
        >
          <span>Pooled {{ symbols[token] }}</span>
          <span>
            <ValueOrDash :value="formattedReserves?.[token]" />
          </span>
        </div>

        <div :class="cssRows.rowMd">
          <span>Your pool tokens:</span>
          <span>
            <ValueOrDash :value="formattedPoolTokens" />
          </span>
        </div>

        <div :class="cssRows.rowMd">
          <span>Your pool share:</span>
          <span>
            <ValueOrDash :value="formattedPoolShare" />
          </span>
        </div>
      </div>
    </template>
  </KlayCollapse>
</template>

<style lang="scss" scoped>
h3 {
  font-size: 14px;
}
</style>
