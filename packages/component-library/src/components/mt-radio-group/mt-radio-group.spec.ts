import { render, screen } from "@testing-library/vue";
import { vi } from "vitest";
import MtRadioGroupRoot from "./mt-radio-group-root.vue";
import MtRadioGroupList from "./mt-radio-group-list.vue";
import MtRadioGroupItem from "./mt-radio-group-item.vue";
import MtRadioGroupCardItem from "./mt-radio-group-card-item.vue";
import { userEvent } from "@testing-library/user-event";
import { ref } from "vue";

vi.mock("vue-i18n", async () => {
  const actual = await vi.importActual("vue-i18n");
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  };
});

describe("radio group cards", () => {
  it("selects a card once when clicking its label", async () => {
    // ARRANGE
    const onSelectionChange = vi.fn();

    render({
      components: { MtRadioGroupRoot, MtRadioGroupCardItem },
      setup: () => ({ selection: ref("basic"), onSelectionChange }),
      template: `
        <MtRadioGroupRoot v-model="selection" @update:modelValue="onSelectionChange">
          <MtRadioGroupCardItem id="basic" value="basic" label="Basic" />
          <MtRadioGroupCardItem id="pro" value="pro" label="Pro" />
        </MtRadioGroupRoot>
      `,
    });

    // ACT
    await userEvent.click(screen.getByText("Pro"));
    await userEvent.click(screen.getByText("Pro"));

    // ASSERT
    expect(screen.getByRole("radio", { name: "Basic" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith("pro");
  });

  it("reflects a selection changed outside the group", async () => {
    // ARRANGE
    render({
      components: { MtRadioGroupRoot, MtRadioGroupCardItem },
      setup: () => ({ selection: ref("basic") }),
      template: `
        <button @click="selection = 'pro'">Choose the recommended plan</button>
        <MtRadioGroupRoot v-model="selection">
          <MtRadioGroupCardItem id="basic" value="basic" label="Basic" />
          <MtRadioGroupCardItem id="pro" value="pro" label="Pro" />
        </MtRadioGroupRoot>
      `,
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Choose the recommended plan" }));

    // ASSERT
    expect(screen.getByRole("radio", { name: "Basic" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
  });

  it("shares one selection with standard radio options", async () => {
    // ARRANGE
    render({
      components: { MtRadioGroupRoot, MtRadioGroupItem, MtRadioGroupCardItem },
      setup: () => ({ selection: ref("basic") }),
      template: `
        <MtRadioGroupRoot v-model="selection" name="plan">
          <MtRadioGroupItem id="basic" value="basic" label="Basic" />
          <MtRadioGroupCardItem id="pro" value="pro" label="Pro" />
        </MtRadioGroupRoot>
      `,
    });

    // ACT
    await userEvent.click(screen.getByText("Pro"));

    // ASSERT
    expect(screen.getByRole("radio", { name: "Basic" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveAttribute("name", "plan");

    // ACT
    await userEvent.click(screen.getByRole("radio", { name: "Basic" }));

    // ASSERT
    expect(screen.getByRole("radio", { name: "Basic" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Pro" })).not.toBeChecked();
  });

  it("preserves the selection when the group becomes disabled", async () => {
    // ARRANGE
    const onSelectionChange = vi.fn();

    render({
      components: { MtRadioGroupRoot, MtRadioGroupCardItem },
      setup: () => ({ selection: ref("basic"), disabled: ref(false), onSelectionChange }),
      template: `
        <button @click="disabled = true">Disable plans</button>
        <MtRadioGroupRoot v-model="selection" :disabled="disabled" @update:modelValue="onSelectionChange">
          <MtRadioGroupCardItem id="basic" value="basic" label="Basic" />
          <MtRadioGroupCardItem id="pro" value="pro" label="Pro" />
        </MtRadioGroupRoot>
      `,
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Disable plans" }));
    await userEvent.click(screen.getByText("Pro"));

    // ASSERT
    expect(screen.getByRole("radio", { name: "Basic" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Basic" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Pro" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Pro" })).not.toBeChecked();
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it.each([1, true, false])("preserves a selection's value type for %s", async (value) => {
    // ARRANGE
    const onSelectionChange = vi.fn();

    render({
      components: { MtRadioGroupRoot, MtRadioGroupCardItem },
      setup: () => ({ selection: ref(null), value, onSelectionChange }),
      template: `
        <MtRadioGroupRoot v-model="selection" @update:modelValue="onSelectionChange">
          <MtRadioGroupCardItem id="plan" :value="value" label="Plan" />
        </MtRadioGroupRoot>
      `,
    });

    // ACT
    await userEvent.click(screen.getByText("Plan"));

    // ASSERT
    expect(screen.getByRole("radio", { name: "Plan" })).toBeChecked();
    expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith(value);
  });

  it("requires a selection when the card is required", async () => {
    // ARRANGE
    render({
      components: { MtRadioGroupRoot, MtRadioGroupCardItem },
      setup: () => ({ selection: ref(null) }),
      template: `
        <MtRadioGroupRoot v-model="selection">
          <MtRadioGroupCardItem id="plan" value="plan" label="Plan" required />
        </MtRadioGroupRoot>
      `,
    });

    // ASSERT
    expect(screen.getByRole("radio", { name: "Plan" })).toBeRequired();
    expect(screen.getByRole("radio", { name: "Plan" })).toBeInvalid();

    // ACT
    await userEvent.click(screen.getByText("Plan"));

    // ASSERT
    expect(screen.getByRole("radio", { name: "Plan" })).toBeValid();
  });

  it("keeps a card's own error after the group error is cleared", async () => {
    // ARRANGE
    render({
      components: { MtRadioGroupRoot, MtRadioGroupCardItem },
      setup: () => ({ error: ref<{ detail: string } | undefined>({ detail: "Choose a plan" }) }),
      template: `
        <button @click="error = undefined">Clear group error</button>
        <MtRadioGroupRoot :error="error">
          <MtRadioGroupCardItem id="basic" value="basic" label="Basic" />
          <MtRadioGroupCardItem id="pro" value="pro" label="Pro" error />
        </MtRadioGroupRoot>
      `,
    });

    // ASSERT
    expect(screen.getByRole("radio", { name: "Basic" })).toBeInvalid();
    expect(screen.getByRole("radio", { name: "Pro" })).toBeInvalid();

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Clear group error" }));

    // ASSERT
    expect(screen.getByRole("radio", { name: "Basic" })).toBeValid();
    expect(screen.getByRole("radio", { name: "Pro" })).toBeInvalid();
  });

  it("exposes the description separately from the label and includes additional guidance", () => {
    // ARRANGE
    render({
      components: { MtRadioGroupRoot, MtRadioGroupCardItem },
      template: `
        <p id="plan-hint">Billed monthly.</p>
        <MtRadioGroupRoot>
          <MtRadioGroupCardItem
            id="pro"
            value="pro"
            label="Pro"
            description="For growing businesses."
            aria-described-by="plan-hint"
          />
        </MtRadioGroupRoot>
      `,
    });

    // ASSERT
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveAccessibleDescription(
      "Billed monthly. For growing businesses.",
    );
  });

  it("supports additional guidance when there is no card description", () => {
    // ARRANGE
    render({
      components: { MtRadioGroupRoot, MtRadioGroupCardItem },
      template: `
        <p id="plan-hint">Billed monthly.</p>
        <MtRadioGroupRoot>
          <MtRadioGroupCardItem id="basic" value="basic" label="Basic" aria-described-by="plan-hint" />
          <MtRadioGroupCardItem id="pro" value="pro" label="Pro" />
        </MtRadioGroupRoot>
      `,
    });

    // ASSERT
    expect(screen.getByRole("radio", { name: "Basic" })).toHaveAccessibleDescription(
      "Billed monthly.",
    );
    expect(screen.getByRole("radio", { name: "Pro" })).not.toHaveAttribute("aria-describedby");
  });

  it("explains that cards need to be placed inside a radio group", () => {
    // ARRANGE
    const props = { id: "plan", value: "plan", label: "Plan" };

    // ACT & ASSERT
    expect(() => render(MtRadioGroupCardItem, { props })).toThrow(
      "MtRadioGroupCardItem must be used within MtRadioGroupRoot",
    );
  });
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

  it("displays a hint passed via the hint prop", async () => {
    // ARRANGE
    await render(MtRadioGroupRoot, {
      props: {
        hint: "Hint from prop",
      },
    });

    // ASSERT
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });

  it("renders markup passed via the hint slot", async () => {
    // ARRANGE
    await render(MtRadioGroupRoot, {
      slots: {
        hint: '<span data-testid="custom-hint">Hint from slot</span>',
      },
    });

    // ASSERT
    expect(screen.getByTestId("custom-hint")).toBeVisible();
    expect(screen.getByTestId("custom-hint")).toHaveTextContent("Hint from slot");
  });

  it("does not render a hint when neither prop nor slot is provided", async () => {
    // ARRANGE
    const { container } = await render(MtRadioGroupRoot);

    // ASSERT
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });
});
