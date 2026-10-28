import { webcrypto } from 'crypto';
import { publishServiceEvent, subscribeServiceEvent } from './index';

// Only the Admin RPC channel is stubbed; bridge transport/validation stays real.
jest.mock('../../channel', () => ({ send: jest.fn() }));

const senderOrigin = 'https://analytics.example.com';
const receiverOrigin = 'https://copilot.example.com';
const params = {
  targetOrigin: receiverOrigin,
  targetLocationId: 'copilot-chat',
  eventKey: 'custom.v1',
  data: { prompt: 'Hello' },
  options: { timeout: 100 },
};
let sender;
let receiver;
let disposers;
let parentDescriptor;
let cryptoDescriptor;
const emit = (data, origin, source) => window.dispatchEvent(new MessageEvent('message', { data, origin, source }));
const flush = async () => { for (let i = 0; i < 10; i += 1) await Promise.resolve(); };
const subscribe = (handler, options = {}, key = params.eventKey) => {
  const stop = subscribeServiceEvent(key, handler, { allowedOrigins: [senderOrigin], ...options });
  disposers.push(stop);
  return stop;
};
const request = (requestId, overrides = {}) => ({
  type: 'request', requestId, eventKey: params.eventKey,
  targetLocationId: params.targetLocationId, data: params.data, ...overrides,
});

beforeEach(() => {
  jest.useFakeTimers();
  cryptoDescriptor = Object.getOwnPropertyDescriptor(window, 'crypto');
  Object.defineProperty(window, 'crypto', { configurable: true, value: webcrypto });
  window.history.replaceState({}, '', '/?location-id=copilot-chat');
  parentDescriptor = Object.getOwnPropertyDescriptor(window, 'parent');
  disposers = [];
  sender = { postMessage: jest.fn((data, origin) => {
    if (origin === senderOrigin) emit(data, receiverOrigin, receiver);
  }) };
  receiver = { postMessage: jest.fn((data, origin) => {
    if (origin === receiverOrigin) emit(data, senderOrigin, sender);
  }) };
  Object.defineProperty(window, 'parent', { configurable: true, value: { frames: [sender, receiver] } });
});
afterEach(() => {
  disposers.forEach(stop => stop());
  Object.defineProperty(window, 'parent', parentDescriptor);
  if (cryptoDescriptor) Object.defineProperty(window, 'crypto', cryptoDescriptor);
  else delete window.crypto;
  jest.useRealTimers();
});

test('publishes through sibling frames, awaits the handler and cleans up', async () => {
  const handler = jest.fn(async data => ({ received: data.prompt }));
  subscribe(handler);
  await expect(publishServiceEvent(params)).resolves.toEqual({ received: 'Hello' });
  expect(handler).toHaveBeenCalledTimes(1);
  expect(receiver.postMessage).toHaveBeenCalledWith(expect.objectContaining({ type: 'request' }), receiverOrigin);
  expect(jest.getTimerCount()).toBe(0);
});

test('does not confuse business error data with SDK errors', async () => {
  const result = { error: { code: 'HANDLER_ERROR', message: 'Business result' } };
  subscribe(() => result);
  await expect(publishServiceEvent(params)).resolves.toEqual(result);
});

test('rejects thrown handler errors', async () => {
  subscribe(() => { throw new Error('Failed operation'); });
  await expect(publishServiceEvent(params)).rejects.toMatchObject({ code: 'HANDLER_ERROR', message: 'Failed operation' });
});

test.each([{ origins: [] }, { origins: ['https://untrusted.example.com'] }])('rejects unauthorized origins: %j', async ({ origins }) => {
  const handler = jest.fn();
  subscribe(handler, { allowedOrigins: origins });
  await expect(publishServiceEvent(params)).rejects.toMatchObject({ code: 'ORIGIN_NOT_ALLOWED' });
  expect(handler).not.toHaveBeenCalled();
});

test('supports the wildcard allowlist', async () => {
  subscribe(() => 'accepted', { allowedOrigins: ['*'] });
  await expect(publishServiceEvent(params)).resolves.toBe('accepted');
});

