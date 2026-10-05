import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import MtMessageAction from "./mt-message-action.vue";
import MtMessageActions from "./mt-message-actions.vue";

describe("mt-message-actions", () => {
  it("names each action by its label and passes its attributes to the button", async () => {
    const onRetry = vi.fn();
    render({
      components: { MtMessageActions, MtMessageAction },
      setup: () => ({ onRetry }),
      template: `
        <mt-message-actions>
          <mt-message-action label="Retry" icon="regular-redo" @click="onRetry" />
          <mt-message-action label="Good answer" icon="regular-thumbs-up" aria-pressed="true" />
        </mt-message-actions>
      `,
    });

    await userEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Good answer" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
