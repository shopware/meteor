export declare const add: (messageOptions: Omit<import("../../channel").MessageDataType<"uiComponentSectionRenderer">, "src"> & import("../../channel").BaseMessageOptions) => Promise<void>;
/**
 * Contains all possible components for the sections
 */
export type uiComponentSectionRenderer = {
    responseType: void;
    component: string;
    positionId: string;
    props: unknown;
    src?: string;
} & (cardComponentRender);
interface cardComponentRender {
    component: 'card';
    props: {
        title?: string;
        subtitle?: string;
        locationId: string;
        tabs?: cardTabRenderer[];
    };
}
interface cardTabRenderer {
    name: string;
    label: string;
    locationId: string;
}
export {};
