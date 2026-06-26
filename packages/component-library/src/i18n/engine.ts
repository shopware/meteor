import type { MeteorInterpolationValues } from "./types";

const INTERPOLATION_REGEX = /\{(\w+)\}/g;

/**
 * Render a snippet: select the plural form (if any) and interpolate named values.
 *
 * Supports exactly the message features Meteor uses:
 * - named interpolation: `"{start}-{end}"`
 * - pipe pluralization:  `"no items | one item | {n} items"` selected by `n`/`count`
 *
 * Missing interpolation variables are left as their literal placeholder (`{var}`),
 * matching vue-i18n's default behaviour.
 */
export function render(message: string, values?: MeteorInterpolationValues): string {
  return interpolate(selectPluralForm(message, values), values);
}

function selectPluralForm(message: string, values?: MeteorInterpolationValues): string {
  if (!message.includes("|")) return message;

  const forms = message.split("|").map((form) => form.trim());
  if (forms.length === 1) return forms[0];

  const index = choiceIndex(pluralCount(values), forms.length);
  return forms[index] ?? forms[forms.length - 1];
}

function pluralCount(values?: MeteorInterpolationValues): number {
  const raw = values?.n ?? values?.count;
  const num = typeof raw === "number" ? raw : Number(raw);

  // No usable count -> treat as singular, matching the most common call site.
  return Number.isFinite(num) ? num : 1;
}

/**
 * Mirrors vue-i18n's default choice rule for Latin-script languages (en, de):
 * - 2 forms: `0` -> 1, `1` -> 0, `>1` -> 1
 * - 3+ forms: `0` -> 0, `1` -> 1, `>=2` -> 2
 */
function choiceIndex(choice: number, choicesLength: number): number {
  choice = Math.abs(choice);

  if (choicesLength === 2) {
    return choice ? (choice > 1 ? 1 : 0) : 1;
  }

  return choice ? Math.min(choice, 2) : 0;
}

function interpolate(text: string, values?: MeteorInterpolationValues): string {
  if (!values) return text;

  return text.replace(INTERPOLATION_REGEX, (match, name: string) => {
    const value = values[name];
    return value === undefined || value === null ? match : String(value);
  });
}
