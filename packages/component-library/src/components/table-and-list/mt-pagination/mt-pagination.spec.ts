import { mount } from "@vue/test-utils";
import MtPagination from "./mt-pagination.vue";
import { render, screen } from "@testing-library/vue";

// Mock the $t function
const mockT = (key: any) => {
  return key;
};

function createWrapper() {
  return mount(MtPagination, {
    props: {
      currentPage: 3,
      limit: 25,
      totalItems: 213,
    },
    global: {
      mocks: {
        $t: (v: string, options: object) => v + JSON.stringify(options),
      },
    },
  });
}

describe("mt-pagination", () => {
  describe("should render the correct info text", () => {
    it.each([
      {
        currentPage: 1,
        limit: 25,
        totalItems: 213,
        expectedText: 'mt-pagination.infoText{"start":1,"end":25,"totalItems":213}',
      },
      {
        currentPage: 2,
        limit: 25,
        totalItems: 213,
        expectedText: 'mt-pagination.infoText{"start":26,"end":50,"totalItems":213}',
      },
      {
        currentPage: 3,
        limit: 5,
        totalItems: 152,
        expectedText: 'mt-pagination.infoText{"start":11,"end":15,"totalItems":152}',
      },
      {
        currentPage: 4,
        limit: 50,
        totalItems: 167,
        expectedText: 'mt-pagination.infoText{"start":151,"end":167,"totalItems":167}',
      },
    ])('should render the info text "$expectedText"', async (testCase) => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        currentPage: testCase.currentPage,
        limit: testCase.limit,
        totalItems: testCase.totalItems,
      });

      const infoText = wrapper.find("[data-testid='mt-pagination-info-text']").text();

      expect(infoText).toStrictEqual(testCase.expectedText);
    });
  });

  describe("should emit the correct events", () => {
    it("should emit the first page", async () => {
      const wrapper = createWrapper();

      await wrapper.find("[data-testid='mt-pagination-first-page-button']").trigger("click");

      expect(wrapper.emitted()["change-current-page"][0]).toStrictEqual([1]);
    });

    it("should emit the previous page", async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        ...wrapper.props(),
        currentPage: 4,
      });

      await wrapper.find("[data-testid='mt-pagination-previous-page-button']").trigger("click");

      expect(wrapper.emitted()["change-current-page"][0]).toStrictEqual([3]);
    });

    it("should emit the next page", async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        ...wrapper.props(),
        currentPage: 6,
      });

      await wrapper.find("[data-testid='mt-pagination-next-page-button']").trigger("click");

      expect(wrapper.emitted()["change-current-page"][0]).toStrictEqual([7]);
    });

    it("should emit the last page", async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        ...wrapper.props(),
        currentPage: 2,
      });

      await wrapper.find("[data-testid='mt-pagination-last-page-button']").trigger("click");

      expect(wrapper.emitted()["change-current-page"][0]).toStrictEqual([9]);
    });

    it("should emit the given page", async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        ...wrapper.props(),
        currentPage: 2,
      });

      const pageInput = wrapper.find("[data-testid='mt-pagination-current-page-input']");
      await pageInput.setValue(7);
      await pageInput.trigger("change");

      expect(wrapper.emitted()["change-current-page"][0]).toStrictEqual([7]);
    });

    it("should disable the next page and last page button when total page value is zero", async () => {
      render(MtPagination, {
        props: {
          currentPage: 1,
          totalItems: 0,
          limit: 25,
        },
        global: {
          mocks: {
            $t: mockT,
          },
        },
      });

      const nextPageButton = screen.getByRole("button", { name: /mt-pagination.nextPage/i });
      const lastPageButton = screen.getByRole("button", { name: /mt-pagination.lastPage/i });

      expect(nextPageButton).toBeDisabled();
      expect(lastPageButton).toBeDisabled();
    });
  });
});
