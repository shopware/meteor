import { createSSRApp, h } from "vue";
import { renderToString, type SSRContext } from "vue/server-renderer";
import { createI18n } from "vue-i18n";
import MtMarkdown from "./mt-markdown.vue";

const content = `## Stock

Two products are **low** on stock:

| Product | Stock |
| --- | --: |
| Lamp | 2 |

- [x] Checked
- [ ] Reorder

\`\`\`sh
npm install
\`\`\`

![A lamp](https://cdn.example.com/lamp.png) and [the docs](https://example.com).`;

function createApp() {
  return createSSRApp({
    render: () => h(MtMarkdown, { content, allowedImagePrefixes: ["https://cdn.example.com/"] }),
  }).use(createI18n({ legacy: false, locale: "en" }));
}

describe("mt-markdown server-side rendering", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("renders the Markdown on the server", async () => {
    const html = await renderToString(createApp());

    expect(html).toContain("<h2>Stock</h2>");
    expect(html).toContain("<th");
    expect(html).toContain('src="https://cdn.example.com/lamp.png"');
    expect(html).toContain("npm install");
  });

  it("hydrates without a mismatch", async () => {
    // The copy button's tooltip is teleported to the body, so the page puts it there, as a server
    // would.
    const context: SSRContext = {};
    const container = document.createElement("div");
    container.innerHTML = await renderToString(createApp(), context);
    document.body.innerHTML = context.teleports?.body ?? "";
    document.body.appendChild(container);

    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    createApp().mount(container);
    // Lets the asynchronous parsing finish, so hydration completes.
    await new Promise((resolve) => setTimeout(resolve));

    const messages = [...warn.mock.calls, ...error.mock.calls].map((call) => String(call[0]));
    expect(messages.filter((message) => /hydration/i.test(message))).toEqual([]);
    expect(container.querySelector("table")).toBeInTheDocument();
  });
});
