<script setup lang="ts">
import DefaultLayout from './layouts/default.vue'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Dex',
  meta: [{ name: 'description', content: 'Decentralized exchange platform' }],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
})
</script>

<template>
  <DefaultLayout />
</template>
