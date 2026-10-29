import type {
  Criteria,
  Entities,
  EntityName,
  OrderStatistics,
  Product,
  SearchResult,
} from "../shared/types";
import {
  categories,
  deliveryTimes,
  manufacturers,
  products,
  salesChannels,
  tags,
  taxes,
} from "./catalog";
import { calculateOrder, orders } from "./orders";
import { createRandom } from "./random";

/**
 * An in-memory stand-in for the Admin API. It keeps the generated data and the changes until the
 * page reloads.
 */
const store: { [Name in EntityName]: Entities[Name][] } = {
  product: products,
  order: orders,
  manufacturer: manufacturers,
  category: categories,
  salesChannel: salesChannels,
  deliveryTime: deliveryTimes,
  tax: taxes,
  tag: tags,
};

/** The properties the search term is matched against. */
const searchableProperties: { [Name in EntityName]: string[] } = {
  product: ["name", "productNumber", "manufacturerName", "ean"],
  order: ["orderNumber", "customerName", "customer.email", "customer.company"],
  manufacturer: ["name"],
  category: ["name"],
  salesChannel: ["name"],
  deliveryTime: ["name"],
  tax: ["name"],
  tag: ["name"],
};

const random = createRandom(3);

function getPath(item: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) => (value as Record<string, unknown> | null)?.[key],
      item,
    );
}

function compare(a: unknown, b: unknown) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean")
    return Number(a) - Number(b);

  return String(a ?? "").localeCompare(String(b ?? ""));
}

/** The stock minus the quantities of the orders that aren't shipped yet. */
function withAvailableStock(product: Product): Product {
  const reserved = store.order
    .filter(
      (order) => order.state !== "cancelled" && order.deliveryState === "open",
    )
    .flatMap((order) => order.lineItems)
    .filter((item) => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  return { ...product, availableStock: product.stock - reserved };
}

function prepare<Name extends EntityName>(
  name: Name,
  item: Entities[Name],
): Entities[Name] {
  if (name === "product") {
    const product = item as Product;
    const manufacturer = manufacturers.find(
      (entry) => entry.id === product.manufacturerId,
    );

    return withAvailableStock({
      ...product,
      manufacturerName: manufacturer?.name ?? null,
    }) as Entities[Name];
  }

  if (name === "order") {
    return calculateOrder(item as Entities["order"]) as Entities[Name];
  }

  return item;
}

store.product = store.product.map((product) => prepare("product", product));

export function search<Name extends EntityName>(
  name: Name,
  criteria: Criteria,
): SearchResult<Entities[Name]> {
  const term = criteria.term?.trim().toLowerCase();

  let items = store[name].filter((item) => {
    const matchesTerm =
      !term ||
      searchableProperties[name].some((path) =>
        String(getPath(item, path) ?? "")
          .toLowerCase()
          .includes(term),
      );

    // A list property, such as `categoryIds`, matches when one of its entries is accepted.
    const matchesFilters = Object.entries(criteria.filters ?? {}).every(
      ([path, values]) => {
        const value = getPath(item, path);

        if (values.length === 0) return true;
        if (Array.isArray(value)) {
          return value.some((entry) => values.includes(String(entry)));
        }

        return values.includes(String(value));
      },
    );

    return matchesTerm && matchesFilters;
  });

  if (criteria.sortBy) {
    const direction = criteria.sortDirection === "DESC" ? -1 : 1;
    const sortBy = criteria.sortBy;

    items = [...items].sort(
      (a, b) => compare(getPath(a, sortBy), getPath(b, sortBy)) * direction,
    );
  }

  const start = (criteria.page - 1) * criteria.limit;

  return {
    data: items.slice(start, start + criteria.limit),
    total: items.length,
  };
}

export function get<Name extends EntityName>(
  name: Name,
  id: string,
): Entities[Name] | null {
  return store[name].find((item) => item.id === id) ?? null;
}

/** Creates the entity when it has no id yet, and updates it otherwise. */
export function save<Name extends EntityName>(
  name: Name,
  item: Entities[Name],
): Entities[Name] {
  const isNew = !item.id;
  const entity = { ...item, id: isNew ? random.id() : item.id };

  if (name === "product") {
    const product = entity as Product;
    const now = new Date().toISOString();

    product.createdAt = isNew ? now : product.createdAt;
    product.updatedAt = isNew ? null : now;
  }

  const saved = prepare(name, entity);

  const list = store[name];
  const index = list.findIndex((entry) => entry.id === saved.id);

  if (index === -1) list.unshift(saved);
  else list[index] = saved;

  return saved;
}

export function remove(name: EntityName, ids: string[]) {
  store[name] = store[name].filter((item) => !ids.includes(item.id)) as never;
}

/** The orders and the turnover of the last days, like the dashboard's statistics endpoint. */
export function orderStatistics(days: number): OrderStatistics {
  const toDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const buckets = new Map<string, { orders: number; turnover: number }>();
  const today = new Date();
  const todayKey = toDate(today);
  let todayTotal = 0;

  for (let day = days - 1; day >= 0; day--) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - day,
    );
    buckets.set(toDate(date), { orders: 0, turnover: 0 });
  }

  for (const order of store.order) {
    const key = toDate(new Date(order.orderDateTime));
    const bucket = buckets.get(key);
    if (!bucket) continue;

    bucket.orders += 1;
    if (order.paymentState === "paid") bucket.turnover += order.amountTotal;
    if (key === todayKey) todayTotal += order.amountTotal;
  }

  return {
    today: { orders: buckets.get(todayKey)?.orders ?? 0, total: todayTotal },
    days: [...buckets].map(([date, bucket]) => ({ date, ...bucket })),
  };
}
