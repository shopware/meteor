# Requirements: Meteor Admin SDK Interactive Tutorial

**Defined:** 2026-04-10
**Core Value:** Let developers understand and try the Meteor Admin SDK in the browser without needing a real Shopware Administration environment.

## v1 Requirements

### Lesson Flow

- [x] **LESS-01**: User can open an ordered list of tutorial lessons inside the browser.
- [ ] **LESS-02**: User can read lesson guidance side by side with code and preview output.
- [ ] **LESS-03**: User can reveal the expected solution for the current lesson without leaving the tutorial.
- [ ] **LESS-04**: User can restore the starter state for the current lesson from the tutorial UI.
- [ ] **LESS-05**: User can continue from the last opened lesson after a browser refresh on the same device.

### Editing and Execution

- [ ] **RUN-01**: User can edit the current lesson code directly in the browser.
- [ ] **RUN-02**: User can explicitly run the current lesson and see the preview update in the browser.
- [ ] **RUN-03**: User can see compile or runtime errors without breaking the tutorial shell.
- [ ] **RUN-04**: User can restart the preview session to get a clean runtime state for the current lesson.
- [ ] **RUN-05**: User code runs locally in the browser without depending on StackBlitz, TutorialKit runtime, or a remote execution service.

### Fake Admin Shell

- [ ] **SHELL-01**: User sees a minimal fake admin shell instead of a real Shopware Administration instance.
- [ ] **SHELL-02**: User code interacts with the real Meteor Admin SDK package and tutorial-provided host handlers.
- [ ] **SHELL-03**: User can trigger and observe a visible notification flow from lesson code.
- [ ] **SHELL-04**: User can inspect a simple log or timeline of Admin SDK interactions triggered by their code.
- [ ] **SHELL-05**: Learner code runs in an isolated preview session so tutorial state does not leak into the host UI.

### Location and Position Learning

- [ ] **LOCT-01**: User can see at least two labeled tutorial surfaces that represent different Admin SDK locations.
- [ ] **LOCT-02**: User can understand the difference between hidden runtime context and rendered extension surfaces through the tutorial UI.
- [ ] **LOCT-03**: User can change location or position-related values in lesson code and observe placement changes in the preview.
- [ ] **LOCT-04**: User can complete at least one lesson that demonstrates UI extension behavior beyond notifications, such as menu or component-section style placement.

### Learning Feedback

- [ ] **LEARN-01**: User sees lesson-specific success feedback based on lightweight checks against fake-shell state.
- [ ] **LEARN-02**: User can jump from a lesson to the relevant Admin SDK docs or example source for deeper learning.
- [x] **LEARN-03**: Tutorial authors can define starter code, solution code, lesson text, and scenario metadata for each lesson in a structured format inside the repo.

### Quality and Validation

- [ ] **QUAL-01**: Tutorial catalog loader missing-asset failures are covered by automated tests through an injectable loader seam that leaves seeded lesson fixtures unchanged and preserves the default runtime catalog path.

## v2 Requirements

### Authoring and Lesson Depth

- **AUTHR-01**: Tutorial supports multi-file editing within a lesson.
- **AUTHR-02**: Tutorial supports reusable lesson templates and shared authoring presets.
- **AUTHR-03**: Tutorial supports branching or non-linear learning paths.

### Runtime Expansion

- **RUNTM-01**: Tutorial can switch between app-style and plugin-style runtime modes.
- **RUNTM-02**: Tutorial supports more advanced Admin SDK capabilities such as datasets, subscriptions, or shared state flows.
- **RUNTM-03**: Tutorial provides richer runtime inspection tooling beyond a simple event log.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full Shopware Administration clone | Not necessary for teaching the core Admin SDK concepts in the prototype |
| StackBlitz or TutorialKit dependency | Explicit project constraint to keep runtime owned in-repo |
| Terminal, package installation, or generic browser IDE behavior | Would expand scope away from the tutorial's teaching purpose |
| Full Admin SDK API coverage in the first iteration | Prototype should validate the model with a narrow but high-value lesson set |
| Real backend, authentication, or live Shopware connectivity | The prototype should stay deterministic and browser-local |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LESS-01 | Phase 1 | Complete |
| LESS-02 | Phase 2 | Pending |
| LESS-03 | Phase 2 | Pending |
| LESS-04 | Phase 2 | Pending |
| LESS-05 | Phase 2 | Pending |
| RUN-01 | Phase 2 | Pending |
| RUN-02 | Phase 3 | Pending |
| RUN-03 | Phase 3 | Pending |
| RUN-04 | Phase 3 | Pending |
| RUN-05 | Phase 3 | Pending |
| SHELL-01 | Phase 4 | Pending |
| SHELL-02 | Phase 4 | Pending |
| SHELL-03 | Phase 4 | Pending |
| SHELL-04 | Phase 4 | Pending |
| SHELL-05 | Phase 3 | Pending |
| LOCT-01 | Phase 5 | Pending |
| LOCT-02 | Phase 5 | Pending |
| LOCT-03 | Phase 5 | Pending |
| LOCT-04 | Phase 5 | Pending |
| LEARN-01 | Phase 5 | Pending |
| LEARN-02 | Phase 5 | Pending |
| LEARN-03 | Phase 1 | Complete |
| QUAL-01 | Phase 1.1 | Pending |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0

---
*Requirements defined: 2026-04-10*
*Last updated: 2026-04-10 after roadmap creation*
