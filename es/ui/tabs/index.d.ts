declare const _default: (tabPositionId: string) => {
    addTabItem: (messageOptions: Omit<import("../../channel").MessageDataType<"uiTabsAddTabItem">, "positionId"> & import("../../channel").BaseMessageOptions) => Promise<void>;
};
export default _default;
export type uiTabsAddTabItem = {
    responseType: void;
    positionId: string;
    label: string;
    componentSectionId: string;
};
