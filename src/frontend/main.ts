import { location } from '@shopware-ag/admin-extension-sdk';

if (location.is(location.MAIN_HIDDEN)) {
    /**
     * This get's executed in the administration in a hidden iFrame.
     * So we don't need any visual components here. It just initializes
     * all extension points needed for this component.
     */
    import('./init/init-app');
} else {
    /**
     * This get's executed when the administration renders
     * a location. We use a general view renderer which renders
     * the correct view based on the given location.
     */
    import('./locations/init-locations');
}
