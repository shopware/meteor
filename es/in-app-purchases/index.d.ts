/**
 * Trigger the in-app purchase.
 */
export declare const purchase: (messageOptions: import("../channel").MessageDataType<"inAppPurchase"> & import("../channel").BaseMessageOptions) => Promise<unknown>;
export type inAppPurchase<T extends 'oneTime' | 'subscription' = 'oneTime' | 'subscription'> = {
    responseType: unknown;
    featureId: string;
    rentType: T;
    model: T extends 'subscription' ? 'yearly' | 'monthly' : undefined | null;
};
