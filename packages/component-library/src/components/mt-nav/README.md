# mt-nav

The main navigation of an application, built from three components: `mt-nav` owns the shared
state, `mt-nav-section` groups rows below an optional header, and `mt-nav-item` is one row,
nesting further rows up to three levels deep. The navigation has arrow-key navigation and opens
the branch holding the active row.
Extracted from the Shopware Administration (`sw-admin-menu`) and ported to Meteor conventions.

`mt-nav` renders only the `<nav>`. The panel around it (logo, heading, user block, mobile
off-canvas behaviour) is the application's shell.

```vue
<mt-nav @navigate="closeOffCanvas">
  <mt-nav-section header="Shop">
    <mt-nav-item label="Dashboard" icon="regular-home" :to="{ name: 'dashboard' }" :active="isCurrent('dashboard')" />

    <mt-nav-item label="Catalogues" icon="regular-products">
      <mt-nav-item label="Products" :to="{ name: 'product.index' }" :active="isCurrent('product.index')">
        <mt-nav-item label="Reviews" :to="{ name: 'review.index' }" :active="isCurrent('review.index')" />
      </mt-nav-item>
      <mt-nav-item label="Categories" :to="{ name: 'category.index' }" :active="isCurrent('category.index')" />
    </mt-nav-item>

    <mt-nav-item label="Docs" href="https://docs.shopware.com" target="_blank" />
  </mt-nav-section>
</mt-nav>
```

## Structure

| File                                     | Purpose                                                         |
| ---------------------------------------- | --------------------------------------------------------------- |
| `mt-nav.vue`                             | The navigation: open branches and keyboard handling             |
| `mt-nav-section.vue`                     | Header and list of one section; the rows are slotted in         |
| `mt-nav-item.vue`                        | One navigation row; nested rows are slotted in                  |
| `mt-nav.types.ts`                        | `NavLinkComponent`, `NavLinkTarget`, `NavNavigateEvent`         |
| `mt-nav.spec.ts`                         | Vitest / Testing Library spec                                   |
| `_stories/mt-nav.stories.ts`             | Storybook stories                                               |
| `_stories/mt-nav.interactive.stories.ts` | Storybook interaction tests                                     |
| `_stories/story-link.ts`                 | Router-link stand-in used only by the stories                   |
| `_internal/mt-nav-context.ts`            | Provide/inject contracts between the navigation, sections, rows |

## API

### mt-nav

| Prop            | Description                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `linkComponent` | Component rendering the links, receives the `to` of a row. Defaults to `router-link` like `mt-link`. |

The default slot takes the sections. `navigate({ label, to, href })` is emitted when a row with a
`to` or `href` is clicked. Use it to close an off-canvas panel or to track navigation.

### mt-nav-section

| Prop     | Description                      |
| -------- | -------------------------------- |
| `header` | Optional heading above the rows. |

The default slot takes the `mt-nav-item` rows. Rows are `<li>` elements and the section renders
the list around them, so single rows without a header also go into a section.

### mt-nav-item

| Prop     | Description                                                                          |
| -------- | ------------------------------------------------------------------------------------ |
| `label`  | Translated label.                                                                    |
| `icon`   | Icon name of the meteor icon kit, e.g. `regular-products`. Shown on top level rows.  |
| `to`     | Route location handed to the link component as `to`.                                 |
| `href`   | External URL, rendered as a plain anchor when no `to` is set. `target` goes with it. |
| `active` | Whether the row is the current page.                                                 |

| Slot     | Description                                                     |
| -------- | --------------------------------------------------------------- |
| default  | Nested `mt-nav-item` rows. Three levels in total are supported. |
| `suffix` | Rendered after the label, e.g. for a badge or counter.          |

A row with nested rows and no `to` renders as a button toggling them. A row with both navigates
and toggles. Rows nested deeper than three levels are not rendered and reported to the console.

### Active state

The application decides which row is current and sets `active` on it, typically by comparing the
row's route with the current route. Pages the navigation does not list, e.g. detail pages, mark
the row of their listing as active. The ancestors of the active row open and, while closed, take
over its highlight. When the active row moves into another top level branch, that branch opens
and branches holding nothing active close.

Sections and rows must be rendered inside `mt-nav`. Top level rows register with the navigation,
nested rows report their active state to their parent row.

### Layout

The root fills the height of its container and scrolls its content, fading it out at the top and
bottom edges. Give it a flex item with `min-height: 0` or a fixed height. It sets no width and no
background.

### Styling hooks

Everything is prefixed `mt-nav__*`. Rows accept a `class` attribute for targeting a single row;
the active link carries `is--active`.

## Provenance

- Repository: `shopware/shopware`, branch `trunk`
- Commit: `109b4b81d3340c22cf82589e7f3c7048680128a6`
- Source: `src/Administration/Resources/app/administration/src/app/component/structure/sw-admin-menu{,-item}/`,
  `app/store/admin-menu.store.ts`, `app/composables/use-module-icon-colors.ts`

Shopware couplings replaced or dropped during the port:

| Shopware coupling                                              | Meteor replacement                                      |
| -------------------------------------------------------------- | ------------------------------------------------------- |
| `menuService`, `appModulesService`, custom entity entries      | `mt-nav-item` rows written by the application           |
| `adminMenu` store `isExpanded` (+ `localStorage`)              | Dropped: the navigation is always expanded              |
| `adminMenu` store `expandedEntries`                            | Internal state                                          |
| `acl`, `hasAccessToRoute`, settings special case               | Removed: render only the rows the user may see          |
| `$t` on entry labels and menu strings                          | Translated `label` props; inline `useI18n` (`en`, `de`) |
| `$route`, `$router`, `router-link`, `meta.parentPath`          | `active` prop set by the application, `linkComponent`   |
| `meta.$module` fallback, `moduleType` and legacy class names   | Removed                                                 |
| Header (logo, shop name, collapse toggle)                      | Shell of the application                                |
| `session` store user, `userService`, `sw-avatar`, `sw-version` | Shell of the application                                |
| `loginService.logoutSso`, notification cleanup                 | Shell of the application                                |
| Off-canvas panel, backdrop, `$device.getViewportWidth()`       | Shell of the application                                |
| Collapsed mode and flyout                                      | Dropped                                                 |
| Twig blocks                                                    | Slots                                                   |

The Jest specs of the original components relied on Shopware's `wrapTestComponent` harness and
were replaced by `mt-nav.spec.ts`.
