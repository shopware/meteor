# Technology Stack

**Project:** Meteor Admin SDK Interactive Tutorial
**Researched:** 2026-04-10
**Scope:** Interactive in-browser tutorial package under `packages/`

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vue | 3.5.x | Tutorial shell, fake admin host UI, lesson chrome | This repo is already centered on Vue 3 for consumer-facing UI, including `examples/admin-sdk-app`, `examples/admin-sdk-plugin`, and `packages/component-library`. Reusing Vue keeps the package aligned with Meteor’s existing components and avoids bringing in a second UI stack. |
| Vite | 5.x | Dev server, package build, preview asset pipeline | Vite already exists in the repo and fits a browser-first package better than adding a custom bundler. Use Vite 5 for the new tutorial package so the runtime looks like the app-style example stack, not the older SDK build stack. |
| TypeScript | 5.7.x | Package code, lesson manifests, fake admin contracts | The tutorial package should stay on the repo’s current TypeScript line, not the older TypeScript 4.9 line still present in `packages/admin-sdk`. This reduces new-package technical debt from day one. |
| `@shopware-ag/meteor-admin-sdk` | `workspace:*` | Real extension-side SDK inside the preview runtime | The tutorial should teach the real SDK semantics, not a tutorial-only facade. User code should import the workspace SDK directly, while the fake admin shell implements only the host-side handlers needed for the selected lessons. |
| `@shopware-ag/meteor-component-library` | `workspace:*` | Buttons, cards, tabs, form controls, baseline styling for the fake admin shell | This keeps the tutorial visually and behaviorally aligned with Meteor without rebuilding common UI primitives. Use it for shell chrome, not as a crutch to mimic the full Shopware Administration. |

### Browser Runtime
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `esbuild-wasm` | current stable | Compile user TypeScript/JavaScript in the browser | esbuild officially supports browser execution through WebAssembly in a Web Worker. That is the right fit for a constrained, browser-local tutorial where the editable surface is a small set of lesson files and the runtime must stay repo-owned. |
| Sandboxed `iframe` | platform feature | Run user code in an isolated preview surface | The SDK already models extension code as a separate window talking to a host. A sandboxed iframe is the cleanest way to preserve that mental model while keeping user code away from the parent tutorial UI. |
| `postMessage` bridge | platform feature | Communication between preview iframe and fake admin host | MDN explicitly documents cross-window communication with `postMessage()` for iframe scenarios. This matches the Admin SDK’s messaging model and keeps the fake host/test harness honest. |
| `localforage` | 1.10.x | Persist per-lesson workspace state in the browser | The repo already uses `localforage` inside the SDK for browser persistence. Reusing it keeps persistence predictable and avoids introducing a second browser-storage abstraction. |

### Editor
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| CodeMirror | 6.x | Main code editor for lesson files | The repo already ships CodeMirror 6 and `vue-codemirror6` in `packages/component-library`. CodeMirror is modular, mobile-friendly, accessible, and lighter to integrate than Monaco for this tutorial package. |
| `vue-codemirror6` | 1.3.x | Vue wrapper for the editor | This is already present in the monorepo and is the fastest repo-fit path to a good editor integration. |
| `@codemirror/lang-javascript` | 6.x | JS/TS syntax highlighting and language config | The tutorial should default to JavaScript/TypeScript lesson files. Add only the language packages needed for those lessons instead of pulling a general-purpose IDE stack. |
| `@codemirror/lint` and autocomplete packages | 6.x | Inline syntax feedback and a small amount of guidance | Good enough for tutorial ergonomics without introducing a full language-server architecture. |

