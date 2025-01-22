import { render, screen } from "@testing-library/vue";
import MtLink from "./mt-link.vue";

describe("mt-link", async () => {
  it("renders as a custom component", async () => {
    // ARRANGE
    render(MtLink, {
      props: {
        as: "button",
      },
    });

    // ASSERT
    expect(screen.getByRole("button")).toBeVisible();
  });
});
