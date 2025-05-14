import { createSender } from '../../channel';
import type { MtButtonSize, MtButtonVariant } from '@shopware-ag/meteor-component-library';

export const open = createSender('uiModalOpen');
export const close = createSender('uiModalClose');

export type uiModalOpen =
 {
   responseType: void,
   title: string,
   locationId: string,
   variant?: 'default'|'small'|'large'|'full',
   showHeader?: boolean,
   showFooter?: boolean,
   closable?: boolean,
   buttons?: buttonProps[],
 }

export type uiModalClose =
 {
   responseType: void,
   locationId: string,
 }

export type buttonProps = {
  method: () => void,
  label: string,
  variant?: MtButtonVariant,
  size?: MtButtonSize,
  square?: boolean,
}
