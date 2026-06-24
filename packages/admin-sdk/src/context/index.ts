import { createSender, createSubscriber } from '../channel';
import getCompareIsShopwareVersion from './compare-version';
import createACLHelper from './acl';
import type { privileges } from '../_internals/privileges';

export const getLanguage = createSender('contextLanguage', {});
export const subscribeLanguage = createSubscriber('contextLanguage');
export const getEnvironment = createSender('contextEnvironment', {});
export const getLocale = createSender('contextLocale', {});
export const subscribeLocale = createSubscriber('contextLocale');
export const getCurrency = createSender('contextCurrency', {});
export const getShopwareVersion = createSender('contextShopwareVersion', {});
export const compareIsShopwareVersion = getCompareIsShopwareVersion(getShopwareVersion);
export const getUserInformation = createSender('contextUserInformation', {});
export const getUserTimezone = createSender('contextUserTimezone', {});
export const getAppInformation = createSender('contextAppInformation', {});
export const can = createACLHelper(getAppInformation);
export const getModuleInformation = createSender('contextModuleInformation', {});
export const getShopId = createSender('contextShopId', {});
export const getTheme = createSender('contextTheme', {});
export const subscribeTheme = createSubscriber('contextTheme');

/**
 * Syncs the resolved Administration theme to the `data-theme` attribute of an
 * element (the document root by default). The current theme is applied
 * immediately and the attribute is updated whenever the Administration theme
 * changes.
 *
 * Returns a function that stops the subscription.
 */
export async function syncTheme(
  options: { target?: HTMLElement } = {},
): Promise<() => void> {
  const target = options.target ?? document.documentElement;

  const apply = (theme: contextTheme['responseType']): void => {
    target.dataset.theme = theme;
  };

  /*
   * Subscribe before fetching the current value so a theme change published
   * while getTheme() is in flight cannot slip through unobserved.
   */
  const unsubscribe = subscribeTheme(apply);
  apply(await getTheme());

  return unsubscribe;
}

/**
 * Get the current content language
 */
export type contextLanguage = {
  responseType: {
    systemLanguageId: string,
    languageId: string,
  },
}

/**
 * Get the current environment (development or production)
 */
export type contextEnvironment = {
  responseType: 'development' | 'production' | 'testing',
}

/**
 * Get the current UI locale
 */
export type contextLocale = {
  responseType: {
    locale: string,
    fallbackLocale: string,
  },
}

/**
 * Get the system currency
 */
export type contextCurrency = {
  responseType: {
    systemCurrencyISOCode: string,
    systemCurrencyId: string,
  },
}

/**
 * Get the current Shopware version
 */
export type contextShopwareVersion = {
  responseType: string,
}

/**
 * Get the current app information
 */
export type contextAppInformation = {
  responseType: {
    name: string,
    version: string,
    type: 'app'|'plugin',
    privileges: privileges,
  },
}

/**
 * Get the current user information
 */
export type contextUserInformation = {
  responseType: {
    aclRoles: Array<{
      name: string,
      type: string,
      id: string,
      privileges: Array<string>,
    }>,
    active: boolean,
    admin: boolean,
    avatarId: string,
    email: string,
    firstName: string,
    id: string,
    lastName: string,
    localeId: string,
    title: string,
    type: string,
    username: string,
  },
}

/**
 * Get the user's timezone
 */
export type contextUserTimezone = {
  responseType: string,
}

/**
 * Get all registered module information for the extension
 */
export type contextModuleInformation = {
  responseType: {
    modules: Array<{
      displaySearchBar: boolean,
      heading: string,
      id: string,
      locationId: string,
    }>,
  },
}

export type contextShopId = {
  responseType: string|null,
}

/**
 * Get the current resolved Administration color theme. A "system" preference is
 * always resolved to the actually applied value, so this is either "light" or
 * "dark".
 */
export type contextTheme = {
  responseType: 'light' | 'dark',
}
