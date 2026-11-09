---
"@shopware-ag/meteor-component-library": major
---

Ship the package as ES modules only, give every public export an import path of its own, and stop bundling dependencies.

**Breaking changes**

- **ESM only:** the package has `"type": "module"`. The CommonJS build, `dist/common/`, `main` and the `require` export conditions are removed, so `require()` of the package no longer works. Test setups that map the package to `dist/common` import the package instead.
- **Only public entry points resolve:** the package root, `/<Name>` of public exports, `styles.css`, `font.css`, the font files in `/fonts/` and `package.json`.
  - `dist/*` paths are no longer exported. Replace `dist/esm/MtButton` with `/MtButton`.
  - Paths of internal components are removed, for example `/MtBaseField`, `/MtContextButton`, `/MtContextMenuItem`, `/MtSegmentedControl`, `/MtToastNotification`, the `mt-data-table` renderers and filters, and `/ExampleRadioOption`.
  - The `/fonts` module is removed. Import `font.css`.
- **Types:**
  - Import types from the package root or from the path of their component. Type files of internal code are no longer importable.
  - `Props` of `mt-entity-select` and `HeightT` of `mt-snackbar` are no longer exported.
- **Dependencies are no longer bundled.** The library imports them from `node_modules`, so an app shares one copy with it, for example of tiptap. Every package the library imports is declared in `dependencies`.
  - `@shopware-ag/meteor-icon-kit` and `@shopware-ag/meteor-tokens` are no longer installed with the library, because their icons and CSS are built into it. Install them yourself if you import them directly.
- **Dependency versions match reka-ui**, so the library and reka-ui share one copy of each. An app that installs other major versions of these packages itself gets a second copy.
  - `reka-ui` `^2.11.0`: `mt-action-menu`, `mt-breadcrumb`, `mt-collapsible`, `mt-nav` and the `MtDropdownMenu*` parts.
  - `@vueuse/core` and `@vueuse/shared` 14, `@floating-ui/vue` 2: `mt-breadcrumb`, `mt-card`, `mt-chart`, `mt-checkbox`, `mt-colorpicker`, `mt-data-table`, `mt-datepicker`, `mt-email-field`, `mt-entity-data-table`, `mt-entity-select`, `mt-floating-ui`, `mt-grant-permission-service-banner`, `mt-help-text`, `mt-number-field`, `mt-password-field`, `mt-popover`, `mt-popover-item`, `mt-popover-item-result`, `mt-progress-bar`, `mt-radio-group`, `mt-select`, `mt-slider`, `mt-switch`, `mt-tabs`, `mt-text-editor`, `mt-text-field`, `mt-textarea`, `mt-theme-select`, `mt-tooltip`, `mt-unit-field`, `mt-url-field`, `useServicePermission` and `useTheme`.
  - `js-beautify` 2: `mt-text-editor`.
  - `@vuepic/vue-datepicker`, used by `mt-datepicker`, depends on `@floating-ui/vue` 1, so an app also gets `@floating-ui/vue` 1.
  - `@vueuse/components` is no longer installed with the library.
