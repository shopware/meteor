# mt-sidebar

The sidebar navigation extracted from the Shopware Administration (formerly `sw-admin-menu`), ported to Meteor conventions. Not yet
exported from `src/index.ts`.

## Structure

| File                                          | Purpose                                                                                                   |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `mt-sidebar.vue`                              | The sidebar shell: header with logo and collapse toggle, navigation tree, user footer, flyout, off-canvas |
| `mt-sidebar.types.ts`                         | `SidebarEntry`, `SidebarRoute`, `SidebarRouter`, `SidebarUser` and friends                                |
| `mt-sidebar.spec.ts`                          | Vitest / Testing Library spec                                                                             |
| `mt-sidebar.stories.ts`                       | Storybook stories                                                                                         |
| `_internal/mt-sidebar-item.vue`               | One navigation row, recursive up to three levels                                                          |
| `_internal/mt-sidebar-context.ts`             | Provide/inject contract between the menu and its rows                                                     |
| `_internal/build-sidebar-tree.ts`             | Nests the flat entry list (replaces Shopware's `FlatTreeHelper`)                                          |
| `_internal/sidebar-item-active.helper(.spec)` | Active route detection via `route.matched` and `meta.parentPath`                                          |

## API

The component owns no application state. Everything Shopware injected (stores, services, ACL,
snippets, router) arrives via props, models and events:

| Shopware coupling                                         | Meteor replacement                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------------------- |
| `menuService`, `appModulesService`, custom entity entries | `entries` prop: flat `SidebarEntry[]`, nested via `parent`                |
| `adminMenu` store `isExpanded` (+ `localStorage`)         | `v-model:expanded`; persistence is the consumer's job                     |
| `EventBus` `sw-admin-menu/toggle-offcanvas`               | `v-model:offCanvasOpen`                                                   |
| `adminMenu` store `expandedEntries`                       | Internal state                                                            |
| `acl`, `hasAccessToRoute`, settings special case          | Removed: pass only the entries the user may see                           |
| `$t` on entry labels                                      | `label` must already be translated                                        |
| `$t` on the menu's own strings                            | `useI18n` messages inside the component (`en`, `de`)                      |
| `$route`, `$router`                                       | `route` and `router` props (duck-typed, compatible with Vue Router)       |
| `router-link`                                             | `linkComponent` prop, defaults to `"router-link"` like `mt-link`          |
| `session` store user, `userService`                       | `user` and `isUserLoading` props                                          |
| `systemConfigApiService` shop name                        | `shopName` prop                                                           |
| `sw-version`                                              | `version` prop or `#version` slot                                         |
| `sw-avatar`                                               | `mt-avatar`                                                               |
| `loginService.logoutSso`, notification store cleanup      | `logout` event                                                            |
| `useModuleIconColors`                                     | `moduleIconColors` prop                                                   |
| `$device.getViewportWidth()`                              | `window.innerWidth`, `mobileBreakpoint` prop (default 1280)               |
| Twig blocks (`sw-profile`, `sw-sales-channel` overrides)  | `#user-actions` and `#version` slots; other extension points were dropped |

Events: `logout`, `navigate(entry)`, `update:expanded`, `update:offCanvasOpen`.

CSS classes are prefixed `mt-sidebar__*`. The `router-link-active` class name is kept because
Vue Router sets it on the rendered links.

## Provenance

- Repository: `shopware/shopware`, branch `trunk`
- Commit: `109b4b81d3340c22cf82589e7f3c7048680128a6`
- Source: `src/Administration/Resources/app/administration/src/app/component/structure/sw-admin-menu{,-item}/`,
  `app/store/admin-menu.store.ts`, `app/composables/use-module-icon-colors.ts`

The Jest specs of the original components relied on Shopware's `wrapTestComponent` harness and
were replaced by `mt-sidebar.spec.ts`. The pure `sidebar-item-active.helper.spec.ts` was ported as is.
