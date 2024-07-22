import { processDataRegistration } from '../channel';
import Criteria from './Criteria';
import Entity from '../_internals/data/Entity';
import EntityCollection from '../_internals/data/EntityCollection';
import repository from './repository';
/**
 * Methods used by extension developers to get and update data
 */
export declare const subscribe: (id: string, callback: (data: {
    id: string;
    data: unknown;
}) => void | Promise<unknown>, options?: {
    selectors?: string[];
}) => unknown;
export declare const get: (messageOptions: import("../channel").MessageDataType<"datasetGet"> & import("../channel").BaseMessageOptions) => Promise<unknown>;
export declare const update: (messageOptions: import("../channel").MessageDataType<"datasetUpdate"> & import("../channel").BaseMessageOptions) => Promise<unknown>;
/**
 * Internal methods used by the administration
 */
export declare const register: typeof processDataRegistration;
export declare const updateSubscriber: (id: string, callback: (data: {
    id: string;
    data: unknown;
}) => void | Promise<unknown>, options?: {
    selectors?: string[];
}) => unknown;
export declare const handleGet: (method: (data: import("../channel").MessageDataType<"datasetGet"> & import("../channel").BaseMessageOptions, additionalInformation: {
    _event_: MessageEvent<string>;
}) => unknown) => () => void;
export type datasetRegistration = {
    responseType: {
        id: string;
        data: unknown;
    };
    id: string;
    data: unknown;
};
export type datasetSubscribe = {
    responseType: unknown;
    id: string;
    data: unknown;
    selectors?: string[];
};
/**
 * Will be used for giving the admin the information that
 * a window wants to subscribe to a dataset
 */
export type datasetSubscribeRegistration = {
    responseType: unknown;
    id: string;
    selectors?: string[];
};
export type datasetUpdate = {
    responseType: unknown;
    id: string;
    data: unknown;
};
export type datasetGet = {
    responseType: unknown;
    id: string;
    data?: unknown;
    selectors?: string[];
};
declare const Classes: {
    Criteria: typeof Criteria;
    Entity: typeof Entity;
    EntityCollection: typeof EntityCollection;
};
export { repository, Classes, };
