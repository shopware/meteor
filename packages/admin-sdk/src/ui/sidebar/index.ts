import { createSender } from '../../channel';

export const add = createSender('uiSidebarAdd');
export const close = createSender('uiSidebarClose');
export const remove = createSender('uiSidebarRemove');
export const setActive = createSender('uiSidebarSetActive');

export type uiSidebarAdd =
 {
   responseType: void,
   title: string,
   locationId: string,
   icon: string,
   resizable?: boolean,
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

export type uiSidebarSetActive =
 {
   responseType: void,
   locationId: string,
 }
