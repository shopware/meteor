import { nextTick, ref } from "vue";
import { createPanelState } from "./panel-controller";

type Place = "navigation" | "sidebar";

function setup(options: { isDrawer?: boolean; unavailable?: Place[] } = {}) {
  const isDrawer = ref(options.isDrawer ?? false);
  const inlineOpen = { navigation: ref(true), sidebar: ref(true) };
  const panels = createPanelState<Place>({
    isDrawer,
    canOpenDrawer: (place) => !options.unavailable?.includes(place),
    inlineOpen,
  });

  return { isDrawer, inlineOpen, panels };
}

describe("createPanelState", () => {
  describe("next to the content", () => {
    it("shows the panels until they are closed", () => {
      // ARRANGE
      const { inlineOpen, panels } = setup();

      // ACT
      panels.close("sidebar");

      // ASSERT
      expect(panels.isOpen("navigation")).toBe(true);
      expect(panels.isOpen("sidebar")).toBe(false);
      expect(inlineOpen.sidebar.value).toBe(false);
    });

    it("toggles a panel", () => {
      // ARRANGE
      const { panels } = setup();

      // ACT
      panels.toggle("navigation");
      panels.toggle("navigation");

      // ASSERT
      expect(panels.isOpen("navigation")).toBe(true);
    });
  });

  describe("as drawers", () => {
    it("opens one drawer at a time", () => {
      // ARRANGE
      const { inlineOpen, panels } = setup({ isDrawer: true });

      // ACT
      panels.open("navigation");
      panels.open("sidebar");

      // ASSERT
      expect(panels.isOpen("navigation")).toBe(false);
      expect(panels.isOpen("sidebar")).toBe(true);
      expect(inlineOpen.navigation.value).toBe(true);
    });

    it("doesn't open the drawer of an unavailable panel", () => {
      // ARRANGE
      const { panels } = setup({ isDrawer: true, unavailable: ["navigation"] });

      // ACT
      panels.open("navigation");

      // ASSERT
      expect(panels.isOpen("navigation")).toBe(false);
    });

    it("closes the drawer when the layout changes", async () => {
      // ARRANGE
      const { isDrawer, panels } = setup({ isDrawer: true });
      panels.open("sidebar");

      // ACT
      isDrawer.value = false;
      await nextTick();
      isDrawer.value = true;
      await nextTick();

      // ASSERT
      expect(panels.isOpen("sidebar")).toBe(false);
    });
  });
});
