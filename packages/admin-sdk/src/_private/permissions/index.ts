import { createSender } from '../../channel';
import { compareIsShopwareVersion } from '../../context';

const grantPermission = createSender('servicePermissionGrant', {});
const checkPermission = createSender('servicePermissionIsGranted', {});

const minimumSupportedVersion = '6.7.14.0';

/**
 * Grant the permissions required by Shopware Services.
 *
 * @private
 * @since 6.7.14.0
 */
export async function grant(): Promise<void> {
  if (await compareIsShopwareVersion('<', minimumSupportedVersion)) {
    throw new Error('grant() requires Shopware 6.7.14.0 or newer');
  }

  await grantPermission();
}

/**
 * Check whether the Shopware Services consent is already granted (or not needed).
 * Resolves to `true` when the grant UI can stay hidden — i.e. the latest revision
 * has been consented to, or Shopware Services are disabled.
 *
 * @private
 * @since 6.7.14.0
 */
export async function isGranted(): Promise<boolean> {
  if (await compareIsShopwareVersion('<', minimumSupportedVersion)) {
    throw new Error('isGranted() requires Shopware 6.7.14.0 or newer');
  }

  return (await checkPermission()) ?? true;
}

export type servicePermissionGrant = {
  responseType: void,
}

export type servicePermissionIsGranted = {
  responseType: boolean,
}
