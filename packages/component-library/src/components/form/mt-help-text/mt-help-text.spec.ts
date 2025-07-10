import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import MtHelpText from "./mt-help-text.vue";
import { flushPromises } from "@vue/test-utils";

describe("mt-help-text", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useFakeTimers();
  });

  it("opens a tooltip when focusing the help text", async () => {
    // ARRANGE
    render(MtHelpText, {
      props: { text: "Some text" },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeVisible();
  });

  it("opens a tooltip when hovering the help text", async () => {
    // ARRANGE
    render(MtHelpText, {
      props: { text: "Some text" },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("button"));

    vi.advanceTimersByTime(550);
    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeVisible();
  });

  it("uses the overwritten inline styles", async () => {
    // ARRANGE
    render(MtHelpText, {
      props: { text: "Some text" },
      attrs: {
        style: "color: red",
      },
    });

    // ASSERT
    expect(screen.getByRole("button")).toHaveStyle("color: rgb(255, 0, 0)");
  });
});
