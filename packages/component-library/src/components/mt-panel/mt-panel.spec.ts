import { defineComponent, h, nextTick, type App } from "vue";
import { fireEvent, render, screen } from "@testing-library/vue";
import MtApp from "../mt-app/mt-app.vue";
import MtPage from "../mt-page/mt-page.vue";
import MtPanel from "./mt-panel.vue";
import type { Router } from "vue-router";

/** Lets `(width < …px)` queries match below the given viewport width; other queries never match. */
function stubViewport(width: number) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => {
      const maxWidth = Number(/\(width < ([\d.]+)px\)/.exec(query)?.[1] ?? NaN);

      return {
        matches: Number.isNaN(maxWidth) ? false : width < maxWidth,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      };
    }),
  );
}

function createLocalStorageMock(): Storage {
  const store = new Map<string, string>();

  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => void store.set(key, String(value)),
    removeItem: (key) => void store.delete(key),
    clear: () => store.clear(),
    key: (index) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  };
}

/** jsdom has no pointer events, so they are mouse events with a pointer id. */
class PointerEventStub extends MouseEvent {
  pointerId: number;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
  }
}

async function renderSidebar(panel: string, data: Record<string, unknown> = {}) {
  const result = render({
    components: { MtApp, MtPanel },
    data: () => data,
    template: `
      <mt-app>
        <template #content><p>Main content</p></template>
        <template #sidebar>${panel}</template>
      </mt-app>
    `,
  });

  await nextTick();

  return result;
}

function panelElement() {
  return document.querySelector<HTMLElement>(".mt-panel")!;
}

