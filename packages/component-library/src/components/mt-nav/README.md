# mt-nav

The main navigation of an application: a tree of up to three levels, a collapsed mode showing the
top level icons only with a flyout for their children, arrow-key navigation and active route
detection. Extracted from the Shopware Administration (`sw-admin-menu`) and ported to Meteor
conventions.

The component renders only the `<nav>`. The panel around it (logo, heading, collapse toggle, user
block, mobile off-canvas behaviour) is the application's shell, which owns the expanded state and
passes it in.

## Structure

| File                                      | Purpose                                                          |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `mt-nav.vue`                              | The public component                                             |
| `mt-nav.types.ts`                         | `NavEntry`, `NavRoute`, `NavRouter`                              |
| `mt-nav.spec.ts`                          | Vitest / Testing Library spec                                    |
| `_stories/mt-nav.stories.ts`              | Storybook stories                                                |
| `_stories/mt-nav.interactive.stories.ts`  | Storybook interaction tests                                      |
| `_stories/*`                              | Sample data and helper components used only by the stories       |
| `_internal/mt-nav-item.vue`               | One navigation row, recursive up to three levels                 |
| `_internal/mt-nav-context.ts`             | Provide/inject contract between the navigation and its rows      |
| `_internal/build-nav-tree.ts`             | Nests the flat entry list                                        |
| `_internal/nav-item-active.helper(.spec)` | Active route detection via `route.matched` and `meta.parentPath` |

## API

### Props

| Prop              | Description                                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `entries`         | Flat `NavEntry[]`, nested via `parent`, sorted via `position`. Labels must be translated. Pass only entries the user may see. |
| `route`, `router` | Current route and router (duck-typed, Vue Router compatible). Highlight the active entry and open its branch.                 |
| `linkComponent`   | Component rendering the links, receives the route location as `to`. Defaults to `router-link` like `mt-link`.                 |
| `expanded`        | Default `true`. Collapsed, the navigation shows the top level icons only and opens branches in a flyout.                      |

### Slots

| Slot                       | Description                                                                    |
| -------------------------- | ------------------------------------------------------------------------------ |
| `entry-suffix="{ entry }"` | Rendered after the label of every entry, including nested ones and the flyout. |

### Events

`navigate(entry)` when a navigation link is clicked. Use it to close an off-canvas panel or to
track navigation.

### Layout

The root fills the height of its container and scrolls its content, fading it out at the top and
bottom edges. Give it a flex item with `min-height: 0` or a fixed height. It sets no width and no
background: the collapsed rows are 36px wide, so a 60px panel with 12px horizontal padding fits.

### Styling hooks

Everything is prefixed `mt-nav__*`. The root carries `is--expanded` / `is--collapsed` and, for half
a second after the state changes, `is--toggling`, so a shell can synchronise its own transitions.
`mt-nav__hide-on-collapse` fades an element out when the navigation collapses. The
`router-link-active` class name is kept because Vue Router sets it on the rendered links.

## Provenance

- Repository: `shopware/shopware`, branch `trunk`
- Commit: `109b4b81d3340c22cf82589e7f3c7048680128a6`
- Source: `src/Administration/Resources/app/administration/src/app/component/structure/sw-admin-menu{,-item}/`,
  `app/store/admin-menu.store.ts`, `app/composables/use-module-icon-colors.ts`

Shopware couplings replaced or dropped during the port:

| Shopware coupling                                              | Meteor replacement                                        |
| -------------------------------------------------------------- | --------------------------------------------------------- |
| `menuService`, `appModulesService`, custom entity entries      | `entries` prop                                            |
| `adminMenu` store `isExpanded` (+ `localStorage`)              | `expanded` prop, owned by the shell                       |
| `adminMenu` store `expandedEntries`                            | Internal state                                            |
| `acl`, `hasAccessToRoute`, settings special case               | Removed: pass only the entries the user may see           |
| `$t` on entry labels and menu strings                          | Translated labels; inline `useI18n` messages (`en`, `de`) |
| `$route`, `$router`, `router-link`                             | `route`, `router`, `linkComponent` props                  |
| Header (logo, shop name, collapse toggle)                      | Shell of the application                                  |
| `session` store user, `userService`, `sw-avatar`, `sw-version` | Shell of the application                                  |
| `loginService.logoutSso`, notification cleanup                 | Shell of the application                                  |
| Off-canvas panel, backdrop, `$device.getViewportWidth()`       | Shell of the application                                  |
| Twig blocks                                                    | Slots                                                     |

The Jest specs of the original components relied on Shopware's `wrapTestComponent` harness and
were replaced by `mt-nav.spec.ts`. The pure active-route helper spec was ported as is.
