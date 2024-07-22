var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const utils_1 = require("../utils");
    /* eslint-disable */
    const FunctionSerializerFactory = ({ send, handle }) => {
        // only available on sender side
        const methodRegistry = {};
        let isMethodHandlerStarted = false;
        function startMethodHandler() {
            if (isMethodHandlerStarted)
                return;
            isMethodHandlerStarted = true;
            handle('__function__', ({ args, id }) => __awaiter(this, void 0, void 0, function* () {
                return yield Promise.resolve(methodRegistry[id](...args));
            }));
        }
        return {
            name: 'function',
            serialize: ({ value }) => {
                if (typeof value === 'function') {
                    const id = (0, utils_1.generateUniqueId)();
                    // add the method reference to the methodRegistry
                    methodRegistry[id] = value;
                    // start a general function listener which calls the method when the handler calls the method
                    startMethodHandler();
                    // replace function with a object containing the type and id
                    return {
                        __type__: '__function__',
                        id: id,
                        origin: window.origin,
                    };
                }
            },
            deserialize: ({ value, event }) => {
                var _a;
                // @ts-expect-error
                const targetWindow = (_a = event === null || event === void 0 ? void 0 : event.source) !== null && _a !== void 0 ? _a : window;
                // when object is containing a method wrapper
                if ((0, utils_1.isObject)(value)
                    && value['__type__']
                    && value['__type__'] === '__function__'
                    && typeof value['id'] === 'string') {
                    const id = value['id'];
                    const origin = value['origin'];
                    // convert wrapper to a callable method
                    return (...args) => {
                        return send('__function__', {
                            args: args,
                            id: id,
                        }, targetWindow, origin);
                    };
                }
            }
        };
    };
    exports.default = FunctionSerializerFactory;
});
//# sourceMappingURL=function-serializer.js.map