describe("mt-panel", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
    stubViewport(1440);
    vi.stubGlobal("PointerEvent", PointerEventStub);
    HTMLElement.prototype.setPointerCapture = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("options", () => {
    it("names the panel's trigger and sets its icon, as written in a template", async () => {
      // ACT
      await renderSidebar(
        `<mt-panel label="Assistant" icon="regular-sparkles" closable><p>Tools</p></mt-panel>`,
      );

      // ASSERT
      const trigger = screen.getByRole("button", { name: "Open Assistant" });
      expect(trigger.querySelector(".icon--regular-sparkles")).toBeInTheDocument();
    });

    it("reports its options from inside another component", async () => {
      // ARRANGE
      stubViewport(390);
      const AppAssistant = defineComponent({
        render: () => h(MtPanel, { label: "Assistant" }, () => h("p", "Tools")),
      });

      // ACT
      render({
        components: { MtApp, AppAssistant },
        template: `
          <mt-app>
            <template #content><p>Main content</p></template>
            <template #sidebar><AppAssistant /></template>
          </mt-app>
        `,
      });
      await nextTick();
      await nextTick();

      // ASSERT
      expect(screen.getByRole("button", { name: "Open Assistant" })).toBeInTheDocument();
    });
  });

  describe("appearance", () => {
    function region(panel: string) {
      return document.querySelector(`.mt-app__region--${panel}`);
    }

    it("borders the sidebar and leaves the navigation plain by default", async () => {
      // ACT
      render({
        components: { MtApp, MtPanel },
        template: `
          <mt-app>
            <template #navigation><mt-panel><p>Links</p></mt-panel></template>
            <template #content><p>Main content</p></template>
            <template #sidebar><mt-panel><p>Tools</p></mt-panel></template>
          </mt-app>
        `,
      });
      await nextTick();

      // ASSERT
      expect(region("sidebar")).toHaveClass("mt-app__region--bordered");
      expect(region("navigation")).not.toHaveClass("mt-app__region--bordered");
    });

    it("leaves a panel plain with appearance plain, as written in a template", async () => {
      // ACT
      await renderSidebar(`<mt-panel appearance="plain"><p>Tools</p></mt-panel>`);

      // ASSERT
      expect(region("sidebar")).not.toHaveClass("mt-app__region--bordered");
    });
  });

  describe("width", () => {
    it("sets its width and its limits", async () => {
      // ACT
      await renderSidebar(
        `<mt-panel :width="320" :min-width="200" :max-width="480"><p>Tools</p></mt-panel>`,
      );

      // ASSERT
      const style = panelElement().style;
      expect(style.getPropertyValue("--mt-panel-width")).toBe("320px");
      expect(style.getPropertyValue("--mt-panel-min-width")).toBe("200px");
      expect(style.getPropertyValue("--mt-panel-max-width")).toBe("480px");
    });

    it("leaves the width to its content without a width", async () => {
      // ACT
      await renderSidebar(`<mt-panel><p>Tools</p></mt-panel>`);

      // ASSERT
      expect(panelElement().style.getPropertyValue("--mt-panel-width")).toBe("");
    });
  });

  describe("resizing", () => {
    it("has a resize handle only when resizable, in the desktop layout", async () => {
      // ACT
      await renderSidebar(`<mt-panel resizable :min-width="200"><p>Tools</p></mt-panel>`);

      // ASSERT
      const handle = screen.getByRole("separator", { name: "Resize Sidebar" });
      expect(handle).toHaveAttribute("aria-orientation", "vertical");
      expect(handle).toHaveAttribute("aria-controls", panelElement().id);
      expect(handle).toHaveAttribute("aria-valuemin", "200");
    });

    it("has no resize handle without resizable", async () => {
      // ACT
      await renderSidebar(`<mt-panel><p>Tools</p></mt-panel>`);

      // ASSERT
      expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    });

    it("has no resize handle in the mobile layout", async () => {
      // ARRANGE
      stubViewport(390);

      // ACT
      await renderSidebar(`<mt-panel resizable><p>Tools</p></mt-panel>`);

      // ASSERT
      expect(screen.queryByRole("separator", { hidden: true })).not.toBeInTheDocument();
    });

    it("resizes with the keyboard and remembers the width for its slot", async () => {
      // ARRANGE
      const onUpdate = vi.fn();
      await renderSidebar(
        `<mt-panel resizable :width="300" @update:width="onUpdate"><p>Tools</p></mt-panel>`,
        { onUpdate },
      );
      const handle = screen.getByRole("separator");

      // ACT: the sidebar's handle is on its start edge, so the left arrow makes it wider
      await fireEvent.keyDown(handle, { key: "ArrowLeft" });

      // ASSERT
      expect(onUpdate).toHaveBeenLastCalledWith(310);
      expect(localStorage.getItem("mt-panel-width:sidebar")).toBe("310");

      // ACT
      await fireEvent.keyDown(handle, { key: "Home" });

      // ASSERT
      expect(onUpdate).toHaveBeenLastCalledWith(160);

      // ACT
      await fireEvent.keyDown(handle, { key: "End" });

      // ASSERT
      expect(onUpdate).toHaveBeenLastCalledWith(window.innerWidth / 2);
    });

    it("emits the width when a drag ends", async () => {
      // ARRANGE
      const onUpdate = vi.fn();
      await renderSidebar(
        `<mt-panel resizable :width="300" @update:width="onUpdate"><p>Tools</p></mt-panel>`,
        { onUpdate },
      );
      vi.spyOn(panelElement(), "getBoundingClientRect").mockReturnValue({
        width: 300,
      } as DOMRect);
      const handle = screen.getByRole("separator");

      // ACT
      await fireEvent.pointerDown(handle, { button: 0, clientX: 500 });
      await fireEvent.pointerMove(handle, { clientX: 460 });

      // ASSERT
      expect(onUpdate).not.toHaveBeenCalled();
      expect(panelElement().style.getPropertyValue("--mt-panel-width")).toBe("340px");

      // ACT
      await fireEvent.pointerUp(handle);

      // ASSERT
      expect(onUpdate).toHaveBeenCalledWith(340);
    });

    it("applies the remembered width when it mounts, within its limits", async () => {
      // ARRANGE
      localStorage.setItem("mt-panel-width:sidebar", "900");

      // ACT
      await renderSidebar(`<mt-panel resizable :max-width="480"><p>Tools</p></mt-panel>`);

      // ASSERT
      expect(panelElement().style.getPropertyValue("--mt-panel-width")).toBe("480px");
    });

    it("remembers the width of a page's panel for that page only", async () => {
      // ARRANGE
      function renderPageWithPanel(routePath: string) {
        return render(MtPage, {
          slots: {
            default: "<p>Content</p>",
            end: () => h(MtPanel, { resizable: true, width: 300 }, () => h("p", "Customer")),
          },
          global: {
            plugins: [
              {
                install: (app: App) => {
                  // Only the part of a router that the panel reads.
                  app.config.globalProperties.$router = {
                    currentRoute: {
                      value: { path: "/", hash: "", matched: [{ path: routePath }] },
                    },
                  } as unknown as Router;
                },
              },
            ],
          },
        });
      }

      const cms = renderPageWithPanel("/cms");

      // ACT: the end panel's handle is on its start edge, so the left arrow makes it wider
      await fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowLeft" });
      cms.unmount();
      renderPageWithPanel("/orders/:id");
      await nextTick();

      // ASSERT
      expect(localStorage.getItem("mt-panel-width:/cms:end")).toBe("310");
      expect(panelElement().style.getPropertyValue("--mt-panel-width")).toBe("300px");
    });

    it("names the page by its URL path without a router", async () => {
      // ARRANGE
      render(MtPage, {
        slots: {
          default: "<p>Content</p>",
          end: () => h(MtPanel, { resizable: true, width: 300 }, () => h("p", "Customer")),
        },
      });

      // ACT
      await fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowLeft" });

      // ASSERT
      expect(localStorage.getItem(`mt-panel-width:${location.pathname}:end`)).toBe("310");
    });

    it("returns to its starting width on double click", async () => {
      // ARRANGE
      const onUpdate = vi.fn();
      await renderSidebar(
        `<mt-panel resizable :width="300" @update:width="onUpdate"><p>Tools</p></mt-panel>`,
        { onUpdate },
      );
      const handle = screen.getByRole("separator");
      await fireEvent.keyDown(handle, { key: "ArrowLeft" });

      // ACT
      await fireEvent.dblClick(handle);

      // ASSERT
      expect(onUpdate).toHaveBeenLastCalledWith(300);
      expect(localStorage.getItem("mt-panel-width:sidebar")).toBeNull();
    });
  });
});
