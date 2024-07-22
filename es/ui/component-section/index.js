var _a;
import { createSender } from '../../channel';
import { getWindowSrc } from '../../_internals/utils';
export const add = createSender('uiComponentSectionRenderer', {
    src: (_a = getWindowSrc()) !== null && _a !== void 0 ? _a : undefined,
});
//# sourceMappingURL=index.js.map