# Meteor v6: ES modules only, public import paths, unbundled dependencies

This branch prepares the component library (`@shopware-ag/meteor-component-library`) for v6:

- **ES modules only:** the package is ESM only. The CommonJS build is gone.
- **Public import paths:** every public export has its own import path, for example `@shopware-ag/meteor-component-library/MtButton`.
- **Unbundled dependencies:** dependencies are installed from npm and shared with the app, instead of being bundled into Meteor's `dist`.

The release notes are in [the changeset](.changeset/esm-only-public-import-paths.md). This document explains what changed, what the integration test against the Shopware Administration showed, and what is still open.

## Why

- **Cleaner package:** 5.x shipped two builds (ESM and CommonJS) and bundled its dependencies into them. An app that also used tiptap, reka-ui or vueuse got a second copy inside Meteor's `dist`.
- **Encapsulation:** consumers could import any file under `dist/`, so every internal file was effectively public API.
- **v6 is the major to fix both:**
  - Meteor ships one ESM build.
  - It declares a public entry point per export through `exports`.
  - It leaves dependency resolution to the app's package manager and bundler.

## Changes for consumers

### Breaking

- **ESM only:** `"type": "module"`. `dist/common`, `main` and the `require` export conditions are removed, so `require()` of the package no longer works.
- **Only public entry points resolve:**
  - the package root, `/<Name>` for each public export, `styles.css`, `font.css`, the font files under `/fonts/` and `package.json`;
  - `dist/*` paths are no longer exported, and paths of internal components are removed.
- **Types:**
  - Import types from the root or from the component's path; type files of internal code are no longer importable.
  - `Props` of `mt-entity-select` and `HeightT` of `mt-snackbar` are no longer exported.
- **Dependencies are no longer bundled:**
  - Every package the library imports is declared in `dependencies`.
  - Versions match reka-ui (`reka-ui` 2.11, `@vueuse/*` 14, `@floating-ui/vue` 2), so the library and reka-ui share one copy.
  - `@vuepic/vue-datepicker` still brings `@floating-ui/vue` 1.
- **`<script setup>`:** `mt-data-table`, `mt-popover`, `mt-select` and `mt-slider` use it, so their internal state is no longer reachable through a template ref.
- **`mt-unit-field`:** the `Unit` type lists only the 10 offered units, and `convert-units` is no longer installed.
- **Vue:** a peer dependency (`^3.5.0`).
- **Typed events:** the events of `mt-email-field` and `mt-textarea` have typed arguments.

### Migration

**Imports:**

```diff
- import MtButton from "@shopware-ag/meteor-component-library/dist/esm/MtButton";
+ import MtButton from "@shopware-ag/meteor-component-library/MtButton";
```

**TypeScript:** nothing to change. The `/<Name>` paths are typed with `bundler`, `node16`, `nodenext` and also `node` (node10), through a `typesVersions` fallback.

**Vitest:** components import their CSS, so the package has to be processed by Vite:

```ts
export default defineConfig({
  test: {
    server: { deps: { inline: ["@shopware-ag/meteor-component-library"] } },
  },
});
```

**Jest (CommonJS mode):**

- Remove mappings to `dist/common`.
- Transform Meteor and its ESM-only dependencies, including `.mjs` files.
- Check only the last `node_modules` segment, so nested copies are transformed too.
- Map `vue-codemirror6`, which only exports an `import` condition, to its UMD build.

Based on the setup tested in the Administration (which lists a few packages of its own on top):

```ts
transform: { "^.+\\.m?[jt]sx?$": "@swc/jest" },
transformIgnorePatterns: [
  "/node_modules/(?!.*/node_modules/)(?!(@shopware-ag/meteor-component-library|@vuepic/vue-datepicker|@vueuse/core|@vueuse/shared|devlop|lowlight|nanoid|ohash)/)",
],
moduleNameMapper: {
  "^vue-codemirror6$": "<rootDir>/node_modules/vue-codemirror6/dist/index.umd.js",
},
```

**Fonts:** `font.css` stays. The font files can be preloaded, for example in Vite:

```ts
import interRoman from "@shopware-ag/meteor-component-library/fonts/Inter-roman.woff2?url";
```

### New

