import meta, { Default, WithProvidedRepository, WithProvidedCriteria, type MtEntityDataTableMeta } from "./mt-entity-data-table.stories";
import { mockRepositorySearch, mockSwCriteriaStaticEquals, mockSwCriteriaStaticSort } from "./mt-entity-data-table.stories"; // Import mocks needed for assertions
import { within, userEvent, waitFor, expect, fn, screen } from "@storybook/test";
import { waitUntil } from "../../../_internal/test-helper";

export default {
  ...meta,
  title: "Interaction Tests/Entity/mt-entity-data-table",
} as MtEntityDataTableMeta;

export const VisualTestRenderTable = {
  ...Default,
  name: "Should render the Table with initial data",
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    // Wait until loading is finished (no skeleton bars)
    await waitFor(() => expect(canvas.queryAllByRole("progressbar").length).toBe(0));
    await waitUntil(() => !document.querySelector('.mt-skeleton-bar'));

    // Check for some data rendered from the default story args/mock
    await expect(canvas.getByText("Product Data")).toBeInTheDocument(); // Caption
    await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument();
    await expect(canvas.getByText("Emard, Schmidt and Bailey")).toBeInTheDocument();
  },
};

export const TestSearchInteraction = {
  ...Default,
  name: "Should filter data when searching",
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.queryAllByRole("progressbar").length).toBe(0));
    await waitUntil(() => !document.querySelector('.mt-skeleton-bar'));

    const searchInput = canvas.getByRole("searchbox");
    await userEvent.type(searchInput, "Steel Bike", { delay: 100 });

    // Wait for debounce/loading, so 400ms delay
    await new Promise(resolve => setTimeout(resolve, 400));
    await waitFor(() => expect(canvas.queryAllByRole("progressbar").length).toBe(0));
    await waitUntil(() => !document.querySelector('.mt-skeleton-bar'));

    // Check if the table is filtered
    await expect(canvas.getByText("Unbranded Steel Bike")).toBeInTheDocument();
    await expect(canvas.queryByText("Awesome Concrete Chair")).not.toBeInTheDocument();

    // Verify the mock search was called with the term
    const lastSearchCallArgs = mockRepositorySearch.mock.lastCall?.[0];
    expect(lastSearchCallArgs?.term).toBe("Steel Bike");
  },
};

export const TestPaginationInteraction = {
  ...Default,
  name: "Should change page and limit",
  args: {
    paginationOptions: [5, 10, 25], // Use smaller options for testing
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.queryAllByRole("progressbar").length).toBe(0));
    await waitUntil(() => !document.querySelector('.mt-skeleton-bar'));

    // Check initial state (assuming default args lead to 5 items per page)
    await waitFor(() => {
        const rows = canvasElement.querySelectorAll('tbody tr');
        expect(rows.length).toBe(5);
    });

    // --- Change Limit ---
    // Find the whole select component
    const limitSelectComponent = await canvas.getByLabelText(/Items per page/i);
    
    // Find the clickable chevron icon within the select component
    const chevronIcon = within(limitSelectComponent).getByTestId("mt-select__select-indicator");
    await userEvent.click(chevronIcon);

    // Wait for the specific option to appear and then click it
    const optionToSelect = await waitFor(() => screen.findByTestId("mt-select-option--10"));
    await userEvent.click(optionToSelect);

    await waitFor(() => expect(canvas.queryAllByRole("progressbar").length).toBe(0));
    await waitUntil(() => !document.querySelector('.mt-skeleton-bar'));

    // Check if limit changed (10 items now)
     await waitFor(() => {
        const rows = canvasElement.querySelectorAll('tbody tr');
        expect(rows.length).toBe(10);
    });
    let lastSearchCallArgs = mockRepositorySearch.mock.lastCall?.[0];
    expect(lastSearchCallArgs?.limit).toBe(10);
    expect(lastSearchCallArgs?.page).toBe(1); // Should reset to page 1

    // --- Change Page ---
    const nextPageButton = await canvas.findByRole("button", { name: /Next page/i });
    await userEvent.click(nextPageButton);

    await waitFor(() => expect(canvas.queryAllByRole("progressbar").length).toBe(0));
    await waitUntil(() => !document.querySelector('.mt-skeleton-bar'));

    // Check if page changed
    lastSearchCallArgs = mockRepositorySearch.mock.lastCall?.[0];
    expect(lastSearchCallArgs?.page).toBe(2);
    expect(lastSearchCallArgs?.limit).toBe(10);

    // Check for data expected on page 2 (depends on fixture data and sorting)
    await expect(await canvas.findByText("Ergonomic Metal Chips")).toBeInTheDocument(); 
  },
};

