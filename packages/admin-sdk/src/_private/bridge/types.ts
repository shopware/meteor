import { z } from 'zod';

export type PublishServiceEventParams = {
  targetOrigin: string,
  targetLocationId: string,
  eventKey: string,
  data: unknown,
  options?: { timeout?: number },
};

export type ServiceEventHandler = (data: unknown) => unknown | Promise<unknown>;

export type SubscribeServiceEventOptions = {
  allowedOrigins: readonly string[],
  concurrency?: 'parallel' | 'single',
};

export const serviceEventErrorCodes = [
  'TIMEOUT',
  'ORIGIN_NOT_ALLOWED',
  'REQUEST_VALIDATION_FAILED',
  'RESPONSE_VALIDATION_FAILED',
  'HANDLER_ERROR',
  'HANDLER_BUSY',
  'MISSING_LOCATION_ID',
] as const;

export type ServiceEventErrorCode = typeof serviceEventErrorCodes[number];

export class ServiceEventError extends Error {
  constructor(public readonly code: ServiceEventErrorCode, message: string) {
    super(message);
    this.name = 'ServiceEventError';
  }
}

export const serviceMessageSchema = z.object({
  type: z.enum(['request', 'response']),
  requestId: z.string().min(1),
  eventKey: z.string(),
  targetLocationId: z.string(),
  data: z.unknown(),
}).refine(value => Object.prototype.hasOwnProperty.call(value, 'data'), {
  // z.unknown() accepts a missing key; explicit undefined remains a valid payload.
  message: 'Message must contain data.',
  path: ['data'],
});

// Zod 3 infers unknown fields as optional; the schema requires the data key.
export type ServiceMessage = Required<z.infer<typeof serviceMessageSchema>>;

export interface ServiceEventRequest extends ServiceMessage {
  type: 'request',
}

export interface ServiceEventResponse extends ServiceMessage {
  type: 'response',
}

export type ServiceEventErrorData = {
  error: { code: ServiceEventErrorCode, message: string },
};

export type ServiceEventContract = {
  requestSchema?: z.ZodTypeAny,
  responseSchema?: z.ZodTypeAny,
};

export type ServiceEventContractEntry = [eventKey: string, contract: ServiceEventContract];
