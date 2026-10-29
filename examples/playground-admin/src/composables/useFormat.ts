import { computed } from "vue";
import { useI18n } from "vue-i18n";

const relativeUnits: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** Formats prices, numbers and dates in the current language. All prices are in EUR. */
export function useFormat() {
  const { locale } = useI18n();

  const formats = computed(() => ({
    currency: new Intl.NumberFormat(locale.value, {
      style: "currency",
      currency: "EUR",
    }),
    number: new Intl.NumberFormat(locale.value),
    percent: new Intl.NumberFormat(locale.value, {
      style: "percent",
      maximumFractionDigits: 2,
    }),
    date: new Intl.DateTimeFormat(locale.value, { dateStyle: "medium" }),
    shortDate: new Intl.DateTimeFormat(locale.value, {
      day: "numeric",
      month: "short",
    }),
    time: new Intl.DateTimeFormat(locale.value, { timeStyle: "short" }),
    relative: new Intl.RelativeTimeFormat(locale.value, { numeric: "auto" }),
  }));

  /** "2 days ago", "in 3 hours", "now". */
  function relativeTime(date: string) {
    const seconds = (new Date(date).getTime() - Date.now()) / 1000;
    const [unit, size] = relativeUnits.find(
      ([, size]) => Math.abs(seconds) >= size,
    ) ?? ["second", 1];

    return formats.value.relative.format(Math.round(seconds / size), unit);
  }

  return {
    currency: (value: number) => formats.value.currency.format(value),
    number: (value: number) => formats.value.number.format(value),
    /** `19` → "19%", formatted for the current language. */
    percent: (value: number) => formats.value.percent.format(value / 100),
    date: (date: string) => formats.value.date.format(new Date(date)),
    shortDate: (date: string) => formats.value.shortDate.format(new Date(date)),
    time: (date: string) => formats.value.time.format(new Date(date)),
    relativeTime,
  };
}
