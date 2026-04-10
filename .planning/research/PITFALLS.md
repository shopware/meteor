# Domain Pitfalls

**Domain:** Interactive in-browser tutorial package for the Meteor Admin SDK
**Researched:** 2026-04-10

## Critical Pitfalls

Mistakes here are likely to produce a misleading tutorial, force a runtime rewrite, or create unsafe browser execution.

### Pitfall 1: Fake admin semantics drift away from the real SDK contract
**What goes wrong:** The tutorial shell teaches a simplified version of the Admin SDK that no longer matches real `location`, `ui`, `notification`, or callback behavior.
**Why it happens:** A fake admin is easier to build by hand than by following `packages/admin-sdk/src/message-types.ts`, `packages/admin-sdk/src/channel.ts`, serializer behavior, and the existing example flows. That shortcut is the main product risk.
**Consequences:** Learners copy code that only works in the tutorial, docs and examples stop matching the product, and SDK changes silently break lessons.
**Prevention:** Keep the learner-facing API as the real `@shopware-ag/meteor-admin-sdk`; build the fake admin as a host implementation of the existing message contract; support only a small subset of handlers, but make that subset behaviorally correct; add golden integration tests that run the same snippets against the tutorial host and existing browser tests or example fixtures.
**Detection:** Tutorial snippets need tutorial-only caveats, handlers start accepting payloads not present in `ShopwareMessageTypes`, or example code from `examples/admin-sdk-app` / `examples/admin-sdk-plugin` behaves differently in the tutorial.
**Future phase:** Phase 2: Fake admin contract and compatibility validation

### Pitfall 2: Browser execution is not actually isolated
**What goes wrong:** User code can reach or corrupt host state, send permissive messages, or execute with broader privileges than intended.
**Why it happens:** In-browser execution pushes teams toward convenience choices such as same-origin iframes, permissive `postMessage`, dynamic evaluation, and long-lived shared globals. MDN explicitly warns to verify `origin` and `source` for `postMessage`, and warns against permissive evaluation in CSP. The repo already has a related concern in `packages/admin-sdk/src/channel.ts`, where callback matching is more permissive than ideal.
**Consequences:** The tutorial becomes hard to trust, security review expands sharply, and debugging turns into “what escaped the sandbox?” instead of “what did the learner write?”.
**Prevention:** Run user code in a disposable child runtime; keep the host bridge capability-based; validate message sender identity on both sides; avoid `targetOrigin="*"` except where the browser requires it; prefer rebuilding the child runtime on every run over trying to scrub a shared environment; keep CSP strict and document any unavoidable relaxation.
**Detection:** Learner code can inspect `window.parent`, modify shell DOM outside the preview boundary, survive reset, or receive responses from an unexpected source.
**Future phase:** Phase 1: Browser runtime containment

### Pitfall 3: The runtime grows into a mini online IDE instead of a tutorial runner
**What goes wrong:** The package starts chasing general-purpose bundling, module resolution, asset handling, npm-style imports, and hot-reload behavior.
**Why it happens:** “User code should run in the browser” can be misread as “support arbitrary app code.” Without StackBlitz or TutorialKit, every extra execution feature is owned by this repo.
**Consequences:** Delivery stalls in tooling work, lesson quality slips, and the package becomes expensive to maintain relative to its teaching value.
**Prevention:** Constrain the authoring model for the first milestone: a small module format, a curated import surface, pre-bundled support libraries, deterministic reset, and no arbitrary package installation. Make unsupported capabilities explicit instead of half-supporting them.
**Detection:** New lessons require runtime exceptions, hidden transforms, or bespoke loader behavior; execution bugs outnumber content bugs.
**Future phase:** Phase 1: Browser runtime MVP

