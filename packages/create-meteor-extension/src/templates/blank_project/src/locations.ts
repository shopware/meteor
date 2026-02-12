import { defineAsyncComponent, type Component } from 'vue'

export const exampleDashboard = 'example-dashboard-before-content'
export const exampleProductTab = 'example-product-tab'

export const componentMap: Record<string, Component> = {
  [exampleDashboard]: defineAsyncComponent(() => import('./locations/exampleDashboard.vue')),
  [exampleProductTab]: defineAsyncComponent(() => import('./locations/exampleProductTab.vue')),
}
