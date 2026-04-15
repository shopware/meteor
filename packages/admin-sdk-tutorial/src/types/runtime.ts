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
}

export interface TutorialRuntimeState {
  statusLabel: string;
  notificationTitle: string;
  notificationMessage: string;
  notificationTone: 'info' | 'success';
  emptyStateTitle: string;
  emptyStateMessage: string;
  menuItems: DummyAdminMenuItem[];
  surfaces: DummyAdminSurface[];
}

export interface TutorialSdkBridge {
  notification: {
    dispatch: (payload: {
      title: string;
      message: string;
      tone?: 'info' | 'success';
    }) => void;
  };
  menu: {
    add: (payload: { label: string; position?: number }) => void;
  };
  location: {
    render: (payload: {
      locationId: string;
      positionId?: string;
      content: string;
    }) => void;
  };
  reset: (state: TutorialRuntimeState) => void;
}