test('ignores wrong location, event key, malformed messages, and non-sibling sources', async () => {
  const handler = jest.fn();
  subscribe(handler);
  emit(request('wrong-location', { targetLocationId: 'other' }), senderOrigin, sender);
  emit(request('wrong-key', { eventKey: 'other' }), senderOrigin, sender);
  emit({ type: 'request' }, senderOrigin, sender);
  emit(request('outside'), senderOrigin, { postMessage: jest.fn() });
  await flush();
  expect(handler).not.toHaveBeenCalled();
  expect(sender.postMessage).not.toHaveBeenCalled();
});

test('ignores forged and mismatched responses, then accepts the correlated response', async () => {
  receiver.postMessage.mockImplementation(() => {});
  const pending = publishServiceEvent(params);
  const sent = receiver.postMessage.mock.calls[0][0];
  const response = { ...sent, type: 'response', ok: true, data: 'accepted' };
  emit(response, senderOrigin, receiver);
  emit(response, receiverOrigin, { postMessage: jest.fn() });
  for (const field of ['requestId', 'eventKey', 'targetLocationId']) {
    emit({ ...response, [field]: 'wrong' }, receiverOrigin, receiver);
  }
  emit({ ...sent, type: 'response', data: 'missing discriminator' }, receiverOrigin, receiver);
  expect(jest.getTimerCount()).toBe(1);
  emit(response, receiverOrigin, receiver);
  await expect(pending).resolves.toBe('accepted');
  expect(jest.getTimerCount()).toBe(0);
});

test.each([-1, 0, NaN, Infinity, 60_001])('rejects invalid timeout %s', async timeout => {
  await expect(publishServiceEvent({ ...params, options: { timeout } })).rejects.toMatchObject({ code: 'INVALID_PARAMS' });
  expect(receiver.postMessage).not.toHaveBeenCalled();
});

test.each(['*', 'not-a-url', 'null', 'https://copilot.example.com/path'])('rejects invalid origin %s', async targetOrigin => {
  await expect(publishServiceEvent({ ...params, targetOrigin })).rejects.toMatchObject({ code: 'INVALID_PARAMS' });
});

test('accepts the maximum timeout', async () => {
  subscribe(() => 'ok');
  await expect(publishServiceEvent({ ...params, options: { timeout: 60_000 } })).resolves.toBe('ok');
});

test('times out once and removes the response listener', async () => {
  const remove = jest.spyOn(window, 'removeEventListener');
  const pending = publishServiceEvent(params);
  const assertion = expect(pending).rejects.toMatchObject({ code: 'TIMEOUT' });
  jest.advanceTimersByTime(100);
  await assertion;
  expect(receiver.postMessage).toHaveBeenCalledTimes(1);
  expect(remove).toHaveBeenCalledWith('message', expect.any(Function));
  remove.mockRestore();
});

test('validates requests on both publisher and receiver', async () => {
  const handler = jest.fn();
  subscribe(handler, {}, 'copilot.chat.prompt.v1');
  await expect(publishServiceEvent({ ...params, eventKey: 'copilot.chat.prompt.v1', data: {} }))
    .rejects.toMatchObject({ code: 'REQUEST_VALIDATION_FAILED' });
  emit(request('invalid', { eventKey: 'copilot.chat.prompt.v1', data: {} }), senderOrigin, sender);
  expect(handler).not.toHaveBeenCalled();
  expect(sender.postMessage).toHaveBeenCalledWith(expect.objectContaining({
    ok: false, error: expect.objectContaining({ code: 'REQUEST_VALIDATION_FAILED' }),
  }), senderOrigin);
});

test('validates handler results', async () => {
  subscribe(() => ({ status: 'invalid' }), {}, 'copilot.chat.prompt.v1');
  await expect(publishServiceEvent({ ...params, eventKey: 'copilot.chat.prompt.v1' }))
    .rejects.toMatchObject({ code: 'RESPONSE_VALIDATION_FAILED' });
});

test('validates responses at the publisher even if a peer bypasses its schema', async () => {
  receiver.postMessage.mockImplementation(sent => emit({ ...sent, type: 'response', ok: true, data: {} }, receiverOrigin, receiver));
  await expect(publishServiceEvent({ ...params, eventKey: 'copilot.chat.prompt.v1' }))
    .rejects.toMatchObject({ code: 'RESPONSE_VALIDATION_FAILED' });
});

