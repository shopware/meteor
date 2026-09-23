import { effectScope, nextTick, ref } from "vue";
import { isNavigationClick, useAppDrawer } from "./useAppDrawer";

function setup(options: { mobile?: boolean } = {}) {
  const isMobile = ref(options.mobile ?? true);
  const onChange = vi.fn();
  const scope = effectScope();
  const drawer = scope.run(() => useAppDrawer({ isMobile, onChange }))!;

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

  it("closes when the open sidebar is removed", () => {
    // ARRANGE
    const { drawer } = setup();
    const unregister = drawer.registerSidebar("start");
    drawer.open("start");

    // ACT
    unregister();

    // ASSERT
    expect(drawer.activeSide.value).toBeNull();
    drawer.open("start");
    expect(drawer.activeSide.value).toBeNull();
  });
});

describe("isNavigationClick", () => {
  function clickResult(anchorHtml: string, init: MouseEventInit = {}) {
    const root = document.createElement("div");
    root.innerHTML = anchorHtml;
    document.body.appendChild(root);

    let result: boolean | undefined;
    root.addEventListener("click", (event) => {
      event.preventDefault();
      result = isNavigationClick(event, root);
    });

    const target = root.querySelector("[data-target]") ?? root.firstElementChild!;
    target.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...init }),
    );
    root.remove();

    return result;
  }

  it("recognizes a plain click on a link", () => {
    expect(clickResult('<a href="/orders">Orders</a>')).toBe(true);
  });

  it("recognizes a click on an element inside a link", () => {
    expect(clickResult('<a href="/orders"><span data-target>Orders</span></a>')).toBe(true);
  });

  it("ignores clicks with modifier keys", () => {
    expect(clickResult('<a href="/orders">Orders</a>', { metaKey: true })).toBe(false);
    expect(clickResult('<a href="/orders">Orders</a>', { ctrlKey: true })).toBe(false);
    expect(clickResult('<a href="/orders">Orders</a>', { shiftKey: true })).toBe(false);
    expect(clickResult('<a href="/orders">Orders</a>', { altKey: true })).toBe(false);
  });

  it("ignores clicks with other mouse buttons", () => {
    expect(clickResult('<a href="/orders">Orders</a>', { button: 1 })).toBe(false);
  });

  it("ignores links that open elsewhere or download", () => {
    expect(clickResult('<a href="/orders" target="_blank">Orders</a>')).toBe(false);
    expect(clickResult('<a href="/report.pdf" download>Report</a>')).toBe(false);
  });

  it("accepts links that explicitly target the same window", () => {
    expect(clickResult('<a href="/orders" target="_self">Orders</a>')).toBe(true);
  });

  it("ignores placeholder links", () => {
    expect(clickResult('<a href="#">Toggle</a>')).toBe(false);
    expect(clickResult('<a href="">Toggle</a>')).toBe(false);
  });

  it("ignores clicks on buttons", () => {
    expect(clickResult("<button>Expand</button>")).toBe(false);
  });
});
