import { createSender, createSubscriber } from '../channel';
export const getLanguage = createSender('contextLanguage', {});
export const subscribeLanguage = createSubscriber('contextLanguage');
export const getEnvironment = createSender('contextEnvironment', {});
export const getLocale = createSender('contextLocale', {});
export const subscribeLocale = createSubscriber('contextLocale');
export const getCurrency = createSender('contextCurrency', {});
export const getShopwareVersion = createSender('contextShopwareVersion', {});
export const getUserInformation = createSender('contextUserInformation', {});
export const getUserTimezone = createSender('contextUserTimezone', {});
export const getAppInformation = createSender('contextAppInformation', {});
export const getModuleInformation = createSender('contextModuleInformation', {});
//# sourceMappingURL=index.js.map