### Pitfall 4: Lesson authoring overhead dominates package development
**What goes wrong:** Each lesson requires too many moving pieces: prose, starter code, solution code, shell fixtures, reset state, validation logic, and fake-admin handler setup.
**Why it happens:** TutorialKit-like lesson progression is appealing, but the surrounding content system does not exist yet in this repo.
**Consequences:** The prototype ships with one or two polished lessons and then stalls, or authors duplicate setup until the lesson set becomes unmaintainable.
**Prevention:** Define a lesson manifest early with frontmatter-like metadata, starter and solution slots, shell preset selection, and optional assertions; create shared fixtures for common SDK concepts; keep lesson rendering declarative so adding content does not require package code changes.
**Detection:** Adding a lesson requires editing runtime source files, copying large setup blocks, or manually synchronizing multiple files with no schema validation.
**Future phase:** Phase 3: Lesson authoring pipeline

### Pitfall 5: The fake admin becomes too realistic to teach clearly
**What goes wrong:** The shell accumulates enough fake navigation, layout, and state that users must learn the simulator before they can learn the SDK.
**Why it happens:** “Be faithful” drifts into “recreate Shopware Administration.” The docs already show how many locations, positions, and extension points exist; trying to model them broadly is a trap.
**Consequences:** Scope balloons, the UI becomes noisy, and core concepts like `locationId`, `positionId`, and action handlers stop being visually obvious.
**Prevention:** Make the shell intentionally didactic: few surfaces, explicit labels, visible placeholders, and obvious fake boundaries. Prefer “this card represents a location” over pixel accuracy. Keep unsupported admin behaviors absent, not stubbed.
**Detection:** The shell gains generic navigation chrome, hidden state, or inert controls that are present only for realism; lesson text spends more time explaining the shell than the SDK call.
**Future phase:** Phase 2: Pedagogical fake-admin UX

### Pitfall 6: Compatibility validation never catches up with the tutorial
**What goes wrong:** The tutorial appears correct locally but drifts from the real admin, examples, or docs as the SDK evolves.
**Why it happens:** The codebase already documents docs drift risk and notes that the real Shopware acceptance suite is not active in main CI. A tutorial host adds another place for semantic drift to hide.
**Consequences:** Regressions show up late, trust in the tutorial drops, and the package becomes a stale side path instead of an onboarding asset.
**Prevention:** Pick a small set of canonical scenarios, such as notifications, menu items, and location rendering, and validate them across tutorial tests, SDK unit or e2e tests, and example-based flows. Treat tutorial updates as part of any public SDK behavior change.
**Detection:** SDK docs or examples change without a corresponding tutorial failure; tutorial snapshots keep passing while real example behavior changes.
**Future phase:** Phase 4: Cross-validation with real examples

## Moderate Pitfalls

### Pitfall 1: Reset and cleanup are incomplete between lesson runs
**What goes wrong:** Intervals, `ResizeObserver`s, message listeners, object URLs, and pending callbacks survive across runs and pollute the next execution.
**Why it happens:** The SDK already includes runtime behaviors such as auto-resizing and message listeners; a tutorial runner adds another lifecycle layer on top.
**Prevention:** Treat every run as a fresh runtime, revoke blob URLs, destroy the child frame or worker, and assert zero leaked listeners or timers after reset.
**Detection:** Performance degrades during a session, notifications or actions fire twice, or previous lesson state appears after rerun.
**Future phase:** Phase 1: Runtime lifecycle and reset

### Pitfall 2: Security hardening and pedagogy fight each other
**What goes wrong:** Either the runtime is so locked down that lessons feel arbitrary, or it is so permissive that unsafe patterns leak into examples.
**Why it happens:** A tutorial wants immediate feedback, but isolation wants narrow capabilities and explicit host APIs.
**Prevention:** Expose a small host API on purpose, document what is simulated, and keep dangerous primitives out of lesson code paths. Where behavior is fake, label it as fake instead of silently emulating privilege.
**Detection:** Lesson content starts relying on globals that are unavailable in the real SDK context, or hardening changes require widespread lesson rewrites.
**Future phase:** Phase 4: Security and teaching contract review

