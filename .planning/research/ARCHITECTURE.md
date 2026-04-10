# Architecture Patterns

**Domain:** Interactive in-browser tutorial package for the Meteor Admin SDK
**Researched:** 2026-04-10
**Confidence:** HIGH for monorepo fit and SDK boundary choices, MEDIUM for browser compiler implementation details

## Recommended Architecture

Build a single new package, tentatively `packages/admin-sdk-tutorial`, as a Vue 3 + Vite application with a strict three-layer runtime:

```text
Tutorial Host App
├── Lesson catalog + progression
├── Split-pane tutorial UI
├── Editor/document state
├── Browser compiler worker
└── Preview session manager
    └── Sandboxed preview iframe
        └── Fake Admin Shell
            ├── SDK host bridge handlers
            ├── Fake admin UI surfaces
            ├── Hidden runtime iframe (sw-main-hidden)
            └── Visible location runtime iframes
```

This should not be split into multiple packages in v1. The monorepo already favors package-local ownership, and this product is still prototype-first. Keep the tutorial shell, fake admin shell, lesson content loader, and browser runner in one package until the bridge protocol and lesson model are proven.

The critical architectural choice is this: user code should run with the real `@shopware-ag/meteor-admin-sdk` client inside child iframes, while the tutorial package implements only the administration-side handler subset. That preserves the actual SDK mental model from `packages/admin-sdk/src/channel.ts` and avoids teaching a fake direct-call API.

### Recommended package shape

```text
packages/admin-sdk-tutorial/
├── src/app/                 # host UI, routing, split panes, lesson progression
├── src/lessons/             # lesson manifests, markdown, starter and solution files
├── src/editor/              # virtual file system, editor adapter, diagnostics
├── src/compiler/            # worker-based browser bundling
├── src/preview/             # session manager and iframe bootstrapping
├── src/fake-admin/          # fake shell UI and host bridge handlers
├── src/runtime/             # boot script injected into hidden/location iframes
└── tests/                   # integration tests around lesson execution and reset
```

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| Lesson Catalog | Load ordered lesson metadata, markdown, starter files, solutions, and scenario config from static files | Tutorial App, Editor Store, Preview Session Manager |
| Tutorial App Shell | Render split-pane UI inspired by the Solid tutorial layout: lesson text on one side, editor plus preview on the other | Lesson Catalog, Editor Store, Preview Session Manager |
| Editor Store | Keep the in-memory file tree, selected file, dirty state, diagnostics, snapshots, and reset/solution state | Editor UI, Compiler Worker, Lesson Catalog |
| Editor Adapter | Render the code editor and file tabs; default to Monaco behind an adapter, but keep the adapter boundary explicit | Editor Store |
| Compiler Worker | Bundle editable lesson files in the browser and emit one runnable bundle per run | Editor Store, Preview Session Manager |
| Preview Session Manager | Own preview lifecycle, create and destroy iframe sessions, forward boot payloads, and revoke stale assets | Compiler Worker, Fake Admin Shell |
| Fake Admin Shell | Render minimal admin chrome and teaching surfaces for notifications, menus, action buttons, positions, and mounted locations | Preview Session Manager, SDK Host Bridge |
| SDK Host Bridge | Handle `postMessage` traffic from child runtimes, using real SDK message shapes and serializer behavior for the supported subset | Fake Admin Shell, Runtime Iframes |
| Runtime Frame Factory | Spawn the hidden iframe and any visible location iframes with the compiled user bundle and lesson-specific query params | Fake Admin Shell |
| Reset Controller | Restore lesson files and destroy all runtime state by rebuilding the preview session from an immutable snapshot | Tutorial App Shell, Editor Store, Preview Session Manager |

## Lesson Content Model

Keep lessons file-based and static. Do not add a CMS, remote content source, or dynamic authoring system.

Each lesson should contain:

- `lesson.md`: narrative content, instructions, hints, and expected outcome
- `meta.ts`: id, title, order, prerequisites, estimated time, and preview mode
- `starter/*`: immutable starter files copied into the editor store
- `solution/*`: hidden solution files used for compare/reset/solve actions
- `scenario.ts`: fake-admin setup required for the lesson

Recommended lesson manifest shape:

```ts
type LessonDefinition = {
  id: string;
  title: string;
  order: number;
  markdown: string;
  entry: string;
  editableFiles: string[];
  starterFiles: Record<string, string>;
  solutionFiles: Record<string, string>;
  scenario: {
    surfaces: Array<'notifications' | 'menu' | 'positions' | 'action-buttons'>;
    positions: Array<{ id: string; label: string }>;
    context: {
      locationId?: string;
      entity?: string;
      entityIds?: string[];
    };
  };
};
```

