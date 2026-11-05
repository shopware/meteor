import type { Messages } from "./en";

export const de: Messages = {
  app: {
    title: "Standalone-Playground",
  },
  nav: {
    label: "Haupt",
    home: "Start",
    editor: "Editor",
    docs: "Doku",
    releaseNotes: "Versionshinweise",
    settings: "Einstellungen",
    logout: "Abmelden",
  },
  menu: {
    label: "Menü",
    open: "Menü öffnen",
    close: "Menü schließen",
  },
  pageTree: {
    label: "Seiten",
  },
  editor: {
    title: "Editor",
    fullScreen: "Vollbild",
    blocks: "Blöcke",
    properties: "Eigenschaften",
    content: "Inhalt",
    layouts: "Layouts",
    layoutNames: {
      fullWidth: "Volle Breite",
      sidebarStart: "Seitenleiste links",
      sidebarEnd: "Seitenleiste rechts",
      twoColumns: "Zwei Spalten",
      threeColumns: "Drei Spalten",
    },
    types: {
      heading: "Überschrift",
      text: "Text",
      image: "Bild",
    },
  },
  page: {
    title: "Seite",
    placeholder: "Das ist eine Platzhalterseite.",
  },
  panel: {
    close: "{title} schließen",
  },
  copilot: {
    title: "Copilot",
    open: "Copilot öffnen",
  },
  chat: {
    user: "Du:",
    assistant: "Copilot:",
    message: "Nachricht",
    placeholder: "Frag etwas",
    send: "Senden",
    messages: {
      question: "Welche Seiten müssen noch geprüft werden?",
      answer:
        "Configuration und Production wurden länger nicht bearbeitet. Soll ich sie öffnen?",
      placeholder:
        "Dieser Chat ist ein Platzhalter, deshalb gibt es noch keinen Assistenten.",
    },
  },
  home: {
    title: "Start",
  },
  settings: {
    title: "Einstellungen",
    language: "Sprache",
    theme: "Design",
  },
  notFound: {
    title: "Seite nicht gefunden",
    description: "Die gesuchte Seite gibt es nicht.",
    home: "Zur Startseite",
  },
};
