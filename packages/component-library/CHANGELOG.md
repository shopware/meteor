# Changelog

## 4.0.0

### Major Changes

- fc3c5a6: Reduce bundle size caused by font

  # Upgrade guide

  Previously you needed to only import one css file:

  ```js
  // Some JavaScript file: index.js
  import "@shopware-ag/meteor-component-library/dist/styles.css";
  ```

  You now need to update that one import to the following two imports:

  ```js
  // Some JavaScript file: index.js
  import "@shopware-ag/meteor-component-library/styles.css"; // Note: this path is different from the old one
  import "@shopware-ag/meteor-component-library/font.css";
  ```

  If you want to load the font by yourself, you can do that.
  Remove the second import and load the font the way you want.

- eeb8c7f: Removed locale control from mt-theme-provider.

  Controlling the local will still happen via vue-i18n

- b2ef241: Making vue a peer dependency

  This allows you to define the version of Vue you want to use. Before
  you needed to use the exact vue version Meteor used. Now you can
  define it by yourself, but it must meet the version requirements.

- 50de30f: Require a minimum version of vue 3.5
- b3039c1: # Add new Text Editor component

  This change introduces a new Text Editor component to the Meteor Component Library.

  # Updated i18n configuration

  We change the 'legacy' mode of i18n to 'false' in the Meteor Component Library configuration to use the new i18n composable.

### Minor Changes

- ba4fdbd: Adds a new slot for custom content within the button, enabling more flexible button customization.
- d9c26a2: Export mt-tooltip component
- 7593d00: remove hero variant from mt-card
- 9175c17: replace flatpickr with vue3datepicker
- b5ed517: Add mt-tooltip component
- b7423bb: remove mt-url-field

### Patch Changes

- ad10063: Hide inheritance toggle in card by default
- 0dcb079: Improve reading order for card titles when using a screen reader
- 54b5fa4: Add translation for mt-banner
- a4b2203: Add focus styles for checkbox
- 066da5c: Open tooltip when focusing disabled button
- 51d6160: Migrate mt-select over to the custom built i18n composable
- 85908bf: Migrate mt-data-table over to the custom built i18n composable
- 824ee5a: Update focus style of inheritance toggle in card
- d2480cf: Fixes a issue in the mt-modal that the toggling does not work when it is triggered outside the modal.
  Fixes a issue in the mt-modal that it does not work inside transformed elements. This was fixed by moving the modal to the body element using the native Teleport feature of Vue 3.
- 0280b80: Add missing translation for data table filters
- 069a2ad: Do not announce mt-avatar for screen readers
- daa8824: Add landmarks to card component for screen readers
- ed03f65: Improve accessibility of mt-field-error
- 893fba8: Increase contrast ratio in mt-avatar
- 3b50452: Update focus style of switch
- 4f9e73d: Migrate mt-data-table-settings over to the composition api
- 893fba8: Increase color contrast in mt-avatar component
- 45e2dc7: Make size propert on mt-loader optional
- 235546f: Migrate mt-label to custom built i18n composable
- 850107e: Fix emit focus event for mt-text-field component

## 3.14.0

### Minor Changes

- 001adb3: Add external and internal variants for link component

### Patch Changes

- cc754b9: Deprecated the mt-url-field component
- 47063ae: Deprecated mt-external link component
- 62be382: move mt-loader over to plain css
- 28f5cb1: remove default margin of banner component, hidden by future flag
- 6d32afa: Improve a11y of help text
- 936ccf3: Allow disabling individual tab items
- 2f0a666: Remove default margin from base field, hidden by future flag
- 07e243a: Migrate mt-loader over to the composition api

## 3.13.0

### Minor Changes

- a438ea0: Add future flag for removing card max width
- 3c1b5ad: Add mt-theme-provider component
- 79f0b40: Remove default margin for tab component when using removeDefaultMargin future flag

### Patch Changes

- ec2aba1: Do not announce icon of empty state
- 340f7af: fix the issue in the sw-number-field component when pressing the up or down arrow keys if a new value was typed
- 5a5e797: Replace mt-popover-deprecated in mt-colorpicker
- 307439b: Updated flatpickr dependency to the latest version to fix mt-datepicker issue when date typed manually
- d0185b6: Deprecate hero card
- 3ddcd26: Make buttons in number field accessible
- cb83cca: Deprecate small prop on tabs component
- 17bca01: Remove default margin from checkbox, hidden by future flag
- c43799c: remove default margin from card component, hidden by future flag

## 3.12.0

### Minor Changes

- ea49a5e: Disable next page and last page button in mt-pagination when data table is empty
- ecf9d1a: Allow insetting of card footer
- 627f2fb: Add mt-text component
- ebf0a2a: Add mt-inset component

### Patch Changes

- da43c4e: Use semantic border radius tokens in card component
- c412dd0: Change styling of card footer
- 36e0812: Fixed missing emit definition and console warning
- 4a59fcc: Replaced border radius tokens with tokens
- 0630e58: Adjust padding of card header
- 9ea8e15: Allow null label for mt-textarea
- dc6ad1a: allow x-small as valid variant for button
- 1321454: Add semantic border radius token for checkbox
- 6371d3a: Use rem values instead of px values in card
- 11d870a: Make toggle password button accessible
- 099ca2b: Fix styling of card title
- 8045090: Hide label with CSS in base-field component when empty
- ebe7a33: Use semantic border radius token for overlays
- bebea2e: Use button border radius token for buttons and segmented control
- Updated dependencies [e644cef]
  - @shopware-ag/meteor-tokens@0.3.0

## 3.11.0

### Minor Changes

- 1319ae3: Add mt-slider component

## 3.10.0

