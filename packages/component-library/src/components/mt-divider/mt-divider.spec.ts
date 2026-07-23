import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtDivider from "./mt-divider.vue";

describe("mt-divider", () => {
  it("renders a horizontal solid separator by default", async () => {
    render(MtDivider);

    const divider = screen.getByRole("separator");
    expect(divider).toHaveAttribute("aria-orientation", "horizontal");
    expect(divider).toHaveClass("mt-divider--horizontal");
    expect(divider).toHaveClass("mt-divider--solid");
    expect(divider).toHaveStyle({
      "--mt-divider-color": "var(--color-border-secondary-default)",
    });
  });

  it("renders a vertical separator", async () => {
    render(MtDivider, {
      props: {
        orientation: "vertical",
      },
    });

    const divider = screen.getByRole("separator");
    expect(divider).toHaveAttribute("aria-orientation", "vertical");
    expect(divider).toHaveClass("mt-divider--vertical");
  });

  it("renders a dashed separator", async () => {
    render(MtDivider, {
      props: {
        variant: "dashed",
      },
    });

    expect(screen.getByRole("separator")).toHaveClass("mt-divider--dashed");
  });

  it("uses the given color token for the line", async () => {
    render(MtDivider, {
      props: {
        color: "color-border-brand-default",
      },
    });

    expect(screen.getByRole("separator")).toHaveStyle({
      "--mt-divider-color": "var(--color-border-brand-default)",
    });
  });

  it("hides a decorative divider from assistive technologies", async () => {
    const { container } = render(MtDivider, {
      props: {
        decorative: true,
      },
    });

    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("role", "none");
    expect(container.firstElementChild).not.toHaveAttribute("aria-orientation");
  });

  it("is not full-bleed by default", async () => {
    render(MtDivider);

    expect(screen.getByRole("separator")).not.toHaveClass("mt-divider--full-bleed");
  });

  it("stretches across the container padding when full-bleed", async () => {
    render(MtDivider, {
      props: {
        fullBleed: true,
      },
    });

    expect(screen.getByRole("separator")).toHaveClass("mt-divider--full-bleed");
  });

  it("renders slot content in the middle of the divider", async () => {
    const { container } = render(MtDivider, {
      slots: {
        default: "or",
      },
    });

    expect(screen.getByText("or")).toBeVisible();
    expect(container.firstElementChild).toHaveClass("mt-divider--with-content");
  });

  it("keeps slot content accessible by dropping the separator role", async () => {
    const { container } = render(MtDivider, {
      slots: {
        default: "<button>Show older entries</button>",
      },
    });

    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveAttribute("role");
    expect(screen.getByRole("button", { name: "Show older entries" })).toBeVisible();
  });

  it("has no content class without slot content", async () => {
    render(MtDivider);

    expect(screen.getByRole("separator")).not.toHaveClass("mt-divider--with-content");
  });
});
