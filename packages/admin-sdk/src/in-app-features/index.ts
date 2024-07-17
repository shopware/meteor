import { createSender } from '../channel';

/**
 * Trigger the in-app feature purchase.
 */
export const purchase = createSender('inAppFeaturePurchase');

export type inAppFeaturePurchase = {
    responseType: unknown,

    featureId: string,
}
