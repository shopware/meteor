import { defineAsyncComponent } from 'vue'

export const exampleDashboard = 'example-dashboard-before-content'
export const exampleProductTab = 'example-product-tab'

export const componentMap: { [key: string]: any } = {
  [exampleDashboard]: defineAsyncComponent(() => import('./locations/exampleDashboard.vue')),
  [exampleProductTab]: defineAsyncComponent(() => import('./locations/exampleProductTab.vue')),
}
