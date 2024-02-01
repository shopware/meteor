import { mount } from "@vue/test-utils";
import SwDataTableSettings from "./sw-data-table-settings.vue";

// mock resizeOvserver
global.ResizeObserver = class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
};

async function createWrapper({ disableInitialOpen = false } = {}) {
  const wrapper = mount(SwDataTableSettings, {
    propsData: {
      columns: [
        { label: "Name", property: "name", renderer: "text", position: 0, cellWrap: "normal" },
        {
          label: "Manufacturer",
          property: "manufacturer.name",
          renderer: "text",
          position: 100,
          cellWrap: "normal",
        },
        {
          label: "Active",
          property: "active",
          renderer: "checkmark",
          position: 200,
          width: 120,
          allowResize: false,
        },
        {
          label: "Price",
          property: "price",
          renderer: "price",
          position: 300,
          cellWrap: "nowrap",
          width: 150,
        },
        { label: "Stock", property: "stock", renderer: "number", position: 400, visible: false },
        { label: "Available", property: "available", renderer: "number", position: 500 },
      ],
    },
    mocks: {
      $t: (value: string) => value,
    },
  });

  if (!disableInitialOpen) {
    // open the floating UI
    await wrapper.find(".sw-button").trigger("click");
  }

  return wrapper;
}

