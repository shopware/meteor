# Phase 03: browser-run-loop - Research

**Researched:** 2026-04-10  
**Domain:** Browser-local code execution, iframe isolation, preview session orchestration for the Meteor Admin SDK tutorial  
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

Verbatim copy from `.planning/phases/03-browser-run-loop/03-CONTEXT.md`. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md]

### Locked Decisions

### Run trigger behavior
- **D-01:** Lesson code should execute only when the learner explicitly clicks `Run`.
- **D-02:** Phase 3 should not auto-run on lesson open, after edits, or on a debounce timer.
- **D-03:** After the learner edits code, the workspace should keep the last successful run visible until the learner explicitly runs again, with a clear not-yet-run state for the draft.

### Error and diagnostics flow
- **D-04:** Compile and runtime failures should appear in a dedicated diagnostics panel inside the workspace instead of collapsing the full tutorial shell.
- **D-05:** When a run fails, the preview pane should leave the last-success snapshot model and switch to an error state rather than continuing to show stale successful output.

### Restart and isolation semantics
- **D-06:** `Restart preview` should reset only the preview runtime session and its state.
- **D-07:** Restarting the preview must preserve the learner's current edited code.
- **D-08:** The preview runtime should stay isolated from the tutorial shell so learner execution state cannot leak into the host workspace UI.

### Preview scope before fake-admin work
- **D-09:** Successful runs in Phase 3 should render a minimal isolated lesson app surface.
- **D-10:** Phase 3 should not introduce fake admin chrome or host-shell visuals early; that belongs to Phase 4.

### Claude's Discretion
- The exact placement and copy for the `Run`, `Restart preview`, and diagnostics controls.
- Whether the diagnostics panel uses tabs, stacked sections, or a split layout alongside the preview.
- The exact wording and visual treatment of the "changes not run yet" state.
- The concrete sandboxing mechanism that delivers runtime isolation while staying browser-local and repo-owned.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| RUN-02 | User can explicitly run the current lesson and see the preview update in the browser. [VERIFIED: .planning/REQUIREMENTS.md] | Use a parent-owned preview controller that rebuilds and mounts a fresh iframe session only on explicit `Run`. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md][CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe] |
| RUN-03 | User can see compile or runtime errors without breaking the tutorial shell. [VERIFIED: .planning/REQUIREMENTS.md] | Keep compilation in the host app, catch runtime failures inside the iframe, and mirror diagnostics into a dedicated workspace panel. [CITED: https://esbuild.github.io/api/][CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage] |
| RUN-04 | User can restart the preview session to get a clean runtime state for the current lesson. [VERIFIED: .planning/REQUIREMENTS.md] | Model each preview as a disposable session keyed by `sessionId`; restart replaces the iframe without touching persisted drafts. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md][VERIFIED: repo grep] |
| RUN-05 | User code runs locally in the browser without depending on StackBlitz, TutorialKit runtime, or a remote execution service. [VERIFIED: .planning/REQUIREMENTS.md] | Use browser-local bundling with `esbuild-wasm` and a sandboxed iframe document owned by the tutorial package. [CITED: https://esbuild.github.io/api/][VERIFIED: npm registry][VERIFIED: .planning/PROJECT.md] |
| SHELL-05 | Learner code runs in an isolated preview session so tutorial state does not leak into the host UI. [VERIFIED: .planning/REQUIREMENTS.md] | Keep learner code inside a separate iframe browsing context and communicate only through a narrow `postMessage` bridge. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe][CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage][VERIFIED: repo grep] |
</phase_requirements>

## Summary

Phase 3 should add a parent-owned preview controller that compiles the current lesson into a fresh iframe session only when the learner clicks `Run`, while keeping lesson drafts and lesson navigation state in the existing workspace store. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md][VERIFIED: .planning/phases/02-tutorial-workspace-ux/02-CONTEXT.md][VERIFIED: repo grep]

