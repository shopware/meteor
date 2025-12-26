import { ui, location } from '../index';

export const enum MESSAGE_EVENT_TYPE {
  PAYMENT_CLOSE = 'payment_close',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_ERROR = 'payment_error',
  SYNC_HEIGHT = 'sync_height',
}

const channel = new BroadcastChannel('payment');

const servicePaymentModalLocationId = 'sw-service-payment-modal';

const _createFlow = () => {
  return {
    subscribe: (eventType: MESSAGE_EVENT_TYPE, callback: () => void) => {
      const func = (event: MessageEvent) => {
        if (event.data.type === eventType) {
          callback();
        }
      };
      channel.addEventListener('message', func);

      return {
        unsubscribe: () => {
          channel.removeEventListener('message', func);
        },
      };
    },
  };
};

const paymentDomain = process.env['IFRAME_URL'];

export const buildIframe = (
  shopUrl: string,
  swVersion: string,
  swUserLanguage: string,
) => {
  const link = `${paymentDomain}/payment?shop-url=${shopUrl}&sw-version=${swVersion}&sw-user-language=${swUserLanguage}`;
  const iframeEl = document.createElement('iframe');
  iframeEl.width = '100%';
  iframeEl.height = '100%';
  iframeEl.src = link;
  iframeEl.style.border = 'none';
  iframeEl.style.borderRadius = 'var(--border-radius-card)';

  const handleEvent = (event: MessageEvent) => {
    if (event.data.type === MESSAGE_EVENT_TYPE.SYNC_HEIGHT) {
      iframeEl.style.height = `${event.data.payload}px`;
      location.startAutoResizer();
    } else if (event.data.type === MESSAGE_EVENT_TYPE.PAYMENT_CLOSE) {
      window.removeEventListener('message', handleEvent);
      ui.modal.close({
        locationId: servicePaymentModalLocationId,
      });
    } else if ([MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS].includes(event.data.type)){
      channel.postMessage(event.data);
    }
  };

  window.addEventListener('message', handleEvent);

  const unmount = () => {
    window.removeEventListener('message', handleEvent);
    channel.close();
  };

  return { el: iframeEl, unmount };
};

export const startPaymentFlow = () => {
  ui.modal.open({
    locationId: servicePaymentModalLocationId,
    variant: 'small',
    showHeader: false,
    showFooter: false,
    closable: false,
  });

  const flow = _createFlow();
  return flow;
};
