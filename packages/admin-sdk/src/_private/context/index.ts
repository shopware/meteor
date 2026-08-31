import { createSender } from '../../channel';
import { compareIsShopwareVersion } from '../../context';

const getServiceContext = createSender('contextIsService', {});

/**
 * Check whether the current extension is a Shopware Service.
 *
 * @private
 * @since 6.7.14.0
 */
export async function isService(): Promise<boolean> {
  if (await compareIsShopwareVersion('<', '6.7.14.0')) {
    throw new Error('isService() requires Shopware 6.7.14.0 or newer');
  }

  return (await getServiceContext()) ?? false;
}

export type contextIsService = {
  responseType: boolean,
}
