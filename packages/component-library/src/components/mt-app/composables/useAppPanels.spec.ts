import { nextTick, ref } from "vue";
import { useAppPanels } from "./useAppPanels";
import type { MtAppPanel } from "./useMtApp";

function setup(options: { isMobile?: boolean; unavailable?: MtAppPanel[] } = {}) {
  const isMobile = ref(options.isMobile ?? false);
  const desktopState = { navigation: ref(true), sidebar: ref(true) };
  const panels = useAppPanels({
    isMobile,
    canOpenDrawer: (panel) => !options.unavailable?.includes(panel),
    desktopState,
  });

  return { isMobile, desktopState, panels };
}

describe("useAppPanels", () => {
  describe("desktop layout", () => {
    it("shows the panels until they are closed", () => {
      // ARRANGE
      const { desktopState, panels } = setup();

      // ACT
      panels.close("sidebar");

      // ASSERT
      expect(panels.isOpen("navigation")).toBe(true);
      expect(panels.isOpen("sidebar")).toBe(false);
      expect(desktopState.sidebar.value).toBe(false);
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

  describe("mobile layout", () => {
    it("opens one drawer at a time", () => {
      // ARRANGE
      const { desktopState, panels } = setup({ isMobile: true });

      // ACT
      panels.open("navigation");
      panels.open("sidebar");

      // ASSERT
      expect(panels.isOpen("navigation")).toBe(false);
      expect(panels.isOpen("sidebar")).toBe(true);
      expect(desktopState.navigation.value).toBe(true);
    });

    it("doesn't open the drawer of an unavailable panel", () => {
      // ARRANGE
      const { panels } = setup({ isMobile: true, unavailable: ["navigation"] });

      // ACT
      panels.open("navigation");

      // ASSERT
      expect(panels.isOpen("navigation")).toBe(false);
    });

    it("closes the drawer when the layout changes", async () => {
      // ARRANGE
      const { isMobile, panels } = setup({ isMobile: true });
      panels.open("sidebar");

      // ACT
      isMobile.value = false;
      await nextTick();
      isMobile.value = true;
      await nextTick();

      // ASSERT
      expect(panels.isOpen("sidebar")).toBe(false);
    });
  });
});