### Minor Changes

- 4c8d610: Add mt-modal component

## 3.9.0

### Minor Changes

- 8c74a37: Add mt-link component

### Patch Changes

- 24e5d7a: Add token to select empty state
- 573953b: Fix mt-select currentValue getter early return on null or undefined values
- 0ee7820: Make difference between enabled and disabled paginations button more clear

## 3.8.2

### Patch Changes

- 4be837e: Add tokens for loader component
- b6c52b7: Fix positioning of the toast notifications
- b301a99: Fix placeholder in select components
- 4f85b4f: Style required star for base field
- cdb9eda: Add tokens to context button
- 8182c77: Add tokens for data table component
- 3eb91a0: Add tokens for skeleton bar

## 3.8.1

### Patch Changes

- def10ee: Add tokens to tooltip component
- 81f8d4c: Fix tag deletion is not working on the Safari browser
- d60aad5: # Fix number field events
  - Deprecated `change` event for `mt-number-field`
  - Added `update:modelValue` event to `mt-number-field`
- Updated dependencies [0a0ac80]
- Updated dependencies [0a0ac80]
- Updated dependencies [0a0ac80]
- Updated dependencies [0a0ac80]
- Updated dependencies [0a0ac80]
- Updated dependencies [0a0ac80]
- Updated dependencies [0a0ac80]
- Updated dependencies [0a0ac80]
- Updated dependencies [0a0ac80]
- Updated dependencies [0a0ac80]
  - @shopware-ag/meteor-tokens@0.2.0

## 3.8.0

### Minor Changes

- 19bba6e: Make mt-floating-ui component public available

### Patch Changes

- 2946e98: Add tokens to switch component
- 7798532: Remove unecessary pressed state for number field component
- 1c90253: Add tokens to external link component
- 23dc704: Add tokens for password field
- 1574963: Set disabled attribute on disabled items in segmented control
- 40641b6: Fix tooltip placement
- 2d24896: Add tokens for textarea field
- d935701: Adjust padding of card content
- 5fc49f8: Add tokens for color picker
- 16be216: Add tokens to segmented control component
- 2b13b0b: Add tokens to number field

## 3.7.0

### Minor Changes

- cfff3b8: Update and build globally mt-empty-state
- 50afd23: Add a prop to remove settings table button in the header
- fbe8152: Allow add an image to cell table

### Patch Changes

- c76ec92: Add tokens for search component
- 15efa51: Add tokens for mt-base-field
- 1b4e735: Add tokens for checkbox component
- b9b4005: Change icon of inheritance switch
- d9f7c3e: Adjust icon of copy button

## 3.6.1

### Patch Changes

- c58b80f: Fix data table open details event emitter in context menu item

## 3.6.0

### Minor Changes

- 22a5068: Exporting Filter and Option types
- 321a830: Add filters to data table
- 3b22c7a: Import overlay popover component to use.

### Patch Changes

- b54d88c: Fix toast type to accept string|number for property id

## 3.5.2

### Patch Changes

- 84836ea: Fix correct wrapping of "mt-select-selection-list"

## 3.5.1

### Patch Changes

- b68fa55: fix createId not being compatible with webpack

## 3.5.0

### Minor Changes

- 95cdb1f: Allow attribute inheritance on every form field

### Patch Changes

- 85942a2: Fix id generation for inputs when using SSR

## 3.4.0

### Minor Changes

- 97ba4d8: Implement toasts

### Patch Changes

- 7ff2788: Remove unnecessary left border in data table
- Updated dependencies [8443590]
  - @shopware-ag/meteor-tokens@0.1.0

## 3.3.0

### Minor Changes

- f0655bf: Add inheritance toggle to card component

### Patch Changes

- a6fe140: resize checkmark in checkbox to correct dimensions
- 0ba5c91: Change wrong Fragment import from React to Vue
- 856489b: Only animate tabs slider after first render

## 3.2.0

### Minor Changes

- e0e1741: Add property "size" to "mt-icon"

## 3.1.0

### Minor Changes

- 6c6678d: - Renamed all "sw" prefixes to "mt"
  - Keep old sw prefixes for backwards compatibility

## 3.0.0

### Minor Changes

- bff12c5: - Added character count to sw-text-field and sw-textarea

### Patch Changes

- 8a9066a: Fix prop type validation inside sw-select-result-list which fixes SSR

All notable changes to this project will be documented in this file.

## [3.0.0] - 16.02.2024

- Updated Vue version from 2 to 3
- Updated Storybook build from Webpack to Vite
- Changed Jest to Vitest

## [2.2.0] - 17.10.2023

- Added MtPagination and DeviceHelperPlugin to public API
- Fix sw-tab emitting 'new-item-active' event

## [2.1.2] - 06.09.2023

- Fix indeterminate state of `sw-checkbox`

## [2.1.1] - 26.04.2023

- Fixed broken `sw-text-field` inheritance option
- Fixed missing bannerIndex property in `sw-banner`
- Fixed `sw-select` single select behaviour

## [2.1.0] - 21.03.2023

- Fixed wrong timezone handling in datepicker

## [2.0.1] - 25.01.2022

- Fixed wrong bundling of UUID utils which don't work in browser

## [2.0.0] - 09.01.2022

### BREAKING CHANGES

- Changed default font from Source-Sans-Pro to Inter

## [1.0.2] - 30.12.2022

### Changed

- Changed `visibleValues` computed property in `sw-select` to correctly display selected value for single select component.

### BREAKING CHANGES

- Updated Vue version to 2.7

### Changed

- Updated Webpack in Storybook to version 5
- Changed drop-shadow to box-shadow in "sw-card" to improve performance in Safari
