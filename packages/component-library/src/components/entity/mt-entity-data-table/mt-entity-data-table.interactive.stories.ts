import meta, { type MtEntityDataTableMeta } from "./mt-entity-data-table.stories";
import type { StoryObj } from "@storybook/vue3";
import { within, userEvent, waitFor, expect, fn, screen } from "@storybook/test";
import { waitUntil } from "../../../_internal/test-helper";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import Criteria from "@shopware-ag/meteor-admin-sdk/es/data/Criteria";
import type Repository from "@shopware-ag/meteor-admin-sdk/es/data/Repository";
import repositoryMockData from "./_mocks/repositoryMock";
import productFixtures from "../../table-and-list/mt-data-table/mt-data-table.fixtures.json";

// Define a minimal ApiContext interface locally if direct import is troublesome
interface MinimalApiContext {
  apiPath?: string;
  apiResourcePath?: string;
  assetsPath?: string;
  authToken?: string | null;
  basePath?: string;
  host?: string;
  installationPath?: string;
  languageId?: string;
  liveVersionId?: string;
  port?: number;
  scheme?: string;
  schemeAndHttpHost?: string;
  version?: string;
  inheritance?: boolean;
  [key: string]: any; // Allow other properties for flexibility if SDK uses them internally
}

export default {
  ...meta,
  title: "Interaction Tests/Entity/mt-entity-data-table",
} as MtEntityDataTableMeta;

type MtEntityDataTableStory = StoryObj<MtEntityDataTableMeta>;

const waitForLoadingComplete = async (canvasElement: HTMLElement) => {
  await waitUntil(() => !canvasElement.querySelector(".mt-skeleton-bar"), 5000);
  await new Promise((resolve) => setTimeout(resolve, 200));
};

const createMockApiContext = (): MinimalApiContext => ({
  apiPath: "/api",
  apiResourcePath: "/api",
  assetsPath: "/assets",
  authToken: null,
  basePath: "",
  host: "localhost",
  installationPath: "",
  languageId: "2fbb5fe2e29a4d70aa5854ce7ce3e20c",
  liveVersionId: "0fa91ce3e96a4bc2be4bd9ce752c3425",
  port: 80,
  scheme: "http",
  schemeAndHttpHost: "http://localhost",
  version: "v3",
  inheritance: false,
});

const emptyRepositoryFactory = (entityName: string) => {
  const criteria = new Criteria(1, 25);
  const collection = new EntityCollection(
    `/api/${entityName.replace(/_/g, "-")}`,
    entityName,
    createMockApiContext() as any, // Cast to any if MinimalApiContext is not perfectly matching SDK's internal ApiContext
    criteria,
    [],
    0,
  );

  return {
    search: fn().mockResolvedValue(collection),
    get: fn().mockResolvedValue(null),
    save: fn().mockResolvedValue({}),
    delete: fn().mockResolvedValue(undefined),
    clone: fn().mockResolvedValue({}),
    create: fn().mockReturnValue({}),
    changesetGenerator: { generate: fn().mockReturnValue({}) },
    syncService: { sync: fn().mockResolvedValue({}) },
    schema: { properties: {} },
  };
};

// Basic Rendering and Visual States
export const VisualTestRenderTable: MtEntityDataTableStory = {
  name: "Should render the table with initial data",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitForLoadingComplete(canvasElement);
    await expect(canvas.getByText(args.title ?? "Products")).toBeInTheDocument();
    await expect(canvas.getByText("Fantastic Cotton Sausages")).toBeInTheDocument();
  },
};

export const VisualTestRenderFullLayout: MtEntityDataTableStory = {
  name: 'Should render in full layout when layout="full"',
  args: {
    layout: "full",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitForLoadingComplete(canvasElement);
    await expect(canvas.getByText(args.title ?? "Products")).toBeInTheDocument();
    await expect(canvas.getByText("Fantastic Cotton Sausages")).toBeInTheDocument();
  },
};

export const VisualTestRenderEmptyState: MtEntityDataTableStory = {
  name: "Should render the empty state when repository returns no data",
  args: {
    repository: fn(emptyRepositoryFactory) as unknown as typeof Repository,
    availableFilters: [],
    title: "Empty Products Table",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitForLoadingComplete(canvasElement);
    await expect(canvas.getByText("Currently no items are available yet.")).toBeInTheDocument();
  },
};

