import { createSender } from '../channel';

/**
 * Trigger the in-app purchase checkout modal.
 */
export const purchase = createSender('iapCheckout');

export type iapCheckout<T extends 'oneTime' | 'subscription' = 'oneTime' | 'subscription'> = {
    responseType: unknown,

    identifier: string,
    rentType: T,
    model: T extends 'subscription' ? 'yearly' | 'monthly' : undefined | null,
}
