# Admin SDK Tutorial Prototype — Recommended Next Pass

## Recommendation

The best next implementation pass is:

## 1. Upgrade the editor experience

### Why

The current prototype already proves:

- the split tutorial layout works
- the lesson loop works
- the dummy admin teaching model works
- in-browser execution is understandable enough for a prototype

The weakest remaining part of the experience is now the editor.

The textarea is sufficient for proving the concept, but it is now the main thing making the tutorial feel less product-ready.

### Recommended scope

- replace the textarea with a real editor component
- add syntax highlighting for TypeScript/JavaScript
- preserve the simple single-file model
- do **not** add multi-file editing yet
- do **not** add heavy IDE/platform behavior yet

### Good outcome for this pass

- the tutorial feels more trustworthy and enjoyable to edit in
- learner code is easier to scan
- the overall prototype feels much closer to a real interactive tutorial

---

## 2. Add lightweight lesson validation after the editor upgrade

### Why

Once the editor feels credible, the next biggest product improvement is helping the learner know when they succeeded.

### Recommended scope

- add simple per-lesson validation
- define success checks for the three existing lessons
- show a lightweight solved/unsolved state
- optionally add a “Check” or “Solve” affordance if needed

### Example validation targets

- **Notifications:** title/message/tone changed and preview updated
- **Menu items:** dynamic item exists with expected label/position
- **Locations:** content rendered into the expected slot

---

## 3. Reassess execution safety after validation is in place

### Why

The current execution approach is acceptable for a prototype, but if the tutorial becomes more widely used internally or externally, the execution model should become more constrained.

### Recommended scope

- keep the current execution model for now if iteration speed is still the priority
- plan a safer constrained execution layer once editor + validation are stable

---

## Concepts to add after that

After editor + validation, the next Admin SDK concepts to consider are:

- action buttons
- context / payload access
- modals or overlays
- basic communication/event flows

---

## Packaging / integration direction

For now, keeping this work in:

`packages/admin-sdk-tutorial`

is still reasonable while the interaction model evolves.

Once the concept is validated, the next product decision should be whether this remains a standalone package app or becomes part of the Admin SDK documentation experience.

---

## Final recommendation in one sentence

**Next, replace the textarea with a real code editor, then add lightweight per-lesson validation before investing in a safer execution model or broader lesson coverage.**