This is the right place to borrow from TutorialKit: treat lesson content, starter files, solutions, reset, and progression as first-class data. Do not borrow its runtime assumptions such as WebContainer, terminal orchestration, or hosted preview infrastructure.

### Recommended first lesson set

1. Hidden bootstrap and `location.MAIN_HIDDEN`
2. Notifications and callback actions
3. Menu item registration and location rendering
4. Position IDs, component sections, and visible placeholder locations
5. Action buttons with callback payloads

This order matches the actual SDK learning curve better than starting with rendering. Developers first need to understand that the hidden iframe registers behavior and that visible locations are a second runtime.

## Code Editor Model

The editor should be a small virtual file system, not a single textarea and not a full cloud IDE.

Recommended rules:

- Edit only plain `.ts`, `.js`, `.json`, and maybe `.css` files in v1
- Do not support Vue SFCs in the prototype
- Do not support package installation, terminals, or arbitrary imports
- Show compile diagnostics continuously, but execute only on explicit `Run`

That last point is important. The Admin SDK is side-effectful: notifications, menu registrations, action callbacks, and location rendering all mutate runtime state. Auto-running on every keystroke creates duplicate side effects and makes reset semantics harder to reason about. Compile on change, run on demand.

The editor store should keep:

- current lesson id
- selected file
- current file contents
- immutable starter snapshot
- immutable solution snapshot
- diagnostics by file
- last successful compiled bundle

## Browser Execution Sandbox

Use a sandboxed preview iframe for the fake admin shell, and run the user bundle only inside child iframes created by that shell.

Recommended isolation model:

1. Host app compiles the lesson files into one runtime bundle
2. Host app boots a fresh preview iframe
3. Preview iframe renders the fake admin shell
4. Fake admin shell creates a hidden child iframe with `location-id=sw-main-hidden`
5. When the hidden runtime registers locations, the shell mounts visible location iframes with their own `location-id`

Use full iframe boundaries instead of `eval` inside the host app. That preserves the SDK’s existing `window.parent.postMessage(...)` transport model and makes the tutorial’s mental model match the real product.

### Sandbox settings

Use a restrictive iframe sandbox and communicate only through `postMessage`.

- Preview shell iframe: `sandbox="allow-scripts"`
- Runtime child iframes: `sandbox="allow-scripts"`
- Do not use `allow-same-origin` in v1

MDN explicitly warns that combining `allow-scripts` and `allow-same-origin` on same-origin frames weakens the sandbox enough that the embedded document can effectively escape it. For this product, security and predictable teardown matter more than direct DOM access.

### Compiler recommendation

Use `esbuild-wasm` inside a dedicated worker and bundle to a single executable runtime string per run.

Why this is the practical choice:

- official browser support exists for WebAssembly-based worker usage
- TypeScript transpilation is fast enough for a lesson-sized file graph
- a single bundle is easier to inject into fresh iframes than a custom module graph loader
- explicit bundling keeps reset deterministic

Do not build a generic npm-compatible browser IDE. The tutorial only needs a closed world: lesson files plus a fixed alias for the Admin SDK runtime.

## Fake Admin Shell

The fake shell is not a visual clone of Shopware Administration. It is a teaching host that implements only enough semantics to make SDK concepts concrete.

Recommended shell regions:

- left navigation with one or two fake menu groups
- main content area with named position placeholders
- action bar area for entity-level actions
- notification stack
- optional inspector panel showing active `locationId`s, `positionId`s, and recent bridge messages

The inspector is worth building early. Location and position concepts are otherwise invisible, and the docs explicitly describe them as hard to remember and discover.

### Supported handler subset for v1

Implement only the message types needed for the first lessons:

- `notificationDispatch`
- `menuItemAdd`
- `menuCollapse`
- `menuExpand`
- `uiComponentSectionRenderer`
- `uiTabsAddTabItem` if tabs are part of the lesson set
- `actionButtonAdd`
- `locationUpdateHeight`
- `locationUpdateUrl` only if you expose URL-based lessons
- `__function__`
- `__registerWindow__`

Do not start with repository, dataset, CMS, media modal, or IAP handlers. Those add state and serializer complexity that is not needed to prove the tutorial model.

## SDK Bridge Integration

This boundary needs to stay close to the real SDK contract.

Recommended approach:

- reuse `ShopwareMessageTypes` from `packages/admin-sdk/src/message-types.ts` for supported message names and payload shapes
- reuse or extract the serializer internals needed for callback transport, especially `function-serializer`
- implement a tutorial-local host bridge module instead of importing `packages/admin-sdk/src/channel.ts` directly on the fake-admin side

Do not import the extension-side channel wholesale into the fake admin shell. That module auto-registers with its own parent and carries extension-runtime assumptions that are wrong on the administration side. The right reuse point is the message contract plus serializer behavior, not the entire runtime.

