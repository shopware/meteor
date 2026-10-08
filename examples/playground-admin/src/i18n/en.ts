export const en = {
  app: {
    title: "Meteor playground",
  },
  nav: {
    label: "Main navigation",
    dashboard: "Dashboard",
    cms: "CMS",
    settings: "Settings",
  },
  sidebar: {
    label: "Details",
  },
  dashboard: {
    title: "Admin playground",
    description:
      "A minimal application for trying out the Meteor app shell: navigation, sidebar, drawers on small screens, theme and language.",
  },
  cms: {
    back: "Back",
  },
  notFound: {
    title: "Page not found",
    description: "The page you are looking for doesn't exist.",
    home: "Go to the dashboard",
  },
  settings: {
    title: "User settings",
    language: "Language",
    theme: "Theme",
    reset: "Reset settings",
    resetTitle: "Reset settings?",
    resetText: "Language and theme go back to their defaults.",
    cancel: "Cancel",
    resetDone: "Settings reset",
  },
};

export type Messages = typeof en;
