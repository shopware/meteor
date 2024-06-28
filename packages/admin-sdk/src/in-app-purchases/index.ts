import { createSender } from '../channel';

/**
 * Trigger the in-app purchase flow modal.
 */
export const trigger = createSender('inAppPurchases');

export type inAppPurchases = {
    responseType: unknown,

    featureId: string,
}
