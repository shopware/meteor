import MtPagination from "./mt-pagination.vue";
import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";

describe("mt-pagination", () => {
  describe("should render the correct info text", () => {
    it.each([
      {
        currentPage: 1,
        limit: 25,
        totalItems: 213,
        expectedText: "1-25 of 213",
      },
      {
        currentPage: 2,
        limit: 25,
        totalItems: 213,
        expectedText: "26-50 of 213",
      },
      {
        currentPage: 3,
        limit: 5,
        totalItems: 152,
        expectedText: "11-15 of 152",
      },
      {
        currentPage: 4,
        limit: 50,
        totalItems: 167,
        expectedText: "151-167 of 167",
      },
    ])('should render the info text "$expectedText"', async (testCase) => {
      render(MtPagination, {
        props: {
          currentPage: testCase.currentPage,
          limit: testCase.limit,
          totalItems: testCase.totalItems,
        },
      });

      const infoText = screen.getByText(testCase.expectedText);

      expect(infoText).toBeVisible();
    });
  });

  describe("should emit the correct events", () => {
    it("should emit the first page", async () => {
      const handler = vi.fn();

      render(MtPagination, {
        props: {
          currentPage: 3,
          limit: 25,
          totalItems: 213,
          "onChange-current-page": handler,
        },
      });

      await userEvent.click(screen.getByRole("button", { name: "First page" }));

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenLastCalledWith(1);
    });

    it("should emit the previous page", async () => {
      const handler = vi.fn();

      render(MtPagination, {
        props: {
          currentPage: 4,
          limit: 25,
          totalItems: 213,
          "onChange-current-page": handler,
        },
      });

      await userEvent.click(screen.getByRole("button", { name: "Previous page" }));

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenLastCalledWith(3);
    });

    it("should emit the next page", async () => {
      const handler = vi.fn();

      render(MtPagination, {
        props: {
          currentPage: 6,
          limit: 25,
          totalItems: 213,
          "onChange-current-page": handler,
        },
      });

      await userEvent.click(screen.getByRole("button", { name: "Next page" }));

      expect(handler).toHaveBeenLastCalledWith(7);
      expect(handler).toHaveBeenCalledOnce();
    });

    it("should emit the last page", async () => {
      const handler = vi.fn();

      render(MtPagination, {
        props: {
          currentPage: 2,
          limit: 25,
          totalItems: 213,
          "onChange-current-page": handler,
        },
      });

      await userEvent.click(screen.getByRole("button", { name: "Last page" }));

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenLastCalledWith(9);
    });

    it("should emit the given page", async () => {
      const handler = vi.fn();

      render(MtPagination, {
        props: {
          currentPage: 2,
          limit: 25,
          totalItems: 213,
          "onChange-current-page": handler,
        },
      });

      await userEvent.type(screen.getByRole("spinbutton"), "{Backspace}7");

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenLastCalledWith(7);
    });

    it("should disable the next page and last page button when total page value is zero", async () => {
      render(MtPagination, {
        props: {
          currentPage: 1,
          totalItems: 0,
          limit: 25,
        },
      });

      expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Last page" })).toBeDisabled();
    });
  });
});
