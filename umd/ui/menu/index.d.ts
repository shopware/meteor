export declare const collapseMenu: (messageOptions: import("../../channel").MessageDataType<"menuCollapse"> & import("../../channel").BaseMessageOptions) => Promise<void>;
export declare const expandMenu: (messageOptions: import("../../channel").MessageDataType<"menuExpand"> & import("../../channel").BaseMessageOptions) => Promise<void>;
export declare const addMenuItem: (messageOptions: import("../../channel").MessageDataType<"menuItemAdd"> & import("../../channel").BaseMessageOptions) => Promise<void>;
export type menuCollapse = {
    responseType: void;
};
export type menuExpand = {
    responseType: void;
};
export type menuItemAdd = {
    responseType: void;
    /**
     * Label of the menu item.
     */
    label: string;
    /**
     * The locationId you want to display.
     */
    locationId: string;
    /**
     * Toggles the sw-page search bar on/off.
     * Defaults to true.
     */
    displaySearchBar?: boolean;
    /**
     * Toggles the sw-page smart bar on/off.
     * Defaults to true.
     */
    displaySmartBar?: boolean;
    /**
     * Determines under which main menu entry your item is displayed.
     * Defaults to `sw-extension`.
     */
    parent?: string;
    /**
     * Determines the position of your menu item.
     * Defaults to 110.
     */
    position?: number;
};
