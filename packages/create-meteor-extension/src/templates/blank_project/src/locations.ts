import { defineAsyncComponent } from 'vue';
export const settingsBoostingTabLocation = 'sw-settings-search-index-boosting';
export const settingsBoostingTabContentPositionId = 'sw-settings-search-index-boosting-content';
export const settingsBoostingEditModalLocation = 'sw-settings-search-index-boosting-edit-modal';

export const componentMap: { [key: string]: any } = {
  [settingsBoostingTabLocation]: defineAsyncComponent(() => import('./locations/settingsBoostingTabLocation.vue')),
  [settingsBoostingEditModalLocation]: defineAsyncComponent(() => import('./locations/settingsBoostingEditModalLocation.vue')),
}
