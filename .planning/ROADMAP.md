# Roadmap: Meteor Admin SDK Interactive Tutorial

## Overview

This roadmap keeps v1 narrow: prove a repo-owned, browser-local tutorial package inside the Meteor monorepo that teaches real Admin SDK semantics through a split-pane lesson flow, a constrained run loop, and a fake admin shell that makes notifications and location concepts visible without turning into a generic IDE or a Shopware clone.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Lesson Catalog & Authoring Model** - Define the ordered lesson system and repo-owned tutorial content format.
- [x] **Phase 1.1: Expose a test seam in packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts so the missing-asset branch can be automated** - Urgent inserted work to make missing-asset coverage automatable.
- [ ] **Phase 2: Tutorial Workspace UX** - Deliver the split-pane learning workspace with lesson persistence and recovery controls.
- [ ] **Phase 3: Browser Run Loop** - Let users edit, run, diagnose, and restart lessons entirely in the browser.
- [ ] **Phase 4: Fake Admin Notification Slice** - Connect the real SDK client to a minimal fake admin shell and visible event log.
- [ ] **Phase 5: Location Lessons & Learning Feedback** - Teach location and position concepts with visible surfaces, checks, and deeper-learning links.

## Phase Details

### Phase 1: Lesson Catalog & Authoring Model
**Goal**: Tutorial content is packaged as an ordered, repo-owned lesson system that stays easy to extend without broadening the prototype scope.
**Depends on**: Nothing (first phase)
**Requirements**: LESS-01, LEARN-03
**Success Criteria** (what must be TRUE):
  1. User can open the tutorial in the browser and see an ordered list of lessons.
  2. Tutorial authors can define lesson text, starter code, solution code, and scenario metadata in a structured format inside the repo.
  3. The lesson model stays constrained to the narrow prototype workflow instead of exposing generic IDE or multi-file authoring behavior.
**Plans**: 4 plans
Plans:
- [x] `01-01-PLAN.md` — Create the content-first tutorial package scaffold, authoring contract, and Wave 0 validation files.
- [x] `01-02-PLAN.md` — Seed representative lesson bundles and add manifest-integrity coverage.
- [x] `01-03-PLAN.md` — Implement static lesson discovery, safe bundle resolution, and normalized catalog ordering with unit coverage.
- [x] `01-04-PLAN.md` — Render the ordered lesson list in the browser and prove it with Playwright.
**UI hint**: yes

### Phase 01.1: Expose a test seam in packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts so the missing-asset branch can be automated (INSERTED)

**Goal:** Create a narrow loader seam that keeps the runtime catalog behavior unchanged while making the missing-asset error branch automatable in tests without mutating seeded lesson fixtures.
**Requirements**: QUAL-01
**Depends on:** Phase 1
**Plans:** 1/1 plans complete

Plans:
- [x] `01.1-01-PLAN.md` — Add a defaulted module-map seam to `loadLessonCatalog.ts` and cover the missing-asset branch with automated tests.

### Phase 2: Tutorial Workspace UX
**Goal**: Users can work through a lesson in a practical split view, recover from mistakes, and continue where they left off on the same device.
**Depends on**: Phase 1
**Requirements**: LESS-02, LESS-03, LESS-04, LESS-05, RUN-01
**Success Criteria** (what must be TRUE):
  1. User can read lesson guidance side by side with the lesson editor and preview area.
  2. User can edit the current lesson code directly in the browser.
  3. User can reveal the expected solution for the current lesson without leaving the tutorial.
  4. User can restore the starter state for the current lesson from the tutorial UI.
  5. User can refresh the browser and continue from the last opened lesson on the same device.
**Plans**: 4 plans
Plans:
- [x] `02-01-PLAN.md` — Build lesson-id keyed workspace state, persistence, and dirty-draft coverage.
- [x] `02-02-PLAN.md` — Replace the Phase 1 catalog screen with the responsive workspace shell and browser editor.
- [x] `02-03-PLAN.md` — Add reversible solution compare mode plus guarded restore and dirty-switch flows.
- [x] `02-04-PLAN.md` — Prove the workspace flows with integration and Playwright coverage for desktop and narrow screens.
**UI hint**: yes

### Phase 3: Browser Run Loop
**Goal**: Users can explicitly run lesson code in an isolated browser-local preview and recover cleanly from failures or stale runtime state.
**Depends on**: Phase 2
**Requirements**: RUN-02, RUN-03, RUN-04, RUN-05, SHELL-05
**Success Criteria** (what must be TRUE):
  1. User can explicitly run the current lesson and see the preview update in the browser.
  2. User can see compile or runtime errors without breaking the tutorial shell.
  3. User can restart the preview session to get a clean runtime state for the current lesson.
  4. User code runs locally in the browser without depending on StackBlitz, TutorialKit runtime, or a remote execution service.
  5. Learner code runs in an isolated preview session so tutorial state does not leak into the host UI.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Fake Admin Notification Slice
**Goal**: The tutorial proves the real SDK-to-host interaction model with a minimal fake admin shell that makes notification behavior observable.
**Depends on**: Phase 3
**Requirements**: SHELL-01, SHELL-02, SHELL-03, SHELL-04
**Success Criteria** (what must be TRUE):
  1. User sees a minimal fake admin shell instead of a real Shopware Administration instance.
  2. User code interacts with the real Meteor Admin SDK package and tutorial-provided host handlers.
  3. User can trigger and observe a visible notification flow from lesson code.
  4. User can inspect a simple log or timeline of Admin SDK interactions triggered by their code.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Location Lessons & Learning Feedback
**Goal**: Users can understand location and position mechanics through visible placeholder surfaces, lesson-specific checks, and links back to the canonical docs and examples.
**Depends on**: Phase 4
**Requirements**: LOCT-01, LOCT-02, LOCT-03, LOCT-04, LEARN-01, LEARN-02
**Success Criteria** (what must be TRUE):
  1. User can see at least two labeled tutorial surfaces that represent different Admin SDK locations.
  2. User can understand the difference between hidden runtime context and rendered extension surfaces through the tutorial UI.
  3. User can change location or position-related values in lesson code and observe placement changes in the preview.
  4. User can complete at least one lesson that demonstrates UI extension behavior beyond notifications, such as menu or component-section style placement.
  5. User sees lesson-specific success feedback and can jump to the relevant Admin SDK docs or example source for deeper learning.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 1.1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Lesson Catalog & Authoring Model | 4/4 | Complete | 2026-04-10 |
| 1.1 Expose a test seam in packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts so the missing-asset branch can be automated | 1/1 | Complete | 2026-04-10 |
| 2. Tutorial Workspace UX | 4/4 | Ready for verification | - |
| 3. Browser Run Loop | 0/TBD | Not started | - |
| 4. Fake Admin Notification Slice | 0/TBD | Not started | - |
| 5. Location Lessons & Learning Feedback | 0/TBD | Not started | - |
