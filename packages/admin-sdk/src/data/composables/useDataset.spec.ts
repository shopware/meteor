/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue';
import flushPromises from 'flush-promises';
import { useDataset } from './useDataset';
import { get, subscribe, update } from '../index';

Vue.config.devtools = false;
Vue.config.productionTip = false;

// Mock the data methods
jest.mock('../index', () => ({
  get: jest.fn(),
  subscribe: jest.fn(),
  update: jest.fn(),
}));

const getMock = get as jest.Mock;
const subscribeMock = subscribe as jest.Mock;
const updateMock = update as jest.Mock;

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

describe('useDataset composable', () => {
  beforeEach(() => {
    getMock.mockClear();
    subscribeMock.mockClear();
    updateMock.mockClear();
    
    // Default mock implementations
    getMock.mockResolvedValue({ name: 'Initial Name' });
    subscribeMock.mockReturnValue(() => {}); // Return an empty unsubscribe function
    updateMock.mockResolvedValue(undefined);
  });

  it('should not be ready at the beginning and become ready afterwards', async () => {
    const [result, app] = mockLoadComposableInApp(() => useDataset('product'));

    expect(result.isReady.value).toBe(false);

    await flushPromises();

    expect(result.isReady.value).toBe(true);

    app.$destroy();
  });

  it('should fetch initial data and update the state', async () => {
    const initialData = { name: 'Test Product' };
    getMock.mockResolvedValue(initialData);

    const [result, app] = mockLoadComposableInApp(() => useDataset('product'));

    expect(result.data.value).toBe(null);
    
    await flushPromises();

    expect(getMock).toHaveBeenCalledWith({ id: 'product', selectors: undefined });
    expect(result.data.value).toEqual(initialData);

    app.$destroy();
  });

  it('should subscribe to data changes and update the state', async () => {
    let subscribeCallback: (data: { data: any }) => void = () => {};
    subscribeMock.mockImplementation((_, callback) => {
      subscribeCallback = callback;
      return () => {};
    });

    const [result, app] = mockLoadComposableInApp(() => useDataset('product'));
    await flushPromises();

    expect(result.data.value.name).toBe('Initial Name');

    const updatedData = { name: 'Updated Name' };
    subscribeCallback({ data: updatedData });

    await flushPromises();

    expect(result.data.value).toEqual(updatedData);

    app.$destroy();
  });

  it('should call update when the reactive data is changed', async () => {
    const [result, app] = mockLoadComposableInApp(() => useDataset('product'));
    await flushPromises();

    result.data.value.name = 'New Name';
    await flushPromises();
    
    expect(updateMock).toHaveBeenCalledWith({ id: 'product', data: { name: 'New Name' } });

    app.$destroy();
  });

  it('should not call update when data is updated via subscribe', async () => {
    let subscribeCallback: (data: { data: any }) => void = () => {};
    subscribeMock.mockImplementation((_, callback) => {
      subscribeCallback = callback;
      return () => {};
    });

    const [result, app] = mockLoadComposableInApp(() => useDataset('product'));
    await flushPromises();

    updateMock.mockClear();

    const updatedData = { name: 'Updated via subscribe' };
    subscribeCallback({ data: updatedData });
    await flushPromises();
    
    expect(result.data.value).toEqual(updatedData);
    expect(updateMock).not.toHaveBeenCalled();

    app.$destroy();
  });

  it('should call unsubscribe on unmount', async () => {
    const unsubscribeMock = jest.fn();
    subscribeMock.mockReturnValue(unsubscribeMock);

    const [, app] = mockLoadComposableInApp(() => useDataset('product'));
    await flushPromises();

    app.$destroy();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
