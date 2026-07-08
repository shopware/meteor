import { defineComponent, h } from "vue";
import { render, screen } from "@testing-library/vue";
import MtThemeProvider from "../components/mt-theme-provider/mt-theme-provider.vue";
import { resolveFutureFlags, useFutureFlags } from "./useFutureFlags";

describe("useFutureFlags", () => {
  describe("resolveFutureFlags", () => {
    it("returns all flags disabled when no input is given", () => {
      // ACT
      const result = resolveFutureFlags(undefined);

      // ASSERT
      expect(result).toEqual({
        removeCardWidth: false,
        removeDefaultMargin: false,
        removeSwitchMinHeight: false,
        bannerFullWidth: false,
      });
    });

    it("enables only the flags listed in a subset", () => {
      // ACT
      const result = resolveFutureFlags({ removeCardWidth: true });

      // ASSERT
      expect(result.removeCardWidth).toBe(true);
      expect(result.removeDefaultMargin).toBe(false);
      expect(result.removeSwitchMinHeight).toBe(false);
      expect(result.bannerFullWidth).toBe(false);
    });

    it("enables every flag when all is true", () => {
      // ACT
      const result = resolveFutureFlags({ all: true });

      // ASSERT
      expect(result).toEqual({
        removeCardWidth: true,
        removeDefaultMargin: true,
        removeSwitchMinHeight: true,
        bannerFullWidth: true,
      });
    });

    it("lets an explicit flag override all", () => {
      // ACT
      const result = resolveFutureFlags({ all: true, removeCardWidth: false });

      // ASSERT
      expect(result.removeCardWidth).toBe(false);
      expect(result.removeDefaultMargin).toBe(true);
      expect(result.removeSwitchMinHeight).toBe(true);
      expect(result.bannerFullWidth).toBe(true);
    });

    it("does not leak the all key into the resolved flags", () => {
      // ACT
      const result = resolveFutureFlags({ all: true });

      // ASSERT
      expect("all" in result).toBe(false);
    });
  });

  describe("provide / inject via MtThemeProvider", () => {
    const Consumer = defineComponent({
      setup() {
        const future = useFutureFlags();
        return () => h("span", JSON.stringify(future));
      },
    });

    it("falls back to all-disabled flags without a provider", () => {
      // ACT
      render(Consumer);

      // ASSERT
      expect(screen.getByText(/"removeCardWidth":false/)).toBeInTheDocument();
    });

    it("provides the resolved flags to descendants", () => {
      // ACT
      render(MtThemeProvider, {
        props: { future: { all: true, removeCardWidth: false } },
        slots: { default: () => h(Consumer) },
      });

      // ASSERT
      const output = screen.getByText(/removeCardWidth/).textContent ?? "";
      expect(JSON.parse(output)).toEqual({
        removeCardWidth: false,
        removeDefaultMargin: true,
        removeSwitchMinHeight: true,
        bannerFullWidth: true,
      });
    });
  });
});
