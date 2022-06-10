<script>
export default {
  name: 'KlaytnWrap',
  props: {
    active: {
      type: String,
    },
  },
}
</script>

<template>
  <div class="wrap">
    <div class="head">
      <slot name="head">
        <RouterLink to="/trade" class="head--btn" active-class="head--btn-active">
          Swap
        </RouterLink>
        <RouterLink to="/liquidity" class="head--btn" active-class="head--btn-active">
          Liquidity
        </RouterLink>
      </slot>
      <button class="head--btn head--btn-left">
        <Icon name="refresh" />
      </button>
      <button class="head--btn">
        <Icon name="filters" />
      </button>
    </div>

    <slot />
  </div>
</template>

<style lang="scss" scoped src="./index.scss"></style>
