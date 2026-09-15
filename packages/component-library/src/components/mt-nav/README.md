# mt-nav

The main navigation of an application: `mt-nav-item` rows grouped in `mt-nav-section` components
with an optional header, each row a tree up to three levels deep, a collapsed mode showing the
top level icons only, arrow-key navigation and active route detection. Extracted from the Shopware Administration (`sw-admin-menu`) and ported to Meteor
conventions.

`mt-nav` renders only the `<nav>` and owns the shared state: which branch is open and which item
is active. The panel around it (logo, heading, collapse toggle, user block,
mobile off-canvas behaviour) is the application's shell, which owns the expanded state and passes
it in.

```vue
<mt-nav
  :route="route"
  :router="router"
  :expanded="expanded"
  @navigate="closeOffCanvas"
>
  <mt-nav-section>
    <mt-nav-item :item="dashboard" />
  </mt-nav-section>

  <mt-nav-section header="Shop">
    <mt-nav-item v-for="item in shopItems" :key="item.id" :item="item" />
  </mt-nav-section>
</mt-nav>
```

## Structure

| File                                      | Purpose                                                          |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `mt-nav.vue`                              | The navigation: shared state and keyboard handling               |
| `mt-nav-section.vue`                      | Header and list of one section; the rows are slotted in          |
| `mt-nav-item.vue`                         | One navigation row, recursive up to three levels                 |
| `mt-nav.types.ts`                         | `NavItem`, `NavRoute`, `NavRouter`                               |
| `mt-nav.spec.ts`                          | Vitest / Testing Library spec                                    |
| `_stories/mt-nav.stories.ts`              | Storybook stories                                                |
| `_stories/mt-nav.interactive.stories.ts`  | Storybook interaction tests                                      |
| `_stories/*`                              | Sample data and helper components used only by the stories       |
| `_internal/mt-nav-context.ts`             | Provide/inject contract between the navigation, sections, rows   |
| `_internal/nav-item-key.ts`               | Identity of an item, used to key the open branches               |
| `_internal/prune-deep-items.ts`           | Drops and reports items nested deeper than three levels          |
| `_internal/nav-item-active.helper(.spec)` | Active route detection via `route.matched` and `meta.parentPath` |

## API

### mt-nav

| Prop              | Description                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `route`, `router` | Current route and router (duck-typed, Vue Router compatible). Highlight the active item and open its branch.  |
| `linkComponent`   | Component rendering the links, receives the route location as `to`. Defaults to `router-link` like `mt-link`. |
| `expanded`        | Default `true`. Collapsed, the navigation shows the top level icons only.                                     |

The default slot takes the sections. `navigate(item)` is emitted when a navigation link is
clicked. Use it to close an off-canvas panel or to track navigation.

The active item is the one whose `path` is in the route's `matched` chain. Pages the navigation
does not list, e.g. detail pages, declare the owning route name as `meta.parentPath`; the chain is
followed through `router.getRoutes()`, so a detail route may point at a listing route that points
at its own parent in turn.

### mt-nav-section

| Prop     | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| `header` | Optional heading above the rows. Hidden while the navigation is collapsed. |

The default slot takes the `mt-nav-item` rows. Rows are `<li>` elements and the section renders
the list around them, so single rows without a header also go into a section.

### mt-nav-item

| Prop   | Description                                                                            |
| ------ | -------------------------------------------------------------------------------------- |
| `item` | `NavItem`, nested via `children` up to three levels. Labels are translated by the app. |

| Slot                     | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `item-suffix="{ item }"` | Rendered after the label, including the nested rows. |

Sections and rows must be rendered inside `mt-nav`. Every top level row registers its item with
the navigation, which uses the complete list to find the branch owning the current route and to
keep only one branch open, no matter which section the branch sits in.

### Layout

The root fills the height of its container and scrolls its content, fading it out at the top and
bottom edges. Give it a flex item with `min-height: 0` or a fixed height. It sets no width and no
background: the collapsed rows are 36px wide, so a 60px panel with 12px horizontal padding fits.

### Styling hooks

Everything is prefixed `mt-nav__*`. The root carries `is--expanded` / `is--collapsed` and, for half
a second after the state changes, `is--toggling`, so a shell can synchronise its own transitions.
`mt-nav__hide-on-collapse` fades an element out when the navigation collapses. Rows carry
`mt-nav__item--<id>` for targeting a single row. The `router-link-active` class name is kept
because Vue Router sets it on the rendered links.

## Provenance

- Repository: `shopware/shopware`, branch `trunk`
- Commit: `109b4b81d3340c22cf82589e7f3c7048680128a6`
- Source: `src/Administration/Resources/app/administration/src/app/component/structure/sw-admin-menu{,-item}/`,
  `app/store/admin-menu.store.ts`, `app/composables/use-module-icon-colors.ts`

Shopware couplings replaced or dropped during the port:

| Shopware coupling                                              | Meteor replacement                                        |
| -------------------------------------------------------------- | --------------------------------------------------------- |
| `menuService`, `appModulesService`, custom entity entries      | `item` prop of `mt-nav-item`                              |
| `adminMenu` store `isExpanded` (+ `localStorage`)              | `expanded` prop, owned by the shell                       |
| `adminMenu` store `expandedEntries`                            | Internal state                                            |
| `acl`, `hasAccessToRoute`, settings special case               | Removed: pass only the items the user may see             |
| `meta.$module` fallback, `moduleType` and legacy class names   | Removed: declare `meta.parentPath` on detail routes       |
| `$t` on entry labels and menu strings                          | Translated labels; inline `useI18n` messages (`en`, `de`) |
| `$route`, `$router`, `router-link`                             | `route`, `router`, `linkComponent` props                  |
| Header (logo, shop name, collapse toggle)                      | Shell of the application                                  |
| `session` store user, `userService`, `sw-avatar`, `sw-version` | Shell of the application                                  |
| `loginService.logoutSso`, notification cleanup                 | Shell of the application                                  |
| Off-canvas panel, backdrop, `$device.getViewportWidth()`       | Shell of the application                                  |
| Twig blocks                                                    | Slots                                                     |

The Jest specs of the original components relied on Shopware's `wrapTestComponent` harness and
were replaced by `mt-nav.spec.ts`. The pure active-route helper spec was ported as is.
