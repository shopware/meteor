import type { privileges } from '../privileges';
import type { ShopwareMessageTypes } from '../../message-types';
export default function validate({ serializedData, origin, type, privilegesToCheck, }: {
    serializedData: any;
    origin: string;
    type: keyof ShopwareMessageTypes;
    privilegesToCheck: (keyof privileges)[];
}): Error | null;