// Data Operations
export const InteractionTestPaginationChangePage: MtEntityDataTableStory = {
  name: "Should change page and fetch new data on pagination page change",
  args: {
    repository: fn(repositoryMockData) as unknown as typeof Repository,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitForLoadingComplete(canvasElement);

    // Check if the first item is visible
    await expect(canvas.getByText("Fantastic Cotton Sausages")).toBeInTheDocument();

    // Click on the next page button
    const nextPageButton = canvas.getByRole("button", { name: /Next page|Go to page 2/ });
    await userEvent.click(nextPageButton);
    await waitForLoadingComplete(canvasElement);

    // Check if the first item on the second page is visible
    await expect(canvas.getByText("Practical Wooden Keyboard")).toBeInTheDocument();
  },
};

export const InteractionTestPaginationChangeLimit: MtEntityDataTableStory = {
  name: "Should change item limit and fetch new data on pagination limit change",
  args: {
    repository: fn(repositoryMockData) as unknown as typeof Repository,
    paginationOptions: [5, 10, 25],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitForLoadingComplete(canvasElement);

    // Check if 6. item is visible
    await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument();

    // Change limit to 5
    const limitSelectComponent = await canvas.getByLabelText(/Items per page/i);
    const chevronIcon = within(limitSelectComponent).getByTestId("mt-select__select-indicator");
    await userEvent.click(chevronIcon);

    // Wait for the specific option to appear and then click it
    const optionToSelect = await waitFor(() => screen.findByTestId("mt-select-option--5"));
    await userEvent.click(optionToSelect);

    // Wait for the loading to complete
    await waitForLoadingComplete(canvasElement);

    // Check if 5. item is visible
    await expect(canvas.getByText("Practical Concrete Pizza")).toBeInTheDocument();

    // Check if 6. item is not visible
    await expect(canvas.queryByText("Awesome Concrete Chair")).not.toBeInTheDocument();
  },
};

export const InteractionTestSorting: MtEntityDataTableStory = {
  name: "Should sort data and refetch when a sortable column header is clicked",
  args: {
    repository: fn(repositoryMockData) as unknown as typeof Repository,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on the specific settings trigger for the 'Manufacturer' column
    const settingsTriggerManufacturer = canvas.getByTestId(
      "column-settings-trigger__manufacturer.name",
    );
    console.log(
      "Attempting to click 'Manufacturer' column settings trigger:",
      settingsTriggerManufacturer,
    );
    await userEvent.click(settingsTriggerManufacturer);

    // Popover interaction
    const popoverContent = await waitFor(
      () => document.querySelector('.mt-floating-ui__content[data-show="true"]'),
      { timeout: 3000 },
    );
    const popover = within(popoverContent as HTMLElement);
    const sortDescButton = await popover.findByText(/Sort descending/i); // This is a label in the HTML
    await userEvent.click(sortDescButton);

    // Wait for the loading to complete
    await waitUntil(() => !document.querySelector(".mt-skeleton-bar"));
    await waitUntil(() => !canvas.queryByText("McDermott, Walsh and McGlynn"));

    // Check if the correct items are visible
    await expect(canvas.getByText("Willms - Waelchi")).toBeInTheDocument();
  },
};

export const InteractionTestSearch: MtEntityDataTableStory = {
  name: "Should filter data via search term and refetch",
  args: {
    repository: fn(repositoryMockData) as unknown as typeof Repository,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitForLoadingComplete(canvasElement);

    // Search for "Concrete"
    const searchInput = canvas.getByPlaceholderText(/Search/i);
    await userEvent.type(searchInput, "Handmade Granite Mouse");

    // Wait for the search to complete
    await waitUntil(() => !canvas.queryByText("Fantastic Cotton Sausages"));
    await waitForLoadingComplete(canvasElement);

    // Check if the correct items are visible
    await waitUntil(() => canvas.getByText("Handmade Granite Mouse"));
    await expect(canvas.getByText("Handmade Granite Mouse")).toBeInTheDocument();
  },
};

