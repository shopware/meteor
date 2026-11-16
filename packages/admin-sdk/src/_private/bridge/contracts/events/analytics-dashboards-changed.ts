import { z } from 'zod';
import { serviceEventResponseSchema } from '../response-schema';
import type { ServiceEventContractEntry } from '../../types';

// Never `.strict()`: receivers on an older SDK must keep accepting optional fields added to v1 later.
const dashboardsChangedRequestSchema = z.object({}).passthrough();

export const analyticsDashboardsChangedContracts: ServiceEventContractEntry[] = [
  ['analytics.dashboards.changed.v1', {
    requestSchema: dashboardsChangedRequestSchema,
    responseSchema: serviceEventResponseSchema,
  }],
];
