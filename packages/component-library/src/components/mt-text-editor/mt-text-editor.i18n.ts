import type { MeteorMessages } from "@/i18n/types";

/**
 * Shared translations for the whole mt-text-editor component cluster.
 *
 * The toolbar resolves button labels (`t(button.label)`) across several namespaces that are
 * defined by sibling components (the editor itself, the toolbar, and the link/table/color
 * buttons). The cluster carries one shared catalog that every cluster component passes to
 * `useMeteorI18n`, reproducing a merged lookup locally. Keys are public `mt.text-editor*.*`
 * snippet keys, so a host or plugin can override them.
 */
export const meteorTextEditorMessages: MeteorMessages = {
  en: {
    mt: {
      "text-editor": {
        buttons: {
          "switch-to-code": "Switch to code mode",
          "switch-to-visual": "Switch to visual mode",
          "toggle-fullscreen": "Toggle fullscreen mode",
        },
        footer: {
          characters: "{characters} characters",
        },
        diff: {
          title: "Code changes required",
          subtitle:
            "Editing in visual mode requires changes to your code. Some parts may be removed or new code may be added to ensure compatibility.",
          accept: "Apply changes",
          cancel: "Continue in code mode",
          headlines: {
            current: "Your code",
            new: "With changes applied",
          },
        },
        gate: {
          message: "This editor contains custom code that isn’t fully supported in visual mode.",
          showDiff: "View code",
        },
      },
      "text-editor-toolbar": {
        buttons: {
          format: "Format",
          p: "Paragraph",
          h1: "Headline 1",
          h2: "Headline 2",
          h3: "Headline 3",
          h4: "Headline 4",
          h5: "Headline 5",
          h6: "Headline 6",
          bold: "Bold",
          italic: "Italic",
          underline: "Underline",
          strikethrough: "Strikethrough",
          superscript: "Superscript",
          subscript: "Subscript",
          "text-alignment": "Text Alignment",
          "align-left": "Align left",
          "align-center": "Align center",
          "align-right": "Align right",
          justify: "Justify",
          "unordered-list": "Insert Unordered List",
          "numbered-list": "Insert Ordered List",
          undo: "Undo",
          redo: "Redo",
        },
      },
      "text-editor-toolbar-button-link": {
        modalTitle: "Insert/Edit Link",
        cancel: "Cancel",
        applyLink: "Apply link",
        removeLink: "Remove link",
        openInNewTab: "Open in new tab",
        linkUrl: "Link URL",
        label: "Link",
      },
      "text-editor-toolbar-button-table": {
        label: "Table",
        modalTitle: "Insert/Edit Table",
        insertTable: "Insert table",
        cancel: "Cancel",
        columns: "Columns",
        rows: "Rows",
        showHeader: "Show header",
        insertRowBefore: "Insert row before",
        insertRowAfter: "Insert row after",
        deleteRow: "Delete row",
        insertColumnBefore: "Insert column before",
        insertColumnAfter: "Insert column after",
        deleteColumn: "Delete column",
        removeTable: "Remove table",
      },
      "text-editor-toolbar-button-color": {
        label: "Text Color",
      },
    },
  },
  de: {
    mt: {
      "text-editor": {
        buttons: {
          "switch-to-code": "In den Code-Modus wechseln",
          "switch-to-visual": "In den visuellen Modus wechseln",
          "toggle-fullscreen": "Vollbildmodus umschalten",
        },
        footer: {
          characters: "{characters} Zeichen",
        },
        diff: {
          title: "Codeänderungen erforderlich",
          subtitle:
            "Das Bearbeiten im visuellen Modus erfordert Änderungen an deinem Code. Einige Teile können entfernt oder neuer Code hinzugefügt werden, um die Kompatibilität sicherzustellen.",
          accept: "Änderungen anwenden",
          cancel: "Im Code-Modus fortfahren",
          headlines: {
            current: "Dein Code",
            new: "Mit angewandten Änderungen",
          },
        },
        gate: {
          message:
            "Dieser Editor enthält benutzerdefinierten Code, der im visuellen Modus nicht vollständig unterstützt wird.",
          showDiff: "Code anzeigen",
        },
      },
      "text-editor-toolbar": {
        buttons: {
          format: "Format",
          p: "Absatz",
          h1: "Überschrift 1",
          h2: "Überschrift 2",
          h3: "Überschrift 3",
          h4: "Überschrift 4",
          h5: "Überschrift 5",
          h6: "Überschrift 6",
          bold: "Fett",
          italic: "Kursiv",
          underline: "Unterstrichen",
          strikethrough: "Durchgestrichen",
          superscript: "Hochgestellt",
          subscript: "Tiefgestellt",
          "text-alignment": "Textausrichtung",
          "align-left": "Links ausrichten",
          "align-center": "Zentriert ausrichten",
          "align-right": "Rechts ausrichten",
          justify: "Blocksatz",
          "unordered-list": "Unsortierte Liste einfügen",
          "numbered-list": "Sortierte Liste einfügen",
          undo: "Rückgängig",
          redo: "Wiederholen",
        },
      },
      "text-editor-toolbar-button-link": {
        modalTitle: "Link einfügen/bearbeiten",
        cancel: "Abbrechen",
        applyLink: "Link anwenden",
        removeLink: "Link entfernen",
        openInNewTab: "In neuem Tab öffnen",
        linkUrl: "Link URL",
        label: "Link",
      },
      "text-editor-toolbar-button-table": {
        label: "Tabelle",
        modalTitle: "Tabelle einfügen/bearbeiten",
        insertTable: "Tabelle einfügen",
        cancel: "Abbrechen",
        columns: "Spalten",
        rows: "Zeilen",
        showHeader: "Kopfzeile anzeigen",
        insertRowBefore: "Zeile davor einfügen",
        insertRowAfter: "Zeile danach einfügen",
        deleteRow: "Zeile löschen",
        insertColumnBefore: "Spalte davor einfügen",
        insertColumnAfter: "Spalte danach einfügen",
        deleteColumn: "Spalte löschen",
        removeTable: "Tabelle entfernen",
      },
      "text-editor-toolbar-button-color": {
        label: "Textfarbe",
      },
    },
  },
};
