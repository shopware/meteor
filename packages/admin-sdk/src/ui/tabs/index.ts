import { createSender } from '../../channel';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (tabPositionId: string) => ({
  addTabItem: createSender('uiTabsAddTabItem', { positionId: tabPositionId }),
});

export type uiTabsAddTabItem =
 {
   responseType: void,
   positionId: string,
   /* The label of the tab item */
   label: string,
   /* The componentSectionId for the tab content */
   componentSectionId: string,
   /* Whether the tab item is shown. Defaults to visible when omitted; set to `false` to hide the tab.
      Re-send `addTabItem` for the same `componentSectionId` to toggle visibility for the current context. */
   visible?: boolean,
 }
