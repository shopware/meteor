import { send } from '../channel';
import { getLocationId } from '../_internals/utils';
// TODO: add documentation (+ "body {overflow: hidden}" notice for views)
export const is = (location) => {
    return getLocationId() === location;
};
export const get = () => {
    var _a;
    return (_a = getLocationId()) !== null && _a !== void 0 ? _a : '';
};
export const isIframe = () => {
    return window !== window.parent;
};
export const updateHeight = (height) => {
    if (height) {
        return send('locationUpdateHeight', {
            height,
            locationId: getLocationId(),
        });
    }
    // If no height is defined then send the current document height
    const currentHeight = document.documentElement.offsetHeight;
    return send('locationUpdateHeight', {
        height: currentHeight,
        locationId: getLocationId(),
    });
};
let resizeObserver = null;
export const startAutoResizer = () => {
    // Create an Observer instance
    resizeObserver = new ResizeObserver(() => {
        void updateHeight();
    });
    // Start observing a DOM node
    resizeObserver.observe(document.body);
};
export const stopAutoResizer = () => {
    if (resizeObserver) {
        resizeObserver.unobserve(document.body);
        resizeObserver.disconnect();
    }
};
export const updateUrl = (url) => {
    return send('locationUpdateUrl', {
        hash: url.hash,
        pathname: url.pathname,
        searchParams: [...url.searchParams.entries()],
        locationId: getLocationId(),
    });
};
let urlUpdateInterval = null;
export const startAutoUrlUpdater = () => {
    let prevUrl = undefined;
    if (urlUpdateInterval) {
        clearInterval(urlUpdateInterval);
    }
    urlUpdateInterval = setInterval(() => {
        const currUrl = window.location.href;
        if (currUrl !== prevUrl) {
            prevUrl = currUrl;
            void updateUrl(new URL(currUrl));
        }
    }, 50);
};
export const stopAutoUrlUpdater = () => {
    if (urlUpdateInterval) {
        clearInterval(urlUpdateInterval);
    }
};
export const MAIN_HIDDEN = 'sw-main-hidden';
//# sourceMappingURL=index.js.map