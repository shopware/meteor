import { mount } from "@vue/test-utils";
import SwPopover from "./sw-popover.vue";

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

async function createWrapper({ scopedSlots, disableInitialOpen }: {
  disableInitialOpen?: boolean;
  scopedSlots?: any;
} = {
  scopedSlots: {},
  disableInitialOpen: false
 }) {
  const wrapper = mount(SwPopover, {
    scopedSlots: {
      'popover-items__base': `
          <div class="base-view">
            <span>Base view content</span>
            <span id="goToExampleView" @click="props.changeView('example')">Go to example view</span>
            <span id="goToExampleWithAnotherChildView" @click="props.changeView('example_with_another_child')">Go to example with another child view</span>
          </div>
      `,
      'popover-items__example': `
          <div class="example-view">
            <span>Example view content</span>
            <span id="goToBaseView" @click="props.changeView('base')">Go to base view</span>
          </div>
      `,
      'popover-items__example_with_another_child': `
          <div class="example_with_another_child-view">
            <span>Example with another child view content</span>
            <span id="goToThirdLevelView" @click="props.changeView('example_third_level')">Go to third level view</span>
          </div>
      `,
      'popover-items__example_third_level': `
          <div class="example_third_level-view">
            <span>Example with third level view content</span>
            <span id="toToExampleWithAnotherChild" @click="props.changeView('example_with_another_child')">Go to example with another child view</span>
          </div>
      `,
      trigger: `
        <span
          class="trigger-slot"
          @click="props.toggleFloatingUi"
        >
          Trigger slot content
        </span>`,
      ...scopedSlots
    },
    propsData: {
      title: 'My default popover title',
      childViews: [
        { name: 'example', title: 'Example view title' },
        { name: 'example_with_another_child', title: 'Example view with another child title', childViews: [
          { name: 'example_third_level', title: 'Example third level view title' }
        ] },
      ]
    },
    mocks: {}
  });
  
  if (!disableInitialOpen) {
    // open the floating UI
    await wrapper.find('.trigger-slot').trigger('click');
  }

  return wrapper;
}

