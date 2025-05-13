import { createSender } from '../../channel';

export const add = createSender('uiSidebarAdd');
export const close = createSender('uiSidebarClose');
export const remove = createSender('uiSidebarRemove');

export type uiSidebarAdd =
 {
   responseType: void,
   title: string,
   locationId: string,
   icon: string,
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
