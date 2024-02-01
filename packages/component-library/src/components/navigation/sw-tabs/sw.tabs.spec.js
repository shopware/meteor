import { mount } from '@vue/test-utils';
import SwTabs from './sw-tabs.vue';

async function createWrapper(customOptions, props) {
    return mount(SwTabs, {
        propsData: {
            items: [{
                name: 'foo',
                label: 'Foo'
            }, {
                name: 'bar',
                label: 'Bar'
            }],
            ...props ?? {},
        },
        stubs: {
            'sw-icon': true,
        },
        mocks: {
            $device: {
                onResize: () => {},
                removeResizeListener: () => {}
            },
        },
        ...customOptions ?? {},
    });
}


describe('src/app/component/navigation/sw-tabs', () => {
    let wrapper;

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it('should be a Vue.JS component', async () => {
        wrapper = await createWrapper();
        expect(wrapper.vm).toBeTruthy();
    });

    it('should emit on clicked tab', async () => {
        wrapper = await createWrapper();

        await wrapper.find('.sw-tabs--item[data-item-name=bar]').trigger('click');

        expect(wrapper.emitted('new-item-active')[0]).toEqual(['bar']);
    });

    it('should emit on clicked vertical tab', async () => {
        wrapper = await createWrapper(undefined, {
            vertical: true
        });

        await wrapper.find('.sw-tabs--item[data-item-name=bar]').trigger('click');

        expect(wrapper.emitted('new-item-active')[0]).toEqual(['bar']);
    });
});
