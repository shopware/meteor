import type { Messages } from "./en";

export const de: Messages = {
  app: {
    title: "Meteor Playground",
  },
  nav: {
    label: "Hauptnavigation",
    dashboard: "Dashboard",
    products: "Produkte",
    cms: "CMS",
    settings: "Einstellungen",
  },
  dashboard: {
    title: "Admin-Playground",
    description:
      "Eine minimale Anwendung zum Ausprobieren der Meteor App-Shell: Kopfzeile, Seitenleisten, Drawer auf kleinen Bildschirmen, Design und Sprache.",
  },
  products: {
    title: "Produkte",
    name: "Produkt",
    sku: "Produktnummer",
    category: "Kategorie",
    stock: "Bestand",
    price: "Preis",
    categories: {
      lighting: "Beleuchtung",
      textiles: "Heimtextilien",
      kitchen: "Küche",
      apparel: "Bekleidung",
      footwear: "Schuhe",
      accessories: "Accessoires",
    },
  },
  cms: {
    back: "Zurück",
  },
  settings: {
    userTitle: "Benutzereinstellungen",
    language: "Sprache",
    theme: "Design",
    shellTitle: "App-Shell",
    header: "Kopfzeile",
    sidebarStart: "Start-Seitenleiste",
    sidebarEnd: "End-Seitenleiste",
    openModal: "Modal öffnen",
    modalTitle: "Modal",
    modalText: "Ein Modal, das innerhalb der Shell geöffnet wurde.",
    close: "Schließen",
    showNotification: "Benachrichtigung anzeigen",
    notification: "Benachrichtigung vom Snackbar-Host",
  },
};
