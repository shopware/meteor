import type { Messages } from "./en";

export const de: Messages = {
  app: {
    title: "Standalone-Playground",
  },
  nav: {
    home: "Start",
    editor: "Editor",
    docs: "Doku",
    releaseNotes: "Versionshinweise",
    settings: "Einstellungen",
    logout: "Abmelden",
    notifications: "Benachrichtigungen",
    help: "Hilfe",
    navigation: "Navigation",
  },
  editor: {
    title: "Editor",
    fullScreen: "Vollbild",
    blocks: "Blöcke",
    properties: "Eigenschaften",
    content: "Inhalt",
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
  copilot: {
    title: "Copilot",
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
    name: "Name",
    email: "E-Mail",
    sections: {
      general: "Allgemein",
      account: "Konto",
      notifications: "Benachrichtigungen",
      layout: "Layout",
    },
    layout: {
      shell: "Shell",
      header: "Kopfzeile",
      customHeader: "Eigene Kopfzeile",
      customHeaderNavigationTrigger:
        "Navigations-Trigger in der eigenen Kopfzeile",
      customHeaderSidebarTrigger:
        "Seitenleisten-Trigger in der eigenen Kopfzeile",
      navigation: "Navigation",
      sidebar: "Seitenleiste",
      off: "Aus",
      open: "Auf dem Desktop immer offen",
      closable: "Auf dem Desktop schließbar",
      thisPage: "Diese Seite",
      thisPageHint: "Gilt, solange die Einstellungen offen sind.",
      inPage: "mt-page verwenden",
      panelTriggers: "Trigger mit mt-app-panel-trigger anzeigen",
      hideHeader: "Kopfzeile ausblenden",
    },
    notifications: {
      orders: "Bestellupdates",
      report: "Wöchentlicher Bericht",
      news: "Produktneuigkeiten",
    },
  },
  notFound: {
    title: "Seite nicht gefunden",
    description: "Die gesuchte Seite gibt es nicht.",
    home: "Zur Startseite",
  },
};
