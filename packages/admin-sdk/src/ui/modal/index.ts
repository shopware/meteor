import { createSender } from '../../channel';

export const open = createSender('uiModalOpen');
export const close = createSender('uiModalClose');

export type uiModalOpen =
 {
   responseType: void,
   title: string,
   // Use the locationId to render the modal in the iframe
   locationId?: string,
   // Use the textContent when no locationId is provided
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

export type buttonProps = {
  method: () => void,
  label: string,
  variant?: 'primary'|'ghost'|'danger'|'ghost-danger'|'contrast'|'context',
  size?: 'x-small'|'small'|'large',
  square?: boolean,
}
