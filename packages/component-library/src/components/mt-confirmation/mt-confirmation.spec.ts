import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { MtToolApproval, MtToolState } from "@/types/ai";
import MtConfirmation from "./mt-confirmation.vue";
import MtConfirmationAccepted from "./mt-confirmation-accepted.vue";
import MtConfirmationAction from "./mt-confirmation-action.vue";
import MtConfirmationActions from "./mt-confirmation-actions.vue";
import MtConfirmationRejected from "./mt-confirmation-rejected.vue";
import MtConfirmationRequest from "./mt-confirmation-request.vue";
import MtConfirmationTitle from "./mt-confirmation-title.vue";

function renderConfirmation(state: MtToolState, approval?: MtToolApproval, onApprove = () => {}) {
  return render({
    components: {
      MtConfirmation,
      MtConfirmationTitle,
      MtConfirmationRequest,
      MtConfirmationAccepted,
      MtConfirmationRejected,
      MtConfirmationActions,
      MtConfirmationAction,
    },
    setup: () => ({ state, approval, onApprove }),
    template: `
      <mt-confirmation :state="state" :approval="approval">
        <mt-confirmation-title>Change the stock?</mt-confirmation-title>
        <mt-confirmation-request>Set SW-1012 to 40.</mt-confirmation-request>
        <mt-confirmation-accepted>You approved it.</mt-confirmation-accepted>
        <mt-confirmation-rejected>You declined it.</mt-confirmation-rejected>
        <mt-confirmation-actions>
          <mt-confirmation-action>Decline</mt-confirmation-action>
          <mt-confirmation-action variant="primary" @click="onApprove">Approve</mt-confirmation-action>
        </mt-confirmation-actions>
      </mt-confirmation>
    `,
  });
}

const requested = { id: "approval-1" };

describe("mt-confirmation", () => {
  it.each([
    ["input-streaming", requested],
    ["input-available", requested],
    ["output-available", undefined],
  ] as [MtToolState, MtToolApproval | undefined][])(
    "shows nothing in %s with approval %o",
    (state, approval) => {
      const { container } = renderConfirmation(state, approval);

      expect(container).toHaveTextContent("");
    },
  );

  it("asks for the approval", () => {
    renderConfirmation("approval-requested", requested);

    expect(screen.getByText("Change the stock?")).toBeInTheDocument();
    expect(screen.getByText("Set SW-1012 to 40.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(screen.queryByText("You approved it.")).toBeNull();
    expect(screen.queryByText("You declined it.")).toBeNull();
  });

  it.each([
    ["approval-responded", true, "You approved it."],
    ["output-available", true, "You approved it."],
    ["approval-responded", false, "You declined it."],
    ["output-denied", false, "You declined it."],
  ] as [MtToolState, boolean, string][])(
    "shows the answer in %s when approved is %s",
    (state, approved, answer) => {
      renderConfirmation(state, { id: "approval-1", approved });

      expect(screen.getByText(answer)).toBeInTheDocument();
      expect(screen.queryByText("Set SW-1012 to 40.")).toBeNull();
      expect(screen.queryByRole("button")).toBeNull();
    },
  );

  it("answers through the click of an action", async () => {
    const onApprove = vi.fn();
    renderConfirmation("approval-requested", requested, onApprove);

    await userEvent.click(screen.getByRole("button", { name: "Approve" }));

    expect(onApprove).toHaveBeenCalledTimes(1);
  });
});
