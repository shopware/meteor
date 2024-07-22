export declare const redirect: (messageOptions: import("../channel").MessageDataType<"windowRedirect"> & import("../channel").BaseMessageOptions) => Promise<void>;
export declare const routerPush: (messageOptions: import("../channel").MessageDataType<"windowRouterPush"> & import("../channel").BaseMessageOptions) => Promise<void>;
export declare const reload: (messageOptions?: (import("../channel").MessageDataType<"windowReload"> & import("../channel").BaseMessageOptions) | undefined) => Promise<void>;
/**
 * Redirect to another URL
 */
export type windowRedirect = {
    responseType: void;
    /**
     * The URL for the redirection
     */
    url: string;
    /**
     * If this is activated then the link will be opened in a new tab
     */
    newTab?: boolean;
};
/**
 * Push to an existing route
 */
export type windowRouterPush = {
    responseType: void;
    name?: string;
    path?: string;
    params?: Record<string, string>;
    replace?: boolean;
};
/**
 * Reload the current window
 */
export type windowReload = {
    responseType: void;
};
