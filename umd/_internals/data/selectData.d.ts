import type { ShopwareMessageTypes } from '../../message-types';
/**
 * Selects data from a source object using a list of selectors.
 */
export declare function selectData(sourceData: Record<string | number, unknown>, selectors?: string[], messageType?: keyof ShopwareMessageTypes, origin?: string): unknown;
