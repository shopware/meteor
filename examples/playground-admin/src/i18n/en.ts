export const en = {
  app: {
    title: "Meteor playground",
  },
  nav: {
    label: "Main navigation",
    dashboard: "Dashboard",
    products: "Products",
    cms: "CMS",
    settings: "Settings",
  },
  dashboard: {
    title: "Admin playground",
    description:
      "A minimal application for trying out the Meteor app shell: header, sidebars, drawers on small screens, theme and language.",
  },
  products: {
    title: "Products",
    name: "Product",
    sku: "Product number",
    category: "Category",
    stock: "Stock",
    price: "Price",
    categories: {
      lighting: "Lighting",
      textiles: "Home textiles",
      kitchen: "Kitchen",
      apparel: "Apparel",
      footwear: "Footwear",
      accessories: "Accessories",
    },
  },
  cms: {
    back: "Back",
  },
  settings: {
    userTitle: "User settings",
    language: "Language",
    theme: "Theme",
    shellTitle: "App shell",
    header: "Header",
    sidebarStart: "Start sidebar",
    sidebarEnd: "End sidebar",
    openModal: "Open modal",
    modalTitle: "Modal",
    modalText: "A modal opened from inside the shell.",
    close: "Close",
    showNotification: "Show notification",
    notification: "Notification from the snackbar host",
  },
};

export type Messages = typeof en;
