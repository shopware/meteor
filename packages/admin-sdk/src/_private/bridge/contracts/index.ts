import { ServiceEventError } from '../types';
import { eventContracts } from './events';
import type { ServiceEventContract } from '../types';

// Canonical contracts are maintained with the SDK.
const serviceEventContracts = new Map<string, ServiceEventContract>(eventContracts);

export function validateContract(eventKey: string, data: unknown, phase: 'request' | 'response'): void {
  const contract = serviceEventContracts.get(eventKey);
  const schema = contract?.[phase === 'request' ? 'requestSchema' : 'responseSchema'];
  if (schema && !schema.safeParse(data).success) {
    throw new ServiceEventError(
      phase === 'request' ? 'REQUEST_VALIDATION_FAILED' : 'RESPONSE_VALIDATION_FAILED',
      `Invalid ${phase} data for service event "${eventKey}".`,
    );
  }
}
