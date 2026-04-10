# Phase 2: Tutorial Workspace UX - Research

**Researched:** 2026-04-10
**Domain:** Split-pane lesson workspace, in-browser single-file editing, reversible solution compare, and same-device draft persistence for `packages/admin-sdk-tutorial`
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Desktop defaults to a two-pane layout with guidance on the left.
- **D-02:** The working area keeps the editor primary with preview below it in the same pane.
- **D-03:** The guidance pane includes lesson title, summary, prose, docs links, and main workspace actions.
- **D-04:** Narrow screens keep the same features through a stacked or tabbed layout.
- **D-05:** Lesson navigation stays persistently available while the user works.
- **D-06:** Navigation exposes the full `parts -> chapters -> lessons` hierarchy with the current lesson expanded.
- **D-07:** Refresh reopens the last active lesson on the same device.
- **D-08:** Switching lessons while the draft differs from starter must warn before leaving.
- **D-09:** Showing the solution opens a secondary read-only solution panel instead of replacing learner code.
- **D-10:** Compare mode is simple side-by-side learner code versus solution on desktop in Phase 2.
- **D-11:** Hiding the solution restores the learner draft exactly.
- **D-12:** Solution reveal is reversible and needs no confirmation.
- **D-13:** Same-device persistence stores both the last active lesson and per-lesson drafts.
- **D-14:** Restore starter resets only the current lesson draft.
- **D-15:** Restore starter is destructive and always needs confirmation.
- **D-16:** Solution visibility does not persist across refresh.

### the agent's Discretion
- Exact breakpoint values, pane sizing, and tab treatment on narrow screens.
- Exact persistence abstraction and autosave timing implementation.
- Exact copy for dirty-state warnings and restore confirmation.
- Exact preview placeholder implementation before Phase 3 adds runnable output.

### Deferred Ideas (OUT OF SCOPE)
- Explicit run controls, compile/runtime diagnostics, and preview restart flows.
- Fake-admin event rendering or host-runtime behavior.
- Multi-file editing, support-file editing, or generic IDE affordances.
</user_constraints>

<project_constraints>
## Project Constraints (from AGENTS.md)

- Stay inside the GSD planning/execution flow instead of ad hoc repo edits. [VERIFIED: AGENTS.md]
- Run package lint with autofix after implementation, but only fix errors introduced by the change set. [VERIFIED: AGENTS.md]
- Run Jest after implementation finishes. [VERIFIED: AGENTS.md]
- New behavior needs integration coverage, not unit-only coverage. [VERIFIED: AGENTS.md]
- Comments should explain only non-obvious constraints or intent. [VERIFIED: AGENTS.md]
- GitHub-related work should use the GitHub MCP tools. [VERIFIED: AGENTS.md]
- The tutorial must stay repo-owned inside the workspace and remain aligned with real Admin SDK semantics. [VERIFIED: .planning/PROJECT.md]
</project_constraints>

<research_summary>
## Summary

Phase 2 should evolve `packages/admin-sdk-tutorial/src/App.vue` from the Phase 1 catalog page into a stateful lesson workspace backed by package-local Vue composables. The strongest fit for the current package is a single-source workspace state model that derives the active lesson entry from `loadLessonCatalog()`, persists drafts and the last-opened lesson by lesson id, and drives the shell, compare mode, confirmation dialogs, and responsive layout from that same state. [VERIFIED: packages/admin-sdk-tutorial/src/App.vue, packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts, .planning/phases/02-tutorial-workspace-ux/02-CONTEXT.md]

The implementation should keep the prototype narrow: one editable file, read-only support-file metadata, a non-runnable preview placeholder, and simple modal or inline confirmation flows. CodeMirror 6 is already a repo-proven choice through the component library, but the tutorial package should add only the minimal editor dependencies it needs locally instead of importing the whole component library just to get buttons or cards. [VERIFIED: packages/component-library/package.json, .planning/PROJECT.md]

**Primary recommendation:** Plan Phase 2 as four sequential slices: workspace state and persistence, responsive shell plus editor, reversible solution and recovery flows, and browser integration coverage that proves refresh recovery and guarded destructive flows.
</research_summary>

