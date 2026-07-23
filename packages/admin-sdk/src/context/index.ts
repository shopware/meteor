import { createSender, createSubscriber, startThemeSync } from '../channel';
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
 * Syncs the resolved Administration color theme to the `data-theme` attribute
 * of an element (the document root by default). Returns a function that stops
 * the synchronization.
 */
export async function syncTheme(options: { target?: HTMLElement } = {}): Promise<() => void> {
  const { initialFetch, stop } = startThemeSync(options.target ?? document.documentElement);

  try {
    await initialFetch;
  } catch (error) {
    stop();

    throw error;
  }

  return stop;
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
 * Get the resolved color theme (a `system` preference is always resolved
 * to `light` or `dark`)
 */
export type contextTheme = {
  responseType: 'light' | 'dark',
}
