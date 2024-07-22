import { createSender } from '../channel';
export const redirect = createSender('windowRedirect');
export const routerPush = createSender('windowRouterPush');
export const reload = createSender('windowReload', {});
//# sourceMappingURL=index.js.map