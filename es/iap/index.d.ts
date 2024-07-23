/**
 * Trigger the in-app purchase checkout modal.
 */
export declare const purchase: (messageOptions: import("../channel").MessageDataType<"iapCheckout"> & import("../channel").BaseMessageOptions) => Promise<unknown>;
export type iapCheckout<T extends 'oneTime' | 'subscription' = 'oneTime' | 'subscription'> = {
    responseType: unknown;
    identifier: string;
    rentType: T;
    model: T extends 'subscription' ? 'yearly' | 'monthly' : undefined | null;
};