describe("sw-popover-item", () => {
  it("should render the component", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.vm).toBeTruthy();
  });

  it("should render the trigger slot content", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.find('.trigger-slot').exists()).toBeTruthy();
    expect(wrapper.find('.trigger-slot').text()).toBe('Trigger slot content');
  })

  it("should not render the trigger slot content when float is disabled", async () => {
    const wrapper = await createWrapper({
      disableInitialOpen: true
    });

    await wrapper.setProps({
      disableFloat: true,
    })

    expect(wrapper.find('.trigger-slot').exists()).toBeFalsy();
  })

  it("should render the popover directly when disable float", async () => {
    const wrapper = await createWrapper({
      scopedSlots: {},
      disableInitialOpen: true
    });

    await wrapper.setProps({
      disableFloat: true,
    })

    expect(wrapper.find('.sw-popover__content').exists()).toBeTruthy();
    expect(wrapper.find('.sw-popover__content').text()).toContain('Base view content')
  });

  it("should open the floating UI with trigger click", async () => {
    const wrapper = await createWrapper({
      scopedSlots: {},
      disableInitialOpen: true
    });

    expect(wrapper.find('.sw-popover__content').exists()).toBeFalsy();

    await wrapper.find('.trigger-slot').trigger('click');

    expect(wrapper.find('.sw-popover__content').exists()).toBeTruthy();
  });

  it("should close the floating UI with trigger click", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.find('.sw-popover__content').exists()).toBeTruthy();

    await wrapper.find('.trigger-slot').trigger('click');

    expect(wrapper.find('.sw-popover__content').exists()).toBeFalsy();
  });

  it("should close the floating UI emit close event", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.find('.sw-popover__content').exists()).toBeTruthy();

    const swFloatingUi = wrapper.findComponent({ name: 'SwFloatingUi' });

    // @ts-expect-error - onClickOutside exists on SwFloatingUi
    swFloatingUi.vm.onClickOutside(new MouseEvent('click'));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.sw-popover__content').exists()).toBeFalsy();
  });

  it("should render the title", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.find('h3').exists()).toBeTruthy();
    expect(wrapper.find('h3').text()).toBe('My default popover title');
  })

  it("should use changeView to switch to example view", async () => {
    const wrapper = await createWrapper();
    // check content rendering on base view
    expect(wrapper.find('.sw-popover__content').text()).toContain('Base view content');

    // go to example view
    await wrapper.find('#goToExampleView').trigger('click');

    // check content rendering on example view
    expect(wrapper.find('.sw-popover__content').text()).toContain('Example view content');
  })

  it("should use changeView to switch back to base view", async () => {
    const wrapper = await createWrapper();
    // check content rendering on base view
    expect(wrapper.find('.sw-popover__content').text()).toContain('Base view content');

    // go to example view
    await wrapper.find('#goToExampleView').trigger('click');

    // check content rendering on example view
    expect(wrapper.find('.sw-popover__content').text()).toContain('Example view content');

    // go to example view
    await wrapper.find('#goToBaseView').trigger('click');

    // check content rendering on base view
    expect(wrapper.find('.sw-popover__content').text()).toContain('Base view content');
  })

  it("should not render back button base view", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.find('.sw-popover__back-button').exists()).toBeFalsy();
  });

  it("should render back button on example view", async () => {
    const wrapper = await createWrapper();

    // go to example view
    await wrapper.find('#goToExampleView').trigger('click');

    expect(wrapper.find('.sw-popover__back-button').exists()).toBeTruthy();
  });

  it("should use back button to switch back to base view", async () => {
    const wrapper = await createWrapper();
    // check content rendering on base view
    expect(wrapper.find('.sw-popover__content').text()).toContain('Base view content');

    // go to example view
    await wrapper.find('#goToExampleView').trigger('click');

    // check content rendering on example view
    expect(wrapper.find('.sw-popover__content').text()).toContain('Example view content');

    // go to example view
    await wrapper.find('.sw-popover__back-button').trigger('click');

    // check content rendering on base view
    expect(wrapper.find('.sw-popover__content').text()).toContain('Base view content');
  });

  it("should render the title and content of base view", async () => {
    const wrapper = await createWrapper();

    // check title rendering on base view
    expect(wrapper.find('.sw-popover__content').text()).toContain('My default popover title');
    expect(wrapper.find('.sw-popover__content').text()).not.toContain('Example view title');

    // check content rendering on base view
    expect(wrapper.find('.sw-popover__content').text()).toContain('Base view content');
    expect(wrapper.find('.sw-popover__content').text()).not.toContain('Example view content');
  })

  it("should render the title and content of example view", async () => {
    const wrapper = await createWrapper();

    // go to example view
    await wrapper.find('#goToExampleView').trigger('click');

    // check title rendering on example view
    expect(wrapper.find('.sw-popover__content').text()).not.toContain('My default popover title');
    expect(wrapper.find('.sw-popover__content').text()).toContain('Example view title');

    // check content rendering on example view
    expect(wrapper.find('.sw-popover__content').text()).not.toContain('Base view content');
    expect(wrapper.find('.sw-popover__content').text()).toContain('Example view content');
  })

  it("should render the title and content of third level view", async () => {
    const wrapper = await createWrapper();

    // go to example with another child view
    await wrapper.find('#goToExampleWithAnotherChildView').trigger('click');

    // go to third level view
    await wrapper.find('#goToThirdLevelView').trigger('click');

    // check title rendering on third level view
    expect(wrapper.find('.sw-popover__content').text()).not.toContain('My default popover title');
    expect(wrapper.find('.sw-popover__content').text()).not.toContain('Example view title');
    expect(wrapper.find('.sw-popover__content').text()).toContain('Example third level view title');

    // check content rendering on third level view
    expect(wrapper.find('.sw-popover__content').text()).not.toContain('Base view content');
    expect(wrapper.find('.sw-popover__content').text()).not.toContain('Example view content');
    expect(wrapper.find('.sw-popover__content').text()).toContain('Example with third level view content');
  })

  it("should go back from third level view to base view with back button", async () => {
    const wrapper = await createWrapper();

    // go to example with another child view
    await wrapper.find('#goToExampleWithAnotherChildView').trigger('click');

    // go to third level view
    await wrapper.find('#goToThirdLevelView').trigger('click');

    // go back to base view with clicking back button twice
    await wrapper.find('.sw-popover__back-button').trigger('click');
    await wrapper.find('.sw-popover__back-button').trigger('click');

    // check title rendering on base view
    expect(wrapper.find('.sw-popover__content').text()).toContain('My default popover title');

    // check content rendering on base view
    expect(wrapper.find('.sw-popover__content').text()).toContain('Base view content');
  })  
});