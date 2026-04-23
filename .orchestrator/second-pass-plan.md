# Admin SDK Tutorial Prototype — Second Pass Plan

## Goal

Run a focused second pass on the prototype to improve:

- visual quality
- teaching clarity
- interaction polish
- readiness for a richer editor/execution phase later

This pass should still stay within prototype scope. It should not become a full platform rebuild.

---

## Phase 1 — Refine the teaching experience

### Goal
Make each lesson easier to understand at a glance.

### Tasks
- reduce duplicated information between preview, output, and empty states
- make the primary lesson task more prominent
- improve wording for lesson descriptions and objectives
- make success/error states feel more intentional

### Output
- clearer lesson framing
- less noisy preview state
- stronger “what should I do now?” guidance

### Tiny executable tasks

#### 1.1 Inventory duplicated lesson information
- note repeated information across sidebar, preview, toast, and output
- identify what should remain primary vs secondary

#### 1.2 Make the current task more prominent
- highlight the active lesson objective more clearly
- ensure it is visible without scanning multiple panels

#### 1.3 Tighten notifications lesson description
- shorten or clarify the description text
- make the expected learner action explicit

#### 1.4 Tighten menu lesson description
- shorten or clarify the description text
- make the expected learner action explicit

#### 1.5 Tighten locations lesson description
- shorten or clarify the description text
- make the expected learner action explicit

#### 1.6 Improve lesson objective wording
- standardize objective phrasing across all lessons
- keep objectives action-oriented

#### 1.7 Improve output success message copy
- replace generic success text with more lesson-aware feedback

#### 1.8 Improve output error message copy
- make failure messaging feel more intentional and useful

#### 1.9 Reduce repeated preview copy
- remove or simplify duplicated text in empty state / toast / output where possible

#### 1.10 Verify all three lessons still read clearly
- manually review lesson copy coherence after edits

---

## Phase 2 — Improve the visual shell

### Goal
Make the tutorial feel more polished and cohesive.

### Tasks
- refine sidebar spacing, hierarchy, and progress treatment
- improve editor/preview balance and panel styling
- tighten typography and spacing across the shell
- improve badge, label, and card semantics
- make the dummy admin feel more deliberate and less placeholder-like

### Output
- more convincing split-layout tutorial UI
- better scanability
- stronger visual rhythm

### Tiny executable tasks

#### 2.1 Refine sidebar spacing
- adjust gaps, padding, and section spacing in the left column

#### 2.2 Improve sidebar hierarchy
- strengthen distinctions between title, description, progress, and task sections

#### 2.3 Improve progress treatment
- refine the step count / progress presentation

#### 2.4 Improve lesson card states
- make active/inactive lesson items feel clearer

#### 2.5 Refine workspace panel spacing
- balance internal padding and gaps across editor/preview/output panels

#### 2.6 Improve panel headers
- align label, title, actions, and metadata more cleanly

#### 2.7 Tighten editor/preview proportions
- slightly adjust layout balance if one side feels too heavy

#### 2.8 Refine typography scale
- improve consistency of heading/body/label sizes

#### 2.9 Improve semantic badge styling
- refine status chips, labels, and small badges

#### 2.10 Verify desktop shell coherence
- confirm the full split layout feels visually consistent

---

## Phase 3 — Upgrade the dummy admin model

### Goal
Make the preview better at teaching Admin SDK concepts.

### Tasks
- improve notification presentation so it feels closer to a teaching toast
- improve dynamic sidebar/menu item treatment
- improve extension slot cards and location labels
- clarify host-vs-extension mental model where useful

### Output
- notifications look more intentional
- menu additions are easier to read
- locations/positions are even more understandable

### Tiny executable tasks

#### 3.1 Refine notification container layout
- improve internal spacing and hierarchy of the toast-like UI

#### 3.2 Improve notification tone styling
- make info/success states more distinct but still minimal

#### 3.3 Improve dynamic menu item readability
- refine spacing between label and “new” marker

#### 3.4 Improve menu item semantics
- make dynamic items feel intentionally added, not just appended text

#### 3.5 Refine extension slot labels
- improve wording/formatting of slot labels and titles

#### 3.6 Improve injected content treatment
- make injected content visually distinct from the host slot container

#### 3.7 Clarify host surface mental model
- make it clearer which UI belongs to the host vs extension slot

#### 3.8 Verify each concept is visually obvious
- check notification/menu/location concepts one by one in the preview

---

## Phase 4 — Improve interaction polish

### Goal
Make run/reset/output flows feel cleaner and more trustworthy.

