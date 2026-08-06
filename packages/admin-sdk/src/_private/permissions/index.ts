import { createSender } from '../../channel';

/**
 * Grant the permissions required by Shopware Services.
 *
 * @private
 */
export const grant = createSender('servicePermissionGrant', {});

export type servicePermissionGrant = {
  responseType: void,
}
