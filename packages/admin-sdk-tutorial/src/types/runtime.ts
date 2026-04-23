export interface DummyAdminMenuItem {
  id: string;
  label: string;
  kind: 'static' | 'dynamic';
  position?: number;
}

export interface DummyAdminSurface {
  id: string;
  title: string;
  description: string;
  variant: 'default' | 'ghost';
  slotLabel?: string;
  injectedContent?: string;
  runtimeLocationId?: string;
  runtimeHeight?: number;
}

export interface TutorialRuntimeState {
  statusLabel: string;
  notificationTitle: string;
  notificationMessage: string;
  notificationTone: 'info' | 'success' | 'warning' | 'error';
  emptyStateTitle: string;
  emptyStateMessage: string;
  menuItems: DummyAdminMenuItem[];
  surfaces: DummyAdminSurface[];
}
