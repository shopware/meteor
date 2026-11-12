// Placeholder data: generated from a few verbs, objects and integrations, so the list is long enough
// to search, filter, sort and page through. Like the rest of the mock content, it is English only.

export type AutomationStatus = "live" | "paused" | "draft" | "failed";

export interface Automation {
  id: string;
  name: string;
  status: AutomationStatus;
  /** Why it can't run as it should, if it can't. */
  attention?: "failed" | "missingAccount";
  /** The integrations of its steps, in order. */
  steps: string[];
  updatedMinutesAgo: number;
}

const verbs = ["Sync", "Export", "Import", "Mirror", "Notify about"];
const objects = [
  "orders",
  "customers",
  "products",
  "invoices",
  "stock levels",
  "shipments",
];
const routes: [from: string, to: string, middle?: string][] = [
  ["shopware", "northwind"],
  ["northwind", "shopware", "sftp"],
  ["shopware", "beacon"],
  ["stockpile", "shopware"],
  ["shopware", "ledgerly"],
  ["beacon", "inkwell"],
  ["shopware", "relay"],
  ["gridsheet", "shopware"],
  ["driftbox", "northwind"],
];
const statuses: AutomationStatus[] = [
  "live",
  "live",
  "draft",
  "live",
  "paused",
  "live",
  "failed",
  "draft",
];
const names: Record<string, string> = {
  shopware: "Shopware",
  northwind: "Northwind ERP",
  beacon: "Beacon CRM",
  stockpile: "Stockpile",
  ledgerly: "Ledgerly",
  inkwell: "Inkwell Mail",
  relay: "Relay Chat",
  gridsheet: "Gridsheet",
  driftbox: "Driftbox",
  sftp: "SFTP",
};

export const automations: Automation[] = Array.from(
  { length: 32 },
  (_, index) => {
    const verb = verbs[index % verbs.length];
    const object = objects[(index * 7) % objects.length];
    const [from, to, middle] = routes[(index * 5) % routes.length];
    const status = statuses[index % statuses.length];
    // Steps on an integration without a connected account can't run.
    const missingAccount = [from, to].some((id) =>
      ["inkwell", "gridsheet"].includes(id),
    );

    return {
      id: `automation-${index + 1}`,
      name:
        verb === "Notify about"
          ? `Notify about ${object} from ${names[from]} in ${names[to]}`
          : `${verb} ${object} from ${names[from]} to ${names[to]}`,
      status,
      attention:
        status === "failed"
          ? "failed"
          : missingAccount && status !== "draft"
            ? "missingAccount"
            : undefined,
      steps: middle ? [from, middle, to] : [from, to],
      updatedMinutesAgo: 6 + index * index * 11,
    };
  },
);
