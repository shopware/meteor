# Feature Landscape

**Domain:** interactive in-browser tutorial package for the Meteor Admin SDK
**Researched:** 2026-04-10

## Table Stakes

Features users will expect from a credible SDK tutorial. Missing any of these weakens the teaching value of the prototype.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Split-pane lesson workspace | The brief explicitly targets the Solid-style "read, edit, preview" loop. | Med | Keep the layout simple: lesson content, code editor, fake admin preview. |
| Lesson progression with previous/next navigation | TutorialKit-style onboarding only works when content is broken into ordered lessons. | Low | v1 should support a linear sequence, not branching curricula. |
| Starter code per lesson | The current Admin SDK docs teach from copy-paste examples, so the tutorial must preload working code. | Low | Prefer one editable entry file per lesson in v1. |
| In-browser execution of learner code | Immediate feedback is the core value of the product and an explicit project constraint. | High | Execution must stay deterministic and browser-local. |
| Fake admin shell with visible extension surfaces | SDK concepts only make sense when actions land somewhere concrete. | Med | Use a teaching shell, not a Shopware clone. |
| Solution reveal and reset state | Learners need a recovery path without refreshing or reloading the site. | Low | "Reveal solution" and "Reset lesson" are separate actions. |
| Runtime error and validation feedback | Browser execution without clear failures becomes frustrating fast. | Med | Errors should point to the current lesson and keep the shell usable. |
| Notification demo flow | Notifications are the documented quick-start and the lowest-friction first win. | Low | This should be lesson 1 or 2, not optional. |
| Location and position visualization | `locationId` and `positionId` are the most abstract concepts in the current docs and need concrete representation. | Med | A minimal labeled visualization is table stakes for this domain, not a nice-to-have. |

## V1 Prototype Essentials

Build these first. They are enough to prove the interaction model and the fake-admin teaching approach.

| Feature | Why It Belongs In v1 | Notes |
|---------|----------------------|-------|
| Linear lesson list with completion state | Enough structure for guided onboarding without building a full course platform. | Completion can be local in memory or local storage. |
| Single editable lesson file | Matches the current docs and examples, keeps browser execution simple, and reduces authoring overhead. | Avoid multi-file editing in v1. |
| Reset to lesson seed | Essential when learner code breaks the runtime. | Reset must restore both code and fake-admin state. |
| Reveal full solution | Necessary for self-serve learning and parity with the referenced tutorial style. | Prefer replacing the editor content after a confirmation step. |
| Minimal fake admin shell | Core proof that SDK concepts can be taught without real Shopware Administration. | Include only the views needed by the first lessons. |
| Notification center and growl overlay | Validates `notification.dispatch()` quickly and visibly. | Support title, message, variant, appearance, growl, and action buttons at least at demo level. |
| Labeled extension surfaces | Makes `locationId` and `positionId` teachable instead of invisible strings. | Example: cards for `sw-product-properties__before` and `__after`, plus a tab bar surface. |
| Hidden-runtime vs rendered-location explanation | The docs depend on `MAIN_HIDDEN` and location matching semantics, so learners must see that mental model. | A small shell panel or diagram is sufficient in v1. |
| Lesson-specific success checks | Progression should not rely only on human judgment. | Keep checks lightweight: inspect emitted SDK calls or resulting shell state. |
| Inline call log | Fastest way to explain what learner code did before it rendered anything. | Log `notification`, `ui.componentSection`, `ui.tabs`, and similar calls. |

## Deferred Features

Useful, but not needed to validate the prototype. Building these first would slow the project without proving the core value.

| Feature | Why Defer | What To Do Instead In v1 |
|---------|-----------|--------------------------|
| Multi-file editing | Adds major runtime and authoring complexity with little added teaching value for the first SDK concepts. | Keep lessons to one editable entry file plus fixed scaffold files. |
| Embedded terminal or package manager simulation | This is valuable for framework tutorials, but not necessary for SDK concept teaching in a browser-only fake shell. | Show compile/runtime errors and shell events only. |
| Shareable URLs for learner progress | Nice for collaboration, not required for validating the experience. | Persist only locally if needed. |
| Branching lesson paths | Premature for a prototype. The repo needs proof of one strong learning flow first. | Use one canonical sequence. |
| Rich hint ladders | Good for pedagogy, but solution reveal is enough for v1. | Ship one optional lesson hint at most. |
| App vs plugin mode switching | Interesting later because the SDK supports both, but the first tutorial should teach shared semantics. | Use one runtime model and explain cross-environment compatibility in copy. |
| Full position explorer or devtools recreation | Rebuilding the Shopware devtools plugin would distract from the tutorial goal. | Use a static or lightly interactive visualization of the few supported surfaces. |
| Real docs search inside the tutorial | High effort, low leverage during the prototype. | Link out to exact docs pages from each lesson. |
| Advanced API coverage like datasets and context subscriptions | Valuable later, but these concepts are not the best first proof of the tutorial UX. | Start with notifications, tabs, menu items, component sections, locations, and positions. |
| Mobile-optimized authoring mode | Nice to have, but coding tutorials are desktop-first. | Make the layout usable on narrow screens without optimizing for full lesson completion on mobile. |

