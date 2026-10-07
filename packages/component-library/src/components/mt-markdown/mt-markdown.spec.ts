import { render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtMarkdown from "./mt-markdown.vue";

/** Renders the Markdown and waits for Comark's asynchronous parsing. */
async function renderMarkdown(content: string, props: Record<string, unknown> = {}) {
  const result = render({
    components: { MtMarkdown },
    setup: () => ({ content, props }),
    // Testing Library doesn't render a root that suspends, so the component gets a wrapper.
    template: `<div><mt-markdown :content="content" v-bind="props" /></div>`,
  });
  await waitFor(() => expect(result.container.querySelector(".mt-markdown")).not.toBeNull());

  return result;
}

describe("mt-markdown", () => {
  it("renders tables in a scrolling wrapper and task lists", async () => {
    const { container } = await renderMarkdown(
      "| Product | Stock |\n| --- | --: |\n| Lamp | 2 |\n\n- [x] Counted\n- [ ] Reordered",
    );

    const [counted, reordered] = screen.getAllByRole("checkbox");

    expect(container.querySelector(".mt-markdown__table > table")).toBeInTheDocument();
    expect(counted).toBeChecked();
    expect(reordered).not.toBeChecked();
    expect(reordered).toBeDisabled();
  });

  it("shows raw HTML as text", async () => {
    const { container } = await renderMarkdown(
      "<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>",
    );

    expect(container.querySelector("script, img")).toBeNull();
    expect(container).toHaveTextContent("<script>alert(1)</script>");
  });

  it("doesn't link to unsafe schemes", async () => {
    await renderMarkdown("[Click](javascript:alert(1))");

    expect(screen.queryByRole("link")).toBeNull();
  });

  it("opens links that leave the app in a new tab", async () => {
    await renderMarkdown("[Docs](https://example.com) and [orders](/orders)");

    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "orders" })).not.toHaveAttribute("target");
  });

  it("loads images only from the allowed prefixes", async () => {
    await renderMarkdown(
      "![Lamp](https://cdn.example.com/lamp.png) ![Tracker](https://evil.com/t.png)",
      {
        allowedImagePrefixes: ["https://cdn.example.com/"],
      },
    );

    expect(screen.getByRole("img", { name: "Lamp" })).toHaveAttribute(
      "src",
      "https://cdn.example.com/lamp.png",
    );
    expect(screen.getByRole("img", { name: "Tracker" })).not.toHaveAttribute("src");
  });

  it("copies the code of a code block", async () => {
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

    await renderMarkdown("```sh\nnpm install\n```");
    // Lets the permission query resolve.
    await new Promise((resolve) => setTimeout(resolve));
    await userEvent.click(screen.getByRole("button", { name: "Copy code" }));

    expect(writeText).toHaveBeenCalledWith("npm install");

    Reflect.deleteProperty(navigator, "clipboard");
    Reflect.deleteProperty(navigator, "permissions");
  });

  it("renders unfinished emphasis while streaming without showing its syntax", async () => {
    const { container } = await renderMarkdown("Two products are **low on", { streaming: true });

    expect(container.querySelector("strong")).toHaveTextContent("low on");
    expect(container).not.toHaveTextContent("**");
  });
});
