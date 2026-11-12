import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { useLocalListing } from "./useLocalListing";

const items = [
  { id: "a", name: "Sync orders", status: "live", minutes: 30 },
  { id: "b", name: "Export customers", status: "draft", minutes: 10 },
  { id: "c", name: "Sync invoices", status: "failed", minutes: 20 },
];

function setup(limit = 25) {
  return useLocalListing(items, {
    searchText: (item) => [item.name],
    filterValues: (item, filterId) =>
      filterId === "status" ? [item.status] : [],
    sortValue: (item, property) =>
      property === "minutes" ? item.minutes : item.name,
    limit,
  });
}

const statusFilter = (...ids: string[]) => ({
  id: "status",
  label: "Status",
  type: { id: "options", options: ids.map((id) => ({ id, label: id })) },
});

describe("useLocalListing", () => {
  it("finds items whose text contains the search, ignoring case", () => {
    const listing = setup();

    listing.term.value = "SYNC";

    expect(listing.items.value.map((item) => item.id)).toEqual(["a", "c"]);
    expect(listing.isFiltered.value).toBe(true);
  });

  it("keeps items that match any option of a filter", () => {
    const listing = setup();

    listing.appliedFilters.value = [statusFilter("live", "failed")];

    expect(listing.items.value.map((item) => item.id)).toEqual(["a", "c"]);
    expect(listing.total.value).toBe(2);
  });

  it("sorts numbers and texts in both directions", () => {
    const listing = setup();

    listing.onSortChange("minutes", "ASC");
    expect(listing.items.value.map((item) => item.id)).toEqual(["b", "c", "a"]);

    listing.onSortChange("name", "DESC");
    expect(listing.items.value.map((item) => item.id)).toEqual(["a", "c", "b"]);
  });

  it("shows one page at a time and starts over on a new search", async () => {
    const listing = setup(2);

    listing.page.value = 2;
    expect(listing.items.value.map((item) => item.id)).toEqual(["c"]);

    listing.term.value = "s";
    await nextTick();
    expect(listing.page.value).toBe(1);
  });

  it("clears the search and the filters", () => {
    const listing = setup();
    listing.term.value = "sync";
    listing.appliedFilters.value = [statusFilter("live")];

    listing.clear();

    expect(listing.total.value).toBe(3);
    expect(listing.isFiltered.value).toBe(false);
  });
});
