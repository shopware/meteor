import { computed } from "vue";
import { useI18n } from "vue-i18n";

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 60 * 24],
  ["hour", 60],
  ["minute", 1],
];

/**
 * Formats a time relative to now in the current language, short and rounded to the largest unit,
 * such as "17 min. ago" or "in 2 days". Past times are negative minutes.
 */
export function useRelativeTime() {
  const { locale } = useI18n();

  const formatter = computed(
    () =>
      new Intl.RelativeTimeFormat(locale.value, {
        numeric: "auto",
        style: "short",
      }),
  );

  return function relativeTime(minutes: number) {
    const [unit, size] =
      units.find(([, size]) => Math.abs(minutes) >= size) ?? units[2];
    return formatter.value.format(Math.round(minutes / size), unit);
  };
}
