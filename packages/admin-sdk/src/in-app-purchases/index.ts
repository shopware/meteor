import { createSender } from "../channel";

/**
 * Trigger the initial in-app purchase flow.
 */
export const start = createSender('inAppPurchaseStart');

/**
 * Trigger the creation of an in-app purchase.
 */
export const create = createSender('inAppPurchaseCreate');

export type inAppPurchaseStart = {
    responseType: unknown,

    featureName: string,

    paymentTier: string,
}

export type inAppPurchaseCreate = {
    responseType: unknown,

    featureName: string,

    paymentTier: string,
}