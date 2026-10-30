import { createSSRApp, h, nextTick } from "vue";
import { renderToString } from "vue/server-renderer";
import { waitFor } from "@testing-library/vue";
import { createI18n } from "vue-i18n";
import MtApp from "./mt-app.vue";
import MtPage from "../mt-page/mt-page.vue";
import MtPanel from "../mt-panel/mt-panel.vue";
import { stubMatchMedia } from "./__tests__/shell-test-utils";

interface AppOptions {
  content?: () => unknown;
  navigation?: () => unknown;
  sidebar?: () => unknown;
}

function createApp({ content, navigation, sidebar }: AppOptions = {}) {
  return createSSRApp({
    render: () =>
      h(MtApp, null, {
        header: () => h("span", "Header content"),
        navigation: navigation ?? (() => h("a", { href: "/" }, "Orders")),
        default: content ?? (() => h("p", "Main content")),
        sidebar: sidebar ?? (() => h("div", "Tools")),
      }),
  }).use(createI18n({ legacy: false, locale: "en" }));
}

async function hydrate(width: number, options: AppOptions = {}) {
  vi.stubGlobal("matchMedia", undefined);
  const html = await renderToString(createApp(options));
  stubMatchMedia(width);

  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

  createApp(options).mount(container);
  await nextTick();

  const messages = [...warn.mock.calls, ...error.mock.calls].map((call) => String(call[0]));

  return {
    html,
    container,
    hydrationMessages: messages.filter((message) => /hydration/i.test(message)),
  };
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
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeInTheDocument());
  });

  it("hydrates a page with the triggers of closable panels without mismatches", async () => {
    // ACT
    const { html, container, hydrationMessages } = await hydrate(1440, {
      content: () => h(MtPage, { breadcrumb: [{ label: "Orders" }] }),
      navigation: () => h(MtPanel, { closable: true }, () => h("a", { href: "/" }, "Orders")),
      sidebar: () =>
        h(MtPanel, { closable: true, label: "Assistant", icon: "regular-sparkles" }, () =>
          h("div", "Tools"),
        ),
    });

    // ASSERT
    expect(html).toContain('aria-label="Toggle Assistant"');
    expect(hydrationMessages).toEqual([]);
    expect(
      container.querySelectorAll(".mt-page__header .mt-app-panel-trigger__button"),
    ).toHaveLength(2);
    expect(container.querySelector(".mt-app__header .mt-app__trigger")).not.toBeInTheDocument();
  });
});
