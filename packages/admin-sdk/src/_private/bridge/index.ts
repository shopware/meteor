import { get as getLocationId } from '../../location';
import { validateContract } from './contracts';
import { generateRequestId, isAdminChildFrame, isServiceMessage, postServiceMessage, reply } from './utils';
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

/** The longest a publisher may wait for a response. */
const MAX_TIMEOUT = 60_000;

export async function publishServiceEvent(params: PublishServiceEventParams): Promise<unknown> {
  const timeout = params.options?.timeout ?? 10_000;
  try {
    const origin = new URL(params.targetOrigin).origin;
    if (origin !== params.targetOrigin || origin === 'null') {
      throw new Error();
    }
  } catch {
    throw new ServiceEventError('INVALID_PARAMS', 'targetOrigin must be an exact origin, including its scheme.');
  }
  if (!Number.isFinite(timeout) || timeout <= 0 || timeout > MAX_TIMEOUT) {
    throw new ServiceEventError('INVALID_PARAMS', 'timeout must be greater than 0 and at most 60000 milliseconds.');
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
        if (!response.ok) {
          throw new ServiceEventError(response.error.code, response.error.message);
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
    concurrency: options.concurrency ?? 'single',
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
      ok: false,
      error: { code: error.code, message: error.message },
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
        sendError(error instanceof ServiceEventError
          ? error
          : new ServiceEventError('HANDLER_ERROR', error instanceof Error ? error.message : 'Service event handler failed.'));
        return;
      }
      validateContract(request.eventKey, result, 'response');
      const response: ServiceEventResponse = {
        type: 'response',
        requestId: request.requestId,
        eventKey: request.eventKey,
        targetLocationId: request.targetLocationId,
        ok: true,
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
