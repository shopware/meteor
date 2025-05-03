import { ui } from '@shopware-ag/meteor-admin-sdk';
import { settingsBoostingTabLocation, settingsBoostingTabContentPositionId } from './locations';

export default function bootstrap() {
  // This is a bootstrap function that runs once when the
  // hidden iframe is loaded. You can use it to initialize
  // your app, the UI, or any other functionality you need.

  /**
   * Tabs
   */
  ui.tabs('sw-settings-search-header').addTabItem({
    label: 'sw-advanced-search.boostingTab.title',
    componentSectionId: settingsBoostingTabContentPositionId,
  })

  /**
   * Cards
   */
  ui.componentSection.add({
    positionId: settingsBoostingTabContentPositionId,
    component: 'card',
    props: {
      title: 'sw-advanced-search.boostingTab.title',
      subtitle: 'sw-advanced-search.boostingTab.subtitle',
      locationId: settingsBoostingTabLocation,
    }
  })
}
