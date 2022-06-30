<script setup lang="ts" name="Farms">
import { SAccordionItem } from '@soramitsu-ui/ui'

const args = ref({
  title: 'Accordion item',
  subtitle: 'Accordion item description',
})

const model = ref(false)
</script>

<template>
  <SAccordionItem v-bind="args" v-model="model">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
    ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur.
  </SAccordionItem>
</template>

<route lang="yaml">
name: Farms
</route>