describe("sw-data-table-settings", () => {
  let wrapper: any;

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
    }
  });

  it("should render the component", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.vm).toBeTruthy();
  });

  it("should render the base view by default", async () => {
    const wrapper = await createWrapper();

    const popoverContent = wrapper.find('.sw-popover__content');

    expect(popoverContent.exists()).toBeTruthy();
    expect(popoverContent.find('.sw-popover__header').text()).toBe('sw-data-table-settings.title');

    const popoverItems = popoverContent.findAll('.sw-popover-item');

    expect(popoverItems.length).toBe(6);

    // The "Columns" popover item should have the correct label and should render the number of columns
    expect(popoverItems.at(0).text()).toContain('sw-data-table-settings.columnOrder.title');
    expect(popoverItems.at(0).text()).toContain('6');

    // The popover items should have the correct label
    expect(popoverItems.at(1).text()).toContain('sw-data-table-settings.showNumberedColumn');
    expect(popoverItems.at(2).text()).toContain('sw-data-table-settings.showStripedRows');
    expect(popoverItems.at(3).text()).toContain('sw-data-table-settings.showOutlines');
    expect(popoverItems.at(4).text()).toContain('sw-data-table-settings.frameOutlines');
    expect(popoverItems.at(4).text()).toContain('sw-data-table-settings.frameOutlinesMetaCopy');
    expect(popoverItems.at(5).text()).toContain('sw-data-table-settings.resetAllChanges');
  });

  it("should switch to columns view", async () => {
    const wrapper = await createWrapper();

    let popoverContent = wrapper.find('.sw-popover__content');

    // Click on "Columns" label to switch to the columns view
    const columnsPopoverItemLabel = popoverContent.findAll('.sw-popover-item__label').at(0);
    expect(columnsPopoverItemLabel.text()).toContain('sw-data-table-settings.columnOrder.title');
    await columnsPopoverItemLabel.trigger('click');

    // Check if the columns view header title is rendered
    popoverContent = wrapper.find('.sw-popover__content');
    expect(popoverContent.find('.sw-popover__header').text()).toBe('sw-data-table-settings.columnOrder.title');

    // Check if every column is rendered correctly
    const columns = wrapper.findAll('.sw-popover-item-result__option_item');
    expect(columns.length).toBe(6);

    expect(columns.at(0).text()).toContain('Name');
    expect(columns.at(1).text()).toContain('Manufacturer');
    expect(columns.at(2).text()).toContain('Active');
    expect(columns.at(3).text()).toContain('Price');
    expect(columns.at(4).text()).toContain('Available');
    expect(columns.at(5).text()).toContain('Stock');
  });

  it("should emit the correct events when the columns are changed", async () => {
    const wrapper = await createWrapper();

    // Click on "Columns" label to switch to the columns view
    const columnsPopoverItemLabel = wrapper.find('.sw-popover__content').findAll('.sw-popover-item__label').at(0);
    await columnsPopoverItemLabel.trigger('click');

    // Trigger a column change from sw-popover-item-result
    const SwPopoverItemResult = wrapper.findComponent({ name: 'SwPopoverItemResult' });
    await SwPopoverItemResult.vm.$emit('change-order', {
      itemId: 'price',
      dropZone: 'before',
      dropId: 'manufacturer.name',
    });

    await wrapper.vm.$nextTick();

    // Check if the change-column-order event was emitted correctly
    expect(wrapper.emitted()['change-column-order']).toBeTruthy();
    expect(wrapper.emitted()['change-column-order']![0]).toEqual([{
      itemId: 'price',
      dropZone: 'before',
      dropId: 'manufacturer.name',
    }]);

    // Check if the change-column-visibility was emitted correctly
    expect(wrapper.emitted()['change-column-visibility']).toBeTruthy();
    expect(wrapper.emitted()['change-column-visibility']![0]).toEqual(['price', true]);
  });

  it("should emit the correct events when the columns are changed with visibility to false", async () => {
    const wrapper = await createWrapper();

    // Click on "Columns" label to switch to the columns view
    const columnsPopoverItemLabel = wrapper.find('.sw-popover__content').findAll('.sw-popover-item__label').at(0);
    await columnsPopoverItemLabel.trigger('click');

    // Trigger a column change from sw-popover-item-result
    const SwPopoverItemResult = wrapper.findComponent({ name: 'SwPopoverItemResult' });
    await SwPopoverItemResult.vm.$emit('change-order', {
      itemId: 'active',
      dropZone: 'before',
      dropId: 'stock',
    });

    await wrapper.vm.$nextTick();

    // Check if the change-column-order event was emitted correctly
    expect(wrapper.emitted()['change-column-order']).toBeTruthy();
    expect(wrapper.emitted()['change-column-order']![0]).toEqual([{
      itemId: 'active',
      dropZone: 'before',
      dropId: 'stock',
    }]);

    // Check if the change-column-visibility was emitted correctly
    expect(wrapper.emitted()['change-column-visibility']).toBeTruthy();
    expect(wrapper.emitted()['change-column-visibility']![0]).toEqual(['active', false]);
  });

  it("should change the visibility of all non-pinned column items to false when click on group header of visibility", async () => {
    const wrapper = await createWrapper();

    // Click on "Columns" label to switch to the columns view
    const columnsPopoverItemLabel = wrapper.find('.sw-popover__content').findAll('.sw-popover-item__label').at(0);
    await columnsPopoverItemLabel.trigger('click');

    // Trigger a group change from sw-popover-item-result
    const visibleGroupHeader = wrapper.findAll('.sw-popover-item-result__group-action').at(0);
    expect(visibleGroupHeader.text()).toContain('sw-data-table-settings.columnOrder.columnGroups.actionLabelShown');
    await visibleGroupHeader.trigger('click');

    await wrapper.vm.$nextTick();

    // Check if the change-column-visibility was emitted correctly to false for all columns
    expect(wrapper.emitted()['change-column-visibility']).toBeTruthy();
    expect(wrapper.emitted()['change-column-visibility']!.length).toBe(5);
    wrapper.emitted()['change-column-visibility']!.forEach(emit => {
      expect(emit[1]).toBe(false);
    })
  });

  it("should change the visibility of all non-pinned column items to true when click on group header of hidden", async () => {
    const wrapper = await createWrapper();

    // Click on "Columns" label to switch to the columns view
    const columnsPopoverItemLabel = wrapper.find('.sw-popover__content').findAll('.sw-popover-item__label').at(0);
    await columnsPopoverItemLabel.trigger('click');

    // Trigger a group change from sw-popover-item-result
    const visibleGroupHeader = wrapper.findAll('.sw-popover-item-result__group-action').at(1);
    expect(visibleGroupHeader.text()).toContain('sw-data-table-settings.columnOrder.columnGroups.actionLabelHidden');
    await visibleGroupHeader.trigger('click');

    await wrapper.vm.$nextTick();

    // Check if the change-column-visibility was emitted correctly to false for all columns
    expect(wrapper.emitted()['change-column-visibility']).toBeTruthy();
    expect(wrapper.emitted()['change-column-visibility']!.length).toBe(5);
    wrapper.emitted()['change-column-visibility']!.forEach(emit => {
      expect(emit[1]).toBe(true);
    })
  });

  it("should emit reset-all-changes event", async () => {
    const wrapper = await createWrapper();

    // Click on "Reset" button to reset all changes
    const resetButton = wrapper.findAll('.sw-popover-item__label').at(5);
    expect(resetButton.text()).toContain('sw-data-table-settings.resetAllChanges');
    await resetButton.trigger('click');

    // Check if the reset-all-changes event was emitted
    expect(wrapper.emitted('reset-all-changes')).toBeTruthy();
  })
});
