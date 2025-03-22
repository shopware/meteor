import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import MtFutureFlag from "./mt-future-flag.vue";
import { defineComponent } from "vue";
import { useFutureFlags } from "@/composables/useFutureFlags";

describe("mt-future-flag", () => {
  it("can enable a future flag", () => {
    // ARRANGE
    const Child = defineComponent({
      template: "<div>No default margin: {{futureFlags.removeDefaultMargin.toString()}}</div>",
      setup() {
        const futureFlags = useFutureFlags();

        return { futureFlags };
      },
    });

    const Component = defineComponent({
      components: { MtFutureFlag, Child },
      template: "<mt-future-flag remove-default-margin><Child /></mt-future-flag>",
    });

    render(Component);

    // ASSERT
    expect(screen.getByText("No default margin: true")).toBeVisible();
  });

  it("future flag is disabled by default", () => {
    // ARRANGE
    const Child = defineComponent({
      template: "<div>No default margin: {{futureFlags.removeDefaultMargin.toString()}}</div>",
      setup() {
        const futureFlags = useFutureFlags();

        return { futureFlags };
      },
    });

    const Component = defineComponent({
      components: { MtFutureFlag, Child },
      template: "<mt-future-flag><Child /></mt-future-flag>",
    });

    render(Component);

    // ASSERT
    expect(screen.getByText("No default margin: false")).toBeVisible();
  });
});
