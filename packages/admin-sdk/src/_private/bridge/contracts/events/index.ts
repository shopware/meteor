import { analyticsDashboardsChangedContracts } from './analytics-dashboards-changed';
import { copilotChatPromptContracts } from './copilot-chat-prompt';
import type { ServiceEventContractEntry } from '../../types';

export const eventContracts: ServiceEventContractEntry[] = [
  ...copilotChatPromptContracts,
  ...analyticsDashboardsChangedContracts,
];
