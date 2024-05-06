# Changelog

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
