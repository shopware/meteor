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
    search: "Search",
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
  context: {
    switch: "Switch team",
    plan: "{plan} plan",
    create: "Create a team",
    manage: "Manage team",
    invite: "Invite members",
  },
  help: {
    label: "Help",
    documentation: "Documentation",
    support: "Request support",
    shortcuts: "Keyboard shortcuts",
    whatsNew: "What's new",
  },
  menu: {
    label: "Menu",
    open: "Open menu",
    close: "Close menu",
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