// Filtering
export const InteractionTestApplyBooleanFilter: MtEntityDataTableStory = {
  name: "Should apply a boolean filter (e.g., Active) and update/refetch data",
  args: {
    repository: fn(repositoryMockData) as unknown as typeof Repository,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitForLoadingComplete(canvasElement);

    // Open "Add filter" button which opens the filter dialog
    const addFilterButton = canvas.getByRole("button", { name: /Add filter/i });
    await userEvent.click(addFilterButton);

    // Open "Active" filter in the opened dialog
    const dialog = await waitFor(() => document.querySelector('[role="dialog"]'));
    const dialogContent = within(document.querySelector('[role="dialog"]') as HTMLElement);
    console.log("Dialog content:", dialogContent);
    const activeFilter = await dialogContent.findByText("Active");
    await userEvent.click(activeFilter);

    // Wait for the loading to complete, e.g. "Manufacturer" filter
    // is not visible anymore inside the dialog
    await waitUntil(() => !dialogContent.queryByText("Manufacturer"));

    // Select "Active" option which has the role "menuitem"
    const activeOption = await dialogContent.findByRole("menuitem", { name: "Active" });
    await userEvent.click(activeOption);

    // Wait for the loading to complete
    await waitUntil(() => !canvas.queryByText("Intelligent Plastic Pants"));
    await waitUntil(() => !document.querySelector(".mt-skeleton-bar"));

    // Check if the correct items are visible
    await expect(canvas.getByText("Fantastic Plastic Hat")).toBeInTheDocument();
  },
};

export const InteractionTestApplyMultiSelectFilter: MtEntityDataTableStory = {
  name: "Should apply a multi-select filter (e.g., Manufacturer) and update/refetch data",
  args: {
    repository: fn(repositoryMockData) as unknown as typeof Repository,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitForLoadingComplete(canvasElement);

    // Open "Add filter" button which opens the filter dialog
    const addFilterButton = canvas.getByRole("button", { name: /Add filter/i });
    await userEvent.click(addFilterButton);

    // Open "Manufacturer" filter in the opened dialog
    await waitFor(() => document.querySelector('[role="dialog"]'));
    const dialogContent = within(document.querySelector('[role="dialog"]') as HTMLElement);
    const manufacturerFilter = await dialogContent.findByText("Manufacturer");
    await userEvent.click(manufacturerFilter);

    // Select "Gibson - Predovic" option which has the role "menuitem"
    const manufacturerOption = await dialogContent.findByRole("menuitem", {
      name: "Gibson - Predovic",
    });
    await userEvent.click(manufacturerOption);

    // Wait for the loading to complete
    await waitUntil(() => !canvas.queryByText("Intelligent Plastic Pants"));
    await waitUntil(() => !document.querySelector(".mt-skeleton-bar"));

    // Check if the correct items are visible inside the first table row
    const tableContent = within(
      document.querySelector(".mt-data-table__table-wrapper") as HTMLElement,
    );
    await expect(tableContent.getByText("Gibson - Predovic")).toBeInTheDocument();
  },
};

export const InteractionTestClearFilter: MtEntityDataTableStory = {
  name: "Should clear the applied filter and update/refetch data",
  args: {
    repository: fn(repositoryMockData) as unknown as typeof Repository,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitForLoadingComplete(canvasElement);

    // Open "Add filter" button which opens the filter dialog
    const addFilterButton = canvas.getByRole("button", { name: /Add filter/i });
    await userEvent.click(addFilterButton);

    // Open "Manufacturer" filter in the opened dialog
    await waitFor(() => document.querySelector('[role="dialog"]'));
    const dialogContent = within(document.querySelector('[role="dialog"]') as HTMLElement);
    const manufacturerFilter = await dialogContent.findByText("Manufacturer");
    await userEvent.click(manufacturerFilter);

    // Select "Gibson - Predovic" option which has the role "menuitem"
    const manufacturerOption = await dialogContent.findByRole("menuitem", {
      name: "Gibson - Predovic",
    });
    await userEvent.click(manufacturerOption);

    // Wait for the loading to complete
    await waitUntil(() => !canvas.queryByText("Intelligent Plastic Pants"));
    await waitUntil(() => !document.querySelector(".mt-skeleton-bar"));

    // Check if the correct items are visible inside the first table row
    const tableContent = within(
      document.querySelector(".mt-data-table__table-wrapper") as HTMLElement,
    );
    await expect(tableContent.getByText("Gibson - Predovic")).toBeInTheDocument();

    // Clear the filter
    const clearFilterButton = await canvas.findByText("Remove filter");
    await userEvent.click(clearFilterButton);

    // Wait until "Remove filter" button is not visible anymore
    await waitFor(() => !canvas.queryByText("Remove filter"));

    // Wait for the loading to complete
    await waitUntil(() => !canvas.queryByText("Gibson - Predovic"));
    await waitUntil(() => !document.querySelector(".mt-skeleton-bar"));

    // Check if the correct items are visible inside the first table row
    await expect(tableContent.getByText("Fantastic Cotton Sausages")).toBeInTheDocument();
  },
};

