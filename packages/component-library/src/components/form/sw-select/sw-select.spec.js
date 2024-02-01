import { mount } from "@vue/test-utils";
import SwSelect from "../sw-select/sw-select.vue";

async function createWrapper() {
  const wrapper = mount(SwSelect, {
    propsData: {
      value: 'becky',
      options: [
        {
          id: 1,
          label: 'Option Alfred',
          value: 'alfred',
        },
        {
          id: 2,
          label: 'Option Becky',
          value: 'becky',
        },
        {
          id: 3,
          label: 'Option C',
          value: 'c',
        },
      ]
    }
  })

  await wrapper.vm.$nextTick();

  return wrapper;
}

describe('sw-select', () => {
  it('should render the select component', async () => {
    const wrapper = await createWrapper();

    expect(wrapper.vm).toBeDefined();
  });

  it('should render only one single select result with type string', async () => {
    const wrapper = await createWrapper();

    const itemHolder = wrapper.findAll('.sw-select-selection-list__item-holder');

    expect(itemHolder.length).toEqual(1);
    expect(itemHolder.at(0).text()).toEqual('Option Becky');
  });

  it('should render only one single select result with type number', async () => {
    const wrapper = await createWrapper();
    await wrapper.setProps({
      value: 25,
      options: [
        { id: 5, label: '5', value: 5 },
        { id: 10, label: '10', value: 10 },
        { id: 25, label: '25', value: 25 },
        { id: 50, label: '50', value: 50 }
      ]
    })

    const itemHolder = wrapper.findAll('.sw-select-selection-list__item-holder');

    expect(itemHolder.length).toEqual(1);
    expect(itemHolder.at(0).text()).toEqual('25');
  });
});