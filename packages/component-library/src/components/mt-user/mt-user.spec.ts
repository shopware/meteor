import { render, screen } from "@testing-library/vue";
import MtUser from "./mt-user.vue";

describe("mt-user", () => {
  it("shows the name and the subtitle", () => {
    // ACT
    render(MtUser, { props: { name: "Mila Hoffmann", subtitle: "mila.hoffmann@example.com" } });

    // ASSERT
    expect(screen.getByText("Mila Hoffmann")).toBeVisible();
    expect(screen.getByText("mila.hoffmann@example.com")).toBeVisible();
  });

  it("shows the initials of the first and the last word of the name", () => {
    // ACT
    render(MtUser, { props: { name: "Mila van Hoffmann" } });

    // ASSERT
    expect(screen.getByTestId("mt-avatar-initials")).toHaveTextContent("MH");
  });

  it("hides the avatar from assistive technology, as the name tells the user", () => {
    // ACT
    render(MtUser, { props: { name: "Mila Hoffmann" } });

    // ASSERT
    expect(screen.getByTestId("mt-avatar-initials").closest("[aria-hidden]")).not.toBeNull();
  });

  it("keeps the name available to assistive technology when only the avatar is shown", () => {
    // ACT
    render(MtUser, { props: { name: "Mila Hoffmann", compact: true } });

    // ASSERT
    expect(screen.getByText("Mila Hoffmann").closest(".visually-hidden")).not.toBeNull();
    expect(screen.getByText("Mila Hoffmann").closest("[aria-hidden]")).toBeNull();
  });
});