test('single is the default and stays busy after the publisher times out', async () => {
  let finish;
  subscribe(() => new Promise(resolve => { finish = resolve; }));
  const first = publishServiceEvent(params);
  await expect(publishServiceEvent(params)).rejects.toMatchObject({ code: 'HANDLER_BUSY' });
  const timedOut = expect(first).rejects.toMatchObject({ code: 'TIMEOUT' });
  jest.advanceTimersByTime(100);
  await timedOut;
  await expect(publishServiceEvent(params)).rejects.toMatchObject({ code: 'HANDLER_BUSY' });
  finish('done');
  await flush();
  const next = publishServiceEvent(params);
  finish('next');
  await expect(next).resolves.toBe('next');
});

test('parallel allows overlapping handlers', async () => {
  const finishes = [];
  subscribe(() => new Promise(resolve => finishes.push(resolve)), { concurrency: 'parallel' });
  const first = publishServiceEvent(params);
  const second = publishServiceEvent(params);
  expect(finishes).toHaveLength(2);
  finishes[0]('first');
  finishes[1]('second');
  await expect(first).resolves.toBe('first');
  await expect(second).resolves.toBe('second');
});

test('deduplicates pending and completed requests without replaying responses', async () => {
  let finish;
  const handler = jest.fn(() => new Promise(resolve => { finish = resolve; }));
  subscribe(handler);
  const message = request('duplicate');
  emit(message, senderOrigin, sender);
  emit(message, senderOrigin, sender);
  expect(handler).toHaveBeenCalledTimes(1);
  finish('done');
  await flush();
  emit(message, senderOrigin, sender);
  expect(handler).toHaveBeenCalledTimes(1);
  expect(sender.postMessage).toHaveBeenCalledTimes(1);
});

test('evicts the oldest completed ID after 100 requests', async () => {
  const handler = jest.fn(() => 'ok');
  subscribe(handler);
  for (let i = 0; i <= 100; i += 1) {
    emit(request(`fifo-${i}`), senderOrigin, sender);
    await flush();
  }
  emit(request('fifo-100'), senderOrigin, sender);
  expect(handler).toHaveBeenCalledTimes(101);
  emit(request('fifo-0'), senderOrigin, sender);
  await flush();
  expect(handler).toHaveBeenCalledTimes(102);
});

test('rejects duplicate subscriptions without replacing the original handler', async () => {
  subscribe(() => 'original');
  const duplicate = jest.fn(() => 'duplicate');
  expect(() => subscribe(duplicate, { concurrency: 'parallel', allowedOrigins: ['*'] }))
    .toThrow(expect.objectContaining({ code: 'DUPLICATE_SUBSCRIPTION' }));
  await expect(publishServiceEvent(params)).resolves.toBe('original');
  expect(duplicate).not.toHaveBeenCalled();
});

test('allows different event keys in the same location', async () => {
  subscribe(() => 'first');
  subscribe(() => 'second', {}, 'other.v1');
  await expect(publishServiceEvent(params)).resolves.toBe('first');
  await expect(publishServiceEvent({ ...params, eventKey: 'other.v1' })).resolves.toBe('second');
});

test('scopes duplicate registration to the location ID', async () => {
  subscribe(() => 'first location');
  window.history.replaceState({}, '', '/?location-id=other-location');
  subscribe(() => 'second location');
  await expect(publishServiceEvent(params)).resolves.toBe('first location');
  await expect(publishServiceEvent({ ...params, targetLocationId: 'other-location' })).resolves.toBe('second location');
});

test('unsubscribe is idempotent and permits registering the same event again', async () => {
  const removed = jest.fn();
  const stop = subscribe(removed);
  stop();
  stop();
  subscribe(() => 'remaining');
  await expect(publishServiceEvent(params)).resolves.toBe('remaining');
  expect(removed).not.toHaveBeenCalled();
});

test('requires a receiving location ID', () => {
  window.history.replaceState({}, '', '/');
  expect(() => subscribe(() => 'unused')).toThrow(expect.objectContaining({ code: 'MISSING_LOCATION_ID' }));
});