The strongest fit for this repo is browser-local bundling with `esbuild-wasm`, followed by execution inside a sandboxed iframe that talks to the tutorial shell over `window.postMessage()`. [VERIFIED: npm registry][CITED: https://esbuild.github.io/api/][CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage] That recommendation is driven by three verified constraints: current lessons are multi-file TypeScript bundles, the learner runtime must use the real `@shopware-ag/meteor-admin-sdk` package, and that SDK sends messages to `window.parent` and uses iframe/location semantics at runtime. [VERIFIED: repo grep]

Do not run learner code in the host Vue app, do not deep-import SDK internals such as `channel.ts`, and do not hand-roll a custom module graph/rewriter around `ts.transpileModule`. [VERIFIED: repo grep][CITED: https://www.typescriptlang.org/tsconfig/#isolatedModules] The public SDK surface does not export host-side handler helpers, so the host bridge should live in `packages/admin-sdk-tutorial` and implement only the message types needed by seeded lessons in Phase 3, while keeping the learner import pointed at the real SDK package. [VERIFIED: repo grep]

**Primary recommendation:** Use `esbuild-wasm` in the parent app to build a single preview bundle per run, mount it in a fresh sandboxed iframe session, and bridge diagnostics plus minimal run state back to the existing workspace UI over a narrow `postMessage` contract. [VERIFIED: npm registry][CITED: https://esbuild.github.io/api/][CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe][CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage]

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `esbuild-wasm` | `0.28.0` — modified `2026-04-02` [VERIFIED: npm registry] | Browser-local bundle/transpile step for the learner lesson graph plus preview harness. [CITED: https://esbuild.github.io/api/] | The official browser API supports `initialize()` with a WebAssembly binary and runs in a Web Worker, which avoids hand-rolled TS/ESM graph assembly in the host UI. [CITED: https://esbuild.github.io/api/] |
| `@shopware-ag/meteor-admin-sdk` | `workspace:*` in the tutorial package, targeting local package version `6.7.1` in the repo. [VERIFIED: repo grep] | Real learner-facing SDK surface that the tutorial must teach against. [VERIFIED: .planning/PROJECT.md][VERIFIED: repo grep] | Existing lessons already import `notification`, `location`, and `ui` from the real package, and the project explicitly requires compatibility with actual SDK semantics. [VERIFIED: repo grep][VERIFIED: .planning/PROJECT.md] |
| `vue` | Existing package dependency `^3.5.0`; latest registry version `3.5.32`, modified `2026-04-03`. [VERIFIED: repo grep][VERIFIED: npm registry] | Host workspace shell, run controls, preview status, and diagnostics UI. [VERIFIED: repo grep] | The tutorial package is already a Vue 3 + Vite app, so the run loop should extend the existing shell instead of introducing a second UI stack. [VERIFIED: repo grep] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Browser `iframe` + `sandbox` | Baseline since July 2015. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe] | Preview isolation boundary and session teardown primitive. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe] | Use for every run and restart so the preview gets a separate browsing context from the host UI. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe] |
| `window.postMessage()` | Baseline since July 2015. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage] | Narrow bridge between the host shell and the preview iframe. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage] | Use for run lifecycle events, diagnostics, and the tutorial-local SDK host bridge; always validate `source`, `origin`, and a session token. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage] |
| `vitest` | Existing package dependency `^3.0.5`; latest registry version `4.1.4`, modified `2026-04-09`. [VERIFIED: repo grep][VERIFIED: npm registry] | Unit and integration coverage for the preview controller, message bridge, and workspace state transitions. [VERIFIED: repo grep] | Use for fast iteration on compile/run/restart/error flows before Playwright. [VERIFIED: repo grep] |
| `@playwright/test` | Existing package dependency `^1.45.0`; latest registry version `1.59.1`, modified `2026-04-10`. [VERIFIED: repo grep][VERIFIED: npm registry] | Browser-level proof that run, diagnostics, and restart work without breaking the shell. [VERIFIED: repo grep] | Use for Phase 3 acceptance coverage because this requirement set is inherently browser-behavior-heavy. [VERIFIED: .planning/ROADMAP.md][VERIFIED: repo grep] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `esbuild-wasm` [VERIFIED: npm registry] | `ts.transpileModule` from `typescript` [CITED: https://www.typescriptlang.org/tsconfig/#isolatedModules] | `transpileModule` is single-file only; TypeScript explicitly documents `isolatedModules` limitations for this class of transpilation, so you still need a fragile custom resolver, rewriter, and bundler layer for multi-file lessons plus the SDK import. [CITED: https://www.typescriptlang.org/tsconfig/#isolatedModules] |
| `esbuild-wasm` [VERIFIED: npm registry] | `@babel/standalone` `7.29.2` [VERIFIED: npm registry] | Babel’s own docs say `@babel/standalone` is mainly for prototyping or sites that compile user-provided JavaScript in real time; it does not solve the bundle graph problem by itself. [CITED: https://babel.dev/docs/babel-standalone] |
| `esbuild-wasm` [VERIFIED: npm registry] | `sucrase` `3.35.1` [VERIFIED: npm registry] | `sucrase` is a syntax transform, not a browser bundler, so the tutorial would still need a separate graph/resolution system. [ASSUMED] |

**Installation:**
```bash
pnpm --dir packages/admin-sdk-tutorial add -D esbuild-wasm
```

**Version verification:** `esbuild-wasm` latest `0.28.0` modified `2026-04-02`; `vue` latest `3.5.32` modified `2026-04-03`; `vitest` latest `4.1.4` modified `2026-04-09`; `@playwright/test` latest `1.59.1` modified `2026-04-10`. [VERIFIED: npm registry]

## Architecture Patterns

### Recommended Project Structure
```text
packages/admin-sdk-tutorial/src/
├── runtime/
│   ├── preview-controller.ts      # Host-side compile/run/restart orchestration
│   ├── preview-session.ts         # Session ids, iframe lifecycle, teardown
│   ├── preview-bridge.ts          # postMessage contract and diagnostics relay
│   ├── preview-host.ts            # Tutorial-local SDK message handlers
│   ├── scenario-adapters/
│   │   ├── notification.ts        # Calls current notification lesson exports
│   │   └── location.ts            # Calls current location lesson exports
│   └── preview-frame.html         # Minimal iframe document or srcdoc template
├── workspace/
│   └── useTutorialWorkspace.ts    # Draft persistence stays here, unchanged in role
└── App.vue                        # Run/Restart/diagnostics wiring
```

### Pattern 1: Parent-Owned Preview Controller
**What:** Keep draft editing and lesson selection in `useTutorialWorkspace()`, but move compile/run/restart state into a separate runtime controller. [VERIFIED: repo grep]  
**When to use:** Always; the phase context explicitly says preview-session state must stay distinct from persisted lesson drafts. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md]  
**Example:**
```ts
// Source: repo design derived from existing workspace + phase constraints
interface PreviewControllerState {
  sessionId: string | null;
  status: "idle" | "dirty" | "building" | "running" | "success" | "compile-error" | "runtime-error";
  lastSuccessfulSessionId: string | null;
  diagnostics: PreviewDiagnostic[];
}
```

### Pattern 2: Session-Per-Run Iframe
**What:** Treat each `Run` or `Restart preview` as a new iframe session instead of trying to scrub globals inside a long-lived runtime. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe][VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md]  
**When to use:** Every explicit run and restart. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md]  
**Example:**
```ts
// Source: MDN iframe browsing-context model + phase restart requirements
function replacePreviewSession(nextSessionId: string): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.sandbox.add("allow-scripts");
  iframe.title = "Lesson preview";
  iframe.dataset.sessionId = nextSessionId;
  return iframe;
}
```

