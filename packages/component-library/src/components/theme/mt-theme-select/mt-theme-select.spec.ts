import { mount } from "@vue/test-utils";
import MtThemeSelect from "./mt-theme-select.vue";
import MtSelect from "../../form/mt-select/mt-select.vue";

vi.mock("@/utils/debounce", () => ({
  debounce: (fn: (...args: unknown[]) => void) => fn,
}));

function createWrapper(props: Record<string, unknown> = {}) {
  return mount(MtThemeSelect, {
    props: { modelValue: "system", ...props },
  });
}

describe("mt-theme-select", () => {
  it("renders the selected scheme's label", () => {
    const wrapper = createWrapper({ modelValue: "dark" });

    const input = wrapper.find(".mt-select-selection-list__input").element as HTMLInputElement;
    expect(input.value).toBe("Dark");
  });

  it("passes the three theme options to mt-select", () => {
    const wrapper = createWrapper();

    const options = wrapper.getComponent(MtSelect).props("options") as {
      value: string;
      label: string;
    }[];

    expect(options.map((option) => option.value)).toEqual(["light", "dark", "system"]);
    expect(options.map((option) => option.label)).toEqual(["Light", "Dark", "System"]);
  });

  it("re-emits the scheme chosen in the select", async () => {
    const wrapper = createWrapper({ modelValue: "system" });

    await wrapper.getComponent(MtSelect).vm.$emit("update:modelValue", "light");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["light"]);
  });

  it("forwards the disabled state to the select", () => {
    const wrapper = createWrapper({ disabled: true });

    expect(wrapper.getComponent(MtSelect).props("disabled")).toBe(true);
  });

  it("uses the provided field label", () => {
    const wrapper = createWrapper({ label: "Appearance" });

    expect(wrapper.getComponent(MtSelect).props("label")).toBe("Appearance");
  });
});
