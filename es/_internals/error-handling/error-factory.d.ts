import type { ShopwareMessageTypes } from '../../message-types';
export default function createError(type: keyof ShopwareMessageTypes, e: unknown): Error;
