# Meteor

High-level repo guide for orientation. Stay at this level first; read package-local docs only when working in that area.

## Repo layout

- `packages/` — reusable Meteor packages
- `examples/` — reference consumers for the packages
- `docs/admin-sdk/` — hand-written Admin SDK docs
- `scripts/` — repo maintenance

## Main packages

- `packages/admin-sdk` — Shopware Administration SDK
- `packages/component-library` — Vue 3 component library
- `packages/tokens` — design tokens pipeline and outputs
- `packages/icon-kit` — icon assets and sync/build tooling
- `packages/stylelint-plugin-meteor` — stylelint rules for Meteor token usage
- `packages/create-meteor-extension` — scaffolding CLI and templates
- `packages/prettier-config` — shared Prettier config

## Notes

- This is a `pnpm` workspace with Turborepo (`pnpm-workspace.yaml`, `turbo.json`).
- Prefer source files over generated output.
- Usually ignore: `dist/`, `build/`, `es/`, `umd/`, `coverage/`, `.nuxt/`, `.output/`, `storybook-static/`, `node_modules/`, `.turbo/`.
- When SDK behavior changes, update `docs/admin-sdk/` too.