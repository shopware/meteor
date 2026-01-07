import * as modal from '../../ui/modal';
import * as location from '../../location';
import * as context from '../../context';

export const enum MESSAGE_EVENT_TYPE {
  PAYMENT_CLOSE = 'payment_close',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_ERROR = 'payment_error',
  SYNC_HEIGHT = 'sync_height',
}

type EventData = {
  type: string,
  payload: unknown,
}

type Flow = {
  subscribe: (eventType: MESSAGE_EVENT_TYPE, callback: () => void) => {
    unsubscribe: () => void,
  },
}

const channel = new BroadcastChannel('payment');

const servicePaymentModalLocationId = 'sw-service-payment-modal';

const _createFlow = (): Flow => {
  return {
    subscribe: (eventType: MESSAGE_EVENT_TYPE, callback: () => void): {
      unsubscribe: () => void,
    } => {
      const func = (event: MessageEvent<EventData>): void => {
        if (event.data.type === eventType) {
          callback();
        }
      };
      channel.addEventListener('message', func);

      return {
        unsubscribe: (): void => {
          channel.removeEventListener('message', func);
        },
      };
    },
  };
};

export const addPaymentIframe = async (
  el: HTMLElement,
  baseUrl: string,
  options: {
    shopUrl: string,
    swVersion: string,
    swUserLanguage: string,
  },
): Promise<{
  iframeEl: HTMLIFrameElement,
  unmount: () => void,
}> => {
  const { name, version } = await context.getAppInformation();
  const link = `${baseUrl}/payment?service-name=${name}&service-version=${version}&shop-url=${options.shopUrl}&sw-version=${options.swVersion}&sw-user-language=${options.swUserLanguage}`;
  const iframeEl = document.createElement('iframe');
  iframeEl.width = '100%';
  iframeEl.height = '100%';
  iframeEl.src = link;
  iframeEl.style.border = 'none';
  iframeEl.style.borderRadius = 'var(--border-radius-card)';

  const handleEvent = (event: MessageEvent<EventData>): void => {
    if (event.data.type === MESSAGE_EVENT_TYPE.SYNC_HEIGHT) {
      iframeEl.style.height = `${event.data.payload as number}px`;
      location.startAutoResizer();
    } else if (event.data.type === MESSAGE_EVENT_TYPE.PAYMENT_CLOSE) {
      window.removeEventListener('message', handleEvent);
      void modal.close({
        locationId: servicePaymentModalLocationId,
      });
    } else if ([MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS].includes(event.data.type as MESSAGE_EVENT_TYPE)){
      channel.postMessage(event.data);
    }
  };

  window.addEventListener('message', handleEvent);

  const unmount = (): void => {
    window.removeEventListener('message', handleEvent);
    channel.close();
  };

  el.appendChild(iframeEl);

  return { iframeEl, unmount };
};

export const startPaymentFlow = async (): Promise<Flow> => {
  await modal.open({
    locationId: servicePaymentModalLocationId,
    variant: 'small',
    showHeader: false,
    showFooter: false,
    closable: false,
  });

  const flow = _createFlow();
  return flow;
};
