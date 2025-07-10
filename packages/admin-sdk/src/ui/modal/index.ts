import { createSender } from '../../channel';

export const open = createSender('uiModalOpen');
export const close = createSender('uiModalClose');
export const update = createSender('uiModalUpdate');

export type uiModalOpen =
 {
   responseType: void,
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
   variant?: 'default'|'small'|'large'|'full',
   showHeader?: boolean,
   showFooter?: boolean,
   closable?: boolean,
   buttons?: buttonProps[],
 }

export type uiModalClose =
 {
   responseType: void,
   /*
    * Define the locationId of the modal to close. If no locationId is provided, 
    * the last opened modal without a locationId will be closed.
    */
   locationId?: string,
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

export type buttonProps = {
  method: () => void,
  label: string,
  variant?: 'primary'|'ghost'|'danger'|'ghost-danger'|'contrast'|'context',
  size?: 'x-small'|'small'|'large',
  square?: boolean,
}
