import { defineComponent, h, nextTick } from "vue";
import { fireEvent, render, screen } from "@testing-library/vue";
import MtApp from "../mt-app/mt-app.vue";
import MtPage from "../mt-page/mt-page.vue";
import MtPanel from "./mt-panel.vue";
import {
  createLocalStorageMock,
  flushPromises,
  routerPlugin,
  stubMatchMedia,
  stubPointerEvents,
} from "../mt-app/__tests__/shell-test-utils";

async function renderSidebar(panel: string, data: Record<string, unknown> = {}) {
  const result = render({
    components: { MtApp, MtPanel },
    data: () => data,
    template: `
      <mt-app>
        <template #default><p>Main content</p></template>
        <template #sidebar>${panel}</template>
      </mt-app>
    `,
  });

  // The remembered width applies a tick after the panel has mounted.
  await flushPromises();

  return result;
}

function renderPageWithEndPanel(router?: unknown) {
  return render(MtPage, {
    slots: {
      default: "<p>Content</p>",
      end: () => h(MtPanel, { resizable: true, width: 300 }, () => h("p", "Customer")),
    },
    global: { plugins: router ? [routerPlugin(router)] : [] },
  });
}

function panelElement() {
  return document.querySelector<HTMLElement>(".mt-panel")!;
}

function panelWidth() {
  return panelElement().style.getPropertyValue("--mt-panel-width");
}

