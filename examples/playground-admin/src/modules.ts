import type { BadgeVariant } from "./components/ModuleCell.vue";
import { manufacturers, products, salesChannels } from "../server/catalog";
import { customerAccounts } from "../server/orders";
import { createRandom } from "../server/random";

/**
 * The modules the playground shows as a plain list with mock rows: their columns, the button in
 * the header and the rows. Labels are i18n keys below `modules.<key>`.
 */

export type CellType =
  | "link"
  | "text"
  | "number"
  | "boolean"
  | "stars"
  | "relative"
  | "date"
  | "badge"
  | "media";

export interface ModuleColumn {
  key: string;
  type?: CellType;
  align?: "start" | "end" | "center";
  /** The badge variant per value, for `badge` cells. */
  variants?: Record<string, BadgeVariant>;
}

export interface ModuleConfig {
  /** Whether the header has an add button, labelled `modules.<key>.add`. */
  add: boolean;
  columns: ModuleColumn[];
  rows: () => Record<string, unknown>[];
}

const random = createRandom(7);

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString();

const reviewTitles = [
  "Exactly as described",
  "Great quality for the price",
  "Arrived quickly, well packed",
  "Nice, but runs a bit small",
  "Would buy again",
  "Not what I expected",
  "My new favourite",
  "Solid and well made",
  "Colour is slightly different",
  "Perfect gift",
  "Good, but delivery took long",
  "Five stars from me",
];

const reviews = () =>
  reviewTitles.map((title, index) => {
    const customer = random.pick(customerAccounts);
    const points = random.pick([5, 5, 4, 4, 3, 2, 5, 4]);

    return {
      id: `review-${index}`,
      title,
      points,
      product: random.pick(products).name,
      customer: `${customer.lastName}, ${customer.firstName}`,
      createdAt: daysAgo(random.int(0, 90)),
      status: random.chance(0.75),
      comment: random.chance(0.3),
    };
  });

const productStreams = () =>
  [
    ["Bestsellers", "Products with more than 100 sales"],
    ["New arrivals", "Released within the last 30 days"],
    ["Sale", "Products with a list price"],
    ["Low stock", "Stock below 10"],
    ["Coffee lovers", "Everything from the Coffee & tea category"],
    ["Free shipping", "Products shipped free of charge"],
    ["Outdoor season", "Outdoor and garden products in stock"],
  ].map(([name, description], index) => ({
    id: `stream-${index}`,
    name,
    description,
    updatedAt: daysAgo(random.int(1, 60)),
    status: index === 4 ? "Invalid" : "Valid",
  }));

const properties = () =>
  [
    ["Color", ["Black", "White", "Blue", "Green", "Red", "Sand"], true],
    ["Size", ["XS", "S", "M", "L", "XL"], true],
    ["Material", ["Cotton", "Linen", "Merino", "Leather"], true],
    ["Shoe size", ["38", "39", "40", "41", "42", "43", "44"], true],
    ["Fit", ["Slim", "Regular", "Relaxed"], false],
    ["Roast", ["Light", "Medium", "Dark"], true],
    ["Wattage", ["4 W", "6 W", "9 W"], false],
  ].map(([name, values, filterable], index) => {
    const list = values as string[];

    return {
      id: `property-${index}`,
      name,
      values:
        list.slice(0, 4).join(", ") + (list.length > 4 ? ", ..." : ""),
      description: "",
      filterable,
    };
  });

const manufacturerRows = () =>
  manufacturers.map((manufacturer) => ({
    id: manufacturer.id,
    name: manufacturer.name,
    website: `https://www.${manufacturer.name
      .toLowerCase()
      .replace(/[^a-z]+/g, "")}.example`,
  }));

const promotions = () =>
  [
    ["Summer sale 15%", true, 20, -20],
    ["Free shipping over €50", true, 120, null],
    ["Welcome 10", true, 300, null],
    ["Black Friday", false, -3, -6],
    ["Buy 3, pay 2: Coffee", true, 14, -14],
    ["Newsletter 5 € voucher", true, 60, -30],
    ["Spring clearance", false, 200, 140],
  ].map(([name, active, from, until], index) => ({
    id: `promotion-${index}`,
    name,
    active,
    validFrom: daysAgo(from as number),
    validUntil: until === null ? null : daysAgo(until as number),
  }));

const newsletter = () =>
  customerAccounts.slice(0, 18).map((customer, index) => ({
    id: `recipient-${index}`,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    status: random.pick([
      "Subscribed",
      "Subscribed",
      "Subscribed",
      "Not yet confirmed",
      "Unsubscribed",
    ]),
    salesChannel: salesChannels[0].name,
    createdAt: daysAgo(random.int(1, 300)),
  }));

