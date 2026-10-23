import { ServiceEventError, serviceEventErrorCodes, serviceMessageSchema } from './types';
import type { ServiceEventErrorData, ServiceEventRequest, ServiceEventResponse } from './types';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function generateRequestId(): string {
  return window.crypto.randomUUID();
}

/** Send once to each direct child frame. */
export function postServiceMessage(message: ServiceEventRequest, targetOrigin: string): void {
  const admin = window.top;
  if (!admin) {
    return;
  }
  for (let index = 0; index < admin.frames.length; index += 1) {
    try {
      const frame = admin.frames[index];
      frame.postMessage(message, targetOrigin);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'DataCloneError') {
        throw new ServiceEventError('REQUEST_VALIDATION_FAILED', 'Request data cannot be cloned by postMessage.');
      }
      // An inaccessible or detached candidate must not block other receivers.
    }
  }
}

export function isAdminChildFrame(source: MessageEventSource | null): source is Window {
  const admin = window.top;
  if (!admin || !source) {
    return false;
  }
  for (let index = 0; index < admin.frames.length; index += 1) {
    if (admin.frames[index] === source) {
      return true;
    }
  }
  return false;
}

export function isServiceMessage(value: unknown): value is ServiceEventRequest | ServiceEventResponse {
  return serviceMessageSchema.safeParse(value).success;
}

export function isServiceErrorData(value: unknown): value is ServiceEventErrorData {
  if (!isRecord(value) || !isRecord(value.error)) {
    return false;
  }
  const error = value.error;
  return typeof error.message === 'string'
    && serviceEventErrorCodes.some(code => code === error.code);
}

export function reply(source: Window, origin: string, response: ServiceEventResponse): void {
  if (origin === 'null') {
    return;
  }
  try {
    source.postMessage(response, origin);
  } catch (error) {
    if (!(error instanceof DOMException) || error.name !== 'DataCloneError') {
      // The sender can navigate or close while its handler is running.
      return;
    }
    const failure: ServiceEventResponse = {
      requestId: response.requestId,
      eventKey: response.eventKey,
      targetLocationId: response.targetLocationId,
      type: 'response',
      data: {
        error: { code: 'RESPONSE_VALIDATION_FAILED', message: 'Response data cannot be cloned by postMessage.' },
      },
    };
    source.postMessage(failure, origin);
  }
}
