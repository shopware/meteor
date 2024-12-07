export default defineNuxtPlugin((nuxtApp) => {
    // nuxtApp.$i18n
    nuxtApp.provide('t', (a) => a)
})
