import { userEvent } from "@storybook/test";
import MtSwitch from "./mt-switch.vue";
import { render, screen } from "@testing-library/vue";

describe("mt-switch", () => {
  it("is turned on", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        checked: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("is turned off", async () => {
    // ARRANGE
    render(MtSwitch, {
      props: {
        checked: false,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("emits an event when turning off the switch", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSwitch, {
      props: {
        checked: true,
        // @ts-expect-error -- Type is not defined because of missing defineEmits
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(false);
  });
});
