export declare const getLanguage: (messageOptions?: (import("../channel").MessageDataType<"contextLanguage"> & import("../channel").BaseMessageOptions) | undefined) => Promise<{
    systemLanguageId: string;
    languageId: string;
}>;
export declare const subscribeLanguage: (method: (data: {
    systemLanguageId: string;
    languageId: string;
}) => void | Promise<unknown>, id?: string | undefined) => () => void;
export declare const getEnvironment: (messageOptions?: (import("../channel").MessageDataType<"contextEnvironment"> & import("../channel").BaseMessageOptions) | undefined) => Promise<"development" | "production" | "testing">;
export declare const getLocale: (messageOptions?: (import("../channel").MessageDataType<"contextLocale"> & import("../channel").BaseMessageOptions) | undefined) => Promise<{
    locale: string;
    fallbackLocale: string;
}>;
export declare const subscribeLocale: (method: (data: {
    locale: string;
    fallbackLocale: string;
}) => void | Promise<unknown>, id?: string | undefined) => () => void;
export declare const getCurrency: (messageOptions?: (import("../channel").MessageDataType<"contextCurrency"> & import("../channel").BaseMessageOptions) | undefined) => Promise<{
    systemCurrencyISOCode: string;
    systemCurrencyId: string;
}>;
export declare const getShopwareVersion: (messageOptions?: (import("../channel").MessageDataType<"contextShopwareVersion"> & import("../channel").BaseMessageOptions) | undefined) => Promise<string>;
export declare const getUserInformation: (messageOptions?: (import("../channel").MessageDataType<"contextUserInformation"> & import("../channel").BaseMessageOptions) | undefined) => Promise<{
    aclRoles: Array<{
        name: string;
        type: string;
        id: string;
        privileges: Array<string>;
    }>;
    active: boolean;
    admin: boolean;
    avatarId: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    localeId: string;
    title: string;
    type: string;
    username: string;
}>;
export declare const getUserTimezone: (messageOptions?: (import("../channel").MessageDataType<"contextUserTimezone"> & import("../channel").BaseMessageOptions) | undefined) => Promise<string>;
export declare const getAppInformation: (messageOptions?: (import("../channel").MessageDataType<"contextAppInformation"> & import("../channel").BaseMessageOptions) | undefined) => Promise<{
    name: string;
    version: string;
    type: 'app' | 'plugin';
}>;
export declare const getModuleInformation: (messageOptions?: (import("../channel").MessageDataType<"contextModuleInformation"> & import("../channel").BaseMessageOptions) | undefined) => Promise<{
    modules: Array<{
        displaySearchBar: boolean;
        heading: string;
        id: string;
        locationId: string;
    }>;
}>;
/**
 * Get the current content language
 */
export type contextLanguage = {
    responseType: {
        systemLanguageId: string;
        languageId: string;
    };
};
/**
 * Get the current environment (development or production)
 */
export type contextEnvironment = {
    responseType: 'development' | 'production' | 'testing';
};
/**
 * Get the current UI locale
 */
export type contextLocale = {
    responseType: {
        locale: string;
        fallbackLocale: string;
    };
};
/**
 * Get the system currency
 */
export type contextCurrency = {
    responseType: {
        systemCurrencyISOCode: string;
        systemCurrencyId: string;
    };
};
/**
 * Get the current Shopware version
 */
export type contextShopwareVersion = {
    responseType: string;
};
/**
 * Get the current app information
 */
export type contextAppInformation = {
    responseType: {
        name: string;
        version: string;
        type: 'app' | 'plugin';
    };
};
/**
 * Get the current user information
 */
export type contextUserInformation = {
    responseType: {
        aclRoles: Array<{
            name: string;
            type: string;
            id: string;
            privileges: Array<string>;
        }>;
        active: boolean;
        admin: boolean;
        avatarId: string;
        email: string;
        firstName: string;
        id: string;
        lastName: string;
        localeId: string;
        title: string;
        type: string;
        username: string;
    };
};
/**
 * Get the user's timezone
 */
export type contextUserTimezone = {
    responseType: string;
};
/**
 * Get all registered module information for the extension
 */
export type contextModuleInformation = {
    responseType: {
        modules: Array<{
            displaySearchBar: boolean;
            heading: string;
            id: string;
            locationId: string;
        }>;
    };
};
