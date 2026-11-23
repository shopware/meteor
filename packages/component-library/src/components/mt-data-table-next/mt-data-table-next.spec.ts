import { userEvent } from "@testing-library/user-event";
import { render, screen, within } from "@testing-library/vue";
import { ref } from "vue";
import MtDataTableNext from "./mt-data-table-next.vue";
import type { RowData } from "@tanstack/vue-table";
import type { MtDataTableNextColumn } from "./_internal/mt-data-table-next-features";

type Product = { id: string; name: string; stock: number };

const products: Product[] = [
  { id: "1", name: "Canvas tote", stock: 0 },
  { id: "2", name: "Aviator shirt", stock: 12 },
  { id: "3", name: "Linen cap", stock: 7 },
];

// Typed loosely because `render()` can't infer the row type of the generic component
const columns: MtDataTableNextColumn<RowData>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "stock", header: "Stock", meta: { align: "end" } },
];

function getBodyRows() {
  const [, ...bodyRows] = screen.getAllByRole("row");

  return bodyRows;
}

function getFirstColumnValues() {
  return getBodyRows().map((row) => within(row).getAllByRole("cell")[0].textContent?.trim());
}

function renderWithModels(template: string, models: Record<string, unknown>, data = products) {
  const refs = Object.fromEntries(Object.entries(models).map(([key, value]) => [key, ref(value)]));

  render({
    components: { MtDataTableNext },
    setup: () => ({ data, columns, ...refs }),
    template,
  });

  return refs;
}

describe("mt-data-table-next", () => {
  it("renders a row per item and a header per column", () => {
    // ARRANGE
    render(MtDataTableNext, { props: { data: products, columns } });

    // ASSERT
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "Stock" })).toBeVisible();
    expect(getFirstColumnValues()).toEqual(["Canvas tote", "Aviator shirt", "Linen cap"]);
  });

  it("renders cells and headers through their slots", () => {
    // ARRANGE
    render(MtDataTableNext, {
      props: { data: products, columns },
      slots: {
        "header-name": "Product name",
        "cell-name": `<template #cell-name="{ value, row }">{{ value }} (#{{ row.original.id }})</template>`,
      },
    });

    // ASSERT
    expect(screen.getByRole("columnheader", { name: "Product name" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "Aviator shirt (#2)" })).toBeVisible();
  });

  it("names the table through its attributes", () => {
    // ARRANGE
    render(MtDataTableNext, {
      props: { data: products, columns },
      attrs: { "aria-label": "Products" },
    });

    // ASSERT
    expect(screen.getByRole("table", { name: "Products" })).toBeVisible();
  });

  it("keeps headers static when `v-model:sorting` is not bound", () => {
    // ARRANGE
    render(MtDataTableNext, { props: { data: products, columns } });

    // ASSERT
    expect(screen.queryByRole("button", { name: "Name" })).not.toBeInTheDocument();
  });

  it("sorts the rows when a header is clicked", async () => {
    // ARRANGE
    const { sorting } = renderWithModels(
      `<mt-data-table-next v-model:sorting="sorting" :data="data" :columns="columns" />`,
      { sorting: [] },
    );

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Name" }));

    // ASSERT
    expect(getFirstColumnValues()).toEqual(["Aviator shirt", "Canvas tote", "Linen cap"]);
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    expect(screen.getByRole("columnheader", { name: "Stock" })).not.toHaveAttribute("aria-sort");
    expect(sorting.value).toEqual([{ id: "name", desc: false }]);
  });

  it("keeps the order of the data with `manual` and only updates the sorting", async () => {
    // ARRANGE
    const { sorting } = renderWithModels(
      `<mt-data-table-next v-model:sorting="sorting" manual :data="data" :columns="columns" />`,
      { sorting: [] },
    );

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Name" }));

    // ASSERT
    expect(getFirstColumnValues()).toEqual(["Canvas tote", "Aviator shirt", "Linen cap"]);
    expect(sorting.value).toEqual([{ id: "name", desc: false }]);
  });

  it("shows one page of rows and moves to the next page", async () => {
    // ARRANGE
    const manyProducts = Array.from({ length: 25 }, (_, index) => ({
      id: String(index + 1),
      name: `Product ${index + 1}`,
      stock: index,
    }));
    const { pagination } = renderWithModels(
      `<mt-data-table-next v-model:pagination="pagination" :data="data" :columns="columns" />`,
      { pagination: { pageIndex: 0, pageSize: 10 } },
      manyProducts,
    );

    // ASSERT
    expect(getBodyRows()).toHaveLength(10);
    expect(getFirstColumnValues()[0]).toBe("Product 1");

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));

    // ASSERT
    expect(getFirstColumnValues()[0]).toBe("Product 11");
    expect(pagination.value).toEqual({ pageIndex: 1, pageSize: 10 });
  });

  it("renders the given page and counts `row-count` with `manual`", async () => {
    // ARRANGE
    const { pagination } = renderWithModels(
      `<mt-data-table-next v-model:pagination="pagination" manual :row-count="120" :data="data" :columns="columns" />`,
      { pagination: { pageIndex: 0, pageSize: 10 } },
    );

    // ASSERT
    expect(getFirstColumnValues()).toEqual(["Canvas tote", "Aviator shirt", "Linen cap"]);
    expect(screen.getByText("1-10 of 120")).toBeVisible();

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Last page" }));

    // ASSERT
    expect(pagination.value).toEqual({ pageIndex: 11, pageSize: 10 });
  });

  it("selects rows and all rows of the page", async () => {
    // ARRANGE
    const { rowSelection } = renderWithModels(
      `<mt-data-table-next v-model:row-selection="rowSelection" :data="data" :columns="columns" />`,
      { rowSelection: {} },
    );
    const selectAll = screen.getByRole("checkbox", { name: "Select all rows on this page" });

    // ACT
    await userEvent.click(screen.getAllByRole("checkbox", { name: "Select row" })[1]);

    // ASSERT
    expect(rowSelection.value).toEqual({ "2": true });
    expect(selectAll).toHaveProperty("indeterminate", true);

    // ACT
    await userEvent.click(selectAll);

    // ASSERT
    expect(rowSelection.value).toEqual({ "1": true, "2": true, "3": true });
    expect(selectAll).toBeChecked();
    expect(selectAll).toHaveProperty("indeterminate", false);

    // ACT
    await userEvent.click(selectAll);

    // ASSERT
    expect(rowSelection.value).toEqual({});
  });

  it("shows the empty state when there are no rows", () => {
    // ARRANGE
    render(MtDataTableNext, { props: { data: [], columns } });

    // ASSERT
    expect(screen.getByRole("cell", { name: "No results" })).toBeVisible();
  });

  it("marks the table as busy and hides the rows while loading", () => {
    // ARRANGE
    render(MtDataTableNext, {
      props: { data: products, columns, loading: true },
      attrs: { "aria-label": "Products" },
    });

    // ASSERT
    expect(screen.getByRole("table", { name: "Products" })).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("Aviator shirt")).not.toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(products.length);
  });
});
