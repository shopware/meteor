import type { icons } from '../../icons';
export declare const addSettingsItem: (messageOptions: import("../../channel").MessageDataType<"settingsItemAdd"> & import("../../channel").BaseMessageOptions) => Promise<void>;
export type settingsItemAdd = {
    responseType: void;
    /**
     * Label of the settings item.
     */
    label: string;
    /**
     * The locationId you want to display.
     */
    locationId: string;
    /**
     * The icon to display in your settings item.
     */
    icon: icons;
    /**
     * Determines in which tab your settings item will be displayed.
     * Defaults to plugins.
     */
    tab?: 'shop' | 'system' | 'plugins';
    /**
     * Toggles the sw-page search bar on/off.
     * Defaults to true.
     */
    displaySearchBar?: boolean;
};