### Why callback transport matters

Notifications and action buttons can carry functions. In the SDK, those are serialized into `__function__` payloads and invoked later through the message bridge. If the tutorial host cheats here and stores raw JS closures in the same window, it stops teaching the real runtime model.

That means the fake admin shell should treat function callbacks as transported capabilities:

1. hidden runtime sends a message with serialized callback references
2. host bridge deserializes those references into callable proxies
3. fake shell stores the proxies in UI state
4. user interaction invokes the proxy, which sends `__function__` back into the originating runtime iframe

## State Reset

Reset should be session recreation, not in-place cleanup.

Recommended reset algorithm:

1. Restore editor files from the immutable lesson starter snapshot
2. Drop the current compiled bundle
3. Destroy the preview iframe entirely
4. Recreate the preview iframe with a new session id
5. Re-run the last successful compile only when the user presses `Run`

This is the safest design because the SDK transport and serializer keep callback registries, observers, and per-window registrations in memory. Trying to unregister everything manually will miss edge cases and create cross-run leaks.

The same full-teardown strategy should run after:

- lesson switches
- `Reset`
- `Load solution`
- runtime crashes

## Data Flow

### Authoring and Run Flow

1. Tutorial app loads the lesson catalog from static files in `src/lessons/`.
2. Selecting a lesson copies its starter files into the editor store and renders its markdown instructions.
3. User edits files; the compiler worker validates and bundles them, but does not execute them yet.
4. User presses `Run`.
5. Preview session manager creates a fresh preview iframe and passes the lesson scenario plus compiled bundle to it.
6. Fake admin shell renders its base layout and creates the hidden runtime iframe.
7. Hidden runtime executes the real Admin SDK client and sends registration messages to the fake admin shell.
8. The host bridge updates shell state and mounts visible location iframes where required.
9. Visible location iframes execute the same user bundle with a different `location-id`, so `location.is(...)` branches render the correct views.
10. Notifications, menu changes, action buttons, and iframe height updates continue through `postMessage` until the session is reset.

### Runtime Data Flow

```text
Editor Store
  -> Compiler Worker
  -> Preview Session Manager
  -> Fake Admin Shell
  -> Hidden Runtime iframe
  -> SDK messages to host bridge
  -> Fake Admin UI state updates
  -> Visible Runtime iframes
  -> Further SDK messages back to host bridge
```

## Recommended Build Order

### Step 1: Static lesson model and split-pane shell

Ship a host app that can:

- load lesson markdown
- show starter files in a file tree
- switch lessons
- render a non-executable preview placeholder

This proves the TutorialKit-style progression model without touching the hard runtime work yet.

### Step 2: Fake admin shell with hard-coded scenario

Build the preview iframe and fake admin surfaces first with no user code execution. Hard-code one menu item, one card position, and one notification stack. This lets you validate layout and mount strategy early.

### Step 3: Browser compiler plus hidden runtime

Add `Run`, compile one editable entry file, and boot only the hidden iframe. The first successful vertical slice should be `notification.dispatch(...)` from user code showing a toast in the fake shell.

### Step 4: Location mounting and height sync

Support `ui.componentSection.add(...)`, `ui.menu.addMenuItem(...)`, and `location.updateHeight(...)`. This is the moment the architecture becomes believable as an SDK tutorial instead of a code playground.

### Step 5: Function callbacks and action buttons

Implement `__function__` transport and `actionButtonAdd`. This is the highest-value realism upgrade because it proves the bridge can round-trip callbacks instead of only handling fire-and-forget messages.

### Step 6: Reset, solution, and integration tests

Only after the runtime loop is stable should you add solution loading, snapshot restore, and the test matrix. Reset bugs will otherwise be hidden by the evolving runtime.

## Patterns to Follow

### Pattern 1: Real SDK client, fake host

**What:** Run the existing Admin SDK package in user iframes and replace only the administration-side handlers.
**When:** Always, unless the tutorial starts covering handler APIs that require a real Shopware backend.
**Example:**

```ts
// user lesson code
import { location, notification, ui } from '@shopware-ag/meteor-admin-sdk';

if (location.is(location.MAIN_HIDDEN)) {
  ui.menu.addMenuItem({
    label: 'Tutorial page',
    locationId: 'lesson-menu-page',
  });

  notification.dispatch({
    title: 'Bridge works',
    message: 'The fake admin shell received a real SDK message.',
  });
}
```

### Pattern 2: Immutable lesson snapshots

**What:** Treat starter and solution files as immutable snapshots and always copy them into working state.
**When:** Lesson load, reset, solution apply, and test setup.
**Example:**

```ts
const workingFiles = structuredClone(lesson.starterFiles);
```

### Pattern 3: Session-per-run preview lifecycle

