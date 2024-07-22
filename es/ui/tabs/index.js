import { createSender } from '../../channel';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (tabPositionId) => ({
    addTabItem: createSender('uiTabsAddTabItem', { positionId: tabPositionId }),
});
//# sourceMappingURL=index.js.map