### Testing and Quality
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vitest | 3.x | Unit and component tests for the tutorial shell, fake host, lesson logic | A Vite-based Vue package should use Vitest, not Jest. This matches the repo’s newer Vue package conventions and avoids maintaining a second test runner in a fresh package. |
| Playwright | 1.47.x line | Browser integration tests for edit-run-preview flows | This tutorial’s core value is browser interaction. Playwright is already used widely in the repo and should verify the real split-pane, compile, run, and fake-admin behaviors. |
| `vue-tsc` | 2.2.x | Type-check Vue SFCs | Standard repo fit for Vue packages. |
| ESLint | 9.x | Linting for package code | Align with the repo’s newer ESLint 9 setup used by `packages/component-library` and `examples/admin-sdk-app`. |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@vueuse/core` | 13.x | Resize observers, debounced watchers, browser-event helpers | Use for split-pane drag state, preview resize tracking, and persistence throttling. |
| `nanoid` | 5.x | Ephemeral run/session IDs | Use for preview instance IDs and rebuild tracking, not for persisted lesson identity. |
| Native `BroadcastChannel` | platform feature | Optional multi-tab synchronization | Only add if restoring the same lesson in multiple tabs becomes a real requirement. Skip in v1. |

## Prescriptive Architecture Choices

### Editor Model
- Use **CodeMirror 6**, wrapped with `vue-codemirror6`.
- Start with **one editable lesson entry file** plus optional read-only support files rendered in the file tree.
- Store lesson definitions as **typed TypeScript manifests**, not MDX. The tutorial needs deterministic metadata and progression rules more than rich authoring flexibility.
- Keep syntax help intentionally small. Basic linting and completion are enough for a teaching surface.

### Runtime Model
- Compile user code with **`esbuild-wasm` in a dedicated worker**.
- Produce **one ESM bundle per run** and load it into the preview iframe as the lesson entry.
- Keep the runtime **browser-only**:
  - no Node APIs
  - no package installation
  - no arbitrary network imports
  - no dependency graph beyond a small allowlist such as `vue` and `@shopware-ag/meteor-admin-sdk`
- Prefer a **whitelisted virtual module resolver** over a general npm playground. This tutorial is about the Admin SDK, not about package-management realism.

### Sandbox and Preview
- Run user code in a **sandboxed iframe** with the smallest viable permission set.
- Use **`postMessage` only** between iframe and host.
- Do **not** grant `allow-same-origin` in the normal preview path. MDN explicitly warns against combining `allow-scripts` and `allow-same-origin` for same-origin embeds because that defeats the sandbox.
- Make the **parent tutorial app the source of truth** for the fake admin shell:
  - notifications shown
  - registered menu items
  - location and position surfaces
  - modal or sidebar visibility
- Treat the iframe as **ephemeral execution state**. Destroy and recreate it on full reruns instead of trying to preserve internal user-app state between builds.

### State Management
- Use **package-local Vue composable stores**, not Pinia, for v1.
- Split state into four explicit domains:
  - `lessonStore`: current lesson, step progression, completion state
  - `workspaceStore`: editable files, reset state, persisted drafts
  - `runtimeStore`: build status, diagnostics, active run ID, console output
  - `shellStore`: fake admin UI state driven by SDK handlers
- Persist only `workspaceStore` and the minimal lesson progression metadata with `localforage`.
- Reset `runtimeStore` and `shellStore` on every fresh run so lesson behavior stays deterministic and debuggable.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Editor | CodeMirror 6 | Monaco Editor | Monaco is heavier, requires more worker-oriented setup, and its own README says mobile browsers are not supported. The repo already has a CodeMirror path, so Monaco buys little and costs more. |
| Browser execution | `esbuild-wasm` + constrained virtual modules | WebContainers | WebContainers are explicitly a browser runtime for Node.js apps and OS commands. That is overkill for a controlled SDK tutorial and pulls the design toward full IDE behavior instead of lesson-focused execution. |
| Tutorial framework | Repo-owned Vue package | TutorialKit | TutorialKit’s React components are designed around the WebContainer API and are still experimental outside the Astro path. It also brings UnoCSS and TutorialKit design tokens that do not fit this monorepo’s existing UI stack. |
| Playground runtime | Constrained bundle runner | Sandpack | Sandpack is the in-browser bundler behind CodeSandbox and is optimized for broader live code playgrounds with npm dependency support and “open in CodeSandbox” workflows. That is unnecessary surface area for a Meteor-owned, browser-local tutorial. |
| Preview isolation | Sandboxed iframe + `postMessage` | Same-window `eval()` / dynamic `Function` | Same-window execution breaks the SDK’s host/extension mental model and makes isolation weaker. It also makes teardown, error containment, and reproducibility worse. |
| App state | Package-local composables | Pinia or XState | This package has a narrow, internal state surface. Adding an app-wide store framework now creates coupling without solving a real problem. Revisit only if authoring flows become substantially more complex. |
| Admin environment | Minimal fake admin shell | Real Shopware Administration | A real admin clone would dominate scope, add setup complexity, and reduce determinism. The project explicitly only needs enough handlers and UI to teach SDK concepts. |

## What Not To Use

- **Do not use TutorialKit packages** in the shipped package. Use the lesson progression idea, not the runtime or UI stack.
- **Do not use StackBlitz or WebContainers**. The constraint is explicit, and this tutorial does not need a browser-hosted Node environment.
- **Do not use Monaco** unless later requirements clearly justify richer language tooling than CodeMirror can provide.
- **Do not use Sandpack** for the first version. It solves a larger playground problem than this package actually has.
- **Do not use `allow-same-origin` in the default preview iframe**.
- **Do not emulate a full file system or package installer**. Keep the lesson runtime intentionally small and deterministic.
- **Do not build against a real Shopware Administration shell** for the prototype.

## Installation

```bash
# Runtime
pnpm add vue @shopware-ag/meteor-admin-sdk @shopware-ag/meteor-component-library
pnpm add codemirror vue-codemirror6 @codemirror/lang-javascript @codemirror/lint
pnpm add esbuild-wasm localforage @vueuse/core nanoid

# Dev
pnpm add -D vite @vitejs/plugin-vue typescript vue-tsc vitest jsdom
pnpm add -D @playwright/test eslint @eslint/js eslint-plugin-vue typescript-eslint
```

## Sources

### Repo sources
- `package.json`
- `packages/admin-sdk/package.json`
- `packages/component-library/package.json`
- `examples/admin-sdk-app/package.json`
- `examples/admin-sdk-plugin/src/Resources/app/administration/package.json`
- `packages/admin-sdk/AGENTS.md`
- `.planning/PROJECT.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/STRUCTURE.md`

### External primary sources
- CodeMirror homepage and docs: https://codemirror.net/ [HIGH]
- esbuild browser API: https://esbuild.github.io/api/ [HIGH]
- MDN iframe reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe [HIGH]
- TutorialKit React components: https://tutorialkit.dev/reference/react-components/ [HIGH]
- WebContainers introduction: https://webcontainers.io/guides/introduction [HIGH]
- Monaco Editor README: https://github.com/microsoft/monaco-editor [HIGH]
- CodeSandbox Sandpack overview: https://codesandbox.io/blog/sandpack-showcase [MEDIUM]

## Confidence

**Overall:** HIGH

- **Repo fit:** HIGH. The Vue, Vite, CodeMirror, Playwright, and component-library path is directly supported by the current monorepo.
- **Browser runtime recommendation:** HIGH. esbuild officially supports browser execution via WebAssembly in a worker.
- **Sandbox recommendation:** HIGH. iframe sandboxing and `postMessage` match both platform guidance and the SDK’s messaging model.
- **Negative recommendations:** HIGH for TutorialKit/WebContainers/Monaco, MEDIUM for Sandpack because the mismatch is architectural rather than a hard incompatibility.
