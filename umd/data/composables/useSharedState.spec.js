var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "worker_threads", "vue", "flush-promises", "localforage"], factory);
    }
})(function (require, exports) {
    "use strict";
    var __syncRequire = typeof module === "object" && typeof module.exports === "object";
    Object.defineProperty(exports, "__esModule", { value: true });
    const worker_threads_1 = require("worker_threads");
    const vue_1 = __importDefault(require("vue"));
    const flush_promises_1 = __importDefault(require("flush-promises"));
    const localforage_1 = __importDefault(require("localforage"));
    vue_1.default.config.devtools = false;
    vue_1.default.config.productionTip = false;
    let useSharedState;
    function mockLoadComposableInApp(composable) {
        let result;
        const app = new vue_1.default({
            setup() {
                result = composable();
                return () => { };
            },
        });
        app.$mount(document.createElement('div'));
        return [result, app];
    }
    describe('useSharedState composable', () => {
        const storeMock = localforage_1.default.createInstance({
            name: 'adminExtensionSDK',
            storeName: 'persistentSharedValueStore',
        });
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            window.addEventListener('message', (event) => {
                if (event.origin === '') {
                    event.stopImmediatePropagation();
                    const eventWithOrigin = new MessageEvent('message', {
                        data: event.data,
                        origin: window.location.href,
                    });
                    window.dispatchEvent(eventWithOrigin);
                }
            });
            useSharedState = yield (yield __syncRequire ? Promise.resolve().then(() => __importStar(require('./useSharedState'))) : new Promise((resolve_1, reject_1) => { require(['./useSharedState'], resolve_1, reject_1); }).then(__importStar)).useSharedState;
            const setExtensions = yield (yield __syncRequire ? Promise.resolve().then(() => __importStar(require('../../channel'))) : new Promise((resolve_2, reject_2) => { require(['../../channel'], resolve_2, reject_2); }).then(__importStar)).setExtensions;
            setExtensions({
                'test-extension': {
                    baseUrl: 'http://localhost',
                    permissions: {},
                },
            });
        }));
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-expect-error - Mocking BroadcastChannel
            global.BroadcastChannel = worker_threads_1.BroadcastChannel;
            const localStorageMock = (function () {
                let store = {};
                return {
                    getItem(key) {
                        var _a;
                        // @ts-expect-error - Mocking localStorage
                        return (_a = store[key]) !== null && _a !== void 0 ? _a : null;
                    },
                    setItem(key, value) {
                        // @ts-expect-error - Mocking localStorage
                        store[key] = value;
                    },
                    clear() {
                        store = {};
                    },
                    removeItem(key) {
                        // @ts-expect-error - Mocking localStorage
                        delete store[key];
                    },
                    getAll() {
                        return store;
                    },
                };
            })();
            Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            window.localStorage.clear();
        }));
        [
            {
                key: 'age',
                initialValue: 0,
            },
            {
                key: 'age',
                initialValue: 27,
            },
            {
                key: 'name',
                initialValue: 'John Doe',
            },
        ].forEach(({ key, initialValue }) => {
            it(`should return a shared state value for key "${key}" with initial value "${initialValue}"`, () => __awaiter(void 0, void 0, void 0, function* () {
                const [result, app] = mockLoadComposableInApp(() => useSharedState(key, initialValue));
                expect(result.value).toBe(initialValue);
                app.$destroy();
            }));
        });
        [
            {
                key: 'age',
                initialValue: 0,
                storeValue: 27,
            },
            {
                key: 'age',
                initialValue: 27,
                storeValue: 0,
            },
            {
                key: 'name',
                initialValue: 'John Doe',
                storeValue: 'Jane Doe',
            },
        ].forEach(({ key, initialValue, storeValue }) => {
            it(`should load the value from the localforage for key "${key}" with initial value "${initialValue}" and store value ${storeValue}`, () => __awaiter(void 0, void 0, void 0, function* () {
                yield storeMock.setItem(key, storeValue);
                const [result, app] = mockLoadComposableInApp(() => useSharedState(key, initialValue));
                expect(result.value).toBe(initialValue);
                // Wait until the value is loaded from the localforage
                yield (0, flush_promises_1.default)();
                expect(result.value).toBe(storeValue);
                app.$destroy();
            }));
        });
        [
            {
                key: 'age',
                initialValue: 0,
                updatedValue: 27,
            },
            {
                key: 'age',
                initialValue: 27,
                updatedValue: 0,
            },
            {
                key: 'name',
                initialValue: 'John Doe',
                updatedValue: 'Jane Doe',
            },
        ].forEach(({ key, initialValue, updatedValue }) => {
            it(`should update the value "${initialValue}" for "${key}" in the localforage when the value is changed to ${updatedValue}`, () => __awaiter(void 0, void 0, void 0, function* () {
                const [result, app] = mockLoadComposableInApp(() => useSharedState(key, initialValue));
                yield (0, flush_promises_1.default)();
                let storeValue = yield storeMock.getItem(key);
                expect(storeValue).toBe(initialValue);
                expect(result.value).toBe(initialValue);
                result.value = updatedValue;
                // Wait until the value is updated in the localforage
                yield (0, flush_promises_1.default)();
                storeValue = yield storeMock.getItem(key);
                expect(storeValue).toBe(updatedValue);
                expect(result.value).toBe(updatedValue);
                app.$destroy();
            }));
        });
        it('should update all sharedStates when the value is changed', () => __awaiter(void 0, void 0, void 0, function* () {
            const [result1, app1] = mockLoadComposableInApp(() => useSharedState('age', 0));
            yield (0, flush_promises_1.default)();
            const [result2, app2] = mockLoadComposableInApp(() => useSharedState('age', 27));
            const [result3, app3] = mockLoadComposableInApp(() => useSharedState('name', 'John Doe'));
            yield (0, flush_promises_1.default)();
            expect(result1.value).toBe(0);
            expect(result2.value).toBe(0);
            expect(result3.value).toBe('John Doe');
            result1.value = 42;
            yield (0, flush_promises_1.default)();
            expect(result1.value).toBe(42);
            expect(result2.value).toBe(42);
            expect(result3.value).toBe('John Doe');
            app1.$destroy();
            app2.$destroy();
            app3.$destroy();
        }));
        it('should remove broadcast event listener onBeforeUnmount', () => __awaiter(void 0, void 0, void 0, function* () {
            const [result, app] = mockLoadComposableInApp(() => useSharedState('age', 0));
            yield (0, flush_promises_1.default)();
            expect(result.value).toBe(0);
            app.$destroy();
            yield storeMock.setItem('age', 27);
            const persistentSharedValueStoreBroadcast = new worker_threads_1.BroadcastChannel('persistentSharedValueStore');
            persistentSharedValueStoreBroadcast.postMessage({
                type: 'store-change',
                key: 'age',
            });
            yield (0, flush_promises_1.default)();
            expect(result.value).toBe(0);
            persistentSharedValueStoreBroadcast.close();
        }));
        it('should listen to events when not unmounted yet', () => __awaiter(void 0, void 0, void 0, function* () {
            const [result, app] = mockLoadComposableInApp(() => useSharedState('age', 0));
            yield (0, flush_promises_1.default)();
            expect(result.value).toBe(0);
            yield storeMock.setItem('age', 27);
            const persistentSharedValueStoreBroadcast = new worker_threads_1.BroadcastChannel('persistentSharedValueStore');
            persistentSharedValueStoreBroadcast.postMessage({
                type: 'store-change',
                key: 'age',
            });
            yield (0, flush_promises_1.default)();
            expect(result.value).toBe(27);
            persistentSharedValueStoreBroadcast.close();
            app.$destroy();
        }));
        it('should ignore events which arent of type store-change', () => __awaiter(void 0, void 0, void 0, function* () {
            const [result, app] = mockLoadComposableInApp(() => useSharedState('age', 0));
            yield (0, flush_promises_1.default)();
            expect(result.value).toBe(0);
            yield storeMock.setItem('age', 27);
            const persistentSharedValueStoreBroadcast = new worker_threads_1.BroadcastChannel('persistentSharedValueStore');
            persistentSharedValueStoreBroadcast.postMessage({
                type: 'not-store-change',
                key: 'age',
            });
            yield (0, flush_promises_1.default)();
            expect(result.value).toBe(0);
            persistentSharedValueStoreBroadcast.close();
            app.$destroy();
        }));
    });
});
//# sourceMappingURL=useSharedState.spec.js.map