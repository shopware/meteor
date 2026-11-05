export const en = {
  app: {
    title: "Standalone playground",
  },
  nav: {
    label: "Main",
    home: "Home",
    editor: "Editor",
    docs: "Docs",
    releaseNotes: "Release notes",
    settings: "Settings",
    logout: "Log out",
  },
  menu: {
    label: "Menu",
    open: "Open menu",
    close: "Close menu",
  },
  pageTree: {
    label: "Pages",
  },
  editor: {
    title: "Editor",
    fullScreen: "Full screen",
    blocks: "Blocks",
    properties: "Properties",
    content: "Content",
    layouts: "Layouts",
    layoutNames: {
      fullWidth: "Full width",
      sidebarStart: "Sidebar left",
      sidebarEnd: "Sidebar right",
      twoColumns: "Two columns",
      threeColumns: "Three columns",
    },
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
  panel: {
    close: "Close {title}",
  },
  copilot: {
    title: "Copilot",
    open: "Open Copilot",
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
  },
  notFound: {
    title: "Page not found",
    description: "The page you are looking for doesn't exist.",
    home: "Go to the start page",
  },
};

export type Messages = typeof en;
