import { mount } from "@vue/test-utils";
import MtPagination from "./mt-pagination.vue";

function createWrapper() {
  return mount(MtPagination, {
    props: {
      currentPage: 3,
      limit: 25,
      totalItems: 213,
    },
    global: {
      mocks: {
        $t: (v: string) => v,
      },
    },
  });
}

describe("mt-pagination", () => {
  it("should render the component", () => {
    const wrapper = createWrapper();

    expect(wrapper.vm).toBeTruthy();
  });

  describe("should render the correct info text", () => {
    it.each([
      {
        currentPage: 1,
        limit: 25,
        totalItems: 213,
        expectedText: "1-25 mt-pagination.of 213",
      },
      {
        currentPage: 2,
        limit: 25,
        totalItems: 213,
        expectedText: "26-50 mt-pagination.of 213",
      },
      {
        currentPage: 3,
        limit: 5,
        totalItems: 152,
        expectedText: "11-15 mt-pagination.of 152",
      },
      {
        currentPage: 4,
        limit: 50,
        totalItems: 167,
        expectedText: "151-167 mt-pagination.of 167",
      },
    ])('should render the info text "$expectedText"', async (testCase) => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        currentPage: testCase.currentPage,
        limit: testCase.limit,
        totalItems: testCase.totalItems,
      });
      const infoText = wrapper.find(".mt-pagination__info-text").text();

      expect(infoText).toStrictEqual(testCase.expectedText);
    });
  });

  describe("should emit the correct events", () => {
    it("should emit the first page", async () => {
      const wrapper = createWrapper();

      await wrapper.find(".mt-segmented-control__action-id-pagination-first").trigger("click");

      expect(wrapper.emitted()["change-current-page"][0]).toStrictEqual([1]);
    });

    it("should emit the previous page", async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        ...wrapper.props(),
        currentPage: 4,
      });

      await wrapper.find(".mt-segmented-control__action-id-pagination-previous").trigger("click");

      expect(wrapper.emitted()["change-current-page"][0]).toStrictEqual([3]);
    });

    it("should emit the next page", async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        ...wrapper.props(),
        currentPage: 6,
      });

      await wrapper.find(".mt-segmented-control__action-id-pagination-next").trigger("click");

      expect(wrapper.emitted()["change-current-page"][0]).toStrictEqual([7]);
    });

    it("should emit the last page", async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        ...wrapper.props(),
        currentPage: 2,
      });

      await wrapper.find(".mt-segmented-control__action-id-pagination-last").trigger("click");

      expect(wrapper.emitted()["change-current-page"][0]).toStrictEqual([9]);
    });

    it("should emit the given page", async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        ...wrapper.props(),
        currentPage: 2,
      });

      const pageInput = wrapper.find(".mt-pagination__current-input input");
      await pageInput.setValue(7);
      await pageInput.trigger("change");

      expect(wrapper.emitted()["change-current-page"][0]).toStrictEqual([7]);
    });
  });
});
