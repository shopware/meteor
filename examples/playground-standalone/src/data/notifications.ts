// Placeholder data: what the inbox shows. The texts are translated from the type, with the names
// put in.

export interface Notification {
  id: string;
  type: "failed" | "missingAccount" | "memberJoined" | "integrationAdded";
  /** The automation, member or integration it is about. */
  subject: string;
  /** A second name, such as the integration an automation needs an account for. */
  detail?: string;
  minutesAgo: number;
  read: boolean;
}

export const notifications: Notification[] = [
  {
    id: "notification-1",
    type: "failed",
    subject: "Export invoices from Shopware to Ledgerly",
    minutesAgo: 38,
    read: false,
  },
  {
    id: "notification-2",
    type: "missingAccount",
    subject: "Sync customers from Beacon CRM to Inkwell Mail",
    detail: "Inkwell Mail",
    minutesAgo: 3 * 60,
    read: false,
  },
  {
    id: "notification-3",
    type: "failed",
    subject: "Import stock levels from Stockpile to Shopware",
    minutesAgo: 9 * 60,
    read: false,
  },
  {
    id: "notification-4",
    type: "memberJoined",
    subject: "Felix Koch",
    minutesAgo: 3 * 24 * 60,
    read: true,
  },
  {
    id: "notification-5",
    type: "integrationAdded",
    subject: "Relay Chat",
    minutesAgo: 6 * 24 * 60,
    read: true,
  },
];