- **Component instances:** `mt-data-table`, `mt-popover`, `mt-select` and `mt-slider` use `<script setup>`, so their internal state and methods are no longer reachable through a template ref.
- **`mt-unit-field` (#1454):**
  - The `Unit` type lists only the 10 units the field offers. Import it from `/MtUnitField` or the package root.
  - `convert-units` is no longer installed with the library.
- **Vitest:** components import their CSS, which Node can't load now that the package is valid ESM. Add the package to `test.server.deps.inline` in your Vitest config.
- **Vue is a peer dependency** (`^3.5.0`).
- **Typed events:** the events of `mt-email-field` and `mt-textarea` have typed arguments. Listeners that expect other argument types get type errors.

**New**

- `useSnackbar`, `useTheme`, `useServicePermission`, `TooltipDirective`, `DeviceHelperPlugin`, `MtDropdownMenuRoot`, `MtDropdownMenuPortal`, `MtDropdownMenuTrigger` and `MtDropdownMenuSub` have their own import paths, for example `@shopware-ag/meteor-component-library/useSnackbar`. Each one loads only its own code.
- Component paths also export the component by name and the types of its props: `import { MtBreadcrumb, type BreadcrumbItem } from "@shopware-ag/meteor-component-library/MtBreadcrumb"`. The default export stays.
- Components imported from the package root are typed again (#1452).
- The `/<Name>` paths are typed with every TypeScript `moduleResolution`, including `node` (node10).
- The Inter font files have paths of their own, `/fonts/Inter-roman.woff2` and `/fonts/Inter-italic.woff2`, for example to preload them.
- The prop types `CustomButton` of `mt-text-editor`, `ColumnDefinition` of `mt-data-table` and `AvailableFilter` of `mt-entity-data-table` are exported.
- The type files of `mt-data-table`, `mt-popover`, `mt-select` and `mt-slider` are 4 to 33 times smaller, and list the events and slots of these components (#1288).

**Fixes**

- `mt-datepicker` loads the date-fns locale of its `locale` prop in app bundles. Before, it stayed English everywhere except in Node.
  - If a locale file fails to download, `mt-datepicker` logs the error and keeps its current locale.
  - The default of `locale` is `en-US` instead of `de`, so a date picker without `locale` stays English.
- The minimum versions of these dependencies are releases with security fixes:
  - tiptap 2.27.3 and `diff` 8.0.4: `mt-text-editor`.
  - `dompurify` 3.4.17: `mt-checkbox`, `mt-colorpicker`, `mt-data-table`, `mt-datepicker`, `mt-email-field`, `mt-entity-data-table`, `mt-entity-select`, `mt-help-text`, `mt-number-field`, `mt-password-field`, `mt-popover-item`, `mt-popover-item-result`, `mt-progress-bar`, `mt-radio-group`, `mt-select`, `mt-slider`, `mt-switch`, `mt-tabs`, `mt-text-editor`, `mt-text-field`, `mt-textarea`, `mt-theme-select`, `mt-tooltip`, `mt-unit-field` and `mt-url-field`.
  - `nanoid` 5.1.16: `mt-checkbox`, `mt-colorpicker`, `mt-data-table`, `mt-entity-data-table`, `mt-entity-select`, `mt-modal`, `mt-number-field`, `mt-password-field`, `mt-popover-item`, `mt-popover-item-result`, `mt-select`, `mt-slider`, `mt-snackbar`, `mt-tabs`, `mt-text-editor`, `mt-text-editor-toolbar-button`, `mt-text-field`, `mt-theme-select`, `mt-unit-field`, `TooltipDirective` and `useSnackbar`.
  - `vue-i18n` 9.14.5: `mt-action-menu-item`, `mt-banner`, `mt-breadcrumb`, `mt-card`, `mt-checkbox`, `mt-colorpicker`, `mt-data-table`, `mt-datepicker`, `mt-email-field`, `mt-entity-data-table`, `mt-entity-select`, `mt-grant-permission-service-banner`, `mt-nav`, `mt-number-field`, `mt-pagination`, `mt-password-field`, `mt-popover-item`, `mt-popover-item-result`, `mt-progress-bar`, `mt-promo-badge`, `mt-radio-group`, `mt-search`, `mt-select`, `mt-slider`, `mt-switch`, `mt-tabs`, `mt-text-editor`, `mt-text-editor-toolbar-button`, `mt-text-field`, `mt-textarea`, `mt-theme-select`, `mt-unit-field` and `mt-url-field`.
- `mt-slider` calls `inheritance-restore` and `inheritance-remove` listeners once instead of twice.
- `mt-data-table` emits `open-details` once instead of twice when a clickable text, number or price cell is clicked. A click on a text, number or price cell that isn't clickable no longer emits it.
- A search in one `mt-select` no longer cancels a search started in another `mt-select` less than 100 ms before.
