<script>
import { mapActions, mapState } from 'pinia'
import { useTokensStore } from '@/store/tokens'

export default {
  computed: {
    ...mapState(useTokensStore, ['selectedTokens']),
    isValid() {
      return this.selectedTokens?.tokenA && this.selectedTokens?.tokenB
    },
  },
  methods: {
    ...mapActions(useTokensStore, ['tokens/setSelectedTokensByPair']),
  },
  beforeMount() {
    this.setSelectedTokensByPair(this.$route.params.id)
  },
}
</script>

<template>
  <Wrap>
    <template #head>
      <RouterLink to="/liquidity" class="back">
        <Icon name="back-arrow" />
        <span v-if="isValid">
          Remove
          {{ selectedTokens.tokenA.symbol }}-{{ selectedTokens.tokenB.symbol }}
          liquidity
        </span>
      </RouterLink>
    </template>
    <template>
      <div class="add-liq">
        <LiquidityRemove v-if="isValid" />
        <div v-else class="loader-wrapper">
          <Loader />
        </div>
      </div>
    </template>
  </Wrap>
</template>

<style lang="scss" scoped>
.loader-wrapper {
  margin: 20px auto;
  width: min-content;
}
.back {
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  color: $dark2;
  display: flex;
  align-items: center;

  & span {
    margin-left: 11px;
  }
}
</style>
