export declare const addMainModule: (messageOptions: import("../../channel").MessageDataType<"mainModuleAdd"> & import("../../channel").BaseMessageOptions) => Promise<void>;
export declare const addSmartBarButton: (messageOptions: import("../../channel").MessageDataType<"smartBarButtonAdd"> & import("../../channel").BaseMessageOptions) => Promise<void>;
export type mainModuleAdd = {
    responseType: void;
    /**
     * Heading of the main module.
     */
    heading: string;
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
     * Toggles the sw-page language switch on/off.
     * Defaults to false.
     */
    displayLanguageSwitch?: boolean;
};
export type smartBarButtonAdd = {
    responseType: void;
    /**
     * The locationId you want to display.
     */
    locationId: string;
    /**
     * The id of the button
     */
    buttonId: string;
    /**
     * The label of the button
     */
    label: string;
    /**
     * Toggle disabled state of the button
     */
    disabled?: boolean;
    /**
     * Set the variant of the button
     */
    variant: 'primary' | 'ghost' | 'danger' | 'ghost-danger' | 'contrast' | 'context';
    /**
     * Callback function which will be called once the button is clicked.
     */
    onClickCallback: () => void;
};