// Event Emissions
export const InteractionTestEmitOpenDetails: MtEntityDataTableStory = {
  name: 'Should emit "onOpenDetails" with row data on details action',
  args: {
    onOpenDetails: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitForLoadingComplete(canvasElement);
    const firstProductNameCell = await waitFor(() => canvas.getByText("Fantastic Cotton Sausages"));
    await userEvent.click(firstProductNameCell);
    expect(args.onOpenDetails).toHaveBeenCalledWith(
      productFixtures.find((product) => product.name === "Fantastic Cotton Sausages"),
    );
  },
};

export const InteractionTestEmitBulkEdit: MtEntityDataTableStory = {
  name: 'Should emit "onBulkEdit" with selected IDs on bulk edit action',
  args: {
    allowRowSelection: true,
    allowBulkEdit: true,
    onBulkEdit: fn(),
    repository: fn(repositoryMockData) as unknown as typeof Repository,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitForLoadingComplete(canvasElement);
    const rowCheckboxes = await waitFor(() => canvas.getAllByRole("checkbox"));
    await userEvent.click(rowCheckboxes[0]);

    // Wait until "25 items selected" is visible
    await waitFor(() => canvas.getByText("25 items selected"));

    // Click on "Edit" button
    const editButton = await waitFor(() => canvas.getByRole("button", { name: /Edit/i }));
    await userEvent.click(editButton);

    // Check if "onBulkEdit" event was emitted with the correct IDs
    expect(args.onBulkEdit).toHaveBeenCalledTimes(1);
    expect(args.onBulkEdit).toHaveBeenCalledWith(
      // Get the first 25 product IDs
      productFixtures.map((product) => product.id).slice(0, 25),
    );
  },
};

export const InteractionTestEmitBulkDelete: MtEntityDataTableStory = {
  name: 'Should emit "onBulkDelete" with selected IDs on bulk delete action',
  args: {
    allowRowSelection: true,
    allowBulkDelete: true,
    onBulkDelete: fn(),
    repository: fn(repositoryMockData) as unknown as typeof Repository,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitForLoadingComplete(canvasElement);
    const rowCheckboxes = await waitFor(() => canvas.getAllByRole("checkbox"));
    await userEvent.click(rowCheckboxes[0]);

    // Wait until "25 items selected" is visible
    await waitFor(() => canvas.getByText("25 items selected"));

    // Click on "Delete" button
    const deleteButton = await waitFor(() => canvas.getByRole("button", { name: /Delete/i }));
    await userEvent.click(deleteButton);

    // Check if "onBulkDelete" event was emitted with the correct IDs
    expect(args.onBulkDelete).toHaveBeenCalledTimes(1);
    expect(args.onBulkDelete).toHaveBeenCalledWith(
      productFixtures.map((product) => product.id).slice(0, 25),
    );
  },
};

export const VisualTestDeleteModal: MtEntityDataTableStory = {
  name: "Should render the delete modal",
  play: async ({ canvasElement, args }) => {
    await waitForLoadingComplete(canvasElement);
    // Click on context button in first row
    const firstRow = within(
      canvasElement.querySelector("table > tbody > tr:nth-child(1)") as HTMLElement,
    );
    const contextButton = await firstRow.findByRole("button", { name: /Context menu/i });
    await userEvent.click(contextButton);

    // Click on "Delete" menuItem in context menu
    const deleteMenuItem = await screen.findByRole("menuitem", { name: /Delete/i });
    await userEvent.click(deleteMenuItem);

    // Wait for the delete modal to be visible
    await waitFor(() => screen.getByText("Are you sure you want to delete the selected items?"));

    // Do nothing anymore because we want to check the visual state of the modal
  },
};
