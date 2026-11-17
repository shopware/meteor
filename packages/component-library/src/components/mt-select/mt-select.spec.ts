import { render, screen } from "@testing-library/vue";
import { defineComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import MtSelect from "./mt-select.vue";

async function createWrapper({ props = {}, slots = {}, attrs = {} } = {}) {
  const wrapper = mount(MtSelect, {
    props: {
      modelValue: "becky",
      options: [
        {
          id: 1,
          label: "Option Alfred",
          value: "alfred",
        },
        {
          id: 2,
          label: "Option Becky",
          value: "becky",
        },
        {
          id: 3,
          label: "Option C",
          value: "c",
        },
      ],
      ...props,
    },
    slots,
    attrs,
  });

  await wrapper.vm.$nextTick();

  return wrapper;
}

// mock debounce from '@/utils/debounce'
vi.mock("@/utils/debounce", () => ({
  debounce: (fn: (...args: any[]) => void) => fn,
}));

describe("mt-select", () => {
  describe("keyboard", () => {
    let wrapper: ReturnType<typeof mount>;

    async function createFocusedSelect(props = {}) {
      wrapper = mount(MtSelect, {
        props: {
          label: "Select",
          options: [
            { id: 1, label: "Option Alfred", value: "alfred" },
            { id: 2, label: "Option Becky", value: "becky" },
          ],
          ...props,
        },
        attachTo: document.body,
      });

      const selection = wrapper.find<HTMLElement>(".mt-select__selection").element;
      selection.focus();
      await flushPromises();

      return selection;
    }

    function dispatchKey(type: "keydown" | "keypress", element: Element, init: KeyboardEventInit) {
      const event = new KeyboardEvent(type, { bubbles: true, cancelable: true, ...init });
      element.dispatchEvent(event);

      return event;
    }

    const isExpanded = () => wrapper.find(".mt-select-result-list").exists();

    afterEach(() => {
      wrapper.unmount();
      document.body.innerHTML = "";
    });

    it("shows the focus without expanding when the select gets focus", async () => {
      await createFocusedSelect();

      expect(isExpanded()).toBe(false);
      expect(wrapper.find(".mt-field").classes()).toContain("has--focus");
    });

    it.each(["ArrowDown", "ArrowUp", "Enter", " "])(
      'expands on "%s" without scrolling the page',
      async (key) => {
        const selection = await createFocusedSelect();

        const event = dispatchKey("keydown", selection, { key });
        await flushPromises();

        expect(isExpanded()).toBe(true);
        expect(event.defaultPrevented).toBe(true);
      },
    );

    it.each([
      ["a plain character", { key: "a" }],
      ["an AltGr character", { key: "@", ctrlKey: true, altKey: true }],
      ["an Option character", { key: "@", altKey: true }],
    ])("expands on %s and lets it reach the search", async (_, init) => {
      const selection = await createFocusedSelect();

      const event = dispatchKey("keypress", selection, init);
      await flushPromises();

      expect(isExpanded()).toBe(true);
      expect(event.defaultPrevented).toBe(false);
    });

    it("does not expand on a shortcut", async () => {
      const selection = await createFocusedSelect();

      dispatchKey("keydown", selection, { key: "ArrowDown", metaKey: true });
      await flushPromises();

      expect(isExpanded()).toBe(false);
    });

    it.each([
      ["keydown", "Enter"],
      ["keydown", " "],
      ["keypress", " "],
    ] as const)('leaves a %s of "%s" on the clear button to that button', async (type, key) => {
      await createFocusedSelect({ modelValue: "alfred" });
      const clearButton = wrapper.find<HTMLElement>("[data-clearable-button]").element;
      clearButton.focus();

      const event = dispatchKey(type, clearButton, { key });
      await flushPromises();

      expect(isExpanded()).toBe(false);
      expect(event.defaultPrevented).toBe(false);
    });

    it("keeps the focus on the select when ESC collapses it", async () => {
      const selection = await createFocusedSelect();
      dispatchKey("keydown", selection, { key: "ArrowDown" });
      await flushPromises();
      const searchInput = wrapper.find(".mt-select-selection-list__input").element;
      expect(document.activeElement).toBe(searchInput);

      dispatchKey("keydown", searchInput, { key: "Escape" });
      await flushPromises();

      expect(isExpanded()).toBe(false);
      expect(document.activeElement).toBe(selection);
    });

    it("leaves SHIFT+TAB to the browser, starting from the select", async () => {
      const selection = await createFocusedSelect();
      dispatchKey("keydown", selection, { key: "ArrowDown" });
      await flushPromises();
      const searchInput = wrapper.find(".mt-select-selection-list__input").element;

      const event = dispatchKey("keydown", searchInput, { key: "Tab", shiftKey: true });
      await flushPromises();

      expect(isExpanded()).toBe(false);
      expect(event.defaultPrevented).toBe(false);
      expect(document.activeElement).toBe(selection);
    });

    it("takes the focus back to the select after picking a single value with the mouse", async () => {
      const selection = await createFocusedSelect();
      dispatchKey("keydown", selection, { key: "ArrowDown" });
      await flushPromises();

      const result = document.querySelectorAll<HTMLElement>(".mt-select-result")[1];
      // A mouse pick moves the focus out of the select before the click lands
      (document.activeElement as HTMLElement).blur();
      result.click();
      await flushPromises();

      expect(wrapper.emitted("update:modelValue")).toEqual([["becky"]]);
      expect(isExpanded()).toBe(false);
      expect(document.activeElement).toBe(selection);
    });
  });

  it("should render the select component", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.vm).toBeDefined();
  });

  it("should render only one single select result with type string", async () => {
    const wrapper = await createWrapper();

    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");

    expect(itemHolder).toHaveLength(1);
    expect((itemHolder.at(0)?.element as HTMLInputElement).value).toBe("Option Becky");
  });

  it("should render only one single select result with type number", async () => {
    const wrapper = await createWrapper();
    await wrapper.setProps({
      modelValue: 25,
      options: [
        { id: 5, label: "5", value: 5 },
        { id: 10, label: "10", value: 10 },
        { id: 25, label: "25", value: 25 },
        { id: 50, label: "50", value: 50 },
      ],
    });

    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");

    expect(itemHolder).toHaveLength(1);
    expect((itemHolder.at(0)?.element as HTMLInputElement).value).toBe("25");
  });

  it("should render a label for option with id 0", async () => {
    const wrapper = await createWrapper();
    await wrapper.setProps({
      modelValue: 0,
      options: [
        { id: 0, label: "Id 0", value: 0 },
        { id: 10, label: "Id 10", value: 10 },
      ],
    });

    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");

    expect(itemHolder).toHaveLength(1);
    expect((itemHolder.at(0)?.element as HTMLInputElement).value).toBe("Id 0");
  });

  it("should select an object value by id", async () => {
    const wrapper = await createWrapper();
    await wrapper.setProps({
      modelValue: { id: 2, label: "Option Becky", value: "becky" },
      options: [
        { id: 1, label: "Option Alfred", value: "alfred" },
        { id: 2, label: "Option Becky", value: "becky" },
        { id: 3, label: "Option C", value: "c" },
      ],
    });

    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");

    expect(itemHolder).toHaveLength(1);
    expect((itemHolder.at(0)?.element as HTMLInputElement).value).toBe("Option Becky");
  });

  it("should select an object value by value property prop", async () => {
    const wrapper = await createWrapper();
    await wrapper.setProps({
      modelValue: { id: 2, label: "Option Becky", value: "becky" },
      valueProperty: "label",
      options: [
        { id: 1, label: "Option Alfred", value: "alfred" },
        { id: 2, label: "Option Becky", value: "becky" },
        { id: 3, label: "Option C", value: "c" },
      ],
    });

    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");

    expect(itemHolder).toHaveLength(1);
    expect((itemHolder.at(0)?.element as HTMLInputElement).value).toBe("Option Becky");
  });

  it("should use fallback property from an array of label properties", async () => {
    const wrapper = await createWrapper();
    await wrapper.setProps({
      modelValue: "user1",
      labelProperty: ["name", "username", "email"],
      options: [
        { id: 1, username: "User 1", email: "user1@example.com", value: "user1" },
        { id: 2, name: "User Two", username: "user2", value: "user2" },
        { id: 3, name: "", username: "", email: "user3@example.com", value: "user3" },
      ],
    });
    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");

    expect(itemHolder).toHaveLength(1);
    expect((itemHolder.at(0)?.element as HTMLInputElement).value).toBe("User 1");
  });

  it("should search in all properties of the labelProperty array", async () => {
    vi.useFakeTimers();
    const wrapper = await createWrapper();
    await wrapper.setProps({
      labelProperty: ["name", "username", "email"],
      options: [
        { id: 1, username: "user1", email: "user1@example.com", value: "user1" },
        { id: 2, name: "User Two", username: "user2", value: "user2" },
        { id: 3, name: "", username: "", email: "test@example.com", value: "user3" },
      ],
    });

    // Simulate a search
    wrapper.vm.onSearchTermChange("test");
    await flushPromises();

    // Check that the search found the item with 'test' in the email field
    expect(wrapper.vm.visibleResults.length).toBe(1);
    expect(wrapper.vm.visibleResults[0].value).toBe("user3");
  });

  it("displays a hint passed via the hint prop", async () => {
    const wrapper = await createWrapper({ props: { hint: "Hint from prop" } });

    expect(wrapper.find(".mt-field-hint").text()).toContain("Hint from prop");
  });

  it("renders markup passed via the hint slot", async () => {
    const wrapper = await createWrapper({
      slots: { hint: '<span data-testid="custom-hint">Hint from slot</span>' },
    });

    expect(wrapper.find('[data-testid="custom-hint"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="custom-hint"]').text()).toBe("Hint from slot");
  });

  it("does not render a hint when neither prop nor slot is provided", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.find(".mt-field-hint").exists()).toBe(false);
  });

  it("should select the active item with the enter key", async () => {
    const wrapper = mount(MtSelect, {
      props: {
        modelValue: null,
        options: [
          { id: 1, label: "Option Alfred", value: "alfred" },
          { id: 2, label: "Option Becky", value: "becky" },
        ],
      },
      attachTo: document.body,
    });
    await flushPromises();

    await wrapper.find(".mt-select__selection").trigger("click");
    await flushPromises();

    const input = wrapper.find(".mt-select-selection-list__input");
    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "Enter" });
    await flushPromises();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["becky"]);
    expect(document.querySelector(".mt-select-result-list__content")).toBeNull();

    wrapper.unmount();
  });

  it("should show the selected value as input value on focus and only filter after the user edits it", async () => {
    const wrapper = await createWrapper();
    const input = wrapper.find(".mt-select-selection-list__input");

    await input.trigger("focus");

    expect((input.element as HTMLInputElement).value).toBe("Option Becky");
    expect((input.element as HTMLInputElement).placeholder).not.toBe("Option Becky");
    expect(wrapper.vm.visibleResults).toHaveLength(3);

    await input.setValue("Option Beck");
    await flushPromises();

    expect((input.element as HTMLInputElement).value).toBe("Option Beck");
    expect(wrapper.vm.visibleResults).toHaveLength(1);
    expect(wrapper.vm.visibleResults[0].value).toBe("becky");

    wrapper.vm.onSelectCollapsed();
    await flushPromises();
    await input.trigger("focus");

    expect((input.element as HTMLInputElement).value).toBe("Option Becky");
    expect(wrapper.vm.visibleResults).toHaveLength(3);
  });

  it("should render a searchable input that opts out of autofill", async () => {
    const wrapper = await createWrapper();

    const input = wrapper.find(".mt-select-selection-list__input");

    expect(input.attributes("autocomplete")).toBe("off");
    expect(input.attributes("data-1p-ignore")).toBeDefined();
    expect(input.attributes("data-lpignore")).toBe("true");
    expect(input.attributes("data-bwignore")).toBeDefined();
    expect(input.attributes("readonly")).toBeUndefined();
  });

  it("should render a readonly input when search is disabled", async () => {
    const wrapper = await createWrapper({
      props: {
        enableSearch: false,
      },
    });

    const input = wrapper.find(".mt-select-selection-list__input");

    expect(input.attributes("readonly")).toBeDefined();
  });

  it("associates the label with the input via the name attribute", async () => {
    const wrapper = await createWrapper({
      props: { label: "Date range" },
      attrs: { name: "date-range" },
    });

    const label = wrapper.find(".mt-field__label label");
    const input = wrapper.find(".mt-select-selection-list__input");

    expect(label.attributes("for")).toBe("date-range");
    expect(input.attributes("id")).toBe("date-range");
  });

  it("associates the label with the input via a generated id when no name is given", async () => {
    const wrapper = await createWrapper({ props: { label: "Date range" } });

    const label = wrapper.find(".mt-field__label label");
    const input = wrapper.find(".mt-select-selection-list__input");

    expect(label.attributes("for")).toMatch(/^mt-field--/);
    expect(input.attributes("id")).toBe(label.attributes("for"));
  });
});

describe("mt-select conditional hint", () => {
  const Host = defineComponent({
    components: { Field: MtSelect },
    props: {
      showHint: { type: Boolean, default: false },
      hint: { type: String, default: null },
    },
    setup: () => ({ fieldProps: { options: [] } }),
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
