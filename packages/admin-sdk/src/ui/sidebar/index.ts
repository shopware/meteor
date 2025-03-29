import { createSender } from '../../channel';

export const open = createSender('uiSidebarOpen');
export const close = createSender('uiSidebarClose');

export type uiSidebarOpen =
 {
   responseType: void,
   title: string,
   locationId: string,
   closable?: boolean,
 }

export type uiSidebarClose =
 {
   responseType: void,
   locationId: string,
 }
