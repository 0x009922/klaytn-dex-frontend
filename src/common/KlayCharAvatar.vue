<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    content: string
    saturation?: number
    lightness?: number
  }>(),
  {
    saturation: 80,
    lightness: 70
  },
)

const firstCapital = computed(() => props.content?.slice(0, 1).toUpperCase())

const hslGenerator = (str: string, s: number, l: number) => {
  const [...strArray] = str
  const hash = strArray.reduce((a, c) => {
    const h = c.charCodeAt(0) + ((a << 4) - a)
    return h % 360
  }, 0)
  return `hsl(${hash}, ${s}%, ${l}%)`
}
</script>

<template>
  <div
    class="w-6 h-6 rounded-full flex items-center justify-center"
    :style="{ background: hslGenerator(content, saturation, lightness) }"
  >
    {{ firstCapital }}
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/vars';

div {
  font-weight: 700;
  font-size: 12px;
}
</style>
