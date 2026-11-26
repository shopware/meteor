import { defineComponent, h, nextTick } from "vue";
import { fireEvent, render, screen } from "@testing-library/vue";
import MtApp from "../mt-app/mt-app.vue";
import MtAppPanelTrigger from "../mt-app/mt-app-panel-trigger.vue";
import MtPanel from "./mt-panel.vue";
import {
  flushPromises,
  stubMatchMedia,
  stubPointerEvents,
} from "../mt-app/__tests__/shell-test-utils";

async function renderSidebar(panel: string, data: Record<string, unknown> = {}) {
  const result = render({
    components: { MtApp, MtAppPanelTrigger, MtPanel },
    data: () => data,
    template: `
      <mt-app>
        <template #header><mt-app-panel-trigger panel="sidebar" /></template>
        <template #default><p>Main content</p></template>
        <template #sidebar>${panel}</template>
      </mt-app>
    `,
  });

  await flushPromises();

  return result;
}

function panelElement() {
  return document.querySelector<HTMLElement>(".mt-panel")!;
}

function panelWidth() {
  return panelElement().style.getPropertyValue("--mt-panel-width");
}

describe("mt-panel", () => {
  beforeEach(() => {
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
        components: { MtApp, MtAppPanelTrigger, AppAssistant },
        template: `
          <mt-app>
            <template #header><mt-app-panel-trigger panel="sidebar" /></template>
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
    it("sets its starting width and its limits", async () => {
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

    it("takes the default width and limits of its place", async () => {
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
      await flushPromises();

      // ASSERT
      const [navigation, sidebar] = document.querySelectorAll<HTMLElement>(".mt-panel");
      expect(navigation.style.getPropertyValue("--mt-panel-width")).toBe("280px");
      expect(navigation.style.getPropertyValue("--mt-panel-min-width")).toBe("200px");
      expect(navigation.style.getPropertyValue("--mt-panel-max-width")).toBe("400px");
      expect(sidebar.style.getPropertyValue("--mt-panel-width")).toBe("320px");
      expect(sidebar.style.getPropertyValue("--mt-panel-min-width")).toBe("240px");
      expect(sidebar.style.getPropertyValue("--mt-panel-max-width")).toBe("480px");
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

    it("resizes with the keyboard", async () => {
      // ARRANGE
      await renderSidebar(
        `<mt-panel resizable :width="300" :max-width="800"><p>Tools</p></mt-panel>`,
      );
      const handle = screen.getByRole("separator");

      // ACT: the sidebar's handle is on its start edge, so the left arrow makes it wider
      await fireEvent.keyDown(handle, { key: "ArrowLeft" });

      // ASSERT
      expect(panelWidth()).toBe("310px");

      // ACT
      await fireEvent.keyDown(handle, { key: "Home" });

      // ASSERT
      expect(panelWidth()).toBe("240px");

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
      await fireEvent.pointerMove(handle, { buttons: 1, clientX: 460 });

      // ASSERT
      expect(onUpdate).not.toHaveBeenCalled();
      expect(panelWidth()).toBe("340px");

      // ACT
      await fireEvent.pointerUp(handle, { clientX: 460 });

      // ASSERT
      expect(onUpdate).toHaveBeenCalledWith(340);
    });

    it("keeps the width after a click on the handle", async () => {
      // ARRANGE
      await renderSidebar(`<mt-panel resizable><p>Tools</p></mt-panel>`);
      const handle = screen.getByRole("separator");

      // ACT
      await fireEvent.pointerDown(handle, { button: 0, clientX: 500 });
      await fireEvent.pointerUp(handle, { clientX: 500 });

      // ASSERT
      expect(panelWidth()).toBe("320px");
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
    });

    it("has its default width until it is resized", async () => {
      // ACT
      await renderSidebar(`<mt-panel resizable :default-width="400"><p>Tools</p></mt-panel>`);

      // ASSERT
      expect(panelWidth()).toBe("400px");
    });

    it("returns a width the app keeps to the default width on double click", async () => {
      // ARRANGE
      const onUpdate = vi.fn();
      await renderSidebar(
        `<mt-panel resizable :default-width="400" :width="300" @update:width="onUpdate"><p>Tools</p></mt-panel>`,
        { onUpdate },
      );

      // ACT
      await fireEvent.dblClick(screen.getByRole("separator"));

      // ASSERT
      expect(onUpdate).toHaveBeenLastCalledWith(400);
    });

    describe("closing by drag", () => {
      async function renderDraggableSidebar(panel: string) {
        const onUpdateWidth = vi.fn();
        const onUpdateOpen = vi.fn();
        render({
          components: { MtApp, MtPanel },
          data: () => ({ onUpdateWidth, onUpdateOpen }),
          template: `
            <mt-app>
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
          `<mt-panel closable resizable :width="300" @update:open="onUpdateOpen"><p>Tools</p></mt-panel>`,
        );
        await fireEvent.pointerDown(handle, { button: 0, clientX: 700 });

        // ACT: 200px to the end leaves 100px, 140px less than the smallest width of 240px
        await fireEvent.pointerMove(handle, { buttons: 1, clientX: 900 });

        // ASSERT
        expect(dragOffset()).toBe("140px");

        // ACT
        await fireEvent.pointerMove(handle, { buttons: 1, clientX: 750 });

        // ASSERT
        expect(dragOffset()).toBe("");
      });

      it("slides it back at its smallest width when less than half of that has slid out", async () => {
        // ARRANGE
        const { handle, onUpdateWidth, onUpdateOpen } = await renderDraggableSidebar(
          `<mt-panel closable resizable :width="300" @update:width="onUpdateWidth" @update:open="onUpdateOpen"><p>Tools</p></mt-panel>`,
        );
        await fireEvent.pointerDown(handle, { button: 0, clientX: 700 });
        await fireEvent.pointerMove(handle, { buttons: 1, clientX: 850 });

        // ACT
        await fireEvent.pointerUp(handle, { clientX: 850 });

        // ASSERT
        expect(onUpdateOpen).not.toHaveBeenCalled();
        expect(onUpdateWidth).toHaveBeenCalledWith(240);
        expect(dragOffset()).toBe("");
      });

      it("closes a closable panel once half of its smallest width has slid out", async () => {
        // ARRANGE
        const { handle, onUpdateWidth, onUpdateOpen } = await renderDraggableSidebar(
          `<mt-panel closable resizable :width="300" @update:width="onUpdateWidth" @update:open="onUpdateOpen"><p>Tools</p></mt-panel>`,
        );
        await fireEvent.pointerDown(handle, { button: 0, clientX: 700 });

        // ACT
        await fireEvent.pointerMove(handle, { buttons: 1, clientX: 900 });
        await fireEvent.pointerUp(handle, { clientX: 900 });

        // ASSERT
        expect(onUpdateOpen).toHaveBeenCalledWith(false);
        expect(onUpdateWidth).not.toHaveBeenCalled();
      });

      it("keeps a panel that isn't closable open at its smallest width", async () => {
        // ARRANGE
        const { handle, onUpdateWidth, onUpdateOpen } = await renderDraggableSidebar(
          `<mt-panel resizable :width="300" @update:width="onUpdateWidth" @update:open="onUpdateOpen"><p>Tools</p></mt-panel>`,
        );

        // ACT
        await fireEvent.pointerDown(handle, { button: 0, clientX: 700 });
        await fireEvent.pointerMove(handle, { buttons: 1, clientX: 1200 });
        await fireEvent.pointerUp(handle, { clientX: 1200 });

        // ASSERT
        expect(onUpdateOpen).not.toHaveBeenCalled();
        expect(onUpdateWidth).toHaveBeenCalledWith(240);
      });

      it("ends a drag that is cut off as the panel shows it", async () => {
        // ARRANGE
        const { handle, onUpdateOpen } = await renderDraggableSidebar(
          `<mt-panel closable resizable :width="300" @update:open="onUpdateOpen"><p>Tools</p></mt-panel>`,
        );

        // ACT
        await fireEvent.pointerDown(handle, { button: 0, clientX: 700 });
        await fireEvent.pointerMove(handle, { buttons: 1, clientX: 900 });
        await fireEvent.pointerCancel(handle);

        // ASSERT
        expect(onUpdateOpen).toHaveBeenCalledWith(false);
      });
    });
  });
});