const rules = () =>
  [
    ["Always valid (Default)", 100, "Matches every cart and customer"],
    ["Cart >= 0 (Payment)", 1, ""],
    ["Customers from Germany", 10, "Billing country is Germany"],
    ["Free shipping over €50", 20, "Cart amount is at least €50"],
    ["New customers", 5, "First order of the customer"],
    ["VIP customers", 50, "Customer group is VIP"],
    ["Weekend orders", 1, "Order placed on Saturday or Sunday"],
    ["Wholesale", 30, "Customer group is Net customer group"],
  ].map(([name, priority, description], index) => ({
    id: `rule-${index}`,
    name,
    priority,
    description,
    updatedAt: daysAgo(random.int(1, 200)),
  }));

const flows = () =>
  [
    ["Order placed", "Checkout / Order / Placed", true],
    ["Order enters status in progress", "State / Order / In progress", true],
    ["Order enters status cancelled", "State / Order / Cancelled", true],
    ["Order enters status done", "State / Order / Done", true],
    ["Payment enters status paid", "State / Payment / Paid", true],
    ["Delivery enters status shipped", "State / Delivery / Shipped", true],
    ["Customer registered", "Checkout / Customer / Register", true],
    ["Newsletter double opt-in", "Newsletter / Register", false],
    ["Contact form sent", "Contact form / Send", true],
    ["Password recovery", "Customer / Recovery / Request", true],
  ].map(([name, trigger, active], index) => ({
    id: `flow-${index}`,
    name,
    active,
    trigger,
    description: "",
  }));

const extensions = () =>
  [
    ["PayPal", "shopware AG", "9.6.4", true],
    ["Shopware Analytics", "shopware AG", "2.4.0", true],
    ["Shopware Copilot", "shopware AG", "1.8.2", true],
    ["Migration Assistant", "shopware AG", "13.1.0", false],
    ["Digital Sales Rooms", "shopware AG", "3.0.1", false],
    ["Mollie Payments", "Mollie B.V.", "4.14.0", true],
  ].map(([name, producer, version, active], index) => ({
    id: `extension-${index}`,
    name,
    producer,
    version,
    active,
    installedAt: daysAgo(random.int(5, 400)),
  }));

export const modules = {
  reviews: {
    add: false,
    columns: [
      { key: "title", type: "link" },
      { key: "points", type: "stars" },
      { key: "product" },
      { key: "customer" },
      { key: "createdAt", type: "relative" },
      { key: "status", type: "boolean", align: "center" },
      { key: "comment", type: "boolean", align: "center" },
    ],
    rows: reviews,
  },
  productStreams: {
    add: true,
    columns: [
      { key: "name", type: "link" },
      { key: "description" },
      { key: "updatedAt", type: "relative", align: "end" },
      {
        key: "status",
        type: "badge",
        variants: { Valid: "positive", Invalid: "critical" },
      },
    ],
    rows: productStreams,
  },
  properties: {
    add: true,
    columns: [
      { key: "name", type: "link" },
      { key: "values" },
      { key: "description" },
      { key: "filterable", type: "boolean", align: "center" },
    ],
    rows: properties,
  },
  manufacturers: {
    add: true,
    columns: [{ key: "name", type: "media" }, { key: "website" }],
    rows: manufacturerRows,
  },
  promotions: {
    add: true,
    columns: [
      { key: "name", type: "link" },
      { key: "active", type: "boolean", align: "center" },
      { key: "validFrom", type: "date" },
      { key: "validUntil", type: "date" },
    ],
    rows: promotions,
  },
  newsletter: {
    add: false,
    columns: [
      { key: "email", type: "link" },
      { key: "firstName" },
      { key: "lastName" },
      {
        key: "status",
        type: "badge",
        variants: {
          Subscribed: "positive",
          "Not yet confirmed": "attention",
          Unsubscribed: "neutral",
        },
      },
      { key: "salesChannel" },
      { key: "createdAt", type: "relative" },
    ],
    rows: newsletter,
  },
  rules: {
    add: true,
    columns: [
      { key: "name", type: "link" },
      { key: "priority", type: "number", align: "end" },
      { key: "description" },
      { key: "updatedAt", type: "relative" },
    ],
    rows: rules,
  },
  flows: {
    add: true,
    columns: [
      { key: "name", type: "link" },
      { key: "active", type: "boolean", align: "center" },
      { key: "trigger" },
      { key: "description" },
    ],
    rows: flows,
  },
  myExtensions: {
    add: false,
    columns: [
      { key: "name", type: "media" },
      { key: "producer" },
      { key: "version", align: "end" },
      { key: "active", type: "boolean", align: "center" },
      { key: "installedAt", type: "relative" },
    ],
    rows: extensions,
  },
} satisfies Record<string, ModuleConfig>;

export type ModuleKey = keyof typeof modules;
