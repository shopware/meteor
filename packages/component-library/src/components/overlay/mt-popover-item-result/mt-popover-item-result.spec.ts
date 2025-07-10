import { mount } from "@vue/test-utils";
import MtPopoverItemResult from "./mt-popover-item-result.vue";

function createWrapper({
  propsData = {},
}: {
  propsData?: Record<string, any>;
} = {}) {
  return mount(MtPopoverItemResult, {
    props: {
      groups: [
        {
          id: "visible",
          label: "Shown in table",
          actionLabel: "Hide all",
        },
        {
          id: "hidden",
          label: "Hidden in table",
          actionLabel: "Show all",
        },
      ],
      options: [
        {
          id: "name",
          label: "Name",
          position: 0,
          isVisible: true,
          parentGroup: "visible",
          isSortable: true,
          isHidable: false,
        },
        {
          id: "manufacturer",
          label: "Manufacturer",
          position: 1,
          isVisible: true,
          parentGroup: "visible",
          isSortable: true,
          isHidable: true,
        },
        {
          id: "active",
          label: "Active",
          position: 2,
          isVisible: true,
          parentGroup: "visible",
          isSortable: true,
          isHidable: true,
        },
        {
          id: "price",
          label: "Price",
          position: 3,
          isVisible: true,
          parentGroup: "visible",
          isSortable: true,
          isHidable: true,
        },
        {
          id: "stock",
          label: "Stock",
          position: 4,
          isVisible: false,
          parentGroup: "hidden",
          isSortable: true,
          isHidable: true,
        },
        {
          id: "available",
          label: "Available",
          position: 5,
          isVisible: false,
          parentGroup: "hidden",
          isSortable: true,
          isHidable: true,
        },
        {
          id: "release_date",
          label: "Release date",
          position: 6,
          isVisible: false,
          parentGroup: undefined,
          isSortable: true,
          isHidable: true,
        },
      ],
      ...propsData,
    },
    global: {
      mocks: {
        $t: (key: string) => key,
      },
    },
  });
}

