import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtLoader from "./mt-loader.vue";

describe("mt-loader", () => {
  it("renders the spinner", () => {
    const { container } = render(MtLoader);

    expect(container.querySelector(".mt-loader__element")).toBeInTheDocument();
  });

  it("renders with a backdrop by default", () => {
    const { container } = render(MtLoader);

    expect(container.querySelector(".mt-loader")).toHaveClass("mt-loader--has-backdrop");
  });

  it("can render without a backdrop", () => {
    const { container } = render(MtLoader, {
      props: {
        backdrop: false,
      },
    });

    expect(container.querySelector(".mt-loader")).not.toHaveClass("mt-loader--has-backdrop");
  });

  it("does not render text wrappers when title and description are omitted", () => {
    const { container } = render(MtLoader);

    expect(container.querySelector(".mt-loader__text")).not.toBeInTheDocument();
    expect(container.querySelector(".mt-loader__title")).not.toBeInTheDocument();
    expect(container.querySelector(".mt-loader__description")).not.toBeInTheDocument();
  });

  it("renders title and description when provided", () => {
    render(MtLoader, {
      props: {
        title: "Loading data",
        description: "This may take a few seconds.",
      },
    });

    expect(screen.getByText("Loading data")).toBeVisible();
    expect(screen.getByText("This may take a few seconds.")).toBeVisible();
  });

  it("renders title and description with the expected text styles", () => {
    render(MtLoader, {
      props: {
        title: "Loading data",
        description: "This may take a few seconds.",
      },
    });

    expect(screen.getByText("Loading data")).toHaveClass(
      "mt-text--size-s",
      "mt-text--weight-semibold",
    );
    expect(screen.getByText("This may take a few seconds.")).toHaveClass(
      "mt-text--size-xs",
      "mt-text--weight-regular",
    );
  });
});
