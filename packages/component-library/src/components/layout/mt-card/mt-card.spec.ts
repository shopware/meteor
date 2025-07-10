import { screen, render } from "@testing-library/vue";
import MtCard from "./mt-card.vue";
import { userEvent } from "@testing-library/user-event";

describe("mt-card", () => {
  it("hides the inheritance toggle by default", () => {
    // ARRANGE
    render(MtCard, {
      props: {
        title: "Some title",
      },
    });

    // ACT & ASSERT
    expect(screen.queryByRole("button", { name: "Enable inheritance" })).not.toBeInTheDocument();
  });

  it("shows the enable inheritance toggle when value is inherited", () => {
    // ARRANGE
    render(MtCard, {
      props: {
        title: "Some title",
        inheritance: true,
      },
    });

    // ACT & ASSERT
    expect(screen.getByRole("button", { name: "Disable inheritance" })).toBeInTheDocument();
  });

  it("shows the disabled inheritance toggle when inheritance is disabled", () => {
    // ARRANGE
    render(MtCard, {
      props: {
        title: "Some title",
        inheritance: false,
      },
    });

    // ACT & ASSERT
    expect(screen.getByRole("button", { name: "Enable inheritance" })).toBeInTheDocument();
  });

  it("emits an event when disabling inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtCard, {
      props: {
        title: "Some title",
        inheritance: true,
        "onUpdate:inheritance": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Disable inheritance" }));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits an event when enabling inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtCard, {
      props: {
        title: "Some title",
        inheritance: false,
        "onUpdate:inheritance": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Enable inheritance" }));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });
});
