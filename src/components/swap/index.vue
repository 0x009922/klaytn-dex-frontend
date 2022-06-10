<script>
import { mapActions, mapState } from 'pinia'
import { useSwapStore } from '@/store/swap'
import { useTokensStore } from '@/store/tokens'

export default {
  name: 'KlaySwap',
  data() {
    return {
      isSwapLoading: false,
    }
  },
  computed: {
    ...mapState(useSwapStore, [
      'pairNotExist',
      'exchangeRateIntervalID',
      'exchangeRateLoading',
    ]),
    ...mapState(useTokensStore, [
      'selectedTokens',
      'tokensList',
      'computedToken',
    ]),
    isLoading() {
      return !this.tokensList?.length
    },
    isValidTokens() {
      return (
        !this.isSwapLoading
        && !this.selectedTokens.emptyPair
        && Number(this.selectedTokens.tokenA?.balance) >= 0
        && Number(this.selectedTokens.tokenB?.balance) >= 0
      )
    },
  },
  beforeUnmount() {
    this.refreshStore()
    this.clearSelectedTokens()
  },
  methods: {
    ...mapActions(useSwapStore, [
      'swapExactTokensForTokens',
      'swapTokensForExactTokens',
      'swapForKlayTokens',
      'refreshStore',
      'setExchangeRateIntervalID',
    ]),
    ...mapActions(useTokensStore, [
      'clearSelectedTokens',
    ]),
    async swapTokens() {
      try {
        this.isSwapLoading = true
        const isWKLAY
          = this.$kaikas.utils.isNativeToken(this.selectedTokens.tokenA.address)
          || this.$kaikas.utils.isNativeToken(this.selectedTokens.tokenB.address)

        if (isWKLAY)
          await this.swapForKlayTokens()

        if (this.computedToken === 'tokenB' && !isWKLAY)
          await this.swapExactTokensForTokens()

        if (this.computedToken === 'tokenA' && !isWKLAY)
          await this.swapTokensForExactTokens()

        if (this.exchangeRateIntervalID) {
          clearInterval(this.exchangeRateIntervalID)
          this.setExchangeRateIntervalID(null)
        }
      }
      catch (e) {}
      this.isSwapLoading = false
    },
    onRefresh() {
      this.refreshStore()
    },
  },
}
</script>

<template>
  <div v-if="isLoading" class="wrap">
    <div class="head">
      <button class="head--btn head--btn-active">
        Swap
      </button>
      <button class="head--btn">
        Liquidity
      </button>
      <button class="head--btn head--btn-left" @click="onRefresh">
        <Icon name="refresh" />
      </button>
      <button class="head--btn">
        <Icon name="filters" />
      </button>
    </div>
    <div class="load">
      <Loader />
    </div>
  </div>

  <Wrap v-else>
    <SwapExchangeRate />

    <div class="slippage">
      <Slippage />
    </div>

    <Button :disabled="!isValidTokens" @click="swapTokens">
      {{ isSwapLoading ? "Wait" : "Swap" }}
    </Button>

    <SwapDetails />

    <div v-if="exchangeRateLoading">
      Exchange rate loading
    </div>

    <div v-if="pairNotExist">
      Pair doesn't exist
    </div>
  </Wrap>
</template>

<style lang="scss" scoped src="./index.scss" />