describe("mt-panel", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
    stubMatchMedia(1440);
    stubPointerEvents();
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
      const trigger = screen.getByRole("button", { name: "Toggle Assistant" });
      expect(trigger.querySelector(".icon--regular-sparkles")).toBeInTheDocument();
    });

    it("reports its options from inside another component", async () => {
      // ARRANGE
      stubMatchMedia(390);
      const AppAssistant = defineComponent({
        render: () => h(MtPanel, { label: "Assistant" }, () => h("p", "Tools")),
      });

      // ACT
      render({
        components: { MtApp, AppAssistant },
        template: `
          <mt-app>
            <template #default><p>Main content</p></template>
            <template #sidebar><AppAssistant /></template>
          </mt-app>
        `,
      });
      await nextTick();
      await nextTick();

      // ASSERT
      expect(screen.getByRole("button", { name: "Toggle Assistant" })).toBeInTheDocument();
    });
  });

  describe("appearance", () => {
    function region(place: string) {
      return document.querySelector(`.mt-panel-region--${place}`);
    }

    it("borders the sidebar and leaves the navigation plain by default", async () => {
      // ACT
      render({
        components: { MtApp, MtPanel },
        template: `
          <mt-app>
            <template #navigation><mt-panel><p>Links</p></mt-panel></template>
            <template #default><p>Main content</p></template>
            <template #sidebar><mt-panel><p>Tools</p></mt-panel></template>
          </mt-app>
        `,
      });
      await nextTick();

      // ASSERT
      expect(region("sidebar")).toHaveClass("mt-panel-region--bordered");
      expect(region("navigation")).not.toHaveClass("mt-panel-region--bordered");
    });

    it("leaves a panel plain with appearance plain, as written in a template", async () => {
      // ACT
      await renderSidebar(`<mt-panel appearance="plain"><p>Tools</p></mt-panel>`);

      // ASSERT
      expect(region("sidebar")).not.toHaveClass("mt-panel-region--bordered");
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
      expect(panelWidth()).toBe("");
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
      stubMatchMedia(390);

      // ACT
      await renderSidebar(`<mt-panel resizable><p>Tools</p></mt-panel>`);

      // ASSERT
      expect(screen.queryByRole("separator", { hidden: true })).not.toBeInTheDocument();
    });

    it("resizes with the keyboard and remembers the width for its slot", async () => {
      // ARRANGE
      await renderSidebar(`<mt-panel resizable :width="300"><p>Tools</p></mt-panel>`);
      const handle = screen.getByRole("separator");

      // ACT: the sidebar's handle is on its start edge, so the left arrow makes it wider
      await fireEvent.keyDown(handle, { key: "ArrowLeft" });

      // ASSERT
      expect(panelWidth()).toBe("310px");
      expect(localStorage.getItem("mt-panel-width:sidebar")).toBe("310");

      // ACT
      await fireEvent.keyDown(handle, { key: "Home" });

      // ASSERT
      expect(panelWidth()).toBe("160px");

      // ACT
      await fireEvent.keyDown(handle, { key: "End" });

      // ASSERT
      expect(panelWidth()).toBe(`${window.innerWidth / 2}px`);
    });

    it("leaves the width to the app with v-model:width", async () => {
      // ARRANGE
      const onUpdate = vi.fn();
      await renderSidebar(
        `<mt-panel resizable :width="300" @update:width="onUpdate"><p>Tools</p></mt-panel>`,
        { onUpdate },
      );

      // ACT
      await fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowLeft" });

      // ASSERT
      expect(onUpdate).toHaveBeenLastCalledWith(310);
      expect(localStorage.getItem("mt-panel-width:sidebar")).toBeNull();
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
      expect(panelWidth()).toBe("340px");

      // ACT
      await fireEvent.pointerUp(handle);

      // ASSERT
      expect(onUpdate).toHaveBeenCalledWith(340);
    });

    it("keeps a panel as wide as its content after a click on the handle", async () => {
      // ARRANGE
      await renderSidebar(`<mt-panel resizable><p>Tools</p></mt-panel>`);
      const handle = screen.getByRole("separator");

      // ACT
      await fireEvent.pointerDown(handle, { button: 0, clientX: 500 });
      await fireEvent.pointerUp(handle);

      // ASSERT
      expect(panelWidth()).toBe("");
      expect(localStorage.getItem("mt-panel-width:sidebar")).toBeNull();
    });

    it("applies the remembered width when it mounts, within its limits", async () => {
      // ARRANGE
      localStorage.setItem("mt-panel-width:sidebar", "900");

      // ACT
      await renderSidebar(`<mt-panel resizable :max-width="480"><p>Tools</p></mt-panel>`);

      // ASSERT
      expect(panelWidth()).toBe("480px");
    });

    it("remembers the width of a page's panel for that page only", async () => {
      // ARRANGE
      const routeOf = (path: string) => ({
        currentRoute: { value: { path: "/", hash: "", matched: [{ path }] } },
      });
      const cms = renderPageWithEndPanel(routeOf("/cms"));
      await flushPromises();

      // ACT: the end panel's handle is on its start edge, so the left arrow makes it wider
      await fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowLeft" });
      cms.unmount();
      renderPageWithEndPanel(routeOf("/orders/:id"));
      await flushPromises();

      // ASSERT
      expect(localStorage.getItem("mt-panel-width:/cms:end")).toBe("310");
      expect(panelWidth()).toBe("300px");
    });

    it("names the page after the route record that renders it, not after a child route", async () => {
      // ARRANGE
      const record = { path: "/products/:id", instances: {} as Record<string, unknown> };
      const router = {
        currentRoute: {
          value: { path: "/products/1/specs", hash: "", matched: [record, { path: "specs" }] },
        },
      };
      const ProductPage = defineComponent({
        render: () =>
          h(MtPage, null, {
            default: () => h("p", "Specifications"),
            end: () => h(MtPanel, { resizable: true, width: 300 }, () => h("p", "Variants")),
          }),
      });
      render(
        {
          // Like RouterView, which registers the page it renders in the route record.
          render: () =>
            h(ProductPage, {
              ref: (instance: unknown) => {
                if (instance) record.instances.default = instance;
              },
            }),
        },
        { global: { plugins: [routerPlugin(router)] } },
      );
      await flushPromises();

      // ACT
      await fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowLeft" });

      // ASSERT
      expect(localStorage.getItem("mt-panel-width:/products/:id:end")).toBe("310");
    });

    it("names the page by its URL path without a router", async () => {
      // ARRANGE
      renderPageWithEndPanel();
      await flushPromises();

      // ACT
      await fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowLeft" });

      // ASSERT
      expect(localStorage.getItem(`mt-panel-width:${location.pathname}:end`)).toBe("310");
    });

    it("returns to its starting width on double click", async () => {
      // ARRANGE
      await renderSidebar(`<mt-panel resizable :width="300"><p>Tools</p></mt-panel>`);
      const handle = screen.getByRole("separator");
      await fireEvent.keyDown(handle, { key: "ArrowLeft" });

      // ACT
      await fireEvent.dblClick(handle);

      // ASSERT
      expect(panelWidth()).toBe("300px");
      expect(localStorage.getItem("mt-panel-width:sidebar")).toBeNull();
    });

    describe("closing by drag", () => {
      async function renderDraggableSidebar(panel: string) {
        const onUpdateWidth = vi.fn();
        const onUpdateOpen = vi.fn();
        render({
          components: { MtApp, MtPanel },
          data: () => ({ onUpdateWidth, onUpdateOpen }),
          template: `
            <mt-app @update:sidebar-open="onUpdateOpen">
              <template #default><p>Main content</p></template>
              <template #sidebar>${panel}</template>
            </mt-app>
          `,
        });
        await flushPromises();
        // The sidebar's outer edge is its end edge, at 1000px.
        vi.spyOn(panelElement(), "getBoundingClientRect").mockReturnValue({
          width: 300,
          left: 700,
          right: 1000,
        } as DOMRect);
        vi.spyOn(sidebarRegion(), "getBoundingClientRect").mockReturnValue({
          width: 300,
        } as DOMRect);

        return { handle: screen.getByRole("separator"), onUpdateWidth, onUpdateOpen };
      }

      function sidebarRegion() {
        return document.querySelector<HTMLElement>(".mt-panel-region--sidebar")!;
      }

      function dragOffset() {
        return sidebarRegion().style.getPropertyValue("--mt-panel-region-drag-offset");
      }

      it("slides a closable panel out with the pointer past its smallest width, and back in", async () => {
        // ARRANGE
        const { handle } = await renderDraggableSidebar(
          `<mt-panel closable resizable :width="300"><p>Tools</p></mt-panel>`,
        );
        await fireEvent.pointerDown(handle, { button: 0, clientX: 700 });

        // ACT: 200px to the end leaves 100px, 60px less than the smallest width of 160px
        await fireEvent.pointerMove(handle, { clientX: 900 });

        // ASSERT
        expect(dragOffset()).toBe("60px");

        // ACT
        await fireEvent.pointerMove(handle, { clientX: 750 });

        // ASSERT
        expect(dragOffset()).toBe("");
      });

      it("slides it back at its smallest width when the drag ends before the zone", async () => {
        // ARRANGE
        const { handle, onUpdateWidth, onUpdateOpen } = await renderDraggableSidebar(
          `<mt-panel closable resizable :width="300" @update:width="onUpdateWidth"><p>Tools</p></mt-panel>`,
        );
        await fireEvent.pointerDown(handle, { button: 0, clientX: 700 });
        await fireEvent.pointerMove(handle, { clientX: 900 });

        // ACT
        await fireEvent.pointerUp(handle);

        // ASSERT
        expect(onUpdateOpen).not.toHaveBeenCalled();
        expect(onUpdateWidth).toHaveBeenCalledWith(160);
        expect(dragOffset()).toBe("");
      });

      it("closes a closable panel when the drag ends in the zone at its outer edge, or beyond", async () => {
        // ARRANGE
        const { handle, onUpdateWidth, onUpdateOpen } = await renderDraggableSidebar(
          `<mt-panel closable resizable :width="300" @update:width="onUpdateWidth"><p>Tools</p></mt-panel>`,
        );
        await fireEvent.pointerDown(handle, { button: 0, clientX: 700 });

        // ACT
        await fireEvent.pointerMove(handle, { clientX: 1200 });
        await fireEvent.pointerUp(handle);

        // ASSERT
        expect(onUpdateOpen).toHaveBeenCalledWith(false);
        expect(onUpdateWidth).not.toHaveBeenCalled();
      });

      it("keeps a panel that isn't closable open at its smallest width", async () => {
        // ARRANGE
        const { handle, onUpdateWidth, onUpdateOpen } = await renderDraggableSidebar(
          `<mt-panel resizable :width="300" @update:width="onUpdateWidth"><p>Tools</p></mt-panel>`,
        );

        // ACT
        await fireEvent.pointerDown(handle, { button: 0, clientX: 700 });
        await fireEvent.pointerMove(handle, { clientX: 1200 });
        await fireEvent.pointerUp(handle);

        // ASSERT
        expect(onUpdateOpen).not.toHaveBeenCalled();
        expect(onUpdateWidth).toHaveBeenCalledWith(160);
      });

      it("doesn't close when the drag is cancelled in the zone", async () => {
        // ARRANGE
        const { handle, onUpdateOpen } = await renderDraggableSidebar(
          `<mt-panel closable resizable :width="300"><p>Tools</p></mt-panel>`,
        );

        // ACT
        await fireEvent.pointerDown(handle, { button: 0, clientX: 700 });
        await fireEvent.pointerMove(handle, { clientX: 990 });
        await fireEvent.pointerCancel(handle);

        // ASSERT
        expect(onUpdateOpen).not.toHaveBeenCalled();
      });
    });
  });
});
