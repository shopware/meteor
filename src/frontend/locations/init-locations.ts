import Vue from 'vue';
import VueI18n from 'vue-i18n'
import { location } from '@shopware-ag/admin-extension-sdk';
import '@shopware-ag/meteor-component-library/dist/style.css';

Vue.use(VueI18n);

// watch for height changes
location.startAutoResizer();

// register all components for the location
const locations = {
    'ex-product-extension-example-resize': () => import('./ex-product-extension-example-resize.vue'),
    'ex-product-extension-example-data': () => import('./ex-product-extension-example-data.vue'),
    'ex-chart-card-before': () => import('./ex-chart-card-before.vue'),
    'ex-admin-extension-sdk-example-module': () => import('./module/example-module/ex-admin-extension-sdk-example-module.vue'),
    'ex-dailymotion-config': () => import('../cms/ex-dailymotion/ex-dailymotion-config.vue'),
    'ex-dailymotion-preview': () => import('../cms/ex-dailymotion/ex-dailymotion-preview.vue'),
    'ex-dailymotion-element': () => import('../cms/ex-dailymotion/ex-dailymotion-element.vue'),
}

// render the app with the correct view for the location
new Vue({
    el: '#app',
    // @ts-expect-error
    render: h => h(locations[location.get()])
})
