---
"@shopware-ag/meteor-component-library": minor
---

Add `MtApp`, an application shell for standalone Meteor applications. It arranges the `header`, `sidebar-start`, `content`, `sidebar-end` and `global` slots into the standard frame layout, and below the `breakpoint` (1280px by default, `0` disables it) both sidebars become off-canvas drawers with automatic header triggers, a backdrop, Escape and focus handling, while staying the same elements as on desktop so their state survives layout changes. The shell provides future flags through `future`, controls the color theme through `v-model:theme`, `themeStorageKey` and `applyTheme`, mounts the `MtSnackbar` host itself and exposes its state to descendants through the new `useMtApp()` composable.

Alongside: `provideFutureFlags` accepts a ref or getter and then provides a reactive object, `hasSlotContent` treats lists that render only comments as empty, and `MtSnackbar` warns in development when more than one host is mounted.
