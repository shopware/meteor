# mt-sidebar

A collapsible application sidebar: header with logo and collapse toggle, a navigation tree of up
to three levels, a footer slot, a flyout for the collapsed state and
a mobile off-canvas mode with focus trapping. Extracted from the Shopware Administration
(`sw-admin-menu`) and ported to Meteor conventions.

## Structure

| File                                          | Purpose                                                          |
| --------------------------------------------- | ---------------------------------------------------------------- |
| `mt-sidebar.vue`                              | The public component                                             |
| `mt-sidebar.types.ts`                         | `SidebarEntry`, `SidebarRoute`, `SidebarRouter`                  |
| `mt-sidebar.spec.ts`                          | Vitest / Testing Library spec                                    |
| `_stories/mt-sidebar.stories.ts`              | Storybook stories                                                |
| `_stories/mt-sidebar.interactive.stories.ts`  | Storybook interaction tests                                      |
| `_stories/*`                                  | Sample data and helper components used only by the stories       |
| `_internal/mt-sidebar-item.vue`               | One navigation row, recursive up to three levels                 |
| `_internal/mt-sidebar-context.ts`             | Provide/inject contract between the sidebar and its rows         |
| `_internal/build-sidebar-tree.ts`             | Nests the flat entry list                                        |
| `_internal/sidebar-item-active.helper(.spec)` | Active route detection via `route.matched` and `meta.parentPath` |

## API

Nothing is branded by default. Without `title`, `subtitle`, a `logo` slot or a `footer` slot, the
sidebar renders only the navigation and the collapse toggle.

### Props

| Prop                | Description                                                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `entries`           | Flat `SidebarEntry[]`, nested via `parent`, sorted via `position`. Labels must be translated. Pass only entries the user may see. |
| `route`, `router`   | Current route and router (duck-typed, Vue Router compatible). Highlight the active entry and open its branch.                     |
| `linkComponent`     | Component rendering the links, receives the route location as `to`. Defaults to `router-link` like `mt-link`.                     |
| `title`, `subtitle` | Heading next to the logo.                                                                                                         |
| `mobileBreakpoint`  | Viewport width in px at and below which the sidebar becomes an off-canvas panel. Default 1280.                                    |

### Models

`v-model:expanded` (default `true`) and `v-model:offCanvasOpen` (default `false`). Persisting the
expanded state is the consumer's job.

### Slots

| Slot                       | Description                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `logo`                     | Header logo. Add the `mt-sidebar__header-logo` class to an icon to size it.                                                |
| `footer="{ expanded }"`    | Footer below the navigation, e.g. the current user with an action menu (see the `StoryUserFooter` example in `_stories/`). |
| `entry-suffix="{ entry }"` | Rendered after the label of every entry, including nested ones and the flyout.                                             |

### Events

`navigate(entry)` when a navigation link is clicked. There is no built-in user block or logout;
the `footer` slot takes whatever the application needs.

### Styling hooks

Everything is prefixed `mt-sidebar__*`. `mt-sidebar__hide-on-collapse` fades an element out when
the sidebar collapses and can be used inside the `footer` slot. The `router-link-active` class name
is kept because Vue Router sets it on the rendered links.

## Provenance

- Repository: `shopware/shopware`, branch `trunk`
- Commit: `109b4b81d3340c22cf82589e7f3c7048680128a6`
- Source: `src/Administration/Resources/app/administration/src/app/component/structure/sw-admin-menu{,-item}/`,
  `app/store/admin-menu.store.ts`, `app/composables/use-module-icon-colors.ts`

Shopware couplings replaced during the port:

| Shopware coupling                                              | Meteor replacement                                        |
| -------------------------------------------------------------- | --------------------------------------------------------- |
| `menuService`, `appModulesService`, custom entity entries      | `entries` prop                                            |
| `adminMenu` store `isExpanded` (+ `localStorage`)              | `v-model:expanded`                                        |
| `EventBus` `sw-admin-menu/toggle-offcanvas`                    | `v-model:offCanvasOpen`                                   |
| `adminMenu` store `expandedEntries`                            | Internal state                                            |
| `acl`, `hasAccessToRoute`, settings special case               | Removed: pass only the entries the user may see           |
| `$t` on entry labels and menu strings                          | Translated labels; inline `useI18n` messages (`en`, `de`) |
| `$route`, `$router`, `router-link`                             | `route`, `router`, `linkComponent` props                  |
| `session` store user, `userService`, `sw-avatar`, `sw-version` | `footer` slot                                             |
| `systemConfigApiService` shop name, hardcoded logo             | `title`, `subtitle` props, `logo` slot                    |
| `loginService.logoutSso`, notification cleanup                 | `footer` slot                                             |
| `$device.getViewportWidth()`                                   | `window.innerWidth`, `mobileBreakpoint` prop              |
| Twig blocks                                                    | Slots                                                     |

The Jest specs of the original components relied on Shopware's `wrapTestComponent` harness and
were replaced by `mt-sidebar.spec.ts`. The pure active-route helper spec was ported as is.
