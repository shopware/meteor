var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../data/Entity", "./index", "../../channel", "../data/EntityCollection", "../../data/Criteria"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Entity_1 = __importDefault(require("../data/Entity"));
    const index_1 = __importDefault(require("./index"));
    const channel_1 = require("../../channel");
    const EntityCollection_1 = __importDefault(require("../data/EntityCollection"));
    const Criteria_1 = __importDefault(require("../../data/Criteria"));
    const { serialize, deserialize } = (0, index_1.default)({
        handle: channel_1.handle,
        send: channel_1.send,
    });
    describe('index.ts', () => {
        it('should convert entities with circular reference', () => {
            // @ts-expect-error - We don't care about valid entities here
            const entity = new Entity_1.default('foo', 'jest', {
                // @ts-expect-error - We don't care about valid entities here
                lineItems: new EntityCollection_1.default('line_items', 'line_item', undefined, new Criteria_1.default(), [
                    // @ts-expect-error - We don't care about valid entities here
                    new Entity_1.default('line_item_1', 'line_item', {
                        id: 'line_item_1',
                        quantity: 1,
                        versionId: 1,
                        price: {
                            unitPrice: 100,
                            totalPrice: 100,
                        },
                        // @ts-expect-error - We don't care about valid entities here
                        children: new EntityCollection_1.default('line_item', 'order_line_item', undefined, new Criteria_1.default(), [
                            // @ts-expect-error - We don't care about valid entities here
                            new Entity_1.default('extension', 'order_line_item_foreign_keys_extension', {
                                id: 'extension',
                                key: 'value',
                                parent: undefined,
                            }),
                            // @ts-expect-error - We don't care about valid entities here
                            new Entity_1.default('extension', 'order_line_item_foreign_keys_extension', {
                                id: 'extension2',
                                key: 'value',
                            })
                        ]),
                    }),
                    // @ts-expect-error - We don't care about valid entities here
                    new Entity_1.default('line_item_2', 'line_item', {
                        id: 'line_item_2',
                        quantity: 1,
                        versionId: 1,
                        price: {
                            unitPrice: 100,
                            totalPrice: 100,
                        },
                    }),
                ]),
            });
            // @ts-expect-error - Create circular reference
            entity.lineItems.first(0).children.getAt(0).parent = entity.lineItems.getAt(0);
            const messageData = {
                entity,
            };
            const result = serialize(messageData);
            // this is a regression test for a bug that caused the serializer to fail
            // expect the circular reference to be converted
            expect(result.entity.__draft__.lineItems.__entities__[0].__draft__.children.__entities__[0] instanceof Entity_1.default).toBe(false);
            expect(result.entity.__draft__.lineItems.__entities__[0].__draft__.children.__entities__[1] instanceof Entity_1.default).toBe(false);
            expect(result.entity.__draft__.lineItems.__entities__[0].__draft__.children.__entities__[0].__draft__.parent.children instanceof EntityCollection_1.default).toBe(false);
            expect(result.entity.__draft__.lineItems.__entities__[0].__draft__.children.__entities__[0].__draft__.parent).toStrictEqual({
                __$CR__: 'root.entity.lineItems.0'
            });
            const deserialized = deserialize(result, new MessageEvent('message'));
            // expect the circular reference to be converted back
            expect(deserialized.entity.lineItems.getAt(0).children.getAt(0).parent).toBe(deserialized.entity.lineItems.getAt(0));
        });
    });
});
//# sourceMappingURL=index.spec.js.map