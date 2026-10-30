import { z } from 'zod';

export type PublishServiceEventParams = {
  targetOrigin: string,
  targetLocationId: string,
  eventKey: string,
  data: unknown,
  options?: {
    timeout?: number,
  },
};

export type ServiceEventHandler = (data: unknown) => unknown | Promise<unknown>;

export type SubscribeServiceEventOptions = {
  allowedOrigins: readonly string[],
  concurrency?: 'single' | 'parallel',
};

export const serviceEventErrorCodes = [
  'INVALID_PARAMS',
  'INTERNAL_ERROR',
  'TIMEOUT',
  'ORIGIN_NOT_ALLOWED',
  'REQUEST_VALIDATION_FAILED',
  'RESPONSE_VALIDATION_FAILED',
  'HANDLER_ERROR',
  'HANDLER_BUSY',
  'MISSING_LOCATION_ID',
  'DUPLICATE_SUBSCRIPTION',
] as const;

export type ServiceEventErrorCode = typeof serviceEventErrorCodes[number];

export class ServiceEventError extends Error {
  constructor(public readonly code: ServiceEventErrorCode, message: string) {
    super(message);
    this.name = 'ServiceEventError';
  }
}

const messageFields = {
  requestId: z.string().min(1),
  eventKey: z.string(),
  targetLocationId: z.string(),
};

const requestSchema = z.object({
  ...messageFields,
  type: z.literal('request'),
  data: z.unknown(),
});

const successResponseSchema = z.object({
  ...messageFields,
  type: z.literal('response'),
  ok: z.literal(true),
  data: z.unknown(),
});

const errorResponseSchema = z.object({
  ...messageFields,
  type: z.literal('response'),
  ok: z.literal(false),
  error: z.object({
    code: z.enum(serviceEventErrorCodes),
    message: z.string(),
  }),
});

export const serviceMessageSchema = z.union([
  requestSchema,
  successResponseSchema,
  errorResponseSchema,
]).refine(value => (value.type === 'response' && !value.ok)
  || Object.prototype.hasOwnProperty.call(value, 'data'), {
  message: 'Message must contain data.',
  path: ['data'],
});

export type ServiceEventRequest = Required<z.infer<typeof requestSchema>>;
export type ServiceEventResponse = Required<z.infer<typeof successResponseSchema>>
  | z.infer<typeof errorResponseSchema>;
export type ServiceMessage = ServiceEventRequest | ServiceEventResponse;

export type ServiceEventContract = {
  requestSchema?: z.ZodTypeAny,
  responseSchema?: z.ZodTypeAny,
};

export type ServiceEventContractEntry = [eventKey: string, contract: ServiceEventContract];
