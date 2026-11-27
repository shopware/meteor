import type { Brand } from "../components/IntegrationLogo.vue";

export const nodeIcons = {
  schedule: "regular-clock",
  hubspot: "regular-megaphone",
  transform: "regular-shuffle",
  shopware: "solid-shopware",
} as const;

export type Node = keyof typeof nodeIcons;

const steps: Node[] = ["schedule", "hubspot", "transform", "shopware"];

// Example workflows without real data behind them.
export const workflows = [
  {
    id: "export-customers",
    name: "Export new customers from Shopware to HubSpot",
    description: "Creates HubSpot contacts for new Shopware accounts.",
    status: "draft",
    steps,
    updatedMinutesAgo: 2,
  },
  {
    id: "sync-subscribers",
    name: "Sync newsletter subscribers from HubSpot to Shopware",
    description: "Keeps Shopware newsletter subscribers in line with HubSpot.",
    status: "draft",
    steps,
    updatedMinutesAgo: 2,
  },
  {
    id: "sync-orders",
    name: "Sync orders from Shopware to HubSpot",
    description: "Creates HubSpot deals for new Shopware orders every hour.",
    status: "draft",
    steps,
    updatedMinutesAgo: 2,
  },
];

/** The names of the brands that templates use. */
export const brandNames = {
  shopware: "Shopware",
  googleDrive: "Google Drive",
  dropbox: "Dropbox",
  slack: "Slack",
  discord: "Discord",
} satisfies Partial<Record<Brand, string>>;

export type TemplateBrand = keyof typeof brandNames;

// Example templates without real data behind them. Using one opens it in the workflow editor.
export const templates: {
  id: string;
  name: string;
  description: string;
  steps: TemplateBrand[];
}[] = [
  {
    id: "shopware-orders-to-google-drive",
    name: "Shopware Orders to Google Drive",
    description:
      "Save every new Shopware order as a row in a Google Drive spreadsheet, ready for reporting.",
    steps: ["shopware", "googleDrive"],
  },
  {
    id: "dropbox-images-to-shopware-products",
    name: "Dropbox Images to Shopware Products",
    description:
      "Add new images from a Dropbox folder to matching Shopware products and report in Slack.",
    steps: ["dropbox", "shopware", "slack"],
  },
  {
    id: "shopware-reviews-to-discord",
    name: "Shopware Reviews to Discord",
    description:
      "Post new Shopware product reviews to a Discord channel and send a daily summary to Slack.",
    steps: ["shopware", "discord", "slack"],
  },
];
