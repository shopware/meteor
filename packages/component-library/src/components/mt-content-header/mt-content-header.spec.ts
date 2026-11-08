import { h, nextTick } from "vue";
import { render, screen } from "@testing-library/vue";
import MtPage from "../mt-page/mt-page.vue";
import MtContentHeader from "./mt-content-header.vue";

describe("mt-content-header", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("lets the page header hide its current crumb while the title is on screen", async () => {
    // ARRANGE
    let reportIntersection: (isIntersecting: boolean) => void = () => undefined;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          reportIntersection = (isIntersecting) =>
            callback(
              [{ isIntersecting } as IntersectionObserverEntry],
              this as unknown as IntersectionObserver,
            );
        }

        observe() {}

        disconnect() {}
      },
    );
    render(MtPage, {
      props: { breadcrumb: [{ label: "Products", to: "/products" }, { label: "Running shoes" }] },
      slots: { default: () => h(MtContentHeader, { title: "Running shoes" }) },
      global: { stubs: { "router-link": { template: "<a><slot /></a>" } } },
    });
    await nextTick();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });

    // ASSERT
    expect(breadcrumb).toHaveClass("mt-breadcrumb--hide-current");

    // ACT
    reportIntersection(false);
    await nextTick();

    // ASSERT
    expect(breadcrumb).not.toHaveClass("mt-breadcrumb--hide-current");
  });
});