### Pattern 3: Tutorial-Local SDK Host Bridge
**What:** Let learner code keep importing the real SDK package, but answer SDK `postMessage` requests in tutorial-owned host code instead of deep-importing SDK internals. [VERIFIED: repo grep]  
**When to use:** For `notificationDispatch`, `uiComponentSectionRenderer`, and the minimal location/bootstrap flows needed by the seeded lessons. [VERIFIED: repo grep]  
**Example:**
```ts
// Source: current lessons + SDK send semantics in packages/admin-sdk/src/channel.ts
window.addEventListener("message", (event) => {
  if (event.source !== previewIframe.contentWindow) return;
  if (!isPreviewEnvelope(event.data, currentSessionId)) return;

  switch (event.data._type) {
    case "notificationDispatch":
      recordNotification(event.data._data);
      respondOk(event, event.data._callbackId);
      break;
    case "uiComponentSectionRenderer":
      recordComponentSection(event.data._data);
      respondOk(event, event.data._callbackId);
      break;
  }
});
```

### Pattern 4: Scenario Adapter Registry
**What:** Normalize current lesson entry shapes behind tutorial-local adapters keyed by `manifest.scenario.kind` instead of rewriting lesson authoring in Phase 3. [VERIFIED: repo grep]  
**When to use:** Immediately, because the seeded lessons export different entrypoints today (`runLesson`, `describeCurrentSurface`, `bootstrapLessonLocation`). [VERIFIED: repo grep]  
**Example:**
```ts
// Source: current lesson manifests and lesson exports in the repo
const scenarioAdapters = {
  notification: async (mod) => await mod.runLesson?.(),
  location: async (mod) =>
    typeof mod.bootstrapLessonLocation === "function"
      ? mod.bootstrapLessonLocation()
      : mod.describeCurrentSurface?.(),
};
```

