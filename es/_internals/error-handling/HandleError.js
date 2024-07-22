export default class HandleError extends Error {
    constructor(msg, code) {
        super(msg);
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 500
        });
        if (!code) {
            return;
        }
        this.code = code;
    }
    toJSON() {
        return {
            __type__: '__HandleError__',
            __code__: this.code,
            __message__: this.message,
        };
    }
}
//# sourceMappingURL=HandleError.js.map