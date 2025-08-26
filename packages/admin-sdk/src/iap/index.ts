import { createSender } from '../channel';

/**
 * Trigger the in-app purchase checkout modal.
 */
export const purchase = createSender('iapCheckout');

export type iapCheckout = {
    responseType: unknown,

    identifier: string,
}