### Anti-Patterns to Avoid
- **Running learner code in the host Vue app:** This breaks the isolation requirement and bypasses the SDK’s real iframe/window semantics. [VERIFIED: .planning/REQUIREMENTS.md][VERIFIED: repo grep]
- **Deep-importing `packages/admin-sdk/src/channel.ts` from the tutorial package:** `createHandler` is not on the public SDK export surface, and repo conventions prefer public barrels over internal deep imports. [VERIFIED: repo grep]
- **Keeping one long-lived preview iframe and “resetting” globals manually:** This leaves timers, listeners, and hidden mutable state behind; the phase explicitly wants clean recovery from stale runtime state. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md]
- **Using `sandbox="allow-scripts allow-same-origin"` unless you intentionally accept same-origin escape risk:** MDN strongly discourages that combination for same-origin embedded documents because it can nullify the sandbox. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Browser-local TS/ESM lesson bundling | A custom import parser plus regex rewrite pipeline. [CITED: https://www.typescriptlang.org/tsconfig/#isolatedModules] | `esbuild-wasm` build plugins with virtual modules. [CITED: https://esbuild.github.io/api/][CITED: https://esbuild.github.io/plugins/][VERIFIED: npm registry] | Current lessons are multi-file and must import the real SDK package; the bundler already solves graph walking, virtual modules, and browser output. [VERIFIED: repo grep][CITED: https://esbuild.github.io/api/] |
| Runtime teardown | Manual cleanup of globals, timers, and listeners in a reused iframe. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md] | Full iframe replacement per run/restart. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe] | Browsing-context replacement is simpler and more reliable than guessing what user code mutated. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe] |
| Cross-window transport | Shared refs into the host app or same-window `eval`. [VERIFIED: .planning/REQUIREMENTS.md] | A session-scoped `postMessage` envelope with source/origin validation. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage] | The real SDK already uses `window.parent.postMessage`, and MDN documents the required security checks. [VERIFIED: repo grep][CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage] |
| Diagnostics extraction | Regex-parsing thrown error strings only. [ASSUMED] | Structured compiler errors plus serialized runtime error payloads. [CITED: https://esbuild.github.io/api/] | Compile failures and runtime failures need separate, teachable handling in a dedicated diagnostics panel. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md] |

**Key insight:** The hard problem in this phase is not “run this function in the browser”; it is “preserve the real SDK’s iframe message model while giving the planner a predictable compile graph, clean teardown semantics, and a host UI that never shares mutable runtime state with learner code.” [VERIFIED: repo grep][VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md]

## Common Pitfalls

### Pitfall 1: Collapsing Draft State and Run State
**What goes wrong:** Editing immediately mutates what the preview displays, so the user loses the distinction between “current draft” and “last successful run.” [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md]  
**Why it happens:** The current workspace store only tracks persisted drafts, not preview-session snapshots. [VERIFIED: repo grep]  
**How to avoid:** Add a runtime store with `lastSuccessfulSessionId`, `lastSuccessfulDraftHash`, and `status`, and keep it separate from `lessonDrafts`. [VERIFIED: repo grep][VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md]  
**Warning signs:** The preview changes while typing, or a failed run leaves the old “success” UI visible without any dirty-state marker. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md]

### Pitfall 2: Choosing a Worker Instead of an Iframe
**What goes wrong:** The learner runtime can no longer exercise real SDK behavior because the SDK depends on `window.parent`, DOM APIs, and iframe location semantics. [VERIFIED: repo grep]  
**Why it happens:** Workers look attractive for isolation, but the current SDK and lessons are browser-window code, not worker code. [VERIFIED: repo grep]  
**How to avoid:** Keep compilation in the host thread/worker, but execute the preview in an iframe browsing context. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe][VERIFIED: repo grep]  
**Warning signs:** `notification.dispatch()` or `location.is()` fail before host logic even runs. [VERIFIED: repo grep]

