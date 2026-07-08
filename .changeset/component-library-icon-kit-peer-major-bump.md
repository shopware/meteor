---
"@shopware-ag/meteor-component-library": patch
---

Removed `@shopware-ag/meteor-icon-kit` from `peerDependencies` to prevent unwanted major version bumps. Because Changesets treats any non-patch bump of a peer dependency as a breaking change for the dependent package, a minor release of the icon kit forced a major release of the component library. The icon kit remains a regular dependency, so resolution is unchanged.
