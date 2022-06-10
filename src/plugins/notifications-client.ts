import Notifications from '@kyvg/vue3-notification'

// export default (context, inject) => {
//   inject('notify', Vue.notify)
// }

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Notifications)
  return {
    provide: {
      notify: (nuxtApp.vueApp as any).notify
    }
  }
})
