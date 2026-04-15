declare module '@shopware-ag/meteor-admin-sdk' {
  export const notification: {
    dispatch: (payload: {
      title: string;
      message: string;
      growl?: boolean;
      variant?: 'success' | 'info' | 'warning' | 'error';
      appearance?: 'system' | 'notification';
    }) => Promise<void>;
  };

  export const ui: {
    componentSection: {
      add: (payload: {
        component: 'card' | 'div' | string;
        positionId: string;
        props: {
          locationId: string;
          title?: string;
          subtitle?: string;
        };
      }) => Promise<void>;
    };
    menu: {
      addMenuItem: (payload: {
        label: string;
        locationId: string;
        parent?: string;
        position?: number;
      }) => Promise<void>;
    };
  };

  export const location: {
    MAIN_HIDDEN: string;
    is: (locationId: string) => boolean;
    updateHeight: (height?: number) => Promise<void>;
  };
}

declare module '#admin-sdk-channel' {
  export function createHandler<T extends string>(messageType: T): <TData>(
    method: (data: TData) => unknown,
  ) => () => void;
}
