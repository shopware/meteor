import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import MtShopwareSsoButton from "./mt-shopware-sso-button.vue";

describe("mt-shopware-sso-button", () => {
  it("renders default label", () => {
    render(MtShopwareSsoButton);

    expect(screen.getByRole("button", { name: /login with shopware sso/i })).toBeVisible();
  });

  it("allows custom label via default slot", () => {
    render(MtShopwareSsoButton, {
      slots: {
        default: "Sign in with Shopware",
      },
    });

    expect(screen.getByRole("button", { name: /sign in with shopware/i })).toBeVisible();
  });

  it("emits click when pressed", async () => {
    const { emitted } = render(MtShopwareSsoButton);

    await userEvent.click(screen.getByRole("button"));

    expect(emitted().click).toBeTruthy();
  });

  it("can be rendered as an anchor tag", () => {
    render(MtShopwareSsoButton, {
      props: {
        is: "a",
      },
      attrs: {
        href: "https://example.com",
      },
    });

    expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com");
  });

  it("supports disabled state", async () => {
    render(MtShopwareSsoButton, {
      props: { disabled: true },
    });

    expect(screen.getByRole("button")).toBeDisabled();
  });
});


