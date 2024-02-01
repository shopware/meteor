import { mount } from "@vue/test-utils";
import SwPagination from "./sw-pagination.vue";

function createWrapper() {
  return mount(SwPagination, {
    propsData: {
      currentPage: 3,
      limit: 25,
      totalItems: 213
    },
    mocks: {
      $t: v => v
    }
  });
}

describe("sw-pagination", () => {
  it("should render the component", () => {
    const wrapper = createWrapper();

    expect(wrapper.vm).toBeTruthy();
  });

  describe('should render the correct info text', () => {
    test.each([
      {
        currentPage: 1, limit: 25, totalItems: 213,
        expectedText: '1-25 sw-pagination.of 213'
      },
      {
        currentPage: 2, limit: 25, totalItems: 213,
        expectedText: '26-50 sw-pagination.of 213'
      },
      {
        currentPage: 3, limit: 5, totalItems: 152,
        expectedText: '11-15 sw-pagination.of 152'
      },
      {
        currentPage: 4, limit: 50, totalItems: 167,
        expectedText: '151-167 sw-pagination.of 167'
      }
    ])('should render the info text "$expectedText"', async (testCase) => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        currentPage: testCase.currentPage,
        limit: testCase.limit,
        totalItems: testCase.totalItems,
      })
      const infoText = wrapper.find('.sw-pagination__info-text').text();

      expect(infoText).toEqual(testCase.expectedText);
    })
  });

  describe('should emit the correct events', () => {
    it('should emit the first page', async () => {
      const wrapper = createWrapper();

      await wrapper.find('.sw-segmented-control__action-id-pagination-first')
        .trigger('click');
      
      expect(wrapper.emitted()['change-current-page'][0]).toEqual([1]);
    });

    it('should emit the previous page', async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        currentPage: 4,
      })

      await wrapper.find('.sw-segmented-control__action-id-pagination-previous')
        .trigger('click');
      
      expect(wrapper.emitted()['change-current-page'][0]).toEqual([3]);
    });

    it('should emit the next page', async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        currentPage: 6,
      })

      await wrapper.find('.sw-segmented-control__action-id-pagination-next')
        .trigger('click');
      
      expect(wrapper.emitted()['change-current-page'][0]).toEqual([7]);
    });

    it('should emit the last page', async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        currentPage: 2,
      })

      await wrapper.find('.sw-segmented-control__action-id-pagination-last')
        .trigger('click');
      
      expect(wrapper.emitted()['change-current-page'][0]).toEqual([9]);
    });

    it('should emit the given page', async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        currentPage: 2,
      })

      const pageInput = wrapper.find('.sw-pagination__current-input input');
      await pageInput.setValue(7)
      await pageInput.trigger('change')

      expect(wrapper.emitted()['change-current-page'][0]).toEqual([7]);
    });
  });
});