- **Own import paths** for `useSnackbar`, `useTheme`, `useServicePermission`, `TooltipDirective`, `DeviceHelperPlugin` and the `MtDropdownMenu*` parts. Each loads only its own code.
- **Named exports:** component paths also export the component by name and its prop types, for example `import { MtBreadcrumb, type BreadcrumbItem } from ".../MtBreadcrumb"`.
- **Root types:** components imported from the root are typed again (#1452).
- **Smaller type files:** those of `mt-data-table`, `mt-popover`, `mt-select` and `mt-slider` are 4 to 33 times smaller and list their events and slots (#1288).

### Fixes

- **`mt-datepicker` locale:**
  - It loads the date-fns locale of its `locale` prop in app bundles; in 5.x it stayed English everywhere except in Node.
  - The default `locale` is `en-US` instead of `de`, so a date picker without `locale` stays English.
- **`mt-data-table`:**
  - It emits `open-details` once instead of twice when a clickable text, number or price cell is clicked.
  - A click on such a cell that isn't clickable no longer emits it.
- **`mt-slider`:** it calls `inheritance-restore` and `inheritance-remove` listeners once instead of twice.
- **`mt-select`:** a search in one `mt-select` no longer cancels a search in another one.
- **Security floors:** the minimum dependency versions are now releases with security fixes:

  | Package     | Minimum |
  | ----------- | ------- |
  | tiptap      | 2.27.3  |
  | `dompurify` | 3.4.17  |
  | `nanoid`    | 5.1.16  |
  | `diff`      | 8.0.4   |
  | `vue-i18n`  | 9.14.5  |

## What this branch contains besides the core change

Follow-ups from the review and the integration test:

- **Leftovers of the `<script setup>` conversion:**
  - `mt-popover` imported `MtCheckbox`, `MtSwitch`, `MtPopoverItem` and `MtSmoothReflow` without using them, which pulled them into `/MtPopover`.
  - Dead code in `mt-data-table` is removed.
  - `sideEffects` no longer lists `*.vue`, which matched nothing in `dist`.
- **`typesVersions` fallback:**
  - Without it, the Administration (TypeScript 5.7 with `moduleResolution: node`) had 71 type errors and 94 ESLint errors on the new paths.
  - With it: 0, without changes on the Admin side.
- **Font files** exported under `/fonts/*`.
- **Version floors** raised as listed above, and the lockfile refreshed, including tiptap's transitive `markdown-it` and `prosemirror-view`.
- **Lint:**
  - The changed files have no ESLint warnings left.
  - The four specs that still used `@vue/test-utils` (`mt-data-table`, `mt-data-table-settings`, `mt-popover-item`, `mt-select`) now use Testing Library and test through the UI.
  - Some old tests could never fail, for example the disabled-row check in `mt-data-table`; they now check real behavior.
  - A new test covers the `open-details` fix.
- **Prettier formatting** of `icon-kit` and `tokens`, which failed `format:check` on `main`.

## Findings

### Integration test against the Shopware Administration

**Setup:**

- Shopware `trunk` at `204899091df` (2026-11-06), with the packed v6 tarball installed through `npm install`.
- Baseline: Meteor 5.10.0.
- Admin tooling: Vite 6 and Vite 8, Jest 30 with SWC, TypeScript 5.7 with `moduleResolution: node`.

| Check                                   | 5.10.0                         | v6, Admin unchanged         | v6, Admin migrated                  |
| --------------------------------------- | ------------------------------ | --------------------------- | ----------------------------------- |
| Build, Vite 6 and Vite 8                | pass                           | fails on `dist/esm` imports | pass                                |
| `lint:types`                            | 0 errors                       | 71 errors                   | 0 with `typesVersions`              |
| ESLint                                  | 0 errors                       |                             | 0 with `typesVersions`              |
| Jest, full suite                        | 17,909 tests, 2 known failures | every suite fails           | 17,982 tests, same 2 known failures |
| Browser tour, 12 pages and interactions | 0 page or console errors       |                             | 0 page or console errors            |
| Lighthouse score                        | 58                             |                             | 59                                  |

**Migration the Administration needs:**

1. Rewrite 56 `dist/esm/<Name>` imports in 18 files to `/<Name>`.
2. Make 4 changes to the Jest config (see Migration).
3. Remove the npm override `"@tiptap/extension-image": "3.31.3"`. It forces tiptap 3 code onto v6's tiptap 2 core and breaks the build.
4. Drop the `dist/*` path mapping in the extension-tooling tsconfig preset.

**Impact on extensions:**

- **Plugins that aren't updated:**
  - Plugins that use the global `<mt-*>` components or ship prebuilt bundles keep working.
  - Plugins that import `dist/esm/<Name>` fail on their next build against the new Admin.
  - Plugin Jest setups that map Meteor to `dist/common` break. The fix is best shipped through `@shopware-ag/jest-preset-sw6-admin`, together with an UPGRADE note.
- **Apps:** they run their own Meteor in an iframe, so they're only affected when they update.

### Performance

**Install:**

- Admin `node_modules`: 1,075 → 1,039 MB.
- The Meteor package including nested dependencies: 79.4 → 49.3 MB.

**Production build of the Admin:**

- Total JS gzip is +178 KB. That is the 94 new lazy date-fns locale chunks (188 KB, loaded only when used); without them it is about 10 KB smaller.
- The entry chunk is unchanged (336.8 → 337.0 KB gzip).
- Lighthouse is unchanged.

**Admin dev server:**

- The first load is about 0.5 s slower on Vite 6, and 0.5 to 1 s slower with Vite 8's bundled dev mode.
- Dependencies now arrive as unminified npm sources instead of Meteor's minified `dist`.

**Jest in the Admin:** about 35 % slower (warm 137 → 189 s). Each spec now loads the dependencies as separate modules instead of one CommonJS bundle.

**Standalone Vite app, initial JS gzip:**

| Scenario                                   | 5.10.0   | v6       |
| ------------------------------------------ | -------- | -------- |
| `MtButton`                                 | 44.3 KB  | 44.3 KB  |
| Form page with 6 components, through paths | 140.1 KB | 142.9 KB |
| `MtTextEditor`                             | 743.5 KB | 755.7 KB |
| Whole library                              | 908.3 KB | 908.2 KB |

In dev, a form page loads 0.7 MB of JS through paths instead of 2.2 MB.

**What makes up the weight.** Of the 1,672 modules behind the package root (esbuild import graph), only 91 are Meteor's own:

| Package        | Modules | Why it is loaded                                                                            |
| -------------- | ------- | ------------------------------------------------------------------------------------------- |
| `reka-ui`      | 588     | its root barrel                                                                             |
| `date-fns`     | 304     | through `@vuepic/vue-datepicker`                                                            |
| `highlight.js` | 194     | `@git-diff-view` registers all languages on import, although the diff modal only shows HTML |

Production builds tree-shake the unused reka-ui and date-fns modules. Jest and the Vite dev server load whole barrels, which explains most of the dev and Jest costs above. The highlight.js languages are loaded in every mode. Two issues address the biggest parts:

- [#1300](https://github.com/shopware/meteor/issues/1300), updated with these measurements. Loading the diff modal on first open makes `/MtTextEditor` about 44 % smaller, and the root goes from 731 to 472 KB (esbuild, minified and brotli).
- [#1301](https://github.com/shopware/meteor/issues/1301), replacing vuepic with the reka-ui date picker.

**size-limit on this branch** (minified, brotli, all limits met):

| Entry          | Size      | Limit  |
| -------------- | --------- | ------ |
| Package root   | 708.76 kB | 740 kB |
| `MtTextEditor` | 582.84 kB | 605 kB |
| `MtDataTable`  | 76.72 kB  | 78 kB  |
| `MtButton`     | 1.3 kB    | 1.5 kB |

### Jest and ES modules

The Admin runs Jest in CommonJS mode. Three options were tried:

1. **Transform ESM in Jest** (implemented and measured):
   - The full suite passes with 4 config changes.
   - The list of ESM-only packages has to follow Meteor's dependency graph.
   - Runs take about 35 % longer.
2. **Jest in native ESM mode** (spike): not viable.
   - It is still experimental in Jest 30.
   - It needs `@jest/globals` imports in 637 spec files and `jest.unstable_mockModule` rewrites.
3. **Vitest** (spike): promising, but a large migration.
   - Meteor and its dependencies load natively, with no allow-list, and the Admin's Vite plugins are reused.
   - The setup files, reporters and a codemod over 1,409 spec files have to move.

**Proposal:** option 1 now, option 3 as its own track together with the Vite 8 move.

### Compared with other libraries

**ES modules:**

- ESM-only packages are the direction in the Vue ecosystem: Vuetify 4, PrimeVue, Nuxt UI 4 and the Reka UI 3 alpha ship ESM only. Reka UI 3 adds per-component paths and tells Jest users to transform it.
- React libraries mostly still ship both formats.
- TypeScript 6 deprecates `moduleResolution: node` and TypeScript 7 removes it. That is why the `typesVersions` fallback is a bridge, not a long-term setup.

**CSS:**

- Here every component's JS imports its own CSS, so `/MtButton` brings its styles and the bundler extracts them. This is the same model as 5.x and as Vuetify.
- Mantine ships `styles.css`, a cascade-layer variant and per-component CSS paths, because its components don't import CSS.
- PrimeVue generates its styles in JavaScript.
- We don't add per-component CSS paths for now:
  - no consumer needs them;
  - their file names come from the build;
  - adding an export later is a minor release, while removing one is a major.

**Fonts:**

- Fontsource exports its font files so apps can preload them.
- v6 does the same with `/fonts/*`. In 5.x this worked through the now removed `dist/*` export.

### Versioning

- Now that dependencies aren't bundled, their types become part of Meteor's public types wherever they appear in `.d.mts` files. A major update of such a dependency then forces a Meteor major.
- Intentional: tiptap through `mt-text-editor`, and apexcharts through `mt-chart`.
- Incidental, and worth removing before 6.0:

  | Type                                  | From                     | Where                                          |
  | ------------------------------------- | ------------------------ | ---------------------------------------------- |
  | `FormatsConfig`                       | `@vuepic/vue-datepicker` | `mt-datepicker` (this blocks #1301 as a minor) |
  | `FocusTrap`                           | `focus-trap`             | `mt-colorpicker`                               |
  | types                                 | `@intlify/core-base`     | 4 files                                        |
  | types                                 | `@vueuse/shared`         | 4 files                                        |
  | a reference to the whole package root | Meteor itself            | 4 component type files                         |

### Security audit

`pnpm audit` for the library's production dependencies after the floor update:

- **tiptap 2:** moderate GHSA-cp6q-959q-f8rh. 2.27.3 contains the fix, but the advisory lists only 3.30.4 as patched, so audits keep flagging every 2.x.
- **vue-i18n 9:** high GHSA-83rm-6c8r-g728 and low GHSA-8rc2-428q-7ww3. vue-i18n 9 is end of life, and both are only fixed in 11.4.14.

## Open decisions (not in this branch)

- **Before 6.0:**
  - Remove the incidental type leaks listed under Versioning.
  - Decide on tiptap 3, whose types are public through `mt-text-editor`, and on apexcharts 5 or 8.
  - Use `Symbol.for(...)` for the future-flags injection key, so it also works across two Meteor copies.
- **vue-i18n 9:** move to the internal i18n adapter, or to vue-i18n 11, to clear the open advisory.
- **[#1300](https://github.com/shopware/meteor/issues/1300):** load the diff modal on first open, then replace `@git-diff-view`.
- **Lint debt outside this branch's files:**
  - 223 stylelint token warnings, which change visuals if fixed;
  - the remaining ESLint warnings in files this branch doesn't touch.
- **`mt-popover-item`:** a click on its checkbox runs the change handler twice. Its 16 ms debounce merges the calls, so users get one event.
- **Administration side:**
  - the migration above;
  - a `@shopware-ag/jest-preset-sw6-admin` release;
  - an UPGRADE note for plugin developers;
  - upgrading the Admin's own `@vueuse/core` to 14 to remove duplicate copies.

## Verification on this branch

| Check                                         | Result                                                    |
| --------------------------------------------- | --------------------------------------------------------- |
| `turbo run build` (all packages)              | pass                                                      |
| `format:check` (all packages)                 | pass                                                      |
| `lint:all` and `lint:css`                     | 0 errors                                                  |
| ESLint on the changed files                   | 0 warnings                                                |
| `lint:types` (including the docs typecheck)   | pass                                                      |
| `lint:package` (publint and attw)             | pass, all 79 entry points, node10 included                |
| Unit tests                                    | see below                                                 |
| size-limit                                    | all limits met                                            |
| TypeScript fixture against the packed tarball | 0 errors with `node`, `bundler` and `nodenext` resolution |

**Unit tests:**

| Package           | Result     |
| ----------------- | ---------- |
| Component library | 924 passed |
| admin-sdk         | 274 passed |
| tokens            | 70 passed  |
| icon-kit          | 34 passed  |
| stylelint plugin  | 201 passed |
| docs              | 4 passed   |

The tokens tests need Figma credentials; locally they ran with placeholder values.

**Not run:** the Playwright e2e tests and the Storybook visual tests.