**What:** Create a new preview session for each run instead of mutating a long-lived iframe tree.
**When:** Every explicit run or reset.
**Example:**

```ts
sessionId.value += 1;
previewFrame.srcdoc = createPreviewDocument({ sessionId: sessionId.value, bundle });
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Mocking the SDK as same-window function calls

**What:** Replace `postMessage` with direct JS method calls between host UI and user code.
**Why bad:** It teaches the wrong mental model and breaks callback, location, and iframe semantics.
**Instead:** Keep iframe boundaries and a typed host bridge.

### Anti-Pattern 2: Full cloud IDE scope in v1

**What:** Add terminals, npm install, arbitrary imports, or multi-process preview infrastructure.
**Why bad:** It recreates TutorialKit and StackBlitz complexity without helping the teaching goal.
**Instead:** Keep a closed lesson file graph and one explicit run loop.

### Anti-Pattern 3: In-place reset

**What:** Try to clear notifications, remove menu items, unregister callbacks, and detach observers manually.
**Why bad:** Callback registries and iframe lifecycle state leak across runs.
**Instead:** Destroy and rebuild the preview session.

### Anti-Pattern 4: Vue SFC editing in the prototype

**What:** Let users edit `.vue` components in-browser from day one.
**Why bad:** It multiplies the compiler surface and distracts from SDK concepts.
**Instead:** Start with plain TypeScript modules and controlled DOM rendering.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| Hosting | Static site build is enough | CDN cache the tutorial assets and wasm bundle | Same, because execution stays browser-local |
| Lesson catalog size | Bundle all lessons | Code-split lesson markdown and starter files by route | Pre-generate lesson indexes and lazy-load everything else |
| Runtime cost | One compiler worker per tab is fine | Prefer on-demand worker startup and bundle caching per lesson | Same browser limits apply; server scaling is still mostly irrelevant |
| Testing | Integration tests for first lessons | Add regression fixtures per lesson | Add canary browser tests for major browser engines |

## Sources

### Local repository sources

- `/Users/jannisleifeld/Sites/meteor/.planning/PROJECT.md`
- `/Users/jannisleifeld/Sites/meteor/.planning/codebase/ARCHITECTURE.md`
- `/Users/jannisleifeld/Sites/meteor/.planning/codebase/STRUCTURE.md`
- `/Users/jannisleifeld/Sites/meteor/packages/admin-sdk/AGENTS.md`
- `/Users/jannisleifeld/Sites/meteor/packages/admin-sdk/src/channel.ts`
- `/Users/jannisleifeld/Sites/meteor/packages/admin-sdk/src/message-types.ts`
- `/Users/jannisleifeld/Sites/meteor/packages/admin-sdk/src/_internals/serializer/index.ts`
- `/Users/jannisleifeld/Sites/meteor/packages/admin-sdk/src/_internals/serializer/function-serializer.ts`
- `/Users/jannisleifeld/Sites/meteor/packages/admin-sdk/src/location/index.ts`
- `/Users/jannisleifeld/Sites/meteor/packages/admin-sdk/src/notification/index.ts`
- `/Users/jannisleifeld/Sites/meteor/packages/admin-sdk/src/ui/action-button/index.ts`
- `/Users/jannisleifeld/Sites/meteor/examples/admin-sdk-app/src/frontend/main.ts`
- `/Users/jannisleifeld/Sites/meteor/examples/admin-sdk-app/src/frontend/init/init-app.ts`
- `/Users/jannisleifeld/Sites/meteor/examples/admin-sdk-plugin/src/Resources/app/administration/src/main.ts`
- `/Users/jannisleifeld/Sites/meteor/examples/admin-sdk-plugin/src/Resources/app/administration/src/viewRenderer.ts`
- `/Users/jannisleifeld/Sites/meteor/docs/admin-sdk/concepts/locations.md`
- `/Users/jannisleifeld/Sites/meteor/docs/admin-sdk/concepts/positions.md`
- `/Users/jannisleifeld/Sites/meteor/docs/admin-sdk/api-reference/notification.md`
- `/Users/jannisleifeld/Sites/meteor/docs/admin-sdk/api-reference/ui/menu.md`
- `/Users/jannisleifeld/Sites/meteor/docs/admin-sdk/api-reference/ui/actionButton.md`

### External sources

- TutorialKit API reference, especially lesson files, reset, solve, and snapshot semantics: https://tutorialkit.dev/reference/tutorialkit-api/ (MEDIUM confidence; used for lesson model inspiration, not runtime adoption)
- esbuild API browser usage with WebAssembly worker: https://esbuild.github.io/api/#transform-api (MEDIUM confidence; official browser execution guidance)
- MDN `<iframe>` reference, especially sandbox restrictions and `allow-same-origin` warning: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe (HIGH confidence)
