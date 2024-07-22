export declare const add: (messageOptions: import("../../../../channel").MessageDataType<"uiModulePaymentOverviewCard"> & import("../../../../channel").BaseMessageOptions) => Promise<void>;
/**
 * Contains all necessary parameters to render a component in the payment overview
 */
export type uiModulePaymentOverviewCard = {
    responseType: void;
    component?: string;
    positionId: string;
    paymentMethodHandlers: string[];
};
