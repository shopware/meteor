type typeName = '__HandleError__';
interface HandleErrorJson {
    __type__: typeName;
    __code__: number;
    __message__: string;
}
export default class HandleError extends Error {
    code: number;
    constructor(msg: string, code?: number);
    toJSON(): HandleErrorJson;
}
export {};
