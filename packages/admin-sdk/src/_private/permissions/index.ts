import { createSender } from '../../channel';

/**
 * Grant the permissions required by Shopware Services.
 *
 * @private
 */
export const grant = createSender('servicePermissionGrant', {});

/**
 * Check whether the Shopware Services consent is already granted (or not needed).
 * Resolves to `true` when the grant UI can stay hidden — i.e. the latest revision
 * has been consented to, or Shopware Services are disabled.
 *
 * @private
 */
export const isGranted = createSender('servicePermissionIsGranted', {});

export type servicePermissionGrant = {
  responseType: void,
}

export type servicePermissionIsGranted = {
  responseType: boolean,
}
