<script>
import { mapActions, mapState } from 'pinia'
import { useTokensStore } from '@/store/tokens'
import { useLiquidityStore } from '@/store/liquidity'

export default {
  data() {
    return {
      active: 'amount',
    }
  },
  computed: {
    ...mapState(useTokensStore, ['selectedTokens']),
    ...mapState(useLiquidityStore, ['removeLiquidityPair']),
  },
  methods: {
    ...mapActions(useLiquidityStore, ['removeLiquidity']),
    getFormattedValue(_v) {
      if (!_v)
        return '-'

      const bn = new this.$kaikas.bigNumber($kaikas.fromWei(_v))

      return Number(bn.toFixed(4))
    },
  },
}
</script>

<template>
  <div class="rl--wrap">
    <div class="switch">
      <div
        class="switch--item"
        :class="{ 'switch--item-active': active === 'amount' }"
        @click="active = 'amount'"
      >
        Amount
      </div>
      <div
        class="switch--item"
        :class="{ 'switch--item-active': active === 'detailed' }"
        @click="active = 'detailed'"
      >
        Detailed
      </div>
    </div>

    <LiquidityRemoveAmount v-if="active === 'amount'" />
    <LiquidityRemoveDetailed v-if="active === 'detailed'" />

    <Button type="button" class="mt" @click="removeLiquidity">
      Remove
    </Button>

    <div class="mt">
      <Collapse>
        <template #head>
          <div class="rl--collapse-label">
            LP tokens details
          </div>
        </template>
        <template #main>
          <div
            v-if="selectedTokens.tokenA && selectedTokens.tokenB"
            class="rl--row"
          >
            <div>{{ selectedTokens.tokenA.symbol }}</div>
            <div>
              {{
                removeLiquidityPair.amount0
                  && getFormattedValue(removeLiquidityPair.amount0)
              }}
            </div>
          </div>
          <div class="rl--row">
            <div>{{ selectedTokens.tokenB.symbol }}</div>
            <div>
              {{
                removeLiquidityPair.amount1
                  && getFormattedValue(removeLiquidityPair.amount1)
              }}
            </div>
          </div>
          <div
            v-if="selectedTokens.tokenA && selectedTokens.tokenB"
            class="rl--row"
          >
            <div>
              {{ selectedTokens.tokenA.symbol }} per
              {{ selectedTokens.tokenB.symbol }}
            </div>
            <div>-</div>
          </div>
          <div class="rl--row">
            <div>
              {{ selectedTokens.tokenB.symbol }} per
              {{ selectedTokens.tokenA.symbol }}
            </div>
            <div>-</div>
          </div>
        </template>
      </Collapse>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./index.scss" />