### Pitfall 3: Validation focuses on static content instead of user flows
**What goes wrong:** The package has schema tests and renderer tests, but not enough browser tests for edit, run, reset, and inspect flows.
**Why it happens:** Content systems are easier to unit test than embedded execution and preview behavior.
**Prevention:** Add Playwright-level tests for the full tutorial loop, including failed execution, reset, navigation between lessons, and visible fake-admin output.
**Detection:** Most regressions are discovered manually in the browser even though unit coverage looks healthy.
**Future phase:** Phase 4: End-to-end tutorial verification

## Minor Pitfalls

### Pitfall 1: The interaction model copies references too literally
**What goes wrong:** The package imitates the Solid tutorial or TutorialKit UX too closely and inherits interaction affordances that do not fit Admin SDK teaching.
**Prevention:** Borrow the split-pane and lesson progression patterns, but optimize for SDK concepts first: visible host state, location markers, and handler output.
**Detection:** UI work centers on parity with the reference products instead of making Meteor-specific concepts easier to understand.
**Future phase:** Phase 2: Interaction design tuning

### Pitfall 2: Fake-admin visuals imply support that does not exist
**What goes wrong:** The shell visually suggests real search bars, smart bars, or module navigation even when they are decorative.
**Prevention:** Use intentional placeholder styling and labels for simulated surfaces, and avoid shipping inert controls unless the lesson explicitly explains them.
**Detection:** User testing produces “why doesn’t this control do anything?” feedback.
**Future phase:** Phase 2: Shell clarity pass

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Phase 1: Browser runtime MVP | Building a generic sandbox instead of a narrow lesson runner | Freeze the supported code format and rebuild the child runtime on every run |
| Phase 1: Runtime containment | Weak iframe or message isolation | Validate `origin` and `source`, use disposable runtimes, and keep CSP strict |
| Phase 2: Fake admin contract | Reimplementing SDK semantics ad hoc | Drive host handlers from real message types and test against canonical scenarios |
| Phase 2: Shell UX | Overbuilding a Shopware clone | Limit surfaces to the lesson concepts and label fake boundaries clearly |
| Phase 3: Lesson authoring | Each lesson needs custom code changes in the package | Introduce a declarative lesson manifest and reusable shell presets |
| Phase 4: Hardening and validation | Tutorial and real examples drift silently | Add cross-validation against example snippets, docs, and browser tests |

## Sources

- `.planning/PROJECT.md` and `.planning/codebase/CONCERNS.md` for project constraints, existing drift risks, and Admin SDK security concerns
- `.planning/codebase/TESTING.md` for the repo’s current unit, e2e, and acceptance test patterns
- `packages/admin-sdk/AGENTS.md`, `packages/admin-sdk/src/channel.ts`, `packages/admin-sdk/src/message-types.ts`, and `packages/admin-sdk/src/_internals/serializer/index.ts` for the compatibility-sensitive SDK contract
- `docs/admin-sdk/concepts/locations.md`, `docs/admin-sdk/concepts/positions.md`, `docs/admin-sdk/api-reference/notification.md`, and `docs/admin-sdk/api-reference/ui/menu.md` for the currently taught Admin SDK semantics
- `examples/admin-sdk-plugin/tests/acceptance/tests/location.spec.ts` and `examples/admin-sdk-plugin/tests/acceptance/tests/notification.spec.ts` for real example behaviors worth mirroring
- MDN `Window.postMessage()` (opened 2026-04-10): https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
- MDN `Content-Security-Policy` reference (opened 2026-04-10): https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy
- MDN `Using Web Workers` (opened 2026-04-10): https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
- MDN `URL.createObjectURL()` (opened 2026-04-10): https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static
- MDN `<iframe>` reference (opened 2026-04-10): https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/iframe
