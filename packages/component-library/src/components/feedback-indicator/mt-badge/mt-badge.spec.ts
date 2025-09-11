import { render, screen } from "@testing-library/vue";
import MtBadge from "./mt-badge.vue";

describe("mt-badge", () => {
  it("displays an icon", () => {
    // ARRANGE
    render(MtBadge, {
      slots: {
        icon: "Test Icon",
      },
    });

    // ASSERT
    expect(screen.getByText("Test Icon")).toBeVisible();
  });

  it("displays a status indicator", () => {
    // ARRANGE
    render(MtBadge, {
      props: {
        statusIndicator: true,
      },
    });

    // ASSERT
    expect(document.querySelector(".mt-badge__indicator")).toBeVisible();
  });
});
