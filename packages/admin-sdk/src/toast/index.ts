import { createSender } from '../channel';

export const dispatch = createSender('toastDispatch');

/**
 * Dispatch a toast.
 */
export type toastDispatch = {
  responseType: void,
  /**
   * This message will be shown in the toast.
   * The message should consist of 3 words max.
   */
  msg: string,

  /**
   * The type of toast you want to create.
   */
  type: 'informal'|'critical'|'positive',

  /**
   * Specifies if the toast can be manually dismmissed.
   */
  dismissible: boolean,

  /**
   * An icon to be displayed before "message".
   */
  icon?: string,

  /**
   * You can add several action buttons to the notification.
   * Each button contains a route (url) which gets opened on
   * a click.
   */
  action?: {
    label: string,
    callback: () => void,
  },
}
