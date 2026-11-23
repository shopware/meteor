import { createSender, send } from '../../channel';
import { getLocationId, getSearchParam } from '../../_internals/utils';

export const close = createSender('uiModalClose');
export const update = createSender('uiModalUpdate');

/**
 * The Administration adds this query parameter to a modal location that was
 * opened with `props`. Its absence lets `getProps` answer `null` at once
 * instead of waiting for a handler that older Administrations do not have.
 */
export const MODAL_PROPS_QUERY_KEY = 'sw-modal-props';

export type ModalCloseResult<RESULT = unknown> =
  | { reason: 'closed', data?: RESULT }
  | { reason: 'dismissed' };

export type ModalCloseListener<RESULT = unknown> = (result: ModalCloseResult<RESULT>) => void;

export type ModalOpenOptions = Omit<uiModalOpen, 'responseType' | 'onResult'>;

export type ModalUpdateOptions = Omit<uiModalUpdate, 'responseType' | 'locationId'>;

export type ModalHandle<RESULT = unknown> = {
  /**
   * `false` when the Administration does not report close results yet. Then
   * `closed` never settles and close listeners are never called.
   */
  supportsResult: boolean,
  /** Settles once, when the modal closes. */
  closed: Promise<ModalCloseResult<RESULT>>,
  /**
   * Called once, when the modal closes; right away when it is already closed.
   * Returns a function that removes the listener.
   */
  onClose: (listener: ModalCloseListener<RESULT>) => () => void,
  update: (options: ModalUpdateOptions) => Promise<void>,
  close: () => Promise<void>,
};

/**
 * Opens a modal and returns a handle to it. `props` reach the modal location
 * through `getProps`; the modal reports back with `close({ result })`.
 */
export async function open<RESULT = unknown>(options: ModalOpenOptions): Promise<ModalHandle<RESULT>> {
  const listeners = new Set<ModalCloseListener<RESULT>>();
  let closeResult: ModalCloseResult<RESULT> | undefined;
  let settle: (result: ModalCloseResult<RESULT>) => void = () => undefined;
  const closed = new Promise<ModalCloseResult<RESULT>>((resolve) => {
    settle = resolve;
  });

  const notify = (listener: ModalCloseListener<RESULT>, result: ModalCloseResult<RESULT>): void => {
    try {
      listener(result);
    } catch (error) {
      console.error('A modal close listener failed:', error);
    }
  };

  const onResult = (result: ModalCloseResult<RESULT>): void => {
    if (closeResult) {
      return;
    }
    closeResult = result;
    settle(result);
    listeners.forEach((listener) => notify(listener, result));
    listeners.clear();
  };

  const response = await send('uiModalOpen', { ...options, onResult: onResult as ModalCloseListener });

  return {
    supportsResult: response?.supportsResult === true,
    closed,
    onClose: (listener): (() => void) => {
      if (closeResult) {
        notify(listener, closeResult);
        return (): void => undefined;
      }
      listeners.add(listener);
      return (): void => {
        listeners.delete(listener);
      };
    },
    update: (updateOptions): Promise<void> => {
      if (!options.locationId) {
        return Promise.reject(new Error('Only a modal opened with a locationId can be updated.'));
      }
      return update({ ...updateOptions, locationId: options.locationId });
    },
    close: (): Promise<void> => close(options.locationId ? { locationId: options.locationId } : {}),
  };
}

/**
 * Returns the `props` the current modal location was opened with, or `null`
 * when it was opened without props, outside a modal, or by an Administration
 * that does not pass props yet.
 */
export async function getProps<PROPS extends Record<string, unknown>>(): Promise<PROPS | null> {
  const locationId = getLocationId();
  if (!locationId || getSearchParam(MODAL_PROPS_QUERY_KEY) !== '1') {
    return null;
  }

  return (await send('uiModalGetProps', { locationId })) as PROPS | null;
}

export type uiModalOpen =
 {
   responseType: { supportsResult: true } | void,
   title?: string,
   /**
    * If a locationId is provided, the modal will
    * be rendered and the content renders the location.
    */
   locationId?: string,
   /**
    * If no locationId is provided, the textContent will be rendered in the modal.
    * Only simple text is supported.
    */
   textContent?: string,
   variant?: 'default'|'small'|'large'|'x-large'|'full',
   showHeader?: boolean,
   showFooter?: boolean,
   closable?: boolean,
   buttons?: buttonProps[],
   zIndex?: number,
   /**
    * Data for the modal location, read there with `getProps`. Values are
    * transported like any message payload, functions included.
    */
   props?: Record<string, unknown>,
   /**
    * Set by `open`: the Administration calls it once when the modal closes.
    */
   onResult?: ModalCloseListener,
 }

export type uiModalClose =
 {
   responseType: void,
   /*
    * Define the locationId of the modal to close. If no locationId is provided,
    * the last opened modal without a locationId will be closed.
    */
   locationId?: string,
   /**
    * Passed to the opener as `{ reason: 'closed', data: result }`.
    */
   result?: unknown,
 }

/**
 * Update the modal with the given locationId.
 * Can be used to update the modal from every location
 * after it has been opened.
 */
export type uiModalUpdate = {
  responseType: void,
  locationId: string,
  title?: string,
  showHeader?: boolean,
  showFooter?: boolean,
  closable?: boolean,
  buttons?: buttonProps[],
}

export type uiModalGetProps = {
  responseType: Record<string, unknown> | null,
  locationId: string,
}

export type buttonProps = {
  method: () => void,
  label: string,
  variant?: 'primary'|'ghost'|'danger'|'ghost-danger'|'contrast'|'context',
  size?: 'x-small'|'small'|'large',
  square?: boolean,
}
