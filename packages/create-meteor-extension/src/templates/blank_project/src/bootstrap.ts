import { ui } from '@shopware-ag/meteor-admin-sdk';
import { exampleProductTab, exampleDashboard } from './locations';

export default function bootstrap() {
  // This is a bootstrap function that runs once when the
  // hidden iframe is loaded. You can use it to initialize
  // your app, the UI, or any other functionality you need.

  /**
   * Tabs
   */
  ui.tabs('sw-product-detail').addTabItem({
    label: 'example-meteor-app.productTab.title',
    componentSectionId: exampleProductTab,
  })

  /**
   * Cards
   */

  // Dashboard Card
  ui.componentSection.add({
    positionId: 'sw-dashboard__before-content',
    component: 'card',
    props: {
      title: 'example-meteor-app.dashboardCard.title',
      subtitle: 'example-meteor-app.dashboardCard.subtitle',
      locationId: exampleDashboard,
    }
  })

  // Product detail card for new product tab
  ui.componentSection.add({
    // The positionId is the ID of the tab where the card should be displayed
    positionId: exampleProductTab,
    component: 'card',
    props: {
      title: 'example-meteor-app.productCard.title',
      subtitle: 'example-meteor-app.productCard.subtitle',
      locationId: exampleProductTab,
    }
  });
}
