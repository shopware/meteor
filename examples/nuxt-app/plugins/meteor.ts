import { DeviceHelperPlugin } from '@shopware-ag/meteor-component-library'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(DeviceHelperPlugin)
})
