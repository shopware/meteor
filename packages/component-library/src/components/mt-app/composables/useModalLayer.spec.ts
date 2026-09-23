import { h, nextTick, ref, type Component } from "vue";
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { useModalLayer } from "./useModalLayer";

function createHarness() {
  const active = ref(false);
  const onEscape = vi.fn();
  const returnTarget = ref<HTMLElement | null>(null);

  const Harness: Component = {
    setup() {
      const panel = ref<HTMLElement | null>(null);

      useModalLayer({
        target: panel,
        active,
        onEscape,
        returnFocusTo: () => returnTarget.value,
      });

      return () =>
        h("div", [
          h("button", "Outside"),
          h("div", { ref: panel, role: "dialog", "aria-label": "Panel", tabindex: -1 }, [
            h("a", { href: "/first" }, "First"),
            h("button", "Middle"),
            h("button", "Last"),
          ]),
        ]);
    },
  };

  return { Harness, active, onEscape, returnTarget };
}

describe("useModalLayer", () => {
  it("moves the focus onto the panel when it activates", async () => {
    // ARRANGE
    const { Harness, active } = createHarness();
    render(Harness);

    // ACT
    active.value = true;
    await nextTick();

    // ASSERT
    expect(screen.getByRole("dialog", { name: "Panel" })).toHaveFocus();
  });

  it("restores the focus to the given element when it deactivates", async () => {
    // ARRANGE
    const { Harness, active, returnTarget } = createHarness();
    render(Harness);
    returnTarget.value = screen.getByRole("button", { name: "Outside" });
    active.value = true;
    await nextTick();

    // ACT
    active.value = false;
    await nextTick();

    // ASSERT
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  });

  it("leaves the focus alone when no return element is given", async () => {
    // ARRANGE
    const { Harness, active } = createHarness();
    render(Harness);
    active.value = true;
    await nextTick();
    screen.getByRole("button", { name: "Middle" }).focus();

    // ACT
    active.value = false;
    await nextTick();

    // ASSERT
    expect(screen.getByRole("button", { name: "Middle" })).toHaveFocus();
  });

  it("closes on Escape pressed inside the panel", async () => {
    // ARRANGE
    const { Harness, active, onEscape } = createHarness();
    render(Harness);
    active.value = true;
    await nextTick();

    // ACT
    await userEvent.keyboard("{Escape}");

    // ASSERT
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("ignores Escape pressed outside the panel", async () => {
    // ARRANGE
    const { Harness, active, onEscape } = createHarness();
    render(Harness);
    active.value = true;
    await nextTick();
    screen.getByRole("button", { name: "Outside" }).focus();

    // ACT
    await userEvent.keyboard("{Escape}");

    // ASSERT
    expect(onEscape).not.toHaveBeenCalled();
  });

  it("ignores Escape while the panel is inactive", async () => {
    // ARRANGE
    const { Harness, onEscape } = createHarness();
    render(Harness);
    screen.getByRole("button", { name: "Middle" }).focus();

    // ACT
    await userEvent.keyboard("{Escape}");

    // ASSERT
    expect(onEscape).not.toHaveBeenCalled();
  });

  it("wraps Tab from the last element to the first one", async () => {
    // ARRANGE
    const { Harness, active } = createHarness();
    render(Harness);
    active.value = true;
    await nextTick();
    screen.getByRole("button", { name: "Last" }).focus();

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("link", { name: "First" })).toHaveFocus();
  });

  it("wraps Shift+Tab from the first element to the last one", async () => {
    // ARRANGE
    const { Harness, active } = createHarness();
    render(Harness);
    active.value = true;
    await nextTick();
    screen.getByRole("link", { name: "First" }).focus();

    // ACT
    await userEvent.tab({ shift: true });

    // ASSERT
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
  });

  it("moves from the panel itself to the last element on Shift+Tab", async () => {
    // ARRANGE
    const { Harness, active } = createHarness();
    render(Harness);
    active.value = true;
    await nextTick();

    // ACT
    await userEvent.tab({ shift: true });

    // ASSERT
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
  });
});
