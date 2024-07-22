var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BroadcastChannel } from 'worker_threads';
import Vue from 'vue';
import flushPromises from 'flush-promises';
import localforage from 'localforage';
Vue.config.devtools = false;
Vue.config.productionTip = false;
let useSharedState;
function mockLoadComposableInApp(composable) {
    let result;
    const app = new Vue({
        setup() {
            result = composable();
            return () => { };
        },
    });
    app.$mount(document.createElement('div'));
    return [result, app];
}
describe('useSharedState composable', () => {
    const storeMock = localforage.createInstance({
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
        useSharedState = yield (yield import('./useSharedState')).useSharedState;
        const setExtensions = yield (yield import('../../channel')).setExtensions;
        setExtensions({
            'test-extension': {
                baseUrl: 'http://localhost',
                permissions: {},
            },
        });
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-expect-error - Mocking BroadcastChannel
        global.BroadcastChannel = BroadcastChannel;
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
            yield flushPromises();
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
            yield flushPromises();
            let storeValue = yield storeMock.getItem(key);
            expect(storeValue).toBe(initialValue);
            expect(result.value).toBe(initialValue);
            result.value = updatedValue;
            // Wait until the value is updated in the localforage
            yield flushPromises();
            storeValue = yield storeMock.getItem(key);
            expect(storeValue).toBe(updatedValue);
            expect(result.value).toBe(updatedValue);
            app.$destroy();
        }));
    });
    it('should update all sharedStates when the value is changed', () => __awaiter(void 0, void 0, void 0, function* () {
        const [result1, app1] = mockLoadComposableInApp(() => useSharedState('age', 0));
        yield flushPromises();
        const [result2, app2] = mockLoadComposableInApp(() => useSharedState('age', 27));
        const [result3, app3] = mockLoadComposableInApp(() => useSharedState('name', 'John Doe'));
        yield flushPromises();
        expect(result1.value).toBe(0);
        expect(result2.value).toBe(0);
        expect(result3.value).toBe('John Doe');
        result1.value = 42;
        yield flushPromises();
        expect(result1.value).toBe(42);
        expect(result2.value).toBe(42);
        expect(result3.value).toBe('John Doe');
        app1.$destroy();
        app2.$destroy();
        app3.$destroy();
    }));
    it('should remove broadcast event listener onBeforeUnmount', () => __awaiter(void 0, void 0, void 0, function* () {
        const [result, app] = mockLoadComposableInApp(() => useSharedState('age', 0));
        yield flushPromises();
        expect(result.value).toBe(0);
        app.$destroy();
        yield storeMock.setItem('age', 27);
        const persistentSharedValueStoreBroadcast = new BroadcastChannel('persistentSharedValueStore');
        persistentSharedValueStoreBroadcast.postMessage({
            type: 'store-change',
            key: 'age',
        });
        yield flushPromises();
        expect(result.value).toBe(0);
        persistentSharedValueStoreBroadcast.close();
    }));
    it('should listen to events when not unmounted yet', () => __awaiter(void 0, void 0, void 0, function* () {
        const [result, app] = mockLoadComposableInApp(() => useSharedState('age', 0));
        yield flushPromises();
        expect(result.value).toBe(0);
        yield storeMock.setItem('age', 27);
        const persistentSharedValueStoreBroadcast = new BroadcastChannel('persistentSharedValueStore');
        persistentSharedValueStoreBroadcast.postMessage({
            type: 'store-change',
            key: 'age',
        });
        yield flushPromises();
        expect(result.value).toBe(27);
        persistentSharedValueStoreBroadcast.close();
        app.$destroy();
    }));
    it('should ignore events which arent of type store-change', () => __awaiter(void 0, void 0, void 0, function* () {
        const [result, app] = mockLoadComposableInApp(() => useSharedState('age', 0));
        yield flushPromises();
        expect(result.value).toBe(0);
        yield storeMock.setItem('age', 27);
        const persistentSharedValueStoreBroadcast = new BroadcastChannel('persistentSharedValueStore');
        persistentSharedValueStoreBroadcast.postMessage({
            type: 'not-store-change',
            key: 'age',
        });
        yield flushPromises();
        expect(result.value).toBe(0);
        persistentSharedValueStoreBroadcast.close();
        app.$destroy();
    }));
});
//# sourceMappingURL=useSharedState.spec.js.map