import type { Messages } from "./en";

export const de: Messages = {
  app: {
    title: "Standalone-Playground",
  },
  nav: {
    home: "Start",
    automations: "Automatisierungen",
    integrations: "Integrationen",
    members: "Mitglieder",
    editor: "Editor",
    docs: "Doku",
    settings: "Einstellungen",
    logout: "Abmelden",
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
  context: {
    switch: "Team wechseln",
    create: "Team erstellen",
    manage: "Team verwalten",
    invite: "Mitglieder einladen",
  },
  help: {
    label: "Hilfe",
    documentation: "Dokumentation",
    support: "Support anfragen",
    shortcuts: "Tastenkürzel",
    whatsNew: "Neuigkeiten",
  },
  menu: {
    label: "Menü",
    open: "Menü öffnen",
    close: "Menü schließen",
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
    },
    notifications: {
      orders: "Bestellupdates",
      report: "Wöchentlicher Bericht",
      news: "Produktneuigkeiten",
    },
  },
  automations: {
    title: "Automatisierungen",
    description:
      "Automatisiere die Arbeit zwischen deinem Shop und deinen Tools.",
    templates: "Vorlagen",
    create: "Automatisierung erstellen",
    banner: {
      title:
        "{count} Automatisierung braucht Aufmerksamkeit | {count} Automatisierungen brauchen Aufmerksamkeit",
      text: "Sie sind fehlgeschlagen oder ihnen fehlt ein Konto, deshalb laufen sie nicht wie vorgesehen.",
      show: "Anzeigen",
    },
    columns: {
      name: "Name",
      status: "Status",
      steps: "Schritte",
      updated: "Geändert",
    },
    filters: {
      status: "Status",
      integration: "Integration",
      attention: "Aufmerksamkeit",
      needsAttention: "Braucht Aufmerksamkeit",
    },
    statuses: {
      live: "Live",
      paused: "Pausiert",
      draft: "Entwurf",
      failed: "Fehlgeschlagen",
    },
    reasons: {
      failed: "Der letzte Lauf ist fehlgeschlagen.",
      missingAccount: "Ein Schritt braucht ein verbundenes Konto.",
    },
    empty: {
      headline: "Noch keine Automatisierungen",
      description:
        "Erstelle eine, um deinen Shop mit deinen Tools zu verbinden.",
      filteredHeadline: "Keine passenden Automatisierungen",
      filteredDescription: "Versuche eine andere Suche oder weniger Filter.",
      clear: "Filter zurücksetzen",
    },
  },
  integrations: {
    title: "Integrationen",
    description:
      "Verbinde die Dienste und Tools, mit denen deine Automatisierungen arbeiten.",
    addCustom: "Eigene Integration hinzufügen",
    search: "Integrationen durchsuchen",
    categoriesLabel: "Kategorien",
    all: "Alle",
    connected: "Verbunden",
    categories: {
      commerce: "Commerce",
      erp: "ERP & Logistik",
      marketing: "CRM & Marketing",
      messaging: "Nachrichten",
      files: "Dateien & Speicher",
    },
    status: {
      connected: "Verbunden | Verbunden | {count} Verbindungen",
      missing: "Braucht ein Konto",
    },
    usage: {
      none: "Noch nicht verwendet",
      count:
        "In {count} Automatisierung verwendet | In {count} Automatisierungen verwendet",
    },
    connect: "Verbinden",
    manage: "Verwalten",
    setup: {
      title: "{name} verbinden",
      apiKey: "API-Schlüssel",
      note: "Der Schlüssel wird verschlüsselt und nur zum Ausführen deiner Automatisierungen verwendet.",
      cancel: "Abbrechen",
      connect: "Verbinden",
      connected: "{name} ist verbunden.",
    },
    empty: {
      headline: "Keine passenden Integrationen",
      description: "Versuche eine andere Suche oder Kategorie.",
      clear: "Alle Integrationen anzeigen",
    },
  },
  members: {
    title: "Mitglieder",
    description:
      "Wer in diesem Team arbeitet, mit welcher Rolle, und offene Einladungen.",
    invite: "Mitglied einladen",
    search: "Nach Name oder E-Mail suchen",
    allRoles: "Alle Rollen",
    roles: {
      admin: "Admin",
      builder: "Builder",
      viewer: "Betrachter",
    },
    you: "Du",
    joined: "Beigetreten {time}",
    pending: "Offene Einladungen",
    list: "Mitglieder",
    columns: {
      email: "E-Mail",
      role: "Rolle",
      status: "Status",
      expires: "Läuft ab",
    },
    invitedBy: "Eingeladen von {name}",
    invited: "Eingeladen",
    actions: "Aktionen für {name}",
    rowActions: "Aktionen",
    resend: "Einladung erneut senden",
    revoke: "Einladung zurückziehen",
    changeRole: "Zu {role} machen",
    remove: "Aus dem Team entfernen",
    resent: "Einladung erneut an {email} gesendet.",
    revoked: "Einladung für {email} zurückgezogen.",
    roleChanged: "{name} ist jetzt {role}.",
    removed: "{name} wurde aus dem Team entfernt.",
    modal: {
      title: "Mitglied einladen",
      email: "E-Mail",
      role: "Rolle",
      cancel: "Abbrechen",
      send: "Einladung senden",
      sent: "Einladung an {email} gesendet.",
    },
    empty: {
      headline: "Keine passenden Mitglieder",
      description: "Versuche eine andere Suche oder Rolle.",
      clear: "Filter zurücksetzen",
    },
  },
  inbox: {
    title: "Posteingang",
    label:
      "Benachrichtigungen, {count} ungelesen | Benachrichtigungen, {count} ungelesen",
    markAllRead: "Alle als gelesen markieren",
    open: "Automatisierungen öffnen",
    empty: {
      headline: "Alles erledigt",
      description: "Neue Benachrichtigungen erscheinen hier.",
    },
    types: {
      failed: "{subject} ist fehlgeschlagen und läuft nicht.",
      missingAccount: "{subject} braucht ein Konto für {detail}.",
      memberJoined: "{subject} ist dem Team beigetreten.",
      integrationAdded: "{subject} wurde verbunden.",
    },
  },
  palette: {
    label: "Suche",
    placeholder: "Seiten, Automatisierungen, Integrationen und Personen suchen",
    shortcut: "Suche ({shortcut})",
    groups: {
      pages: "Seiten",
      automations: "Automatisierungen",
      integrations: "Integrationen",
      members: "Mitglieder",
      actions: "Aktionen",
    },
    actions: {
      createAutomation: "Automatisierung erstellen",
      inviteMember: "Mitglied einladen",
      toggleTheme: "Design wechseln",
    },
    empty: "Keine Ergebnisse für „{query}“",
    hints: {
      move: "Bewegen",
      open: "Öffnen",
      close: "Schließen",
    },
  },
  notFound: {
    title: "Seite nicht gefunden",
    description: "Die gesuchte Seite gibt es nicht.",
    home: "Zur Startseite",
  },
};
