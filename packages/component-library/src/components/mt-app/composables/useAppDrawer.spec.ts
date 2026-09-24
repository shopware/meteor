import { effectScope, nextTick, ref } from "vue";
import { useAppDrawer } from "./useAppDrawer";

function setup(options: { mobile?: boolean; available?: boolean } = {}) {
  const isMobile = ref(options.mobile ?? true);
  const onChange = vi.fn();
  const scope = effectScope();
  const drawer = scope.run(() =>
    useAppDrawer({ isMobile, onChange, isAvailable: () => options.available ?? true }),
  )!;

  return { isMobile, onChange, drawer, dispose: () => scope.stop() };
}

describe("useAppDrawer", () => {
  it("opens a registered side in the mobile layout", () => {
    // ARRANGE
    const { drawer, onChange } = setup();
    drawer.registerSidebar("start");

    // ACT
    drawer.open("start");

    // ASSERT
    expect(drawer.activeSide.value).toBe("start");
    expect(onChange).toHaveBeenCalledWith("start");
  });

  it("ignores sides without a sidebar", () => {
    // ARRANGE
    const { drawer, onChange } = setup();

    // ACT
    drawer.open("end");

    // ASSERT
    expect(drawer.activeSide.value).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does nothing in the desktop layout", () => {
    // ARRANGE
    const { drawer } = setup({ mobile: false });
    drawer.registerSidebar("start");

    // ACT
    drawer.open("start");

    // ASSERT
    expect(drawer.activeSide.value).toBeNull();
  });

  it("ignores sides whose sidebar is not available", () => {
    // ARRANGE
    const { drawer } = setup({ available: false });
    drawer.registerSidebar("start");

    // ACT
    drawer.open("start");

    // ASSERT
    expect(drawer.activeSide.value).toBeNull();
  });

  it("replaces the open side when the other one opens", () => {
    // ARRANGE
    const { drawer, onChange } = setup();
    drawer.registerSidebar("start");
    drawer.registerSidebar("end");
    drawer.open("start");

    // ACT
    drawer.open("end");

    // ASSERT
    expect(drawer.activeSide.value).toBe("end");
    expect(onChange.mock.calls).toEqual([["start"], ["end"]]);
  });

  it("toggles a side open and closed", () => {
    // ARRANGE
    const { drawer } = setup();
    drawer.registerSidebar("start");

    // ACT
    drawer.toggle("start");
    const afterFirst = drawer.activeSide.value;
    drawer.toggle("start");

    // ASSERT
    expect(afterFirst).toBe("start");
    expect(drawer.activeSide.value).toBeNull();
  });

  it("reports a change only when the state actually changes", () => {
    // ARRANGE
    const { drawer, onChange } = setup();
    drawer.registerSidebar("start");

    // ACT
    drawer.close();
    drawer.open("start");
    drawer.open("start");

    // ASSERT
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("closes when the layout leaves the mobile mode", async () => {
    // ARRANGE
    const { drawer, isMobile, onChange } = setup();
    drawer.registerSidebar("start");
    drawer.open("start");

    // ACT
    isMobile.value = false;
    await nextTick();

    // ASSERT
    expect(drawer.activeSide.value).toBeNull();
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("closes when the open sidebar is removed", async () => {
    // ARRANGE
    const { drawer } = setup();
    const unregister = drawer.registerSidebar("start");
    drawer.open("start");

    // ACT
    unregister();
    await nextTick();

    // ASSERT
    expect(drawer.activeSide.value).toBeNull();
    drawer.open("start");
    expect(drawer.activeSide.value).toBeNull();
  });
});
