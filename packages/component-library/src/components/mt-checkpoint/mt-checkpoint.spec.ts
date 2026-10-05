import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import MtCheckpoint from "./mt-checkpoint.vue";
import MtCheckpointIcon from "./mt-checkpoint-icon.vue";
import MtCheckpointTrigger from "./mt-checkpoint-trigger.vue";

describe("mt-checkpoint", () => {
  it("shows its label before a separator line, with an optional action", async () => {
    const onRestore = vi.fn();
    const { container } = render({
      components: { MtCheckpoint, MtCheckpointIcon, MtCheckpointTrigger },
      setup: () => ({ onRestore }),
      template: `
        <mt-checkpoint>
          <mt-checkpoint-icon icon="regular-sync" />
          Switched to GPT-6 Luna
          <mt-checkpoint-trigger @click="onRestore">Restore</mt-checkpoint-trigger>
        </mt-checkpoint>
      `,
    });

    expect(container.querySelector(".mt-checkpoint__content")).toHaveTextContent(
      "Switched to GPT-6 Luna",
    );
    expect(screen.getByRole("separator")).toBeInTheDocument();
    expect(container.querySelector(".mt-checkpoint-icon")).toHaveClass("icon--regular-sync");

    await userEvent.click(screen.getByRole("button", { name: "Restore" }));
    expect(onRestore).toHaveBeenCalledTimes(1);
  });

  it("uses a bookmark icon by default", () => {
    const { container } = render(MtCheckpointIcon);

    expect(container.querySelector(".mt-checkpoint-icon")).toHaveClass("icon--regular-bookmark");
  });
});
