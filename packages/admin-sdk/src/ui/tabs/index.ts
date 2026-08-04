import { createSender } from '../../channel';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (tabPositionId: string) => ({
  addTabItem: createSender('uiTabsAddTabItem', { positionId: tabPositionId }),
  setVisibility: createSender('uiTabsSetVisibility', { positionId: tabPositionId }),
});

export type uiTabsAddTabItem =
 {
   responseType: void,
   positionId: string,
   /* The label of the tab item */
   label: string,
   /* The componentSectionId for the tab content */
   componentSectionId: string,
   /* Whether the tab item is shown by default */
   visible?: boolean,
 }

export type uiTabsSetVisibility =
 {
   responseType: void,
   positionId: string,
   /* The componentSectionId of the tab item to show or hide */
   componentSectionId: string,
   /* Whether the tab item should be shown */
   visible: boolean,
 }