<standard_stack>
## Standard Stack

The repo-aligned tools for this phase are:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `vue` | `^3.5.0` | Drive the tutorial workspace shell and stateful interactions | The tutorial package already uses Vue 3. [VERIFIED: packages/admin-sdk-tutorial/package.json] |
| `vite` | `^5.1.4` | Keep the package-local browser app and test server flow unchanged | Already used by the tutorial package. [VERIFIED: packages/admin-sdk-tutorial/package.json, packages/admin-sdk-tutorial/playwright.config.ts] |
| `typescript` | `^5.3.3` | Model workspace state, persistence payloads, and lesson-derived view models | Already used by the tutorial package. [VERIFIED: packages/admin-sdk-tutorial/package.json] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `codemirror` | `^6.0.1` | Browser-based editor for the single learner file | Use for the editable draft and read-only solution surface. [VERIFIED: packages/component-library/package.json] |
| `vue-codemirror6` | `^1.3.8` | Vue wrapper for the CodeMirror surface | Use if the package wants to stay in Vue-first composition instead of hand-rolling editor mounting. [VERIFIED: packages/component-library/package.json] |
| `vitest` | `^3.0.5` | Unit/integration coverage for workspace state and draft persistence | Already configured in the tutorial package. [VERIFIED: packages/admin-sdk-tutorial/vitest.config.ts] |
| `@playwright/test` | `^1.45.0` | Browser-level proof for layout, compare mode, restore, and refresh recovery | Already configured in the tutorial package. [VERIFIED: packages/admin-sdk-tutorial/playwright.config.ts] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Local package editor deps | Importing large parts of `@shopware-ag/meteor-component-library` | The component library already carries editor and UI dependencies, but bringing the package in for Phase 2 shell controls adds unnecessary coupling and style surface area. [VERIFIED: packages/component-library/package.json] |
| `localStorage` wrapper | `localforage` | `localforage` is an established repo pattern for persisted browser state, but Phase 2 only stores lesson ids and source strings. A thin storage adapter over `localStorage` is simpler unless cross-tab sync or structured persistence becomes necessary in later phases. [VERIFIED: packages/admin-sdk/src/data/composables/useSharedState.ts] |
| Full markdown renderer dependency | Trusted narrow prose rendering utility | Current lesson markdown is simple headings and paragraphs. A narrow trusted renderer keeps Phase 2 scoped and avoids bringing in a content-processing stack too early. [VERIFIED: packages/admin-sdk-tutorial/src/lessons/**/lesson.md] |
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
packages/admin-sdk-tutorial/
├── src/
│   ├── App.vue
│   ├── catalog/
│   └── workspace/
│       ├── storage.ts
│       ├── useTutorialWorkspace.ts
│       ├── lessonProse.ts
│       └── useResponsiveWorkspace.ts
└── tests/
    └── e2e/