describe("mt-popover-item-result", () => {
  it("should render the component", async () => {
    const wrapper = createWrapper();

    expect(wrapper.vm).toBeTruthy();
  });

  it("should render the search", async () => {
    const wrapper = createWrapper();

    expect(wrapper.find(".mt-search").exists()).toBeTruthy();
  });

  it("should not render the search", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      hideSearch: true,
    });

    expect(wrapper.find(".mt-search").exists()).toBeFalsy();
  });

  it("should render the groups", async () => {
    const wrapper = createWrapper();

    expect(wrapper.findAll(".mt-popover-item-result__group-header")).toHaveLength(2);
  });

  it("should render the group title", async () => {
    const wrapper = createWrapper();

    const groupHeaders = wrapper.findAll(".mt-popover-item-result__group-header");

    expect(groupHeaders.at(0)!.text()).toContain("Shown in table");
    expect(groupHeaders.at(1)!.text()).toContain("Hidden in table");
  });

  it("should render the group action labels", async () => {
    const wrapper = createWrapper();

    const groupHeaders = wrapper.findAll(".mt-popover-item-result__group-header");

    expect(groupHeaders.at(0)!.text()).toContain("Hide all");
    expect(groupHeaders.at(1)!.text()).toContain("Show all");
  });

  it("should emit 'click-group-action' when clicking on action label", async () => {
    const wrapper = createWrapper();

    const groupActions = wrapper.findAll(".mt-popover-item-result__group-action");

    /** When user clicks on "Hide all" action then the id of the group header should be emitted.
     * Here "visible", because the "visible" group header contains "Hide all" action label.
     */
    expect(groupActions.at(0)!.text()).toContain("Hide all");
    await groupActions.at(0)!.trigger("click");

    expect(wrapper.emitted("click-group-action")).toBeTruthy();
    expect(wrapper.emitted("click-group-action")![0]).toStrictEqual(["visible"]);

    /** When user clicks on "Show all" action then the id of the group header should be emitted.
     * Here "hidden", because the "hidden" group header contains "Show all" action label.
     */
    expect(groupActions.at(1)!.text()).toContain("Show all");
    await groupActions.at(1)!.trigger("click");

    expect(wrapper.emitted("click-group-action")![1]).toStrictEqual(["hidden"]);
  });

  it("should render the options for the groups", async () => {
    const wrapper = createWrapper();

    // shown in table options
    const shownInTableGroup = wrapper.findAll("[aria-label^='Shown in table:']");
    expect(shownInTableGroup).toHaveLength(4);

    // hidden in table options
    const hiddenInTableGroup = wrapper.findAll("[aria-label^='Hidden in table:']");
    expect(hiddenInTableGroup).toHaveLength(2);

    // no group options
    const noGroup = wrapper.findAll("[aria-label^='No group:']");
    expect(noGroup).toHaveLength(1);
  });

  it("should not be an draggable option if prop 'draggable' is set to false", async () => {
    const wrapper = createWrapper({
      propsData: {
        draggable: false,
      },
    });

    const allOptions = wrapper.findAll(".mt-popover-item-result__option");

    allOptions.forEach((option) => {
      // check if class is set correctly to popover-item
      expect(option.find(".mt-popover-item").classes()).not.toContain("is--draggable");

      // check if draggable icon was not rendered
      expect(option.find(".icon--solid-grip-vertical-s").exists()).toBeFalsy();

      // check if both drop zones are defined
      expect(option.find(".mt-popover-item-result__option_drop_before").exists()).toBeFalsy();
      expect(option.find(".mt-popover-item-result__option_drop_after").exists()).toBeFalsy();
    });
  });

  it("should be an draggable option if prop 'draggable' is set to true", async () => {
    const wrapper = createWrapper({
      propsData: {
        draggable: true,
      },
    });

    await wrapper.vm.$nextTick();

    const allOptions = wrapper.findAll(".mt-popover-item-result__option");

    allOptions.forEach((option) => {
      // check if class is set correctly to popover-item
      expect(option.find(".mt-popover-item").classes()).toContain("is--draggable");

      // check if draggable icon was rendered
      expect(option.find(".icon--solid-grip-vertical-s").exists()).toBeTruthy();

      // check if both drop zones are defined
      expect(option.find(".mt-popover-item-result__option_drop_before").exists()).toBeTruthy();
      expect(option.find(".mt-popover-item-result__option_drop_after").exists()).toBeTruthy();
    });
  });

  it("should be selectable options if prop selectable is true", async () => {
    const wrapper = createWrapper({
      propsData: {
        selectable: true,
      },
    });

    const allPopoverItems = wrapper.findAllComponents({ name: "MtPopoverItem" });

    allPopoverItems.forEach((popoverItem) => {
      expect(popoverItem.props("showCheckbox")).toBeTruthy();
      expect(popoverItem.props("checkboxPartial")).toBeFalsy();
      expect(popoverItem.props("checkboxChecked")).toBeFalsy();
    });
  });

  it("should not be selectable options if prop selectable is false", async () => {
    const wrapper = createWrapper({
      propsData: {
        selectable: false,
      },
    });

    const allPopoverItems = wrapper.findAllComponents({ name: "MtPopoverItem" });

    allPopoverItems.forEach((popoverItem) => {
      expect(popoverItem.props("showCheckbox")).toBeFalsy();
      expect(popoverItem.props("checkboxPartial")).toBeFalsy();
      expect(popoverItem.props("checkboxChecked")).toBeFalsy();
    });
  });

  it("should render hidable icon for options if prop hidable is true", async () => {
    const wrapper = createWrapper({
      propsData: {
        hidable: true,
      },
    });

    const allPopoverItems = wrapper.findAllComponents({ name: "MtPopoverItem" });

    allPopoverItems.forEach((popoverItem) => {
      if (popoverItem.props("label") === "Name") {
        return;
      }

      expect(popoverItem.props("showVisibility")).toBeTruthy();
    });
  });

  it("should not render hidable icon for options if prop hidable is false", async () => {
    const wrapper = createWrapper({
      propsData: {
        hidable: false,
      },
    });

    const allPopoverItems = wrapper.findAllComponents({ name: "MtPopoverItem" });

    allPopoverItems.forEach((popoverItem) => {
      expect(popoverItem.props("showVisibility")).toBeFalsy();
    });
  });

  it("should render correct props for popover-item", async () => {
    const wrapper = createWrapper({
      propsData: {
        hidable: true,
        selectable: true,
        draggable: true,
        options: [
          {
            id: "name",
            label: "My example label",
            position: 0,
            isVisible: true,
            isSelected: true,
            metaCopy: "My example meta copy",
            contextualDetail: "My example contextual detail",
            isSortable: true,
            isHidable: true,
          },
        ],
      },
    });

    let firstPopoverItem = wrapper.findComponent({ name: "MtPopoverItem" });

    expect(firstPopoverItem.props("showCheckbox")).toBeTruthy();
    expect(firstPopoverItem.props("checkboxPartial")).toBeFalsy();
    expect(firstPopoverItem.props("checkboxChecked")).toBeTruthy();

    expect(firstPopoverItem.props("showVisibility")).toBeTruthy();
    expect(firstPopoverItem.props("visible")).toBeTruthy();

    expect(firstPopoverItem.props("label")).toBe("My example label");
    expect(firstPopoverItem.props("metaCopy")).toBe("My example meta copy");
    expect(firstPopoverItem.props("contextualDetail")).toBe("My example contextual detail");

    await wrapper.setProps({
      options: [
        {
          id: "name",
          label: "My changed example label",
          position: 0,
          isVisible: false,
          isSelected: false,
          metaCopy: "My changed example meta copy",
          contextualDetail: "My changed example contextual detail",
          isSortable: false,
          isHidable: false,
        },
      ],
    });

    firstPopoverItem = wrapper.findComponent({ name: "MtPopoverItem" });

    expect(firstPopoverItem.props("showCheckbox")).toBeTruthy();
    expect(firstPopoverItem.props("checkboxPartial")).toBeFalsy();
    expect(firstPopoverItem.props("checkboxChecked")).toBeFalsy();

    expect(firstPopoverItem.props("showVisibility")).toBeFalsy();
    expect(firstPopoverItem.props("visible")).toBeFalsy();

    expect(firstPopoverItem.props("label")).toBe("My changed example label");
    expect(firstPopoverItem.props("metaCopy")).toBe("My changed example meta copy");
    expect(firstPopoverItem.props("contextualDetail")).toBe("My changed example contextual detail");
  });

  it("should add class to body while dragging", async () => {
    /**
     * Test internals because the event system in jest tests is not working
     */
    const wrapper = createWrapper({
      propsData: {
        draggable: true,
      },
    });

    // @ts-expect-error
    wrapper.vm.dragConfig.onDragStart();

    expect(document.body.classList.contains("is-popover-item-result-dragging")).toBeTruthy();

    // @ts-expect-error
    wrapper.vm.dragConfig.onDrop();

    expect(document.body.classList.contains("is-popover-item-result-dragging")).toBeFalsy();
  });

  it("should emit 'change-order' event when option is dragged", async () => {
    const wrapper = createWrapper({
      propsData: {
        draggable: true,
      },
    });

    const dragConfigData = {
      id: "active",
      label: "Active",
      position: 100,
      isVisible: true,
      parentGroup: "visible",
    };
    const dropConfigData = {
      id: "manufacturer",
      label: "Manufacturer",
      position: 400,
      isVisible: false,
      parentGroup: "hidden",
      dropZone: "after",
    };

    // simulate drag and drop

    // @ts-expect-error
    wrapper.vm.dragConfig.onDragStart();
    // @ts-expect-error
    wrapper.vm.dragConfig.onDrop(dragConfigData, dropConfigData);

    await wrapper.vm.$nextTick();

    // expect correct event to be emitted
    expect(wrapper.emitted("change-order")).toBeTruthy();
    expect(wrapper.emitted("change-order")?.[0]).toStrictEqual([
      {
        dropId: "manufacturer",
        dropZone: "after",
        itemId: "active",
      },
    ]);
  });
});
