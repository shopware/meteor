import { ServiceEventError, serviceMessageSchema } from './types';
import type { ServiceEventRequest, ServiceEventResponse } from './types';

export function generateRequestId(): string {
  if (typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  // A secure context is required for randomUUID, which plain HTTP development hosts are not.
  const bytes = window.crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * The window embedding this service. Services are direct children of the
 * Administration, so its frame list holds every sibling. Reading the parent
 * instead of the top window keeps that true when the Administration itself is
 * embedded, and returns this window when the SDK runs in the Administration.
 */
function getAdminWindow(): Window {
  return window.parent;
}

/** Send once to each direct child frame of the Administration. */
export function postServiceMessage(message: ServiceEventRequest, targetOrigin: string): void {
  const admin = getAdminWindow();
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
  const admin = getAdminWindow();
  if (!source) {
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
      ok: false,
      error: { code: 'RESPONSE_VALIDATION_FAILED', message: 'Response data cannot be cloned by postMessage.' },
    };
    source.postMessage(failure, origin);
  }
}
