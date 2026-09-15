/**
 * One vue-i18n catalog drives everything: the app's own strings (`app.*`) AND the
 * translations for Meteor's snippets (`mt.*`). Meteor resolves host-first, so an
 * `mt.*` entry here wins over Meteor's bundled snippet; on a miss (e.g. English and
 * German below have no `mt` block) Meteor falls back to its bundled en/de texts.
 *
 * NOTE: vue-i18n resolves keys as nested paths, so the `mt.*` overrides use the
 * NESTED object form here. Meteor's own plugin registry
 * (`createMeteorI18nPlugin({ messages })`) additionally accepts flat dotted keys.
 */
export const messages = {
  en: {
    app: {
      title: "Standalone Meteor example",
      description:
        "This app translates its own texts with vue-i18n and adds French for Meteor's snippets — a language Meteor does not bundle.",
      language: "Language",
      ownTexts:
        "The heading and this description come from the app's own catalog.",
      meteorTexts:
        "The pagination below is translated by Meteor: bundled English/German, French supplied by this app.",
    },
  },
  de: {
    app: {
      title: "Eigenständiges Meteor-Beispiel",
      description:
        "Diese App übersetzt ihre eigenen Texte mit vue-i18n und liefert Französisch für Meteors Snippets — eine Sprache, die Meteor nicht mitbringt.",
      language: "Sprache",
      ownTexts:
        "Die Überschrift und diese Beschreibung kommen aus dem Katalog der App.",
      meteorTexts:
        "Die Pagination darunter übersetzt Meteor: Englisch/Deutsch gebündelt, Französisch liefert diese App.",
    },
  },
  fr: {
    app: {
      title: "Exemple Meteor autonome",
      description:
        "Cette application traduit ses propres textes avec vue-i18n et fournit le français pour les extraits de Meteor — une langue que Meteor n'embarque pas.",
      language: "Langue",
      ownTexts:
        "Le titre et cette description proviennent du catalogue de l'application.",
      meteorTexts:
        "La pagination ci-dessous est traduite par Meteor : anglais/allemand embarqués, français fourni par cette application.",
    },
    mt: {
      pagination: {
        firstPage: "Première page",
        previousPage: "Page précédente",
        nextPage: "Page suivante",
        lastPage: "Dernière page",
        infoText: "{start}-{end} sur {totalItems}",
      },
    },
  },
};
