import { createSender } from '../../channel';

export const open = createSender('uiSidebarOpen');
export const close = createSender('uiSidebarClose');

export type uiSidebarOpen =
 {
   responseType: void,
   title: string,
   locationId: string,
    // Width?: number, probably not a good idea to use this
    variant?: 'default'|'small'|'large',
    mode?: 'push'|'overlay',
    icon: string,
    // Persistent?: boolean,
 }

export type uiSidebarClose =
 {
   responseType: void,
   locationId: string,
 }

export type uiSidebarRemove =
 {
   responseType: void,
   locationId: string,
 }
