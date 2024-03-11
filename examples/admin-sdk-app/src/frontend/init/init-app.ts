import { notification, ui, cms } from '@shopware-ag/meteor-admin-sdk';
import EX_DAILYMOTION_CONSTANTS from '../cms/ex-dailymotion/ex-dailymotion-constants';

/**
 * All extension points will be registered here
 */
ui.componentSection.add({
    component: 'card',
    positionId: 'sw-chart-card__before',
    props: {
        title: 'Meteor Admin SDK',
        subtitle: 'Welcome to the example',
        locationId: 'ex-chart-card-before'
    }
});

ui.menu.addMenuItem({
    label: 'Meteor Admin SDK example',
    locationId: 'ex-meteor-admin-sdk-example-module',
    displaySearchBar: true,
})

ui.tabs('sw-product-detail' /* The positionId of the tab bar*/).addTabItem({
    label: 'Example',
    componentSectionId: 'ex-product-extension-example-page',
})

ui.componentSection.add({
    component: 'card',
    positionId: 'ex-product-extension-example-page',
    props: {
        title: 'Data handling examples',
        subtitle: 'Test the data handling capabilities of the Meteor Admin SDK',
        locationId: 'ex-product-extension-example-data'
    }
});

ui.componentSection.add({
    component: 'card',
    positionId: 'ex-product-extension-example-page',
    props: {
        title: 'iFrame resize example',
        subtitle: 'Test the resize capabilities of the iFrame',
        locationId: 'ex-product-extension-example-resize'
    }
});

// Register CMS elements
void cms.registerCmsElement({
    name: EX_DAILYMOTION_CONSTANTS.CMS_DAILYMOTION_ELEMENT_NAME,
    label: 'Dailymotion video',
    defaultConfig: {
        dailyUrl: {
            source: 'static',
            value: '',
        },
    },
});

// Register action buttons
ui.actionButton.add({
    name: 'ex-action-button',
    label: 'Example action button',
    entity: 'product',
    view: 'list',
    callback: (entity, entityIdList) => {
        notification.dispatch({
            title: `Action button for entity ${entity} clicked`,
            message: `The following entity IDs were selected: ${entityIdList.join(', <br />')}`,
        })
    }
});