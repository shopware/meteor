/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { useAsyncSharedState as useAsyncSharedStateType } from './useAsyncSharedState';
import { BroadcastChannel } from 'worker_threads';
import Vue from 'vue';
import flushPromises from 'flush-promises';
import localforage from 'localforage';

Vue.config.devtools = false;
Vue.config.productionTip = false;

let useAsyncSharedState: typeof useAsyncSharedStateType;

function mockLoadComposableInApp(composable: () => any) {
  let result: any;

  const app = new Vue({
    setup() {
      result = composable();
      
      return () => {};
    },
  });

  app.$mount(document.createElement('div'));

  return [result, app];
}

describe('useAsyncSharedState composable', () => {
  const storeMock = localforage.createInstance({
    name: 'adminExtensionSDK',
    storeName: 'persistentSharedValueStore',
  });

  beforeAll(async () => {
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.origin === '') {
        event.stopImmediatePropagation();
        const eventWithOrigin: MessageEvent = new MessageEvent('message', {
          data: event.data,
          origin: window.location.href,
        });
        window.dispatchEvent(eventWithOrigin);
      }
    });
    
    useAsyncSharedState = await (await import('./useAsyncSharedState')).useAsyncSharedState;
    const setExtensions = await (await import('../../channel')).setExtensions;

    setExtensions({
      'test-extension': {
        baseUrl: 'http://localhost',
        permissions: {},
      },
    });
  });

  beforeEach(async () => {
    // @ts-expect-error - Mocking BroadcastChannel
    global.BroadcastChannel = BroadcastChannel;

    const localStorageMock = (function () {
      let store = {};
    
      return {
        getItem(key: any) {
          // @ts-expect-error - Mocking localStorage
          return store[key] ?? null;
        },
    
        setItem(key: any, value: any) {
          // @ts-expect-error - Mocking localStorage
          store[key] = value;
        },
    
        clear() {
          store = {};
        },
    
        removeItem(key: any) {
          // @ts-expect-error - Mocking localStorage
          delete store[key];
        },
    
        getAll() {
          return store;
        },
      };
    })();
    
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    await storeMock.clear();
  });

  afterEach(async () => {
    window.localStorage.clear();
    await storeMock.clear();
  });

  it('should be not ready at the beginning and become ready afterwards', async () => {
    const [result, app] = mockLoadComposableInApp(() => useAsyncSharedState('age', 0));

    expect(result.isReady.value).toBe(false);

    await flushPromises();

    expect(result.isReady.value).toBe(true);

    app.$destroy();
  });

  it('should resolve the ready promise', async () => {
    const [result, app] = mockLoadComposableInApp(() => useAsyncSharedState('age', 0));
    let isReady = false;

    void result.ready.then(() => {
      isReady = true;
    });

    expect(isReady).toBe(false);

    await flushPromises();

    expect(isReady).toBe(true);

    app.$destroy();
  });

  it('should be ready after the value is loaded from the store', async () => {
    await storeMock.setItem('age', 27);
    const [result, app] = mockLoadComposableInApp(() => useAsyncSharedState('age', 0));

    expect(result.isReady.value).toBe(false);
    expect(result.state.value).toBe(0);

    await flushPromises();

    expect(result.isReady.value).toBe(true);
    expect(result.state.value).toBe(27);

    app.$destroy();
  });

  it('should update the state when the value is updated', async () => {
    const [result, app] = mockLoadComposableInApp(() => useAsyncSharedState('age', 0));

    expect(result.state.value).toBe(0);

    await flushPromises();

    result.state.value = 27;

    expect(result.state.value).toBe(27);

    await flushPromises();

    app.$destroy();
  });

  it('should update the state when the value is updated somewhere else', async () => {
    const [result, app] = mockLoadComposableInApp(() => useAsyncSharedState('age', 0));
    const [result2, app2] = mockLoadComposableInApp(() => useAsyncSharedState('age', 0));

    expect(result.state.value).toBe(0);

    await flushPromises();

    result2.state.value = 27;

    await flushPromises();

    expect(result.state.value).toBe(27);

    await flushPromises();

    app.$destroy();
    app2.$destroy();
  });

  it('should support deep reactivity with objects', async () => {
    const initialValue = { user: { name: 'John', age: 30 } };
    const [result, app] = mockLoadComposableInApp(() => useAsyncSharedState('user', initialValue));

    expect(result.state.value).toEqual(initialValue);

    await flushPromises();

    // Update nested property
    result.state.value.user.age = 31;

    expect(result.state.value.user.age).toBe(31);
    expect(result.state.value.user.name).toBe('John');

    // Update entire nested object
    result.state.value.user = { name: 'Jane', age: 25 };

    expect(result.state.value.user).toEqual({ name: 'Jane', age: 25 });

    await flushPromises();
    app.$destroy();
  });

  it('should support deep reactivity with objects and update the state somewhere else', async () => {
    const initialValue = { user: { name: 'John', age: 30 } };
    const [result, app] = mockLoadComposableInApp(() => useAsyncSharedState('user', initialValue));
    const [result2, app2] = mockLoadComposableInApp(() => useAsyncSharedState('user', initialValue));

    expect(result.state.value).toEqual(initialValue);

    await flushPromises();

    // Update nested property
    result2.state.value.user.age = 31;
    await flushPromises();

    expect(result.state.value.user.age).toBe(31);
    expect(result.state.value.user.name).toBe('John');

    // Update entire nested object
    result.state.value.user = { name: 'Jane', age: 25 };

    expect(result.state.value.user).toEqual({ name: 'Jane', age: 25 });

    await flushPromises();

    app.$destroy();
    app2.$destroy();
  });
});
