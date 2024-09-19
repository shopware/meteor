import { render, screen } from "@testing-library/vue";
import MtAvatar from "./mt-avatar.vue";

describe("mt-avatar", () => {
  it("shows only a placeholder", () => {
    render(MtAvatar, { props: { placeholder: true } });

    const result = screen.getByTestId("mt-avatar-placeholder");

    expect(result).toBeInTheDocument();

    expect(screen.queryByTestId("mt-avatar-initials")).not.toBeInTheDocument();
  });

  it("shows only initials", () => {
    render(MtAvatar, { props: { firstName: "John", lastName: "Doe" } });

    const result = screen.getByTestId("mt-avatar-initials");

    expect(result).toBeInTheDocument();
    expect(result).toHaveTextContent("JD");

    expect(screen.queryByTestId("mt-avatar-placeholder")).not.toBeInTheDocument();
  });
});
