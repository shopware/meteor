import { z } from 'zod';

/** Shared response fields. Extend with event-specific fields using .extend(). */
export const serviceEventResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  message: z.string().optional(),
}).strict();
