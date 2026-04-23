import { createHandler } from '#admin-sdk-channel';

export function registerTutorialHostHandlers(options: {
  onNotification: (payload: {
    title: string;
    message: string;
    variant?: 'success' | 'info' | 'warning' | 'error';
  }) => void;
  onMenuItem: (payload: {
    label: string;
    locationId: string;
    parent?: string;
    position?: number;
  }) => void;
  onComponentSection: (payload: {
    component: string;
    positionId: string;
    props: {
      locationId: string;
      title?: string;
      subtitle?: string;
    };
  }) => void;
  onLocationHeight: (payload: {
    locationId: string | null;
    height: number;
  }) => void;
}) {
  const stopNotificationHandler = createHandler('notificationDispatch')<{
    title: string;
    message: string;
    variant?: 'success' | 'info' | 'warning' | 'error';
  }>((data) => {
    options.onNotification({
      title: data.title,
      message: data.message,
      variant: data.variant,
    });
  });

  const stopMenuItemHandler = createHandler('menuItemAdd')<{
    label: string;
    locationId: string;
    parent?: string;
    position?: number;
  }>((data) => {
    options.onMenuItem({
      label: data.label,
      locationId: data.locationId,
      parent: data.parent,
      position: data.position,
    });
  });

  const stopComponentSectionHandler = createHandler('uiComponentSectionRenderer')<{
    component: string;
    positionId: string;
    props: {
      locationId: string;
      title?: string;
      subtitle?: string;
    };
  }>((data) => {
    options.onComponentSection({
      component: data.component,
      positionId: data.positionId,
      props: data.props,
    });
  });

  const stopLocationHeightHandler = createHandler('locationUpdateHeight')<{
    locationId: string | null;
    height: number;
  }>((data) => {
    options.onLocationHeight({
      locationId: data.locationId,
      height: data.height,
    });
  });

  return () => {
    stopNotificationHandler();
    stopMenuItemHandler();
    stopComponentSectionHandler();
    stopLocationHeightHandler();
  };
}
