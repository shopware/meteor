import { createSSRApp, h, nextTick } from "vue";
import { renderToString } from "vue/server-renderer";
import { createI18n } from "vue-i18n";
import MtApp from "./mt-app.vue";

function stubViewport(width: number) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => {
      const maxWidth = Number(/\(max-width: ([\d.]+)px\)/.exec(query)?.[1] ?? NaN);

      return {
        matches: Number.isNaN(maxWidth) ? false : width <= maxWidth,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      };
    }),
  );
}

function createApp() {
  return createSSRApp({
    render: () =>
      h(
        MtApp,
        { theme: "light", applyTheme: false },
        {
          header: () => h("span", "Header content"),
          "sidebar-start": () => h("nav", "Navigation"),
          content: () => h("p", "Main content"),
          "sidebar-end": () => h("div", "Tools"),
        },
      ),
  }).use(createI18n({ legacy: false, locale: "en" }));
}

async function hydrate(width: number) {
  vi.stubGlobal("matchMedia", undefined);
  const html = await renderToString(createApp());
  stubViewport(width);

  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

  createApp().mount(container);
  await nextTick();

  const messages = [...warn.mock.calls, ...error.mock.calls].map((call) => String(call[0]));

  return { container, hydrationMessages: messages.filter((message) => /hydration/i.test(message)) };
}

describe("mt-app server-side rendering", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("hydrates on a desktop viewport without mismatches", async () => {
    // ACT
    const { container, hydrationMessages } = await hydrate(1440);

    // ASSERT
    expect(hydrationMessages).toEqual([]);
    expect(container.querySelector(".mt-app")).toHaveAttribute("data-layout", "desktop");
  });

  it("hydrates on a mobile viewport without mismatches and then switches to drawers", async () => {
    // ACT
    const { container, hydrationMessages } = await hydrate(390);

    // ASSERT
    expect(hydrationMessages).toEqual([]);
    expect(container.querySelector(".mt-app")).toHaveAttribute("data-layout", "mobile");
    expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
  });
});