### Pitfall 3: Using Single-File TS Transforms as a Bundle Strategy
**What goes wrong:** Relative support-file imports, future shared runtime helpers, and the real SDK import force custom resolver work that grows into a mini bundler. [VERIFIED: repo grep][CITED: https://www.typescriptlang.org/tsconfig/#isolatedModules]  
**Why it happens:** `ts.transpileModule` only understands one file at a time; TypeScript documents the `isolatedModules` limitation explicitly. [CITED: https://www.typescriptlang.org/tsconfig/#isolatedModules]  
**How to avoid:** Use `esbuild-wasm` build plugins for the module graph and reserve `ts.transpileModule` for tiny one-file-only experiments, not the tutorial runtime. [CITED: https://esbuild.github.io/api/][CITED: https://esbuild.github.io/plugins/]  
**Warning signs:** You start adding ad hoc path rewrites, extension guessing, or bare-specifier hacks inside the preview controller. [ASSUMED]

### Pitfall 4: Over-Broad Host Bridge Scope
**What goes wrong:** Phase 3 starts implementing fake-admin chrome or too much host behavior early, which blurs the boundary with Phase 4. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md]  
**Why it happens:** The host bridge must answer enough SDK messages to avoid timeouts, and it is easy to overbuild visible shell behavior at the same time. [VERIFIED: repo grep]  
**How to avoid:** Keep Phase 3’s host bridge minimal and invisible: acknowledge or record only the message types needed for successful run semantics and a minimal preview surface. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md][VERIFIED: repo grep]  
**Warning signs:** The preview starts showing admin-like chrome, menus, or event timelines that the roadmap reserves for Phase 4. [VERIFIED: .planning/ROADMAP.md]

## Code Examples

Verified patterns from official or repo sources:

### Browser-Local Bundler Initialization
```ts
// Source: https://esbuild.github.io/api/
import * as esbuild from "esbuild-wasm";

await esbuild.initialize({
  wasmURL: "./node_modules/esbuild-wasm/esbuild.wasm",
});
```

### Iframe Sandboxing + Two-Way Messaging
```ts
// Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
const iframe = document.createElement("iframe");
iframe.sandbox.add("allow-scripts");
iframe.srcdoc = "<!doctype html><html><body><script>window.parent.postMessage({ type: 'ready' }, '*')<\/script></body></html>";

window.addEventListener("message", (event) => {
  if (event.source !== iframe.contentWindow) return;
  // Validate session token + origin/source here before trusting the payload.
});
```

### Current Lesson Export Shapes That Need Adapters
```ts
// Source: packages/admin-sdk-tutorial/src/lessons/**/starter.ts and solution.ts
export async function runLesson(): Promise<void> {
  await notification.dispatch({ /* ... */ });
}

export function describeCurrentSurface(): string {
  if (location.is(location.MAIN_HIDDEN)) {
    return "Hidden location ...";
  }
  return "Unknown location ...";
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Import-map polyfills were commonly required for browser module sandboxes. [CITED: https://www.npmjs.com/package/es-module-shims] | Native import maps are baseline across major browsers for document modules. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap] | Baseline since March 2023. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap] | Phase 3 can avoid an extra shim if it keeps the preview in a document context and stays aligned with the repo’s current Chromium Playwright lane. [VERIFIED: repo grep] |
| Real-time browser demos often relied on ad hoc transpilers or hosted sandboxes. [ASSUMED] | `esbuild-wasm` has an official in-browser API that runs in WebAssembly and can use build plugins. [CITED: https://esbuild.github.io/api/][CITED: https://esbuild.github.io/plugins/] | Current docs as of 2026-04-10. [CITED: https://esbuild.github.io/api/] | The tutorial can stay fully repo-owned and browser-local without introducing StackBlitz or TutorialKit runtime dependencies. [VERIFIED: .planning/PROJECT.md][CITED: https://esbuild.github.io/api/] |

**Deprecated/outdated:**
- Same-window preview execution for this phase is outdated relative to the project’s locked isolation requirement, because the real SDK expects iframe/window semantics and the requirement explicitly forbids host-state leakage. [VERIFIED: .planning/REQUIREMENTS.md][VERIFIED: repo grep]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Chromium-first browser support is sufficient for Phase 3, so native import maps and a Chromium-validated iframe runtime are acceptable without immediately adding `es-module-shims`. [ASSUMED] | State of the Art / Standard Stack | Safari or Firefox support could require a shim or a different runtime-loading path sooner than planned. |
| A2 | The minimal Phase 3 host bridge only needs to cover the seeded lesson scenarios already in the repo (`notification` and `location`). [ASSUMED] | Architecture Patterns | Additional lesson scenarios introduced before Phase 4 could force earlier bridge expansion. |
| A3 | Bundling one preview artifact per explicit run is fast enough for the current lesson set and does not require incremental caching in the first implementation. [ASSUMED] | Summary / Architecture Patterns | If run latency is too high, the planner will need a caching or warm-context task in Wave 1 instead of later hardening. |

## Open Questions (RESOLVED)

1. **Should the Phase 3 iframe stay on `sandbox="allow-scripts"` only, or does the chosen implementation still need `allow-same-origin` for any asset-loading path?**  
   Resolution: Phase 3 will stay on `sandbox="allow-scripts"` only. The plan now standardizes on a fully bundled preview artifact plus a single tutorial-owned frame document, so there is no approved runtime asset-loading path that justifies `allow-same-origin`. Any future exception must be treated as a new design decision and not introduced silently in this phase. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe][CITED: https://esbuild.github.io/api/]

2. **What is the smallest useful Phase 3 success surface for the preview pane?**  
   Resolution: The smallest acceptable Phase 3 success surface is a neutral isolated preview card that shows the rendered lesson output, the current preview status, and minimal scenario-specific output text only. It must not add fake-admin chrome, menus, or event timelines; those remain reserved for Phase 4. This keeps the preview resultful enough to prove explicit run/restart behavior while preserving the phase boundary. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md][VERIFIED: .planning/ROADMAP.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite/Vitest/esbuild/browser build tooling | ✓ [VERIFIED: shell command] | `v22.13.1` via Volta path [VERIFIED: shell command] | — |
| npm | Live registry checks and generic package access | ✓ [VERIFIED: shell command] | `11.12.1` [VERIFIED: shell command] | — |
| `pnpm` | Standard workspace install/run commands | ✗ for execution in this environment [VERIFIED: shell command] | Binary exists, but `pnpm --version` currently fails with a Corepack signature error instead of returning `10.12.3`. [VERIFIED: shell command][VERIFIED: repo grep] | Use direct `node_modules/.bin/*` commands for lint/test only; there is no safe fallback for adding dependencies until the Corepack/pnpm issue is fixed. [VERIFIED: shell command] |
| `vitest` CLI | Fast unit/integration validation | ✓ [VERIFIED: shell command] | `3.0.5` local install [VERIFIED: shell command] | — |
| `eslint` CLI | Package lint/autofix | ✓ [VERIFIED: shell command] | `9.21.0` local install [VERIFIED: shell command] | — |
| Playwright CLI | Browser acceptance checks | ✓ [VERIFIED: shell command] | `1.47.2` local install [VERIFIED: shell command] | — |
| Jest CLI | Legacy package-level suite already present in this package | ✓ [VERIFIED: shell command] | `29.7.0` local install [VERIFIED: shell command] | — |

**Missing dependencies with no fallback:**
- `pnpm` is the blocking dependency for dependency installation and standard workspace commands until the local Corepack signature problem is resolved. [VERIFIED: shell command][VERIFIED: repo grep]

**Missing dependencies with fallback:**
- None beyond the `pnpm` execution issue; lint/test binaries are directly runnable from `node_modules/.bin`. [VERIFIED: shell command]

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `Vitest 3.0.5` for unit/integration, `Playwright 1.47.2` for browser acceptance, plus existing `Jest 29.7.0` legacy package suite. [VERIFIED: shell command][VERIFIED: repo grep] |
| Config file | `packages/admin-sdk-tutorial/vitest.config.ts`, `packages/admin-sdk-tutorial/playwright.config.ts`, `packages/admin-sdk-tutorial/jest.config.cjs`. [VERIFIED: repo grep] |
| Quick run command | `../../node_modules/.bin/vitest run src/App.spec.ts src/workspace/useTutorialWorkspace.spec.ts src/runtime/**/*.spec.ts` from `packages/admin-sdk-tutorial/`. [VERIFIED: repo grep][ASSUMED] |
| Full suite command | `../../node_modules/.bin/vitest run && ../../node_modules/.bin/playwright test tests/e2e/tutorial-workspace.spec.ts && ../../node_modules/.bin/jest --config jest.config.cjs` from `packages/admin-sdk-tutorial/`. [VERIFIED: repo grep][ASSUMED] |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RUN-02 | Explicit `Run` compiles the current draft and updates the preview pane only after the button press. [VERIFIED: .planning/REQUIREMENTS.md] | integration + e2e [VERIFIED: .planning/ROADMAP.md] | `../../node_modules/.bin/vitest run src/runtime/preview-controller.spec.ts src/App.spec.ts && ../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts -g "explicit run"` [ASSUMED] | ❌ Wave 0 |
| RUN-03 | Compile and runtime errors appear in diagnostics without collapsing the workspace shell. [VERIFIED: .planning/REQUIREMENTS.md] | integration + e2e [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md] | `../../node_modules/.bin/vitest run src/runtime/preview-bridge.spec.ts src/runtime/preview-controller.spec.ts && ../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts -g "diagnostics"` [ASSUMED] | ❌ Wave 0 |
| RUN-04 | `Restart preview` replaces the runtime session while preserving the current draft. [VERIFIED: .planning/REQUIREMENTS.md] | integration + e2e [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md] | `../../node_modules/.bin/vitest run src/runtime/preview-session.spec.ts src/App.spec.ts && ../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts -g "restart"` [ASSUMED] | ❌ Wave 0 |
| RUN-05 | Learner code compiles and executes entirely browser-local with no hosted sandbox service. [VERIFIED: .planning/REQUIREMENTS.md] | unit + manual assertion in e2e logs/network [ASSUMED] | `../../node_modules/.bin/vitest run src/runtime/preview-controller.spec.ts && ../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts -g "browser local"` [ASSUMED] | ❌ Wave 0 |
| SHELL-05 | Learner runtime stays isolated from host workspace state and UI. [VERIFIED: .planning/REQUIREMENTS.md] | integration + e2e [VERIFIED: .planning/ROADMAP.md] | `../../node_modules/.bin/vitest run src/runtime/preview-session.spec.ts src/runtime/preview-bridge.spec.ts && ../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts -g "isolated preview"` [ASSUMED] | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `../../node_modules/.bin/vitest run src/runtime/**/*.spec.ts src/App.spec.ts` from `packages/admin-sdk-tutorial/`. [ASSUMED]
- **Per wave merge:** `../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts` from `packages/admin-sdk-tutorial/`. [ASSUMED]
- **Phase gate:** `../../node_modules/.bin/vitest run && ../../node_modules/.bin/playwright test && ../../node_modules/.bin/jest --config jest.config.cjs` from `packages/admin-sdk-tutorial/`. [ASSUMED][VERIFIED: repo grep]

### Wave 0 Gaps
- [ ] `packages/admin-sdk-tutorial/src/runtime/preview-controller.spec.ts` — compile/run state machine coverage for RUN-02, RUN-03, RUN-04, RUN-05. [VERIFIED: repo grep]
- [ ] `packages/admin-sdk-tutorial/src/runtime/preview-session.spec.ts` — iframe teardown/replacement and session token coverage for RUN-04 and SHELL-05. [VERIFIED: repo grep]
- [ ] `packages/admin-sdk-tutorial/src/runtime/preview-bridge.spec.ts` — `postMessage` envelope validation, source checks, and diagnostics relay coverage for RUN-03 and SHELL-05. [VERIFIED: repo grep]
- [ ] `packages/admin-sdk-tutorial/tests/e2e/tutorial-run-loop.spec.ts` — browser acceptance for run, diagnostics, restart, and dirty-state versus last-success state. [VERIFIED: repo grep]
- [ ] Package install step for `esbuild-wasm` once the local `pnpm` issue is fixed. [VERIFIED: shell command][VERIFIED: npm registry]

## Security Domain

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no [ASSUMED] | None; Phase 3 is browser-local and does not introduce user auth. [VERIFIED: .planning/PROJECT.md] |
| V3 Session Management | yes [ASSUMED] | Session-scoped preview ids and iframe replacement on run/restart to prevent stale runtime reuse. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md][CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe] |
| V4 Access Control | yes [ASSUMED] | Validate `event.source`, `event.origin`, and a preview-session token on every host/iframe message. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage] |
| V5 Input Validation | yes [ASSUMED] | Validate message envelopes, lesson ids, compile results, and diagnostics payloads before rendering. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage] |
| V6 Cryptography | no [ASSUMED] | No cryptographic primitives should be introduced in this phase. [VERIFIED: .planning/PROJECT.md] |

### Known Threat Patterns for browser-run-loop stack
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Spoofed cross-window messages from a non-preview frame. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage] | Spoofing | Reject any message whose `source` is not the active preview iframe and whose session token does not match the current preview session. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage] |
| Learner code mutating host UI state directly. [VERIFIED: .planning/REQUIREMENTS.md] | Tampering | Execute learner code in a separate iframe browsing context and do not expose host store refs across the boundary. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe] |
| Stale timers/listeners surviving a restart. [VERIFIED: .planning/phases/03-browser-run-loop/03-CONTEXT.md] | Repudiation / DoS | Replace the entire iframe on restart rather than attempting in-place cleanup. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe] |
| Rendering diagnostics with unsafe HTML. [ASSUMED] | Elevation of Privilege | Render diagnostics as plain text, not `v-html`, and treat compiler/runtime output as untrusted display data. [ASSUMED] |

## Sources

### Primary (HIGH confidence)
- Repo inspection (`packages/admin-sdk-tutorial/src/App.vue`, `packages/admin-sdk-tutorial/src/workspace/useTutorialWorkspace.ts`, `packages/admin-sdk-tutorial/src/catalog/types.ts`, `packages/admin-sdk-tutorial/src/lessons/**`, `packages/admin-sdk/src/channel.ts`, `packages/admin-sdk/src/location/index.ts`, `packages/admin-sdk/src/index.ts`, `packages/admin-sdk-tutorial/package.json`, `packages/admin-sdk-tutorial/playwright.config.ts`, `packages/admin-sdk-tutorial/vitest.config.ts`, `packages/admin-sdk-tutorial/jest.config.cjs`) — existing tutorial/runtime shape, SDK message model, public export limits, and test infrastructure. [VERIFIED: repo grep]
- MDN `<iframe>` reference — sandbox behavior, browsing contexts, `srcdoc`, and same-origin warnings. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe]
- MDN `Window.postMessage()` reference — exact `targetOrigin` guidance and sender validation requirements. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage]
- MDN `<script type="importmap">` reference — import maps apply to document-loaded modules and are baseline since March 2023. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap]
- esbuild API docs — browser WebAssembly API with `initialize()`, browser build support, and rebuild model. [CITED: https://esbuild.github.io/api/]
- esbuild plugin docs — virtual module and plugin patterns for build-time graph control. [CITED: https://esbuild.github.io/plugins/]
- npm registry live queries — current versions and modification dates for `esbuild-wasm`, `es-module-shims`, `@babel/standalone`, `sucrase`, `vite`, `vitest`, `vue`, and `@playwright/test`. [VERIFIED: npm registry]

### Secondary (MEDIUM confidence)
- Babel `@babel/standalone` docs — valid browser-transpile use cases and limitations versus a build system. [CITED: https://babel.dev/docs/babel-standalone]
- TypeScript `isolatedModules` docs — explicit limitation note for single-file transpilers and `ts.transpileModule`. [CITED: https://www.typescriptlang.org/tsconfig/#isolatedModules]
- Local Admin SDK docs in `docs/admin-sdk/api-reference/notification.md`, `docs/admin-sdk/concepts/locations.md`, and `docs/admin-sdk/concepts/positions.md` — canonical learner-facing semantics for the seeded lessons. [VERIFIED: repo grep]

### Tertiary (LOW confidence)
- `es-module-shims` npm README snippet for optional fallback and current polyfill positioning. [CITED: https://www.npmjs.com/package/es-module-shims]

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - `esbuild-wasm` and iframe/postMessage are strongly verified, but the exact performance envelope for per-run bundling is still inferred from current lesson size rather than measured in this repo. [CITED: https://esbuild.github.io/api/][VERIFIED: repo grep][ASSUMED]
- Architecture: MEDIUM - the parent/iframe split is strongly justified by the real SDK’s `window.parent` model, but the final host-bridge surface area is still phase-specific design work. [VERIFIED: repo grep][ASSUMED]
- Pitfalls: HIGH - the isolation, same-window, deep-import, and single-file-transpile risks are directly supported by repo inspection and primary docs. [VERIFIED: repo grep][CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe][CITED: https://www.typescriptlang.org/tsconfig/#isolatedModules]

**Research date:** 2026-04-10  
**Valid until:** 2026-05-10 for repo-local constraints; re-check npm package versions and browser guidance after 30 days. [VERIFIED: npm registry][CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap]