### Tasks
- decide whether Reset should also re-run automatically
- improve output messaging for success/error/reset states
- make run feedback feel immediate
- add small interaction affordances where useful

### Output
- fewer confusing states
- smoother teaching loop
- more coherent execution feedback

### Tiny executable tasks

#### 4.1 Decide Reset behavior
- choose whether Reset should only restore code or also auto-run

#### 4.2 Implement chosen Reset behavior
- update reset flow accordingly

#### 4.3 Improve run success feedback
- make success feedback more immediate and less generic

#### 4.4 Improve reset feedback
- make reset state understandable without reading too much text

#### 4.5 Improve error feedback presentation
- clarify placement and styling of execution errors

#### 4.6 Add subtle run-state affordance
- add a small UI signal that a run occurred if useful

#### 4.7 Review control labels
- ensure Run/Reset labels still feel correct after behavior changes

#### 4.8 Verify the execution loop feels coherent
- manually test edit → run → reset → run again

---

## Phase 5 — Browser review and iteration

### Goal
Validate the second pass visually in a real browser and tighten obvious issues.

### Tasks
- verify desktop layout
- verify narrow/mobile layout
- compare lesson flows side-by-side
- fix obvious spacing, overflow, and clarity issues

### Output
- a more demo-ready prototype
- fewer visual rough edges

### Tiny executable tasks

#### 5.1 Desktop browser check
- review the prototype on desktop viewport

#### 5.2 Mobile browser check
- review the prototype on narrow/mobile viewport

#### 5.3 Verify notifications flow visually
- run through the full notifications lesson in-browser

#### 5.4 Verify menu flow visually
- run through the full menu lesson in-browser

#### 5.5 Verify locations flow visually
- run through the full locations lesson in-browser

#### 5.6 Note layout issues
- capture spacing, overflow, and hierarchy issues found in browser

#### 5.7 Fix first browser issue
- resolve the highest-priority UI issue found

#### 5.8 Re-check in browser
- verify that the first fix worked

#### 5.9 Fix second browser issue if needed
- resolve one more obvious issue only if it materially improves the prototype

#### 5.10 Final browser pass
- confirm the prototype feels demo-ready enough for the second pass goal

---

## Phase 6 — Optional follow-up after the second pass

These should happen only after the visual/product pass feels strong enough.

### Candidate next steps
- replace textarea with a real code editor
- add lesson validation / “Solve” states
- move to a safer execution model
- add more Admin SDK concepts
- define documentation integration path

### Tiny executable planning tasks

#### 6.1 Decide whether editor upgrade is next
- assess if textarea is blocking further prototype learning value

#### 6.2 Define editor upgrade scope
- decide whether syntax highlighting alone is enough or if a fuller editor is needed

#### 6.3 Define lesson validation scope
- outline what “success” means for each current lesson

#### 6.4 Reassess execution safety needs
- decide whether current execution approach is still acceptable for prototype use

#### 6.5 Identify next Admin SDK concepts
- shortlist the next most valuable concepts after the first three lessons

#### 6.6 Decide docs integration direction
- outline whether this should remain a package app or connect into docs later

#### 6.7 Write recommendation for next implementation pass
- summarize the best next technical/product step after the second pass

---

## Recommended execution order

1. Phase 1 — Refine the teaching experience
2. Phase 2 — Improve the visual shell
3. Phase 3 — Upgrade the dummy admin model
4. Phase 4 — Improve interaction polish
5. Phase 5 — Browser review and iteration
6. Phase 6 — Optional follow-up

---

## Suggested second-pass execution batches

These tiny tasks can be grouped into small execution batches.

### Batch A — Lesson clarity
- 1.1 through 1.6

### Batch B — Feedback copy and repetition cleanup
- 1.7 through 1.10

### Batch C — Sidebar and shell polish
- 2.1 through 2.5

### Batch D — Typography, badges, and layout refinement
- 2.6 through 2.10

### Batch E — Notification and menu preview polish
- 3.1 through 3.4

### Batch F — Locations preview polish
- 3.5 through 3.8

### Batch G — Interaction polish
- 4.1 through 4.8

### Batch H — Browser review and iteration
- 5.1 through 5.10

### Batch I — Decide next implementation pass
- 6.1 through 6.7

---

## Scope guardrails

During this second pass:

- do not introduce a full authoring system
- do not introduce persistence or backend services
- do not overbuild the execution environment
- do not optimize for production parity yet

The main question for this pass is:

**Does the prototype now feel compelling enough that it is clearly worth evolving further?**
