# Admin SDK

Read this before changing `packages/admin-sdk`.

## What this package is

`packages/admin-sdk` is the extension-side typed bridge between an extension runtime and the Shopware Administration.

- Most public APIs are thin wrappers around `src/channel.ts`.
- The SDK should behave the same for iframe apps and plugins running in the same window.
- Administration-side business logic lives in matching handlers for the message types defined by this package.

## Files that matter

- `src/index.ts`: public export surface
- `src/channel.ts`: bridge core (`send`, `handle`, publish/subscribe, window registration, dataset subscriptions)
- `src/message-types.ts`: central contract for request/response payloads
- `src/_internals/serializer/`: transport for functions, `Criteria`, `Entity`, `EntityCollection`, and errors
- `src/data/`: repositories, dataset API, composables, `Criteria`
- `src/_internals/data/`: `Entity`, `EntityCollection`, dataset selector logic
- `src/_internals/privileges/`: permission checks and missing-privileges errors
- `docs/admin-sdk/`: user-facing docs that must stay aligned with behavior
- `adr/2024-02-26-circular-dependencies.md`: no circular imports

## Invariants

- Keep public modules thin and typed. The bridge contract is the real API.
- Do not break callback transport, serializer tags, or response shapes.
- Do not remove or weaken privilege checks around entities or datasets.
- Do not introduce circular imports.
- Prefer additive changes over mutations to existing contracts.

## How changes usually work

If you add a new public capability, you usually need:

1. a new type in `src/message-types.ts`
2. a thin sender or handler wrapper in the relevant public module
3. docs in `docs/admin-sdk`
4. tests near the affected subsystem

Keep business logic on the Administration side unless the behavior is explicitly extension-side.

## Compatibility notes

In this package, breaking changes are often runtime-level, not TypeScript-level.

Treat these as compatibility-sensitive:
- public exports
- message payload and response shapes
- serializer tag names and tagged object shapes
- callback behavior
- privilege enforcement
- public `locationId` / `positionId` expectations

When in doubt, add new message types or optional fields instead of changing existing ones.

## Implementation notes

- Serializer order matters.
- Functions are transported through dedicated callback handling.
- `Criteria`, `Entity`, and `EntityCollection` must remain transportable.
- `useRepository()` / `getRepository()` intentionally avoid eager repository side effects.
- `useSharedState()` and `useAsyncSharedState()` are not channel-based.

## Validation

- `pnpm --dir packages/admin-sdk test:unit`
- `pnpm --dir packages/admin-sdk test:e2e`
- `pnpm --dir packages/admin-sdk lint:all`
- `pnpm --dir packages/admin-sdk circular-dependencies`