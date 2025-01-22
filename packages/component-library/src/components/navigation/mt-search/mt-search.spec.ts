import { render, screen } from "@testing-library/vue";
import MtSearch from "./mt-search.vue";

describe("mt-search", () => {
  it("has a default placeholder of search", async () => {
    // ARRANGE
    render(MtSearch);

    // ASSERT
    expect(screen.getByRole("searchbox")).toHaveAttribute("placeholder", "Search");
  });
});
