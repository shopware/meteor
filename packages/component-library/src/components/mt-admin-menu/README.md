# mt-admin-menu (raw extraction, not yet ported)

Verbatim copy of the Shopware Administration sidebar navigation, brought over as the first
step of moving it into the Meteor component library. Nothing in here is wired into the library
yet: the folder is not exported from `src/index.ts`, and it is excluded from `vue-tsc`, vitest,
eslint and prettier (see `tsconfig.app.json`, `tsconfig.vitest.json`, `vitest.config.ts`,
`vite.config.ts`, `eslint.config.mjs`, `.prettierignore`). Remove those exclusions once the
files are ported to Meteor conventions.

## Provenance

- Repository: `shopware/shopware`, branch `trunk`
- Commit: `109b4b81d3340c22cf82589e7f3c7048680128a6`
- Base path: `src/Administration/Resources/app/administration/src/`

| Here                                                    | Source                                                             |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| `sw-admin-menu/`                                        | `app/component/structure/sw-admin-menu/`                           |
| `sw-admin-menu-item/`                                   | `app/component/structure/sw-admin-menu-item/`                      |
| `_dependencies/store/admin-menu.store(.spec).ts`        | `app/store/admin-menu.store(.spec).ts`                             |
| `_dependencies/composables/use-module-icon-colors(.spec).ts` | `app/composables/use-module-icon-colors(.spec).ts`            |
| `_dependencies/fixtures/adminModules.json`              | `app/service/_mocks/adminModules.json` (used by the menu specs)    |
| `_dependencies/snippets/{en-GB,de-DE}.json`             | `global.sw-admin-menu` subtree of `app/snippet/{en,de}.json`       |
| `_dependencies/scss/_shopware-globals.scss`             | Excerpt of `app/assets/scss/{variables,mixins}.scss`               |

## What the components consist of

- `sw-admin-menu`: the sidebar shell. Header with logo and collapse toggle, scrollable
  navigation tree, user footer with an action menu, the collapsed-state flyout, and the mobile
  off-canvas mode with focus trapping (`focus-trap`).
- `sw-admin-menu-item`: one navigation row, recursive up to three levels. Handles ACL
  filtering, active-route detection (`menu-item-active.helper.ts`), collapsible branches,
  external links, the collapsed-sidebar tooltip and the keyboard flyout disclosure.
- `admin-menu.store.ts`: Pinia store holding the sidebar expanded flag (persisted in
  `localStorage`) and the expanded branches.

Meteor components already used by the templates: `mt-icon`, `mt-text`, `mt-button`, `mt-loader`,
`mt-tooltip`, `mt-floating-ui`, `mt-collapsible*`, `mt-action-menu*`, and the reka-ui
`mt-dropdown-menu-*` wrappers.

## Shopware couplings to remove when porting

- `Shopware.*` globals: `Shopware.Store` (`session`, `adminMenu`, `menuItem`, `shopwareApps`,
  `notification`), `Shopware.Utils` (`dom.getScrollbarWidth`, `debug.error`, `createId`,
  `EventBus`), `Shopware.Helper.FlatTreeHelper`, `Shopware.Mixin`, `Shopware.Service`.
- Injected services: `acl`, `menuService`, `loginService`, `userService`, `appModulesService`,
  `feature`, `customEntityDefinitionService`, `systemConfigApiService`, `userConfigService`.
- Shopware-only components in the template: `sw-avatar` (Meteor has `mt-avatar`), `sw-version`.
- `this.$device.getViewportWidth()` (Meteor ships a `DeviceHelperPlugin`), `$t` snippets, and
  `$route` / `$router` from vue-router.
- Twig block templates (`*.html.twig`) need to become Vue SFC templates; the `{% block %}`
  extension points are used by `sw-profile` and `sw-sales-channel` overrides in Shopware.
- SCSS imports `~scss/variables` and `~scss/mixins` resolve only in the Shopware build; the
  values they need are in `_dependencies/scss/_shopware-globals.scss`.
- Type imports from `src/core/...` in the helper and the store.
- Specs are Jest-based and rely on Shopware's `wrapTestComponent` test setup; Meteor uses vitest
  and Testing Library.
