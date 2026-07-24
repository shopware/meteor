import { fileURLToPath } from "node:url";
import { describe, it, expect, beforeAll } from "vitest";
import { kebabCase } from "scule";
import { setup, $fetch } from "@nuxt/test-utils/e2e";
// Relative import on purpose: this spec runs in plain vitest, where the Nuxt
// "#shared" alias does not exist. formatType is dependency-free, so importing
// it directly is safe and gives us the same type formatting the transform uses.
import { formatType } from "../shared/utils/formatType";

/**
 * Verifies the raw-markdown export (`/raw/components/*.md`) renders the real
 * component API. The expectations are *derived from the component's live
 * metadata*, not hardcoded prop names — so renaming/removing a prop updates the
 * expectation automatically, while the transform dropping or mis-rendering a
 * prop the component actually exposes fails the test.
 */

interface Member {
  name: string;
  type?: string;
  default?: string;
  description?: string;
  required?: boolean;
}

interface ComponentMeta {
  meta: {
    props: Member[];
    events: Member[];
    slots: Member[];
    exposed: Member[];
  };
}

// Independent re-implementation of the transform's GFM cell escaping (the
// oracle). Kept separate from server/utils/transformMeteorMdc.ts so an escaping
// regression there is caught here rather than mirrored.
const cell = (value?: string): string =>
  (value ?? "").replace(/\n/g, " ").replace(/\|/g, "\\|").trim();
const code = (value?: string): string =>
  cell(value) ? `\`${cell(value)}\`` : "";

/** Props column layout: `| Prop | Type | Default | Description |`, name kebab-cased, ` *` if required. */
const propRow = (p: Member): string =>
  `| ${code(kebabCase(p.name)) + (p.required ? " *" : "")} | ${code(formatType(p.type))} | ${code(p.default)} | ${cell(p.description)} |`;

/** Slots/events/exposed layout: 3 columns, name rendered verbatim (not kebab-cased). */
const memberRow = (m: Member): string =>
  `| ${code(m.name)} | ${code(formatType(m.type))} | ${cell(m.description)} |`;

describe("raw markdown export — button", async () => {
  // Dev mode (no production bundle): the /raw route, component-meta and
  // component-example endpoints all run identically under `nuxt dev`, and it
  // sidesteps a Rollup sourcemap conflict + heavy-bundle OOM in the docus layer
  // that the production build hits inside the vitest worker.
  await setup({
    rootDir: fileURLToPath(new URL("..", import.meta.url)),
    server: true,
    dev: true,
  });

  let md: string;
  let meta: ComponentMeta;

  beforeAll(async () => {
    md = await $fetch("/raw/components/button.md");
    meta = await $fetch<ComponentMeta>("/api/component-meta/MtButton.json");
  });

  it("renders a correct row for every prop the component actually exposes", () => {
    // Guard: an empty metadata source would make the prop loop vacuously pass.
    expect(meta.meta.props.length).toBeGreaterThan(0);
    expect(md).toContain("### Props");
    for (const prop of meta.meta.props) {
      expect(
        md,
        `prop "${prop.name}" missing or mis-rendered in raw markdown`,
      ).toContain(propRow(prop));
    }
  });

  it("renders a correct row for every slot the component actually exposes", () => {
    if (meta.meta.slots.length === 0) return;
    expect(md).toContain("### Slots");
    for (const slot of meta.meta.slots) {
      expect(
        md,
        `slot "${slot.name}" missing or mis-rendered in raw markdown`,
      ).toContain(memberRow(slot));
    }
  });

  it("embeds the canonical example source verbatim as a vue code block", async () => {
    const example = await $fetch<{ code: string }>(
      "/api/component-example/button-basic-example.json",
    );
    expect(md).toContain(["```vue", example.code.trim(), "```"].join("\n"));
  });

  it("injects the page title/description and resolves all MDC tags away", () => {
    expect(md).toContain("# Button");
    expect(md).toContain(
      "> The standard action trigger for Meteor interfaces.",
    );
    expect(md).not.toContain("::component-example");
    expect(md).not.toContain(":component-api");
  });
});
