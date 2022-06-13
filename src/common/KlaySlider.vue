<script>
// import VueSlider from 'vue-slider-component'
// import 'vue-slider-component/theme/antd.css'

export default {
  name: 'KlaySlider',
  components: {
    // VueSlider
  },
  props: {
    propsValue: {
      type: Number,
    },
  },
  emits: ['onmove'],
  data() {
    return {
      value: this.propsValue,
    }
  },
  watch: {
    value(_new, _old) {
      this.$emit('onmove', _new)
    },
    propsValue() {
      this.value = this.propsValue
    },
  },
}
</script>

<template>
  <div>
    <!-- <vue-slider lazy v-model="value"></vue-slider> -->
  </div>
</template>
