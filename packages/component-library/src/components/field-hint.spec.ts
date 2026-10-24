import { render, screen } from "@testing-library/vue";
import { defineComponent } from "vue";
import MtTextField from "./mt-text-field/mt-text-field.vue";
import MtNumberField from "./mt-number-field/mt-number-field.vue";
import MtPasswordField from "./mt-password-field/mt-password-field.vue";
import MtTextarea from "./mt-textarea/mt-textarea.vue";
import MtEmailField from "./mt-email-field/mt-email-field.vue";
import MtUrlField from "./mt-url-field/mt-url-field.vue";
import MtColorpicker from "./mt-colorpicker/mt-colorpicker.vue";
import MtSlider from "./mt-slider/mt-slider.vue";
import MtSelect from "./mt-select/mt-select.vue";
import MtDatepicker from "./mt-datepicker/mt-datepicker.vue";
import MtRadioGroup from "./mt-radio-group/mt-radio-group-root.vue";

describe.each([
  ["mt-text-field", MtTextField, {}],
  ["mt-number-field", MtNumberField, {}],
  ["mt-password-field", MtPasswordField, {}],
  ["mt-textarea", MtTextarea, {}],
  ["mt-email-field", MtEmailField, {}],
  ["mt-url-field", MtUrlField, {}],
  ["mt-colorpicker", MtColorpicker, {}],
  ["mt-slider", MtSlider, { modelValue: 0, hasFocus: false, label: "Slider" }],
  ["mt-select", MtSelect, { options: [] }],
  ["mt-datepicker", MtDatepicker, { dateType: "date" }],
  ["mt-radio-group", MtRadioGroup, {}],
] as const)("%s conditional hint", (_name, component, fieldProps) => {
  const Host = defineComponent({
    components: { Field: component },
    props: {
      showHint: { type: Boolean, default: false },
      hint: { type: String, default: null },
    },
    setup: () => ({ fieldProps }),
    template: `
      <Field v-bind="fieldProps" :hint="hint">
        <template v-if="showHint" #hint>
          <span data-testid="custom-hint">Original value</span>
        </template>
      </Field>
    `,
  });

  it("renders a hint slot added after mounting and removes it again", async () => {
    const { container, rerender } = render(Host);

    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();

    await rerender({ showHint: true });
    expect(screen.getByTestId("custom-hint")).toBeVisible();

    await rerender({ showHint: false });
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("removes a hint slot that was present when mounting", async () => {
    const { container, rerender } = render(Host, { props: { showHint: true } });

    expect(screen.getByTestId("custom-hint")).toBeVisible();

    await rerender({ showHint: false });
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("falls back to the hint prop when the slot is removed", async () => {
    const { rerender } = render(Host, { props: { hint: "Hint from prop" } });

    expect(screen.getByText("Hint from prop")).toBeVisible();

    await rerender({ showHint: true });
    expect(screen.getByTestId("custom-hint")).toBeVisible();
    expect(screen.queryByText("Hint from prop")).not.toBeInTheDocument();

    await rerender({ showHint: false });
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });
});
