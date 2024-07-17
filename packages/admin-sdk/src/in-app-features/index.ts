import { createSender } from '../channel';

/**
 * Trigger the in-app feature purchase.
 */
export const purchase = createSender('inAppFeaturePurchase');

export type inAppFeaturePurchase<T extends 'oneTime' | 'subscription' = 'oneTime' | 'subscription'> = {
    responseType: unknown,
    rentType: T,
    model: T extends 'subscription' ? 'yearly' | 'monthly' : undefined | null,

    featureId: string,
}
