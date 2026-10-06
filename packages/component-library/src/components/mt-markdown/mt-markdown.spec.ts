import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Token } from "marked";
import type { SetupContext, VNodeChild } from "vue";
import MtMarkdown from "./mt-markdown.vue";
import MtMarkdownBlock from "./_internal/mt-markdown-block";
import answers from "./mt-markdown.fixtures.json";

type BlockSetup = (props: { token: Token }, context: SetupContext) => () => VNodeChild;

function renderMarkdown(content: string, props: Record<string, unknown> = {}) {
  return render(MtMarkdown, { props: { content, ...props } });
}

describe("mt-markdown", () => {
  it.each([
    ["# Title", "h1"],
    ["###### Small title", "h6"],
    ["A paragraph", "p"],
    ["> A quote", "blockquote"],
    ["- An item", "ul"],
    ["1. An item", "ol"],
    ["---", "hr"],
    ["**strong**", "strong"],
    ["*emphasis*", "em"],
    ["~~deleted~~", "del"],
    ["`code`", "code"],
  ])("renders %s as <%s>", (content, tag) => {
    const { container } = renderMarkdown(content);

    expect(container.querySelector(tag)).toBeInTheDocument();
  });

  it("keeps the start number of an ordered list", () => {
    const { container } = renderMarkdown("3. Third\n4. Fourth");

    expect(container.querySelector("ol")).toHaveAttribute("start", "3");
  });

  it("renders a line break for two trailing spaces", () => {
    const { container } = renderMarkdown("First  \nSecond");

    expect(container.querySelector("p br")).toBeInTheDocument();
  });

  it("decodes named character references, but not in code", () => {
    const { container } = renderMarkdown("Tom &amp; Jerry &copy; `&amp;`");

    expect(container.querySelector("p")).toHaveTextContent("Tom & Jerry © &amp;");
  });

  describe("task lists", () => {
    it.each([
      ["tight", "- [ ] Open\n- [x] Done"],
      ["loose", "- [ ] Open\n\n- [x] Done"],
    ])("renders one disabled checkbox per item of a %s list", (_, content) => {
      const { container } = renderMarkdown(content);
      const checkboxes = container.querySelectorAll<HTMLInputElement>("input[type=checkbox]");

      expect(checkboxes).toHaveLength(2);
      expect([...checkboxes].map((checkbox) => checkbox.checked)).toEqual([false, true]);
      expect(checkboxes[0]).toBeDisabled();
    });
  });

  describe("tables", () => {
    const table = "| Product | Stock |\n| :-- | --: |\n| Lamp | 12 |";

    it("renders the header and rows in a scrolling wrapper", () => {
      const { container } = renderMarkdown(table);

      expect(container.querySelector(".mt-markdown__table > table")).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: "Product" })).toHaveAttribute("scope", "col");
      expect(screen.getByRole("cell", { name: "Lamp" })).toBeInTheDocument();
    });

    it("aligns the columns", () => {
      renderMarkdown(table);

      expect(screen.getByRole("columnheader", { name: "Product" })).toHaveStyle({
        textAlign: "left",
      });
      expect(screen.getByRole("cell", { name: "12" })).toHaveStyle({ textAlign: "right" });
    });

    it("turns <br> in a cell into a line break", () => {
      renderMarkdown("| Notes |\n| --- |\n| One<br>Two |");

      expect(screen.getByRole("cell").querySelector("br")).toBeInTheDocument();
    });
  });

  describe("code blocks", () => {
    it("renders the code with its language", () => {
      const { container } = renderMarkdown("```ts title=example.ts\nconst a = 1;\n```");

      expect(container.querySelector("pre > code")).toHaveClass("language-ts");
      expect(container.querySelector("pre > code")).toHaveTextContent("const a = 1;");
    });

    it("copies the code", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      // `useClipboard()` only writes through the Clipboard API with permission.
      const permission = {
        state: "granted",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
      Object.defineProperty(navigator, "permissions", {
        value: { query: vi.fn().mockResolvedValue(permission) },
        configurable: true,
      });

      renderMarkdown("```\nnpm install\n```");
      // Lets the permission query resolve.
      await new Promise((resolve) => setTimeout(resolve));
      await userEvent.click(screen.getByRole("button", { name: "Copy code" }));

      expect(writeText).toHaveBeenCalledWith("npm install");
      expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();

      Reflect.deleteProperty(navigator, "clipboard");
      Reflect.deleteProperty(navigator, "permissions");
    });
  });

  describe("links", () => {
    it.each(["https://example.com", "mailto:shop@example.com", "tel:+49123", "/orders", "#top"])(
      "links to %s",
      (href) => {
        renderMarkdown(`[Target](${href})`);

        expect(screen.getByRole("link", { name: "Target" })).toHaveAttribute("href", href);
      },
    );

    it("opens external links in a new tab without passing the opener", () => {
      renderMarkdown("[Docs](https://example.com) and [Orders](/orders)");

      expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("target", "_blank");
      expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
        "rel",
        "noopener noreferrer",
      );
      expect(screen.getByRole("link", { name: "Orders" })).not.toHaveAttribute("target");
    });

    it("links bare addresses", () => {
      renderMarkdown("See https://example.com");

      expect(screen.getByRole("link", { name: "https://example.com" })).toBeInTheDocument();
    });

    it.each([
      "javascript:alert(1)",
      "JAVASCRIPT:alert(1)",
      "<java\tscript:alert(1)>",
      "<java script:alert(1)>",
      "vbscript:msgbox(1)",
      "data:text/html,<script>alert(1)</script>",
    ])("shows a link to %s as text only", (href) => {
      const { container } = renderMarkdown(`[Click me](${href})`);

      expect(container.querySelector("a")).toBeNull();
      expect(container).toHaveTextContent("Click me");
    });
  });

  describe("raw HTML", () => {
    it.each([
      "<script>alert(1)</script>",
      '<img src="x" onerror="alert(1)">',
      '<div onclick="alert(1)">Click</div>',
    ])("shows %s as text", (html) => {
      const { container } = renderMarkdown(`Before\n\n${html}`);

      expect(container.querySelector("script, img, div[onclick]")).toBeNull();
      expect(container).toHaveTextContent(html);
    });

    it("shows inline HTML as text", () => {
      const { container } = renderMarkdown("A <b>bold</b> word");

      expect(container.querySelector("b")).toBeNull();
      expect(container.querySelector("p")).toHaveTextContent("A <b>bold</b> word");
    });
  });

  describe("images", () => {
    it("doesn't load images by default, but links to them", () => {
      const { container } = renderMarkdown("![A lamp](https://cdn.example.com/lamp.png)");

      expect(container.querySelector("img")).toBeNull();
      expect(screen.getByRole("link", { name: "A lamp" })).toHaveAttribute(
        "href",
        "https://cdn.example.com/lamp.png",
      );
    });

    it("loads images from an allowed prefix", () => {
      renderMarkdown("![A lamp](https://cdn.example.com/lamp.png)", {
        allowedImagePrefixes: ["https://cdn.example.com"],
      });

      expect(screen.getByRole("img", { name: "A lamp" })).toHaveAttribute(
        "src",
        "https://cdn.example.com/lamp.png",
      );
    });

    it.each([
      "https://cdn.example.com.evil.com/lamp.png",
      "http://cdn.example.com/lamp.png",
      "/lamp.png",
      "data:image/png;base64,AAAA",
    ])("blocks %s, even with an allowed prefix", (src) => {
      const { container } = renderMarkdown(`![A lamp](${src})`, {
        allowedImagePrefixes: ["https://cdn.example.com"],
      });

      expect(container.querySelector("img")).toBeNull();
    });
  });

  describe("streaming", () => {
    it("completes unfinished emphasis at the end", () => {
      const { container } = renderMarkdown("Stock is **lo", { streaming: true });

      expect(container.querySelector("strong")).toHaveTextContent("lo");
    });

    it("shows an unfinished link as text", () => {
      const { container } = renderMarkdown("See [the docs](https://exa", { streaming: true });

      expect(container.querySelector("a")).toBeNull();
      expect(container).toHaveTextContent("See the docs");
    });

    it("leaves out an unfinished image", () => {
      const { container } = renderMarkdown("A lamp: ![lamp](https://cdn", { streaming: true });

      expect(container.querySelector("img, a")).toBeNull();
      expect(container).toHaveTextContent("A lamp:");
    });

    it("shows an unclosed code block without a copy button until the answer is complete", async () => {
      const { container, rerender } = renderMarkdown("```ts\nconst a", { streaming: true });

      expect(container.querySelector("pre > code")).toHaveTextContent("const a");
      expect(screen.queryByRole("button", { name: "Copy code" })).toBeNull();

      await rerender({ content: "```ts\nconst a = 1;\n```", streaming: false });

      expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
    });

    it("doesn't render finished blocks again when the answer grows", async () => {
      // Records the Markdown of every block that renders.
      const rendered: string[] = [];
      const block = MtMarkdownBlock as unknown as { setup: BlockSetup };
      const { setup } = block;
      vi.spyOn(block, "setup").mockImplementation((props, context) => {
        const render = setup(props, context);
        return () => {
          rendered.push(props.token.raw);
          return render();
        };
      });

      const { rerender, container } = renderMarkdown("# Stock\n\nFirst paragraph.\n\nSecond", {
        streaming: true,
      });
      expect(rendered).toEqual(["# Stock", "First paragraph.", "Second"]);

      rendered.length = 0;
      await rerender({ content: "# Stock\n\nFirst paragraph.\n\nSecond paragraph" });

      expect(rendered).toEqual(["Second paragraph"]);
      expect(container).toHaveTextContent("Second paragraph");
    });

    it("renders earlier blocks again when a link definition arrives", async () => {
      const { rerender } = renderMarkdown("See [the docs][1].", { streaming: true });

      expect(screen.queryByRole("link")).toBeNull();

      await rerender({ content: "See [the docs][1].\n\n[1]: https://example.com" });

      expect(screen.getByRole("link", { name: "the docs" })).toHaveAttribute(
        "href",
        "https://example.com",
      );
    });
  });

  describe("never shows unrendered or half-rendered Markdown while streaming", () => {
    it.each([
      ["a table header", "Intro:\n\n| # | Pro", "Intro"],
      ["a partial delimiter row", "Intro:\n\n| # | Product | Price |\n|--", "Intro"],
      ["a header without rows", "Intro:\n\n| # | Product | Price |\n|---|---|---|", "Intro"],
      ["a first row in progress", "Intro:\n\n| # | Product |\n|---|---|\n| 1 | La", "Intro"],
      ["bold without content", "Text **", "Text"],
      ["emphasis without content", "Text *", "Text"],
      ["inline code without content", "Text `", "Text"],
      ["strikethrough without content", "Text ~", "Text"],
      ["a heading without text", "Intro\n\n## ", "Intro"],
      ["a list item without text", "- One\n- ", "One"],
      ["a task marker without text", "- [x] One\n- [x", "One"],
      ["a list number", "Intro\n\n1", "Intro"],
      ["a dash under a paragraph", "Intro\n-", "Intro"],
      ["a partial rule", "Intro\n\n--", "Intro"],
      ["a partial fence", "Intro\n\n``", "Intro"],
      ["a partial closing fence", "```sh\nnpm install\n``", "npm install"],
      ["an opening angle bracket", "Intro\n\n<", "Intro"],
      ["a backslash", "Intro \\", "Intro"],
      ["a partial character reference", "Tom &am", "Tom"],
    ])("holds back %s", (_, content, text) => {
      const { container } = renderMarkdown(content, { streaming: true });

      expect(container.firstElementChild).toHaveTextContent(text, { normalizeWhitespace: true });
      expect(container.firstElementChild?.textContent?.trim()).toBe(text);
      expect(container.querySelector("h1, h2, h3, h4, h5, h6, table")).toBeNull();
    });

    it("shows a table with its header and first row, then row by row", async () => {
      const header = "| # | Product |\n|---|---|\n";
      const { container, rerender } = renderMarkdown(`${header}| 1 | Lamp |\n`, {
        streaming: true,
      });

      expect(container.querySelectorAll("tbody tr")).toHaveLength(1);

      await rerender({ content: `${header}| 1 | Lamp |\n| 2 | Va`, streaming: true });
      expect(container.querySelectorAll("tbody tr")).toHaveLength(1);

      await rerender({ content: `${header}| 1 | Lamp |\n| 2 | Vase |\n`, streaming: true });
      expect(container.querySelectorAll("tbody tr")).toHaveLength(2);
    });

    it("shows everything once the answer is complete", () => {
      const { container } = renderMarkdown("Text **");

      expect(container.firstElementChild).toHaveTextContent("Text **");
    });

    /** The text a reader sees, without whitespace. */
    function visibleText(root: Element) {
      return (root.firstElementChild?.textContent ?? "").replace(/\s+/g, "");
    }

    /** The top-level blocks, such as `H2.` or `DIV.mt-markdown__table`. */
    function blocks(root: Element) {
      return [...(root.firstElementChild?.children ?? [])].map(
        (block) => `${block.tagName}.${block.className}`,
      );
    }

    const kitchenSink = `# Stock report

Two products are **low on stock**, and one is *sold out*. The numbers come from the \`stock\` field and were ~~estimated~~ counted this morning.

## Products to reorder

| # | Product | Number | Stock |
| :-- | :-- | :-- | --: |
| 1 | Desk lamp, brass | SW-1000 | 2 |
| 2 | Linen cushion | SW-1012 | 0 |

### Next steps

1. Reorder the cushion from the supplier.
2. Check the open orders:
   - Orders that include the cushion
   - Orders that are paid but not shipped
3. Update the stock.

- [x] Count the warehouse
- [ ] Send the purchase order

> Products below a stock of 5 show as "Only a few left" in the storefront.

#### Update the stock

\`\`\`sh
curl -X PATCH https://shop.example.com/api/product/SW-1012 | jq '.stock'
# prints the new stock
\`\`\`

---

##### Sources

###### Last checked today

See the [stock documentation](https://docs.example.com/stock) or https://example.com. Tom &amp; Jerry \\*not emphasis\\*.`;

    // Every prefix of the answer, as a model streams it character by character: what is visible is
    // always the start of the finished answer, and finished blocks are already their final element.
    it.each([
      ["a kitchen-sink answer", kitchenSink],
      ...answers.map((answer, index) => [`recorded model answer ${index + 1}`, answer]),
    ])("keeps every streaming state of %s final", async (_, content) => {
      const finished = renderMarkdown(content).container;
      const { container, rerender } = renderMarkdown("", { streaming: true });

      for (let length = 1; length <= content.length; length += 1) {
        const streamed = content.slice(0, length);
        await rerender({ content: streamed, streaming: true });

        // The streamed text is part of each comparison, so a failure names the state.
        const shown = blocks(container).slice(0, -1);
        expect({
          streamed,
          final: visibleText(finished).startsWith(visibleText(container)),
        }).toEqual({
          streamed,
          final: true,
        });
        expect({ streamed, blocks: shown }).toEqual({
          streamed,
          blocks: blocks(finished).slice(0, shown.length),
        });
      }
    });
  });
});
