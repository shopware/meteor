import type { extension } from './privileges';
export declare function generateUniqueId(): string;
export declare function isObject(value: unknown): value is any;
export declare function getLocationId(): string | null;
export declare function getWindowSrc(): string;
export declare function hasType(type: string, obj: any): boolean;
export declare function hasOwnProperty(obj: any, path: string): boolean;
export declare function traverseObject(this: any, traversableObject: any, processor: (parentEntry: any, key: string, value: any, previousKey: string) => void, previousKey?: string): void;
export declare function isPrimitive(value: any): boolean;
/**
 * Removes the root prefix from a path
 */
export declare function removeRoot(path: string | number): string | number;
export declare function findExtensionByBaseUrl(baseUrl?: string): extension | undefined;
