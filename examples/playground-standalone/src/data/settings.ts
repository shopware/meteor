/** A switch with its label and description, or `null` for a placeholder in its place. */
type SwitchRow = { setting: string; on: boolean } | null;

/** A card of the settings, by the layout of its content. */
export type SettingsCard = { id: string } & (
  | { layout: "switches"; rows: SwitchRow[] }
  | { layout: "fields"; fields: number; inline?: boolean }
  | {
      layout: "members";
      owner: { firstName: string; lastName: string; email: string };
      placeholders: number;
    }
  | { layout: "plan"; plan: string; runs: number; limit: number }
  | { layout: "payment" }
  | { layout: "invoices"; rows: number }
);

interface SettingsSection {
  id: string;
  icon: string;
  groups: { id: string; cards: SettingsCard[] }[];
}

// The sections of the settings, each its own route, with the headlines and cards they show.
export const settingsSections: SettingsSection[] = [
  {
    id: "general",
    icon: "regular-cog",
    groups: [
      {
        id: "workspace",
        cards: [
          { id: "profile", layout: "fields", fields: 2 },
          { id: "region", layout: "fields", fields: 2, inline: true },
        ],
      },
      {
        id: "workflows",
        cards: [
          {
            id: "defaults",
            layout: "switches",
            rows: [
              { setting: "retry", on: true },
              { setting: "saveRuns", on: false },
              null,
            ],
          },
        ],
      },
    ],
  },
  {
    id: "members",
    icon: "regular-users",
    groups: [
      {
        id: "team",
        cards: [
          {
            id: "members",
            layout: "members",
            owner: {
              firstName: "Alastair",
              lastName: "Fraser",
              email: "alastair.fraser@example.com",
            },
            placeholders: 3,
          },
        ],
      },
      {
        id: "access",
        cards: [
          {
            id: "sso",
            layout: "switches",
            rows: [{ setting: "requireSso", on: false }, null],
          },
          { id: "roles", layout: "switches", rows: [null, null, null] },
        ],
      },
    ],
  },
  {
    id: "notifications",
    icon: "regular-bell",
    groups: [
      {
        id: "channels",
        cards: [
          {
            id: "email",
            layout: "switches",
            rows: [
              { setting: "emailFailures", on: true },
              { setting: "weeklySummary", on: true },
              null,
            ],
          },
          {
            id: "slack",
            layout: "switches",
            rows: [{ setting: "slackFailures", on: false }, null],
          },
        ],
      },
      {
        id: "alerts",
        cards: [
          { id: "thresholds", layout: "fields", fields: 2, inline: true },
        ],
      },
    ],
  },
  {
    id: "billing",
    icon: "regular-credit-card",
    groups: [
      {
        id: "plan",
        cards: [
          {
            id: "currentPlan",
            layout: "plan",
            plan: "Team",
            runs: 1240,
            limit: 5000,
          },
        ],
      },
      {
        id: "payment",
        cards: [
          { id: "paymentMethod", layout: "payment" },
          { id: "invoices", layout: "invoices", rows: 3 },
        ],
      },
    ],
  },
];
