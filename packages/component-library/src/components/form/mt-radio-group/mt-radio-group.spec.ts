import { render, screen } from "@testing-library/vue";
import { vi } from "vitest";
import MtRadioGroupRoot from "./mt-radio-group-root.vue";
import MtRadioGroupList from "./mt-radio-group-list.vue";
import MtRadioGroupItem from "./mt-radio-group-item.vue";
import { userEvent } from "@testing-library/user-event";

vi.mock("vue-i18n", async () => {
  const actual = await vi.importActual("vue-i18n");
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  };
});

describe("mt-radio-group", () => {
  it("renders all radio options", async () => {
    // ARRANGE
    await render(MtRadioGroupRoot, {
      props: {
        label: "Choose an option",
      },
      slots: {
        default: `
        <MtRadioGroupList>
          <MtRadioGroupItem id="option-1" value="value1" label="Option 1" />
          <MtRadioGroupItem id="option-2" value="value2" label="Option 2" />
          <MtRadioGroupItem id="option-3" value="value3" label="Option 3" />
        </MtRadioGroupList>
      `,
      },
      global: {
        components: { MtRadioGroupList, MtRadioGroupItem },
      },
    });

    // ASSERT
    expect(screen.getByRole("radiogroup")).toBeVisible();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("shows the label when provided", async () => {
    // ARRANGE
    await render(MtRadioGroupRoot, {
      props: {
        label: "Choose an option",
      },
      slots: {
        default: `
        <MtRadioGroupList>
          <MtRadioGroupItem id="option-1" value="value1" label="Option 1" />
          <MtRadioGroupItem id="option-2" value="value2" label="Option 2" />
          <MtRadioGroupItem id="option-3" value="value3" label="Option 3" />
        </MtRadioGroupList>
      `,
      },
      global: {
        components: { MtRadioGroupList, MtRadioGroupItem },
      },
    });

    // ASSERT
    expect(screen.getByText("Choose an option")).toBeVisible();
  });

  it("clicks on a radio option", async () => {
    // ARRANGE
    await render(MtRadioGroupRoot, {
      props: {
        label: "Choose an option",
      },
      slots: {
        default: `
      <MtRadioGroupList>
        <MtRadioGroupItem id="option-1" value="value1" label="Option 1" />
        <MtRadioGroupItem id="option-2" value="value2" label="Option 2" />
        <MtRadioGroupItem id="option-3" value="value3" label="Option 3" />
      </MtRadioGroupList>
    `,
      },
      global: {
        components: { MtRadioGroupList, MtRadioGroupItem },
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("radio", { name: "Option 1" }));

    // ASSERT
    expect(screen.getByLabelText("Option 1")).toBeChecked();
  });

  it("shows the correct option as checked based on modelValue", async () => {
    // ARRANGE
    await render(MtRadioGroupRoot, {
      props: {
        modelValue: "value2",
      },
      slots: {
        default: `
        <MtRadioGroupList>
          <MtRadioGroupItem id="option-1" value="value1" label="Option 1" />
          <MtRadioGroupItem id="option-2" value="value2" label="Option 2" />
          <MtRadioGroupItem id="option-3" value="value3" label="Option 3" />
        </MtRadioGroupList>
      `,
      },
      global: {
        components: { MtRadioGroupList, MtRadioGroupItem },
      },
    });

    // ASSERT
    expect(screen.getByLabelText("Option 1")).not.toBeChecked();
    expect(screen.getByLabelText("Option 2")).toBeChecked();
    expect(screen.getByLabelText("Option 3")).not.toBeChecked();
  });

  it("can be disabled", async () => {
    // ARRANGE
    await render(MtRadioGroupRoot, {
      props: {
        label: "Choose an option",
        disabled: true,
      },
      slots: {
        default: `
        <MtRadioGroupList>
          <MtRadioGroupItem id="option-1" value="value1" label="Option 1" />
          <MtRadioGroupItem id="option-2" value="value2" label="Option 2" />
          <MtRadioGroupItem id="option-3" value="value3" label="Option 3" />
        </MtRadioGroupList>
      `,
      },
      global: {
        components: { MtRadioGroupList, MtRadioGroupItem },
      },
    });

    // ASSERT
    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it("displays an error message when provided", async () => {
    // ARRANGE
    await render(MtRadioGroupRoot, {
      props: {
        label: "Choose an option",
        error: { detail: "Please select an option" },
      },
    });

    // ASSERT
    expect(screen.getByText("Please select an option")).toBeVisible();
  });
});
