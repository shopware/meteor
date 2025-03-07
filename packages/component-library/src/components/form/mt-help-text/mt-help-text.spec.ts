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

  it("prefers the text prop over the default slot", async () => {
    // ARRANGE
    render(MtHelpText, {
      props: { text: "Some text" },
      slots: {
        default: "<p data-testid='tooltip-content'>My content</p>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();

    // ASSERT
    expect(screen.getByRole('tooltip')).toBeVisible();

    expect(screen.queryByTestId("tooltip-content")).not.toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Some text");
  });

  it("renders html content", async () => {
    // ARRANGE
    render(MtHelpText, {
      slots: {
        default: "<p data-testid='tooltip-content'>Some text</p>",
      }
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();

    // ASSERT
    expect(screen.getByTestId("tooltip-content")).toBeVisible();
    expect(screen.getByTestId("tooltip-content")).toHaveTextContent("Some text");
  });
});
