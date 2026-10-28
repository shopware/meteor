import type { MeteorMessages } from "@/i18n/types";

export const messages: MeteorMessages = {
  en: {
    booleanFilter: {
      true: "Active",
      false: "Inactive",
    },
    entity: {
      delete: {
        title: "Delete item",
        description: "Are you sure you want to delete the selected items?",
        cancel: "Cancel",
        delete: "Delete",
      },
    },
  },
  de: {
    booleanFilter: {
      true: "Aktiv",
      false: "Inaktiv",
    },
    entity: {
      delete: {
        title: "Element löschen",
        description: "Soll dieses Element wirklich gelöscht werden?",
        cancel: "Abbrechen",
        delete: "Löschen",
      },
    },
  },
};
