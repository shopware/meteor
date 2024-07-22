import type { ShopwareMessageTypes } from '../../message-types';
import type { privilegeString } from './index';
type type = '__MissingPrivilegesError__';
interface MissingPrivilegeErrorJson {
    __type__: type;
    __messageType__: string;
    __data__: string[];
}
export default class MissingPrivilegesError extends Error {
    missingPrivileges: Array<privilegeString>;
    messageType: keyof ShopwareMessageTypes;
    constructor(messageType: keyof ShopwareMessageTypes, missingPrivileges: Array<privilegeString>);
    toJSON(): MissingPrivilegeErrorJson;
}
export {};