export const TestSortingInteraction = {
  ...Default,
  name: "Should change sorting",
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Restore initial waits
    await waitFor(() => expect(canvas.queryAllByRole("progressbar").length).toBe(0));
    await waitUntil(() => !document.querySelector('.mt-skeleton-bar'));

    // Click on the specific settings trigger for the 'Manufacturer' column
    const settingsTriggerManufacturer = canvas.getByTestId("column-settings-trigger__manufacturer.name");
    console.log("Attempting to click 'Manufacturer' column settings trigger:", settingsTriggerManufacturer);
    await userEvent.click(settingsTriggerManufacturer);

    // Popover interaction
    const popoverContent = await waitFor(() => document.querySelector('.mt-floating-ui__content[data-show="true"]'), { timeout: 3000 });
    if (popoverContent) {
      console.log("Manufacturer Popover FOUND. HTML content:", popoverContent.innerHTML);
      const popover = within(popoverContent as HTMLElement);
      
      const sortDescButton = await popover.findByText(/Sort descending/i); // This is a label in the HTML
      await userEvent.click(sortDescButton);
    } else {
      console.error("Manufacturer Popover NOT found after click.");
      // If not found, the test will likely fail here or on subsequent assertions
    }

    // Assertions for sorting
    await waitFor(() => expect(canvas.queryAllByRole("progressbar").length).toBe(0));
    await waitUntil(() => !document.querySelector('.mt-skeleton-bar'));

    const lastSearchCallArgs = mockRepositorySearch.mock.lastCall?.[0];
    expect(lastSearchCallArgs?.sortings).toEqual([
      expect.objectContaining({ field: 'manufacturer.name', order: 'DESC' })
    ]);

    // Check if data is sorted accordingly (depends on fixture data)
    await expect(canvas.getByText("Willms - Waelchi")).toBeInTheDocument(); 
  },
};


export const TestProvidedRepositoryInteraction = {
    ...WithProvidedRepository,
    name: "Should use the provided repository",
    play: async ({ canvasElement, args }: any) => {
        const canvas = within(canvasElement);
        await waitFor(() => expect(canvas.queryAllByRole("progressbar").length).toBe(0));
        await waitUntil(() => !document.querySelector('.mt-skeleton-bar'));

        // Verify the custom item is rendered
        await expect(canvas.getByText("Custom Item 1")).toBeInTheDocument();
        await expect(canvas.getByText("Custom Inc.")).toBeInTheDocument();

        // Verify the provided repository's search mock was called
        expect(args.providedRepository.search).toHaveBeenCalled();

        // Verify the default mock repository was NOT called
        expect(mockRepositorySearch).not.toHaveBeenCalled(); 
    },
};

export const TestProvidedCriteriaInteraction = {
    ...WithProvidedCriteria,
    name: "Should use the provided Criteria class and helpers",
    play: async ({ canvasElement, args }: any) => {
        const canvas = within(canvasElement);
        await waitFor(() => expect(canvas.queryAllByRole("progressbar").length).toBe(0));
        await waitUntil(() => !document.querySelector('.mt-skeleton-bar'));

        // Verify data rendered (using the default repo mock as criteria doesn't change the data source in this test)
        await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument(); 

        // Interaction: Trigger a sort to see if custom helpers are called
        const settingsTriggerName = canvas.getByTestId("column-settings-trigger__name");
        await userEvent.click(settingsTriggerName); // Click to open settings
        const popoverContent = await waitFor(() => document.querySelector('.mt-floating-ui__content[data-show="true"]'));
        const popover = within(popoverContent as HTMLElement);
        const sortAscButton = await popover.findByText(/Sort ascending/i);
        await userEvent.click(sortAscButton);

        await waitFor(() => expect(canvas.queryAllByRole("progressbar").length).toBe(0));
        await waitUntil(() => !document.querySelector('.mt-skeleton-bar'));

        // Check if the custom static helper was called
        expect(args.providedCriteriaStaticHelpers.sort).toHaveBeenCalledWith("name", "ASC");

        // Check if the default static helper was NOT called
        expect(mockSwCriteriaStaticSort).not.toHaveBeenCalled();
    },
}; 