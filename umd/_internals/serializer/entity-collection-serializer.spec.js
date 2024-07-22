var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../data/EntityCollection", "../../data/Criteria", "../data/Entity", "./index", "../../channel", "vue"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const EntityCollection_1 = __importDefault(require("../data/EntityCollection"));
    const Criteria_1 = __importDefault(require("../../data/Criteria"));
    const Entity_1 = __importDefault(require("../data/Entity"));
    const index_1 = __importDefault(require("./index"));
    const channel_1 = require("../../channel");
    const vue_1 = __importDefault(require("vue"));
    const { serialize, deserialize } = (0, index_1.default)({
        handle: channel_1.handle,
        send: channel_1.send,
    });
    describe('entity-collection-serializer.ts', () => {
        [
            {
                testName: 'should convert collections',
                createMessageData: () => {
                    const collection = new EntityCollection_1.default('test', 
                    // @ts-expect-error - we know that this entity does not exist
                    'jest', {}, new Criteria_1.default(), [], 42, ['test', 'foo']);
                    // @ts-expect-error - we know that this entity does not exist
                    collection.add(new Entity_1.default('1', 'test', {}));
                    // @ts-expect-error - we know that this entity does not exist
                    collection.add(new Entity_1.default('2', 'test', {}));
                    const messageData = {
                        collection,
                    };
                    return messageData;
                }
            },
            {
                testName: 'should convert collections even when they are converted with Vue.observable',
                createMessageData: () => {
                    const collection = new EntityCollection_1.default('test', 
                    // @ts-expect-error - we know that this entity does not exist
                    'jest', {}, new Criteria_1.default(), [], 42, ['test', 'foo']);
                    // @ts-expect-error - we know that this entity does not exist
                    collection.add(new Entity_1.default('1', 'test', {}));
                    // @ts-expect-error - we know that this entity does not exist
                    collection.add(new Entity_1.default('2', 'test', {}));
                    const observableCollection = vue_1.default.observable(collection);
                    const messageData = {
                        collection: observableCollection,
                    };
                    return messageData;
                }
            }
        ].forEach(({ testName, createMessageData }) => {
            it(testName, () => {
                var _a, _b;
                const messageData = createMessageData();
                const serializedMessageData = serialize(messageData);
                expect(typeof serializedMessageData.collection).toBe('object');
                expect(typeof serializedMessageData.collection.getIds).toBe('undefined');
                expect(serializedMessageData.collection.hasOwnProperty('__type__')).toBe(true);
                expect(serializedMessageData.collection.__type__).toBe('__EntityCollection__');
                expect(serializedMessageData.collection.hasOwnProperty('__source__')).toBe(true);
                expect(serializedMessageData.collection.__source__).toBe('test');
                expect(serializedMessageData.collection.hasOwnProperty('__entityName__')).toBe(true);
                expect(serializedMessageData.collection.__entityName__).toBe('jest');
                expect(serializedMessageData.collection.hasOwnProperty('__context__')).toBe(true);
                expect(typeof serializedMessageData.collection.__context__).toBe('object');
                expect(serializedMessageData.collection.hasOwnProperty('__criteria__')).toBe(true);
                expect(serializedMessageData.collection.__criteria__ instanceof Criteria_1.default).toBe(false);
                expect(serializedMessageData.collection.hasOwnProperty('__entities__')).toBe(true);
                expect(Array.isArray(serializedMessageData.collection.__entities__)).toBe(true);
                expect(serializedMessageData.collection.__entities__.length).toBe(2);
                expect(serializedMessageData.collection.__entities__[0].__id__).toBe('1');
                expect(serializedMessageData.collection.__entities__[1].__id__).toBe('2');
                expect(serializedMessageData.collection.hasOwnProperty('__total__')).toBe(true);
                expect(serializedMessageData.collection.__total__).toBe(42);
                expect(serializedMessageData.collection.hasOwnProperty('__aggregations__')).toBe(true);
                expect(serializedMessageData.collection.__aggregations__).toStrictEqual(['test', 'foo']);
                const deserializedMessageData = deserialize(serializedMessageData, new MessageEvent(''));
                expect(deserializedMessageData.collection instanceof EntityCollection_1.default).toBe(true);
                expect(deserializedMessageData.collection.total).toBe(42);
                expect(deserializedMessageData.collection.criteria instanceof Criteria_1.default).toBe(true);
                expect(deserializedMessageData.collection.aggregations).toStrictEqual(['test', 'foo']);
                expect(deserializedMessageData.collection.source).toBe('test');
                expect(deserializedMessageData.collection.entity).toBe('jest');
                expect(typeof ((_a = deserializedMessageData.collection.first()) === null || _a === void 0 ? void 0 : _a.getDraft)).toBe('function');
                expect(typeof ((_b = deserializedMessageData.collection.last()) === null || _b === void 0 ? void 0 : _b.getDraft)).toBe('function');
            });
        });
    });
});
//# sourceMappingURL=entity-collection-serializer.spec.js.map