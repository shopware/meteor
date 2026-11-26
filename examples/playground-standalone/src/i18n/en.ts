export const en = {
  app: {
    title: "Standalone playground",
  },
  nav: {
    home: "Home",
    editor: "Editor",
    docs: "Docs",
    releaseNotes: "Release notes",
    settings: "Settings",
    logout: "Log out",
    notifications: "Notifications",
    help: "Help",
    navigation: "Navigation",
  },
  editor: {
    title: "Editor",
    fullScreen: "Full screen",
    blocks: "Blocks",
    properties: "Properties",
    content: "Content",
    types: {
      heading: "Heading",
      text: "Text",
      image: "Image",
    },
  },
  page: {
    title: "Page",
    placeholder: "This is a placeholder page.",
  },
  copilot: {
    title: "Copilot",
  },
  chat: {
    user: "You:",
    assistant: "Copilot:",
    message: "Message",
    placeholder: "Ask something",
    send: "Send",
    messages: {
      question: "Which pages still need a review?",
      answer:
        "Configuration and Production were last edited a while ago. Want me to open them?",
      placeholder: "This chat is a placeholder, so there is no assistant yet.",
    },
  },
  home: {
    title: "Home",
  },
  settings: {
    title: "Settings",
    language: "Language",
    theme: "Theme",
    name: "Name",
    email: "Email",
    sections: {
      general: "General",
      account: "Account",
      notifications: "Notifications",
      layout: "Layout",
    },
    layout: {
      shell: "Shell",
      header: "Header",
      customHeader: "Custom header",
      customHeaderNavigationTrigger: "Navigation trigger in the custom header",
      customHeaderSidebarTrigger: "Sidebar trigger in the custom header",
      navigation: "Navigation",
      sidebar: "Sidebar",
      off: "Off",
      open: "Always open on desktop",
      closable: "Closable on desktop",
      thisPage: "This page",
      thisPageHint: "Applies while the settings are open.",
      inPage: "Use mt-page",
      panelTriggers: "Show the triggers with mt-app-panel-trigger",
      hideHeader: "Hide the header",
    },
    notifications: {
      orders: "Order updates",
      report: "Weekly report",
      news: "Product news",
    },
  },
  notFound: {
    title: "Page not found",
    description: "The page you are looking for doesn't exist.",
    home: "Go to the start page",
  },
};

export type Messages = typeof en;
