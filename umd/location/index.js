(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../channel", "../_internals/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MAIN_HIDDEN = exports.stopAutoUrlUpdater = exports.startAutoUrlUpdater = exports.updateUrl = exports.stopAutoResizer = exports.startAutoResizer = exports.updateHeight = exports.isIframe = exports.get = exports.is = void 0;
    const channel_1 = require("../channel");
    const utils_1 = require("../_internals/utils");
    // TODO: add documentation (+ "body {overflow: hidden}" notice for views)
    const is = (location) => {
        return (0, utils_1.getLocationId)() === location;
    };
    exports.is = is;
    const get = () => {
        var _a;
        return (_a = (0, utils_1.getLocationId)()) !== null && _a !== void 0 ? _a : '';
    };
    exports.get = get;
    const isIframe = () => {
        return window !== window.parent;
    };
    exports.isIframe = isIframe;
    const updateHeight = (height) => {
        if (height) {
            return (0, channel_1.send)('locationUpdateHeight', {
                height,
                locationId: (0, utils_1.getLocationId)(),
            });
        }
        // If no height is defined then send the current document height
        const currentHeight = document.documentElement.offsetHeight;
        return (0, channel_1.send)('locationUpdateHeight', {
            height: currentHeight,
            locationId: (0, utils_1.getLocationId)(),
        });
    };
    exports.updateHeight = updateHeight;
    let resizeObserver = null;
    const startAutoResizer = () => {
        // Create an Observer instance
        resizeObserver = new ResizeObserver(() => {
            void (0, exports.updateHeight)();
        });
        // Start observing a DOM node
        resizeObserver.observe(document.body);
    };
    exports.startAutoResizer = startAutoResizer;
    const stopAutoResizer = () => {
        if (resizeObserver) {
            resizeObserver.unobserve(document.body);
            resizeObserver.disconnect();
        }
    };
    exports.stopAutoResizer = stopAutoResizer;
    const updateUrl = (url) => {
        return (0, channel_1.send)('locationUpdateUrl', {
            hash: url.hash,
            pathname: url.pathname,
            searchParams: [...url.searchParams.entries()],
            locationId: (0, utils_1.getLocationId)(),
        });
    };
    exports.updateUrl = updateUrl;
    let urlUpdateInterval = null;
    const startAutoUrlUpdater = () => {
        let prevUrl = undefined;
        if (urlUpdateInterval) {
            clearInterval(urlUpdateInterval);
        }
        urlUpdateInterval = setInterval(() => {
            const currUrl = window.location.href;
            if (currUrl !== prevUrl) {
                prevUrl = currUrl;
                void (0, exports.updateUrl)(new URL(currUrl));
            }
        }, 50);
    };
    exports.startAutoUrlUpdater = startAutoUrlUpdater;
    const stopAutoUrlUpdater = () => {
        if (urlUpdateInterval) {
            clearInterval(urlUpdateInterval);
        }
    };
    exports.stopAutoUrlUpdater = stopAutoUrlUpdater;
    exports.MAIN_HIDDEN = 'sw-main-hidden';
});
//# sourceMappingURL=index.js.map