## Differentiators

Features that would make this package feel purpose-built for the Admin SDK rather than a generic code playground.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Visual map of locations and positions | Turns the hardest SDK concepts into visible targets and explains why `positionId` and `locationId` differ. | Med | This is the strongest domain-specific differentiator. |
| Event timeline of SDK calls | Lets learners see "dispatch notification", "add tab", and "add component section" before or alongside rendering. | Med | Particularly helpful when code runs in a hidden base runtime. |
| Concept overlays for hidden/runtime contexts | Makes `MAIN_HIDDEN`, iframe-like locations, and render surfaces understandable without deep Shopware knowledge. | Med | Prefer overlays or badges, not long text walls. |
| Lesson-author assertions tied to shell state | Gives maintainers a practical way to encode "done" without building a full testing framework. | Med | Reuse this for automated tutorial regression tests later. |
| Direct mapping from lesson to existing docs and examples | Keeps the tutorial complementary to `docs/admin-sdk` instead of replacing it. | Low | Each lesson should link to the exact docs page and example pattern it teaches. |

## Anti-Features

Explicitly avoid these in the first package.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Full Shopware Administration simulation | Too much product surface, too much maintenance, and it dilutes the teaching goal. | Build a minimal pedagogical shell with only the supported extension points. |
| Generic sandbox platform ambitions | The package is for Meteor Admin SDK learning, not for arbitrary browser coding. | Optimize around a narrow lesson runtime and Admin SDK semantics. |
| "Teach every API at launch" scope | The docs already span far more than a prototype should cover. | Start with the most visible APIs and concepts. |
| Multiple competing navigation models | A prototype needs one clear progression path. | Use a linear course with a compact lesson index. |
| Hidden conceptual state | Invisible runtime context is exactly what makes SDK concepts hard for newcomers. | Surface locations, positions, and emitted SDK events in the UI. |

## Feature Dependencies

```text
Lesson progression -> starter code -> browser execution -> fake admin shell
Fake admin shell -> labeled extension surfaces -> location/position visualization
Browser execution -> runtime error display -> reset state
Browser execution -> SDK call interception -> success checks
Solution reveal -> reset state
Notification lesson -> notification center and growl overlay
Tabs/menu/component-section lessons -> fake admin shell surfaces
```

## MVP Recommendation

Prioritize:
1. Notification lesson with split-pane UI, editable code, run/reveal/reset, and visible notification output.
2. Location and component-section lesson with labeled fake-admin surfaces and a small hidden-runtime explanation.
3. Tab or menu lesson that proves progression beyond a single API and shows how `positionId` selects a render target.

Defer:
- Multi-file authoring: one editable entry file is enough for the first proof.
- Full devtools-like position explorer: a constrained visualization teaches better for the first release.
- Advanced SDK concepts like datasets and subscriptions: valuable after the core interaction model is stable.

## Sources

- `/Users/jannisleifeld/Sites/meteor/.planning/PROJECT.md`
- `/Users/jannisleifeld/Sites/meteor/docs/admin-sdk/index.md`
- `/Users/jannisleifeld/Sites/meteor/docs/admin-sdk/concepts/locations.md`
- `/Users/jannisleifeld/Sites/meteor/docs/admin-sdk/concepts/positions.md`
- `/Users/jannisleifeld/Sites/meteor/docs/admin-sdk/tooling/vue-devtools.md`
- `/Users/jannisleifeld/Sites/meteor/docs/admin-sdk/api-reference/notification.md`
- `/Users/jannisleifeld/Sites/meteor/examples/admin-sdk-plugin/src/Resources/app/administration/src/base/mainCommands.ts`
- `/Users/jannisleifeld/Sites/meteor/examples/admin-sdk-plugin/src/Resources/app/administration/src/viewRenderer.ts`
- `https://tutorialkit.dev/guides/about/`
