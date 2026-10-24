import { get as getLocationId } from '../../location';
import { validateContract } from './contracts';
import { generateRequestId, isAdminChildFrame, isServiceErrorData, isServiceMessage, postServiceMessage, reply } from './utils';
import { ServiceEventError } from './types';
import type {
  PublishServiceEventParams,
  ServiceEventHandler,
  ServiceEventRequest,
  ServiceEventResponse,
  SubscribeServiceEventOptions,
} from './types';

export { ServiceEventError } from './types';
export { SERVICE_ORIGINS } from './service-origins';
export type {
  PublishServiceEventParams,
  ServiceEventHandler,
  ServiceEventErrorCode,
  SubscribeServiceEventOptions,
} from './types';

type Subscription = {
  eventKey: string,
  locationId: string,
  handler: ServiceEventHandler,
  allowedOrigins: readonly string[],
  concurrency: 'parallel' | 'single',
  running: boolean,
};

type TrackedRequest = { source: Window, origin: string, requestId: string };
const subscriptions = new Set<Subscription>();
const pendingRequests = new Set<TrackedRequest>();
const completedRequests: TrackedRequest[] = [];

/** Publish once to matching frames and wait for the first response. */
export async function publishServiceEvent(params: PublishServiceEventParams): Promise<unknown> {
  const timeout = params.options?.timeout ?? 10_000;
  // TypeScript cannot enforce exact origins or finite positive numbers at runtime.
  if (new URL(params.targetOrigin).origin !== params.targetOrigin || params.targetOrigin === 'null') {
    throw new TypeError('targetOrigin must be an exact origin, including its scheme.');
  }
  if (!Number.isFinite(timeout) || timeout <= 0 || timeout > 60_000) {
    throw new RangeError('timeout must be positive and within the browser timer range.');
  }
  validateContract(params.eventKey, params.data, 'request');
  const request: ServiceEventRequest = {
    type: 'request',
    requestId: generateRequestId(),
    eventKey: params.eventKey,
    targetLocationId: params.targetLocationId,
    data: params.data,
  };

  return new Promise((resolve, reject) => {
    const cleanup = (): void => {
      window.clearTimeout(timer);
      window.removeEventListener('message', onMessage);
    };
    const onMessage = (event: MessageEvent<unknown>): void => {
      const response = event.data;
      if (event.origin !== params.targetOrigin || !isServiceMessage(response)
        || response.type !== 'response' || response.requestId !== request.requestId
        || response.eventKey !== request.eventKey || response.targetLocationId !== request.targetLocationId
        || !isAdminChildFrame(event.source)) {
        return;
      }
      cleanup();
      try {
        if (isServiceErrorData(response.data)) {
          throw new ServiceEventError(response.data.error.code, response.data.error.message);
        }
        validateContract(request.eventKey, response.data, 'response');
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    };
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new ServiceEventError('TIMEOUT', 'Service event response timed out.'));
    }, timeout);
    window.addEventListener('message', onMessage);
    try {
      postServiceMessage(request, params.targetOrigin);
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
}

/** Register one handler; return an idempotent unsubscribe callback. */
export function subscribeServiceEvent(
  eventKey: string,
  handler: ServiceEventHandler,
  options: SubscribeServiceEventOptions,
): () => void {
  const locationId = getLocationId();
  if (!locationId) {
    throw new ServiceEventError('MISSING_LOCATION_ID', 'The receiving URL must contain a nonempty location-id.');
  }
  const subscription: Subscription = {
    eventKey,
    locationId,
    handler,
    allowedOrigins: [...options.allowedOrigins],
    concurrency: options.concurrency ?? 'parallel',
    running: false,
  };
  if (subscriptions.size === 0) {
    window.addEventListener('message', receiveRequest);
  }
  subscriptions.add(subscription);
  return (): void => {
    subscriptions.delete(subscription);
    if (subscriptions.size === 0) {
      window.removeEventListener('message', receiveRequest);
    }
  };
}

function receiveRequest(event: MessageEvent<unknown>): void {
  const request = event.data;
  if (!isServiceMessage(request) || request.type !== 'request') {
    return;
  }
  const matches = Array.from(subscriptions).filter(subscription => subscription.eventKey === request.eventKey
    && subscription.locationId === request.targetLocationId);
  if (matches.length === 0) {
    return;
  }
  // Reject messages from other tabs and non-window sources before replying.
  const source = event.source;
  if (!isAdminChildFrame(source)) {
    return;
  }
  const sendError = (error: ServiceEventError): void => {
    reply(source, event.origin, {
      type: 'response',
      requestId: request.requestId,
      eventKey: request.eventKey,
      targetLocationId: request.targetLocationId,
      data: { error: { code: error.code, message: error.message } },
    });
  };
  const allowed = matches.filter(subscription => subscription.allowedOrigins.includes('*')
    || subscription.allowedOrigins.includes(event.origin));
  if (allowed.length === 0) {
    sendError(new ServiceEventError('ORIGIN_NOT_ALLOWED', 'The sender origin is not allowed.'));
    return;
  }
  const isDuplicate = (entry: TrackedRequest): boolean => entry.source === source
    && entry.origin === event.origin && entry.requestId === request.requestId;
  if (Array.from(pendingRequests).some(isDuplicate) || completedRequests.some(isDuplicate)) {
    return;
  }
  try {
    validateContract(request.eventKey, request.data, 'request');
  } catch (error) {
    sendError(error as ServiceEventError);
    return;
  }
  const tracked = { source, origin: event.origin, requestId: request.requestId };
  pendingRequests.add(tracked);
  const finish = (): void => {
    pendingRequests.delete(tracked);
    completedRequests.push(tracked);
    if (completedRequests.length > 100) {
      completedRequests.shift();
    }
  };
  Promise.all(allowed.map(async (subscription): Promise<void> => {
    if (subscription.concurrency === 'single' && subscription.running) {
      sendError(new ServiceEventError('HANDLER_BUSY', 'The service event handler is already running.'));
      return;
    }
    subscription.running = true;
    try {
      let result: unknown;
      try {
        result = await subscription.handler(request.data);
      } catch (error) {
        sendError(new ServiceEventError('HANDLER_ERROR', error instanceof Error ? error.message : 'Service event handler failed.'));
        return;
      }
      validateContract(request.eventKey, result, 'response');
      const response: ServiceEventResponse = {
        type: 'response',
        requestId: request.requestId,
        eventKey: request.eventKey,
        targetLocationId: request.targetLocationId,
        data: result,
      };
      reply(source, event.origin, response);
    } catch (error) {
      sendError(error as ServiceEventError);
    } finally {
      subscription.running = false;
    }
  })).then(finish, finish);
}
