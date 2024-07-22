export declare const is: (location: string) => boolean;
export declare const get: () => string;
export declare const isIframe: () => boolean;
export declare const updateHeight: (height?: number) => Promise<void | null>;
export declare const startAutoResizer: () => void;
export declare const stopAutoResizer: () => void;
export declare const updateUrl: (url: URL) => Promise<void | null>;
export declare const startAutoUrlUpdater: () => void;
export declare const stopAutoUrlUpdater: () => void;
export declare const MAIN_HIDDEN = "sw-main-hidden";
export type locationUpdateHeight = {
    responseType: void;
    /**
     * The height of the iFrame
     */
    height: number;
    /**
     * The locationID of the current element
     */
    locationId: string | null;
};
export type locationUpdateUrl = {
    responseType: void;
    /**
     * The hash of the url
     *
     * @example
     * #/sw/dashboard
     */
    hash: string;
    /**
     * The pathname of the url
     *
     * @example
     * /
     */
    pathname: string;
    /**
     * The searchParams of the url
     *
     * @example
     * [
     *  ['foo', 'bar'],
     *  ['baz', 'qux'],
     * ]
     */
    searchParams: Array<[string, string]>;
    /**
     * The locationID of the current element
     */
    locationId: string | null;
};