```

### Pattern 1: Catalog-Derived Workspace State
**What:** Load the catalog once, flatten lessons into a stable lookup keyed by lesson id, and derive the active lesson, current draft, dirty state, and support-file metadata from that single state source.
**When to use:** Always. App-level state should be catalog-driven, not duplicated in unrelated components.
**Example:**
```ts
const lessonsById = new Map(flatLessons.map((entry) => [entry.lesson.id, entry]));
const activeLessonId = ref(restoredLessonId ?? flatLessons[0]?.lesson.id ?? null);
const draftByLessonId = ref<Record<string, string>>(restoredDrafts);
```
Source pattern: current app already loads the entire catalog synchronously during startup. [VERIFIED: packages/admin-sdk-tutorial/src/App.vue]

### Pattern 2: Single-File Editor Contract
**What:** Treat `primaryEditableFile` as the only writable surface in Phase 2 and keep support files visible but read-only.
**When to use:** For all editor and recovery behaviors in this phase.
**Example:**
```ts
const starterCode = computed(() => activeLesson.value?.starterCode ?? "");
const currentDraft = computed({
  get: () => draftByLessonId.value[activeLessonId.value] ?? starterCode.value,
  set: (value) => {
    draftByLessonId.value[activeLessonId.value] = value;
  }
});
```
Source motivation: Phase 1 locked the single editable file model. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md, packages/admin-sdk-tutorial/src/catalog/types.ts]

### Pattern 3: Responsive Mode Switch, Not Separate Screens
**What:** Desktop uses a two-pane shell, while narrow screens swap to `Lessons / Guide / Workspace` tabs over the same underlying state.
**When to use:** Layout only. Lesson selection, dirty state, and compare mode stay shared.
**Example:**
```ts
const activeMobileSection = ref<"lessons" | "guide" | "workspace">("guide");
const isDesktop = useMediaQuery("(min-width: 1024px)");
```
Source: UI contract requires feature parity across breakpoints. [VERIFIED: .planning/phases/02-tutorial-workspace-ux/02-UI-SPEC.md]

### Pattern 4: Reversible Compare and Recovery Flows
**What:** Solution reveal toggles a read-only compare surface; restore starter and dirty lesson switches go through confirmation state before mutating current view state.
**When to use:** Any action that can surprise the learner or discard visible working context.
**Example:**
```ts
const pendingLessonId = ref<string | null>(null);
const isRestoreConfirmOpen = ref(false);
const isDirty = computed(() => currentDraft.value !== starterCode.value);
```
Source: user decisions lock reversible solution reveal and guarded destructive restore. [VERIFIED: .planning/phases/02-tutorial-workspace-ux/02-CONTEXT.md]

### Anti-Patterns to Avoid
- **Reusing the Phase 1 catalog list as the final workspace layout:** The workspace needs active lesson state, editor surface, and compare interactions, not just static rendering.
- **Persisting solution visibility:** This violates `D-16` and makes refresh recovery confusing.
- **Making support files editable in Phase 2:** That would broaden scope into multi-file IDE behavior too early.
- **Pulling Phase 3 run-loop behavior into the preview area:** The preview remains a placeholder in this phase.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code editor | Raw `contenteditable` or textarea-based faux editor | CodeMirror 6 with a Vue wrapper or thin mount helper | Phase 2 needs a reliable in-browser code editing surface, and the repo already validates CodeMirror as a standard tool. [VERIFIED: packages/component-library/package.json] |
| Persistence | Ad hoc scattered `localStorage.setItem` calls in `App.vue` | A small package-local storage adapter/composable | Centralized persistence keeps restore, dirty detection, and refresh recovery testable. [VERIFIED: packages/admin-sdk-tutorial/src/App.vue, packages/admin-sdk/src/data/composables/useSharedState.ts] |
| Solution compare | Diff library or merge view with extra semantics | Side-by-side editable/read-only code surfaces | The UI spec only requires a simple compare view, not a git-style diff experience. [VERIFIED: .planning/phases/02-tutorial-workspace-ux/02-CONTEXT.md, .planning/phases/02-tutorial-workspace-ux/02-UI-SPEC.md] |
| Preview area | Fake execution or iframe bootstrapping | Static Phase 2 placeholder card | Run-loop and isolation belong to Phase 3. [VERIFIED: .planning/ROADMAP.md] |
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Draft Identity Drift
**What goes wrong:** Refresh restores the wrong draft or loses the active lesson.
**Why it happens:** Persistence keys use list indexes or chapter order instead of stable lesson ids.
**How to avoid:** Key both active lesson and per-lesson drafts by `lesson.id`.
**Warning signs:** Reordering lessons changes which draft reopens after refresh.

### Pitfall 2: Hidden Destructive Transitions
**What goes wrong:** Switching lessons or restoring starter silently discards visible work.
**Why it happens:** Autosave is mistaken for permission to skip confirmation flows.
**How to avoid:** Separate “local draft is saved” from “current visible draft can be replaced without warning.”
**Warning signs:** Lesson switching mutates the editor before the user explicitly confirms.

### Pitfall 3: Phase 3 Leakage
**What goes wrong:** The plan starts introducing run, compile, error, or sandbox controls.
**Why it happens:** The editor and preview surfaces make Phase 3 feel nearby.
**How to avoid:** Keep the preview area as a placeholder with neutral helper copy and no executable behavior.
**Warning signs:** Plans mention iframe reloads, transpilation, bundling, or runtime diagnostics.

### Pitfall 4: Overfitting to Current Lesson Content
**What goes wrong:** Guidance rendering only works for the two seeded lessons and breaks once authors add lists or extra headings.
**Why it happens:** The prose renderer strips structure too aggressively.
**How to avoid:** Support headings, paragraphs, bullet lists, inline code, and trusted links at minimum, or document the intentionally narrow contract.
**Warning signs:** `lesson.md` content is rendered as one large unstructured text block.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from this repo:

### Current Tutorial Bootstrap
```ts
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```
Source: `packages/admin-sdk-tutorial/src/main.ts` [VERIFIED]

### Current Catalog Loader
```ts
export function loadLessonCatalog() {
  return loadLessonCatalogFromModules(defaultLessonCatalogModules);
}
```
Source: `packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts` [VERIFIED]

### Established Persisted Browser State Pattern
```ts
const persistentSharedValueStore = localforage.createInstance({
  name: 'adminExtensionSDK',
  storeName: 'persistentSharedValueStore',
});
```
Source: `packages/admin-sdk/src/data/composables/useSharedState.ts` [VERIFIED]
</code_examples>

<assumptions_log>
## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Phase 2 can keep markdown rendering intentionally narrow because lesson content is authored in-repo and currently uses simple structure | Architecture Patterns | Medium — additional markdown syntax may require widening the renderer during execution |

**If this table is empty:** All claims in this research were verified or cited.
</assumptions_log>

<environment_availability>
## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Workspace tooling | ✓ | `22.13.0` | — |
| `pnpm` | Workspace tooling | ✓ | `10.12.3` | — |
| Vitest | Package unit/integration verification | ✓ | `^3.0.5` in package manifest | — |
| Playwright package | Browser verification | ✓ | `^1.45.0` in package manifest | Browser binaries may still need install during execution |

**Missing dependencies with no fallback:**
- None confirmed at planning time.
</environment_availability>

<validation_architecture>
## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `vitest` 3.x for workspace state and component integration + `@playwright/test` 1.45.x for browser-visible flows |
| Config file | `packages/admin-sdk-tutorial/vitest.config.ts` and `packages/admin-sdk-tutorial/playwright.config.ts` |
| Quick run command | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` |
| Full suite command | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run && pnpm --dir packages/admin-sdk-tutorial test:e2e` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| `LESS-02` | Guidance, editor, and preview placeholder appear in one workspace shell | e2e + component integration | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` and `pnpm --dir packages/admin-sdk-tutorial exec playwright test tests/e2e/tutorial-workspace.spec.ts` | ❌ Wave 0 expansion |
| `RUN-01` | Learner can edit the current lesson code in the browser | integration + e2e | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` and Playwright editor assertions | ❌ Wave 0 expansion |
| `LESS-03` | Solution reveal is reversible and read-only | integration + e2e | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` and Playwright compare assertions | ❌ Wave 0 expansion |
| `LESS-04` | Restore starter requires confirmation and resets only the current draft | integration + e2e | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` and Playwright restore flow assertions | ❌ Wave 0 expansion |
| `LESS-05` | Refresh restores the last active lesson and saved draft on the same device | integration + e2e | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` and Playwright refresh assertions | ❌ Wave 0 expansion |

### Sampling Rate
- **Per task commit:** `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run`
- **Per wave merge:** `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run && pnpm --dir packages/admin-sdk-tutorial exec playwright test tests/e2e/tutorial-workspace.spec.ts`
- **Phase gate:** `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run && pnpm --dir packages/admin-sdk-tutorial test:e2e`
- **Repo-required final hygiene after phase execution:** `pnpm --dir packages/admin-sdk-tutorial lint:eslint:fix`, `pnpm --dir packages/admin-sdk-tutorial lint:eslint`, `pnpm --dir packages/admin-sdk-tutorial lint:types`, `pnpm --dir packages/admin-sdk test:unit`
</validation_architecture>
