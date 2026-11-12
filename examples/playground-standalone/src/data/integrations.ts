// Placeholder data: fictional services, except for Shopware itself. Like the rest of the mock
// content, the descriptions are English only.

export const integrationCategories = [
  { id: "commerce", icon: "regular-storefront" },
  { id: "erp", icon: "regular-briefcase" },
  { id: "marketing", icon: "regular-megaphone" },
  { id: "messaging", icon: "regular-comments" },
  { id: "files", icon: "regular-folder" },
] as const;

export type IntegrationCategory = (typeof integrationCategories)[number]["id"];

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  /** The mark on the logo. */
  icon: string;
  /** The logo's color, as a Meteor palette token. */
  color: string;
  /** How many accounts are connected. */
  connections: number;
  /** How many automations use it. */
  usage: number;
}

export const integrations: Integration[] = [
  {
    id: "shopware",
    name: "Shopware",
    category: "commerce",
    description:
      "Sync orders, customers and products with your Shopware store.",
    icon: "regular-shopware",
    color: "--color-brand-500",
    connections: 2,
    usage: 14,
  },
  {
    id: "stockpile",
    name: "Stockpile",
    category: "commerce",
    description:
      "Keep stock levels in line across warehouses and sales channels.",
    icon: "regular-warehouse",
    color: "--color-emerald-600",
    connections: 1,
    usage: 3,
  },
  {
    id: "catalogue",
    name: "Catalogue PIM",
    category: "commerce",
    description:
      "Pull enriched product data, media and translations into your catalog.",
    icon: "regular-products",
    color: "--color-purple-600",
    connections: 0,
    usage: 0,
  },
  {
    id: "northwind",
    name: "Northwind ERP",
    category: "erp",
    description:
      "Create and update customers, orders and invoices in your ERP.",
    icon: "regular-chart-bar",
    color: "--color-blue-700",
    connections: 1,
    usage: 6,
  },
  {
    id: "ledgerly",
    name: "Ledgerly",
    category: "erp",
    description: "Send invoices and payments to your accounting.",
    icon: "regular-receipt",
    color: "--color-green-600",
    connections: 1,
    usage: 0,
  },
  {
    id: "freightline",
    name: "Freightline",
    category: "erp",
    description: "Book shipments and pull tracking updates for your orders.",
    icon: "regular-truck",
    color: "--color-pumpkin-600",
    connections: 0,
    usage: 0,
  },
  {
    id: "beacon",
    name: "Beacon CRM",
    category: "marketing",
    description: "Keep contacts, companies and deals up to date in your CRM.",
    icon: "regular-users",
    color: "--color-pink-600",
    connections: 1,
    usage: 5,
  },
  {
    id: "inkwell",
    name: "Inkwell Mail",
    category: "marketing",
    description: "Add customers to newsletters and send transactional emails.",
    icon: "regular-envelope",
    color: "--color-orange-600",
    connections: 0,
    usage: 2,
  },
  {
    id: "spotlight",
    name: "Spotlight Ads",
    category: "marketing",
    description: "Sync audiences and conversions with your ad campaigns.",
    icon: "regular-megaphone",
    color: "--color-red-600",
    connections: 0,
    usage: 0,
  },
  {
    id: "relay",
    name: "Relay Chat",
    category: "messaging",
    description: "Post messages to channels when something needs attention.",
    icon: "regular-comments",
    color: "--color-cyan-600",
    connections: 1,
    usage: 4,
  },
  {
    id: "pigeon",
    name: "Pigeon SMS",
    category: "messaging",
    description: "Text customers about orders, deliveries and returns.",
    icon: "regular-paper-plane",
    color: "--color-blue-500",
    connections: 0,
    usage: 0,
  },
  {
    id: "driftbox",
    name: "Driftbox",
    category: "files",
    description: "Read and write files in shared cloud folders.",
    icon: "regular-cloud",
    color: "--color-slate-600",
    connections: 1,
    usage: 2,
  },
  {
    id: "gridsheet",
    name: "Gridsheet",
    category: "files",
    description: "Read rows from spreadsheets and write reports back.",
    icon: "regular-table",
    color: "--color-green-500",
    connections: 0,
    usage: 3,
  },
  {
    id: "sftp",
    name: "SFTP",
    category: "files",
    description: "Exchange files with partners over a secure connection.",
    icon: "regular-server",
    color: "--color-zinc-600",
    connections: 0,
    usage: 0,
  },
];

export function findIntegration(id: string) {
  return integrations.find((integration) => integration.id === id);
}
