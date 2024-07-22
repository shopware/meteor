export default class MissingPrivilegesError extends Error {
    constructor(messageType, missingPrivileges) {
        super(`Your app is missing the privileges ${missingPrivileges.join(', ')} for action "${messageType}".`);
        Object.defineProperty(this, "missingPrivileges", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "messageType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.missingPrivileges = missingPrivileges;
        this.messageType = messageType;
        // Set prototype explicitly
        Object.setPrototypeOf(this, MissingPrivilegesError.prototype);
    }
    toJSON() {
        return {
            __type__: '__MissingPrivilegesError__',
            __messageType__: this.messageType,
            __data__: this.missingPrivileges,
        };
    }
}
//# sourceMappingURL=missing-privileges-error.js.map