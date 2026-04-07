# Storybook docs standard

Every public component should have a docs page that helps developers choose the right component, implement it without reading source code, and understand important behavior and accessibility constraints.

## Page template

Use this section order for component docs pages:

```mdx
<ComponentPageHeader
  title="Component name"
  tagName="mt-component-name"
  packageImports="MtComponentName"
  sourcePath="packages/component-library/src/components/group/mt-component-name"
>
  Short description
</ComponentPageHeader>

## When to use

## Examples

### Basic

Main example

### Additional example

## Anatomy

## API reference

## Do

## Don't

## Behavior notes

## Accessibility notes

## Comparisons
```

Notes:

- Start every docs page with the shared `ComponentPageHeader` block.
- The shared header owns the H1. It must render the title in the format `Component name (mt-component-name)`.
- Pass `sourcePath` as the repo-relative path to the component folder so the docs header can link to the GitHub source location.
- Put the short component description inside `ComponentPageHeader` as children so rich MDX content such as links, bold text, multiple paragraphs, and inline code still works.
- Use `Available` as the default status. Use `Experimental` or `Deprecated` when a stronger lifecycle signal is needed.
- `Examples` is required. Start with the main example directly under the `Examples` heading.
- Additional examples should follow as `H3` subsections under `Examples`, using labels that describe what the example shows.
- `Anatomy`, `Behavior notes`, and `Comparisons` are optional. Only include them when they add real value.
- Keep the order stable. If a section is not needed, omit it instead of moving sections around. When used together, place `Behavior notes` below `API reference` and above `Accessibility notes`.

## How to choose optional sections

- Use `Anatomy` when structure, composition, or internal parts need explanation.
- Use `Behavior notes` when behavior is non-obvious, stateful, or easy to misuse.
- Use `Comparisons` when users are likely to choose between this component and another public component.

Simpler components should stay close to the core template. More complex components can add the optional sections when needed, but the page should still stay concise.

## Storybook authoring rules

- Keep docs in Storybook by using `.mdx` pages colocated with the component stories.
- Use the component stories as the source of truth for live examples whenever possible.
- Use the shared `ComponentPageHeader` block for the page title, component lifecycle state, package import snippet, and short description instead of hand-writing those parts in each page.
- Every component should have one `Default` story that shows the component in its most common state.
- Additional stories should use human-readable user-facing names that describe what the story shows, with the first word capitalized and the remaining words lowercase, for example `Variants`, `Sizes`, `Inline edit`, or `Multiple selection`.
- This naming rule applies to the story name shown in Storybook. The export identifier in code may still use the project's normal code naming conventions.
- Include at least one `Canvas` example that matches the recommended usage.
- Prefer static, copy-friendly story code for docs examples and overview stories. Avoid generating example markup through loops when users are likely to copy the code from Storybook.
- The code shown in Storybook docs should be clean, focused, and easy to copy. Only show the relevant component markup and the minimum surrounding code a developer needs.
- Do not repeat the same example as an inline MDX code block when the rendered story already exposes the same copyable code in Storybook docs.
- In prose, use capitalized display names such as **Button**, **Badge**, or **Promo Badge**, wrapped in bold formatting rather than inline code. Avoid `mt-*` tag names in body copy unless the tag name itself is the thing being explained.
- Mention other public components as capitalized display names in bold formatting rather than inline code. Do not link to other component docs pages by default.

## API reference guidance

- Use Storybook API tables for props, slots, and events where possible.
- Place the Storybook API table directly under `API reference` unless another subsection is genuinely needed.
- Only add a separate exposed methods section when the component actually exposes public methods.

## Companion exports

Some components expose related parts that do not need their own standalone page. Document those exports on the parent page when they are primarily used together.

Use the parent page to explain:

- what each companion export does
- when it should be used
- how the pieces fit together
- any ordering or nesting requirements

Examples:

- `mt-action-menu` documents `mt-action-menu-item` and `mt-action-menu-group`
- `mt-modal` documents companion exports such as `mt-modal-root`, `mt-modal-trigger`, `mt-modal-action`, and `mt-modal-close`

If a companion export becomes complex enough that it has its own decision-making surface, it can graduate to its own page later.

## Comparison guidance

Comparisons should explain when to choose one component over another, not just list differences.

Important comparisons for this rollout include:

- tooltip vs help text
- floating ui vs action menu
- select vs radio group
- checkbox vs radio group vs select

## Accessibility guidance

Accessibility notes should explicitly call out:

- keyboard behavior
- screen reader behavior when relevant
- whether the component is appropriate for critical information
- any content limitations that affect usability or accessibility

Do not assume that accessibility behavior is obvious from the example alone.
