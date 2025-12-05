import { render, screen } from "@testing-library/vue";
import MtAvatar from "./mt-avatar.vue";

describe("mt-avatar", () => {
  it("shows initials", () => {
    render(MtAvatar, { props: { firstName: "John", lastName: "Doe" } });

    const result = screen.getByTestId("mt-avatar-initials");

    expect(result).toBeInTheDocument();
    expect(result).toHaveTextContent("JD");
  });
});
