import { z } from 'zod';
import { serviceEventResponseSchema } from '../response-schema';
import type { ServiceEventContractEntry } from '../../types';

const promptRequestSchema = z.object({
  prompt: z.string().min(1),
}).strict();

export const copilotChatPromptContracts: ServiceEventContractEntry[] = [
  ['copilot.chat.prompt.v1', {
    requestSchema: promptRequestSchema,
    responseSchema: serviceEventResponseSchema,
  }],
];
