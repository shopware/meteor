import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtMessage from "./mt-message.vue";

describe("mt-message", () => {
  it.each([
    ["user", "You"],
    ["assistant", "Assistant"],
    ["system", "System"],
  ] as const)("names the sender of a %s message for assistive technology", (from, sender) => {
    const { container } = render(MtMessage, { props: { from }, slots: { default: "Hello" } });

    expect(container.firstElementChild).toHaveClass(`mt-message--${from}`);
    expect(container.firstElementChild).toHaveTextContent(`${sender}Hello`);
  });

  it("takes a custom sender", () => {
    render(MtMessage, { props: { from: "assistant", sender: "Copilot" } });

    expect(screen.getByText("Copilot")).toBeInTheDocument();
  });

  it("shows attachments above the content", () => {
    const { container } = render(MtMessage, {
      props: { from: "user" },
      slots: { default: "Describe this", attachments: "<span>photo.png</span>" },
    });

    expect(container.querySelector(".mt-message__attachments")).toHaveTextContent("photo.png");
  });

  it("leaves out the content area of a message with only attachments", () => {
    const { container } = render(MtMessage, {
      props: { from: "user" },
      slots: { attachments: "<span>photo.png</span>" },
    });

    expect(container.querySelector(".mt-message__content")).toBeNull();
  });

  it("leaves out the attachments area without attachments", () => {
    const { container } = render(MtMessage, {
      props: { from: "user" },
      slots: { default: "Hello" },
    });

    expect(container.querySelector(".mt-message__attachments")).toBeNull();
  });
});
