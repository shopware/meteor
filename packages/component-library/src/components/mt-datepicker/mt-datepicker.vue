<template>
  <div
    class="mt-datepicker__wrapper wrapper"
    :class="{
      'mt-datepicker__wrapper--small': size === 'small',
      'mt-datepicker__wrapper--disabled': isDisabled,
      'has-error': !!error,
    }"
  >
    <mt-field-label
      class="mt-datepicker__label"
      :for="inputId"
      :has-error="hasError"
      :required="required"
      :inheritance="isInheritanceField ? (isInherited ? 'linked' : 'unlinked') : 'none'"
      :disabled="disableInheritanceToggle"
      :style="{ gridArea: 'label' }"
      @update:inheritance="onInheritanceChange"
    >
      {{ label }}
    </mt-field-label>

    <mt-help-text v-if="!!helpText" :text="helpText" :style="{ gridArea: 'help-text' }" />

    <PopoverRoot v-model:open="isOpen">
      <PopoverAnchor as-child>
        <div class="mt-datepicker__field" :style="{ gridArea: 'input' }">
          <input
            :id="inputId"
            ref="input"
            class="mt-datepicker__input"
            type="text"
            autocomplete="off"
            aria-haspopup="dialog"
            :aria-expanded="isOpen"
            :aria-invalid="hasError ? 'true' : undefined"
            :aria-describedby="hasError ? errorId : undefined"
            :value="shownText"
            :placeholder="placeholder"
            :required="required"
            :disabled="isDisabled"
            :readonly="!textInput"
            @click="open"
            @input="onTextInput"
            @keydown="onInputKeydown"
            @focusout="onInputFocusOut"
          />

          <button
            v-if="hasValue && !isDisabled"
            type="button"
            class="mt-datepicker__clear-button"
            aria-label="Clear value"
            @pointerdown="onClearPointerDown"
            @click="onClearClick"
          >
            <mt-icon name="regular-times-s" size="var(--scale-size-10)" aria-hidden="true" />
          </button>

          <span class="mt-datepicker__icon" aria-hidden="true" @click="open">
            <mt-icon :name="dateType === 'time' ? 'regular-clock' : 'regular-calendar'" />
          </span>
        </div>
      </PopoverAnchor>

      <PopoverPortal>
        <PopoverContent
          class="mt-datepicker__menu"
          side="bottom"
          align="start"
          :side-offset="4"
          :aria-label="label || undefined"
          @open-auto-focus.prevent
          @close-auto-focus.prevent
          @pointer-down-outside="onPointerDownOutside"
          @escape-key-down="onEscape"
        >
          <mt-datepicker-calendar
            v-if="dateType !== 'time'"
            v-model:view-day="viewDay"
            :range="range"
            :model-value="calendarValue"
            :today="today"
            :min-day="minDay"
            :max-day="maxDay"
            :locale="datePickerLocale"
            :locale-tag="localeTag"
            @select="onSelectDay"
            @select-range="onSelectRange"
          />

          <div v-if="dateType !== 'date'" class="mt-datepicker__times">
            <mt-datepicker-time
              v-for="(time, index) in shownTimes"
              :key="index"
              :model-value="time"
              :is24="is24"
              :hour-increment="hourIncrement"
              :minute-increment="minuteIncrement"
              @update:model-value="onTimeChange(index, $event)"
            />
          </div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>

    <mt-field-error
      v-if="error || errorMessage"
      :id="errorId"
      :error="errorMessage || error"
      :style="{ gridArea: 'error' }"
    />

    <!-- @deprecated tag:v5 remove field-hint class -->
    <mt-field-hint
      v-if="showFieldHint() || isTimeHintVisible"
      class="mt-datepicker__hint"
      :class="{ 'field-hint': !showFieldHint() }"
      :icon="showFieldHint() ? 'info-circle' : 'clock'"
      :hide-icon="!!slots.hint"
      :data-testid="showFieldHint() ? undefined : 'time-zone-hint'"
      :style="{ gridArea: 'hint' }"
    >
      <slot name="hint">{{ showFieldHint() ? hint : resolvedTimeZone }}</slot>
    </mt-field-hint>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { PopoverAnchor, PopoverContent, PopoverPortal, PopoverRoot } from "reka-ui";
import { TZDate, tz } from "@date-fns/tz";
import { format as formatDate, isValid, parse, type Locale } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import MtIcon from "../mt-icon/mt-icon.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtFieldHint from "../_internal/mt-field-hint/mt-field-hint.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtDatepickerCalendar from "./mt-datepicker-calendar.vue";
import MtDatepickerTime from "./mt-datepicker-time.vue";
import { importDateFnsLocaleModule } from "./date-fns-locale";
import {
  dateOnlyStringToUtcIso,
  isDateOnlyString,
  resolveTimeZone,
  toDateOnlyString,
  toLocalDateOnlyString,
} from "./date-only";
import { useConfirmedEmit } from "./use-confirmed-emit";

// @deprecated tag:v5 remove the `wrapper` class of the root element. Keep `mt-datepicker__wrapper`,
// which the styles build on.

type DatepickerFormat = string | ((date: Date) => string) | ((dates: Date[]) => string);

interface Time {
  hours: number;
  minutes: number;
}

/** A value as the user sees it: a calendar day and a time on the clock of the picker */
interface Shown extends Time {
  /** "yyyy-MM-dd". Empty for a time-only picker. */
  day: string;
}

type EmittedValue = string | Array<string | null> | null;

const REQUIRED_ERROR = "This field is required";
const RANGE_SEPARATOR = " - ";

const props = withDefaults(
  defineProps<{
    /**
     * A label for your date picker field. It helps the user understand what this field is for.
     */
    label?: string | null;
    /**
     * Defines the type of the date picker.
     * Options: "date" (for selecting a date), or "datetime" (for selecting both).
     */
    dateType?: "date" | "datetime" | "time";
    /**
     * Sets the locale for the date picker.
     * This affects things like the language used for month names and weekdays.
     */
    locale?: string;
    /**
     * The format of the date picker.
     * You can use a string or a function to format the date.
     */
    format?: DatepickerFormat;
    /**
     * Defines the time zone for the date picker.
     * Useful for adjusting date and time according to a specific timezone.
     * A time zone the browser does not know is treated as "UTC".
     */
    timeZone?: string;
    /**
     * Defines the value of a date-only picker (`dateType="date"`). It has no effect on the other
     * date types.
     *
     * - "datetime": midnight of the picked day in `timeZone` as a UTC ISO string. January 15 in
     *   Europe/Berlin is "2000-01-14T23:00:00.000Z". Use it when the day depends on where the
     *   user is, for example in a filter for orders of a day.
     * - "date": the picked calendar day as "yyyy-MM-dd", for example "2000-01-15". The day is the
     *   same in every time zone and `timeZone` is ignored. Use it for days that do not depend on
     *   a place, such as birthdays. A string with a time is read as the day it falls on in UTC. A
     *   Date object is read as its own calendar day, the one `getDate()` returns, so
     *   `new Date(2000, 0, 15)` is January 15.
     *
     * With either format, a value that is a plain day such as "2000-01-15" is shown as that day.
     */
    valueFormat?: "datetime" | "date";
    /**
     * The value of the date picker. Can be a single string or an array of strings.
     * This represents the currently selected date(s).
     */
    modelValue?: string | string[] | Date | Date[] | null;
    /**
     * Placeholder text to show in the date picker input field when no date is selected.
     */
    placeholder?: string;
    /**
     * Determines if the time picker uses a 24 or a 12 hour clock. The input shows the same clock,
     * unless a custom `format` is set.
     */
    is24?: boolean;
    /**
     * Determines if the date picker field is required.
     * If true, the user must select a value before submitting the form. The picker shows the
     * error "This field is required" while the value is empty.
     *
     * @deprecated tag:v6 - the built-in error will be removed, and `required` will only mark the
     * input as required. Show your own message with `error` instead.
     */
    required?: boolean;
    /**
     * Determines if the date picker field is disabled.
     * If true, the user will not be able to interact with the field.
     */
    disabled?: boolean;
    /**
     * Enables the date range selection feature.
     * If true, the user can select a start and end date.
     */
    range?: boolean;
    /**
     * Sets the size of the datepicker.
     * Options: "small" or "default".
     */
    size?: "small" | "default";
    /**
     * An error in your business logic related to this field.
     *
     * For example: {"code": 500, "detail": "Error while saving"}
     */
    error?: { code?: number; detail?: string } | null;
    /**
     * Help text for the date picker.
     */
    helpText?: string;
    /**
     * Optional caption below the field. The `#hint` slot takes precedence when provided.
     * When set, it replaces the time zone hint that datetime pickers show by default.
     */
    hint?: string | null;
    /**
     * The minimum selectable date. Can be a Date object or an ISO string.
     * Any date before this will be disabled in the calendar.
     */
    minDate?: Date | string;
    /**
     * The increment for hours in the time picker grid.
     * Controls how many hours are skipped when navigating through the hours overlay.
     */
    hourIncrement?: number;
    /**
     * The increment for minutes in the time picker grid.
     * Controls how many minutes are skipped when navigating through the minutes overlay.
     */
    minuteIncrement?: number;
    /**
     * Enables typing directly into the input field. A typed value is emitted when the user
     * presses Enter or Tab, or leaves the field.
     */
    textInput?: boolean;
    /**
     * The maximum selectable date.
     * Can be a Date object or an ISO string
     */
    maxDate?: Date | string;
    /**
     * Toggles the inheritance visualization.
     */
    isInherited?: boolean;
    /**
     * Determines if the field is inheritable.
     */
    isInheritanceField?: boolean;
    /**
     * Determines whether the inheritance toggle can be used.
     */
    disableInheritanceToggle?: boolean;
  }>(),
  {
    label: null,
    dateType: "datetime",
    locale: "de",
    format: undefined,
    timeZone: "UTC",
    // @deprecated tag:v6 - "date" will become the default, so date-only pickers work with plain
    // calendar days unless "datetime" is requested.
    valueFormat: "datetime",
    modelValue: null,
    placeholder: "Y-m-d ...",
    is24: true,
    required: false,
    disabled: false,
    range: false,
    size: "default",
    error: null,
    helpText: undefined,
    hint: undefined,
    minDate: undefined,
    hourIncrement: 1,
    minuteIncrement: 1,
    textInput: false,
    maxDate: undefined,
    isInherited: false,
    isInheritanceField: false,
    disableInheritanceToggle: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[] | Array<string | null> | null): void;
  (e: "inheritance-remove"): void;
  (e: "inheritance-restore"): void;
}>();

const slots = defineSlots<{
  hint?(): void;
}>();

const showFieldHint = () =>
  !!slots.hint || (props.hint != null && String(props.hint).trim() !== "");

const onInheritanceChange = (inheritance: "linked" | "unlinked") => {
  if (inheritance === "linked") {
    emit("inheritance-restore");
    return;
  }

  emit("inheritance-remove");
};

// @deprecated tag:v6 - give every picker an id of its own with `useId()`. All pickers share this
// id, so the label of a second picker on a page points at the input of the first one. It is kept
// until then because tests and styles select the input by `#field-id`.
const inputId = "field-id";
const errorId = useId();
const input = ref<HTMLInputElement | null>(null);

const isDisabled = computed(() => props.disabled || props.isInherited);
const isTimeHintVisible = computed(() => props.dateType === "datetime");

/* Time zone */

const resolvedTimeZone = computed(() => resolveTimeZone(props.timeZone));

// A misspelled time zone would otherwise save UTC values without anybody noticing
watch(
  () => props.timeZone,
  (timeZone) => {
    if (timeZone && resolveTimeZone(timeZone) !== timeZone) {
      console.warn(
        `[MtDatepicker] The time zone "${timeZone}" is unknown to the browser. The picker uses "UTC" instead.`,
      );
    }
  },
  { immediate: true },
);

// A plain calendar day is the same in every time zone. The picker then reads and emits
// "yyyy-MM-dd" and does not use the configured time zone.
const isPlainDate = computed(() => props.dateType === "date" && props.valueFormat === "date");

// The time zone in which a date-only picker looks up the calendar day of a value
const dateOnlyTimeZone = computed(() => (isPlainDate.value ? "UTC" : resolvedTimeZone.value));

// The clock on which the picker shows and reads a value. Only a date and time depends on a place.
const clockTimeZone = computed(() =>
  props.dateType === "datetime" ? resolvedTimeZone.value : "UTC",
);

/* Required error */

// @deprecated tag:v6 - remove the built-in required error. `required` will then only mark the
// input as required, and the parent shows its own message through `error`, as with other fields.
const errorMessage = ref<{ detail: string } | undefined>(undefined);

const checkValidity = () => {
  errorMessage.value = props.required && !props.modelValue ? { detail: REQUIRED_ERROR } : undefined;
};

watch(() => props.modelValue, checkValidity, { immediate: true });

const hasError = computed(() => !!(errorMessage.value || props.error));

/* Language */

const datePickerLocale = ref<Locale>(enUS);
let localeLoadId = 0;

async function loadDateFnsLocale(tag: string): Promise<Locale> {
  const normalized = tag.replace(/_/g, "-").trim() || "en-US";

  const lang = normalized.split("-")[0]?.toLowerCase() ?? "";
  const paths = lang && lang !== normalized ? [normalized, lang] : [normalized];

  for (const path of paths) {
    const locale = await importDateFnsLocaleModule(path);
    if (locale) {
      return locale;
    }
  }

  return enUS;
}

watch(
  () => props.locale,
  async (tag) => {
    const id = ++localeLoadId;
    const locale = await loadDateFnsLocale(tag);
    if (id === localeLoadId) {
      datePickerLocale.value = locale;
    }
  },
  { immediate: true },
);

// The calendar names days for assistive technology with the browser, which needs a valid tag
const localeTag = computed(() => {
  try {
    return Intl.getCanonicalLocales(props.locale.replace(/_/g, "-").trim() || "en-US")[0];
  } catch {
    return "en-US";
  }
});

/* From the value to what the user sees, and back */

const pad = (value: number, length = 2) => String(value).padStart(length, "0");

const dayOf = (date: Date) =>
  `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// The calendar day a date-only picker shows for a value
const toPickerDay = (value: string | Date): string | null => {
  // A plain day has no time and no place, so it is the same day in every time zone
  if (typeof value === "string" && isDateOnlyString(value)) return value;

  // A Date that stands for a day is mostly built at midnight on the clock of the browser, as
  // `new Date(2000, 0, 15)` is, so its own calendar day is the day it stands for
  if (isPlainDate.value && value instanceof Date) return toLocalDateOnlyString(value);

  return toDateOnlyString(value, dateOnlyTimeZone.value);
};

const toTime = (value: string): Time | null => {
  const timePart = value.includes("T") ? value.split("T")[1].split(/[Z.+-]/)[0] : value;
  const [hours, minutes] = timePart.split(":").map(Number);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return { hours, minutes };
};

const toShown = (value: string | Date | null | undefined): Shown | null => {
  if (value === null || value === undefined || value === "") return null;

  if (props.dateType === "date") {
    const day = toPickerDay(value);
    return day ? { day, hours: 0, minutes: 0 } : null;
  }

  if (props.dateType === "time") {
    const time = typeof value === "string" ? toTime(value) : null;
    return time ? { day: "", ...time } : null;
  }

  const ms = typeof value === "string" ? Date.parse(value) : value.getTime();
  if (Number.isNaN(ms)) return null;

  const onClock = new TZDate(ms, clockTimeZone.value);
  return { day: dayOf(onClock), hours: onClock.getHours(), minutes: onClock.getMinutes() };
};

const toEmitted = (shown: Shown): string | null => {
  if (props.dateType === "time") return `${pad(shown.hours)}:${pad(shown.minutes)}`;
  if (isPlainDate.value) return shown.day;
  if (props.dateType === "date") return dateOnlyStringToUtcIso(shown.day, resolvedTimeZone.value);

  const [year, month, day] = shown.day.split("-").map(Number);
  const moment = new TZDate(
    year,
    month - 1,
    day,
    shown.hours,
    shown.minutes,
    resolvedTimeZone.value,
  );
  return new Date(moment.getTime()).toISOString();
};

// A range keeps the position of each end, so a range without a start does not show its end as
// the start
const shownValue = computed<Array<Shown | null>>(() => {
  const value = props.modelValue;

  if (props.range) {
    const [start, end] = Array.isArray(value) ? value : [value, null];
    return [toShown(start), toShown(end)];
  }

  return [toShown(Array.isArray(value) ? value[0] : value)];
});

const hasValue = computed(() => shownValue.value.some((shown) => shown !== null));

/* The text in the input */

const timePattern = computed(() => (!props.is24 && !props.format ? "hh:mm aa" : "HH:mm"));

const pattern = computed(() => {
  if (typeof props.format === "string") return props.format;
  if (props.dateType === "date") return "yyyy/MM/dd";
  if (props.dateType === "time") return timePattern.value;
  return `yyyy/MM/dd, ${timePattern.value}`;
});

// A custom format function gets a Date that is on the clock of the picker
const toClockDate = (shown: Shown) => {
  const [year, month, day] = (shown.day || dayOf(new Date())).split("-").map(Number);
  return new TZDate(year, month - 1, day, shown.hours, shown.minutes, clockTimeZone.value);
};

const formatShown = (shown: Shown | null) => {
  if (!shown) return "";

  const date = toClockDate(shown);
  if (typeof props.format === "function") return (props.format as (date: Date) => string)(date);

  return formatDate(date, pattern.value, { locale: datePickerLocale.value });
};

const formattedValue = computed(() => {
  if (!hasValue.value) return "";

  if (props.range && typeof props.format === "function") {
    const dates = shownValue.value.flatMap((shown) => (shown ? [toClockDate(shown)] : []));
    return (props.format as (dates: Date[]) => string)(dates);
  }

  return shownValue.value.map(formatShown).join(RANGE_SEPARATOR);
});

/** What the user typed and has not confirmed or thrown away yet */
const typedText = ref<string | null>(null);

const shownText = computed(() => typedText.value ?? formattedValue.value);

const parseOne = (text: string): Shown | null => {
  // A custom format function cannot be read back, so typed text is read in the default format
  const parsePattern = typeof props.format === "string" ? props.format : pattern.value;
  const parsed = parse(text.trim(), parsePattern, new TZDate(Date.now(), clockTimeZone.value), {
    locale: datePickerLocale.value,
    in: tz(clockTimeZone.value),
  });
  if (!isValid(parsed)) return null;

  const shown = {
    day: props.dateType === "time" ? "" : dayOf(parsed),
    hours: parsed.getHours(),
    minutes: parsed.getMinutes(),
  };

  return isWithinLimits(shown.day) ? shown : null;
};

/** Reads typed text. Returns null for an empty text and undefined for one that is no value. */
const parseText = (text: string): Array<Shown | null> | null | undefined => {
  if (text.trim() === "") return null;

  const parts = props.range ? text.split(RANGE_SEPARATOR) : [text];
  const shown = parts.map(parseOne);
  if (shown.some((part) => part === null)) return undefined;

  return shown;
};

/* Limits */

const toLimitDay = (limit: Date | string | undefined) =>
  limit === undefined || props.dateType === "time" ? null : toPickerDay(limit);

const minDay = computed(() => toLimitDay(props.minDate));
const maxDay = computed(() => toLimitDay(props.maxDate));

// Days written as "yyyy-MM-dd" compare like their text
const isWithinLimits = (day: string) =>
  !day || ((!minDay.value || day >= minDay.value) && (!maxDay.value || day <= maxDay.value));

/* Emitting */

// Brings a value into a form in which two values can be compared, however they are written
const toComparable = (value: unknown): string => {
  const normalize = (item: unknown) => {
    if (item === null || item === undefined || item === "") return null;
    if (item instanceof Date && Number.isNaN(item.getTime())) return null;

    // A date-only picker shows days, so two of its values are equal when they are the same day
    if (props.dateType === "date" && (typeof item === "string" || item instanceof Date)) {
      return toPickerDay(item) ?? item;
    }

    if (item instanceof Date) return item.toISOString();
    if (typeof item !== "string" || isDateOnlyString(item)) return item;

    const ms = Date.parse(item);
    return Number.isNaN(ms) ? item : new Date(ms).toISOString();
  };

  return JSON.stringify(Array.isArray(value) ? value.map(normalize) : normalize(value));
};

// What the user types counts once they confirm it with Enter or Tab, or leave the field. Only a
// value that differs from the current one is passed on.
const { emitValue, startTyping, confirmTyping, discardTyping } = useConfirmedEmit<EmittedValue>({
  modelValue: () => props.modelValue,
  toComparable,
  emit: (value) => emit("update:modelValue", value),
});

const emitShown = (shown: Array<Shown | null>) => {
  const values = shown.map((part) => (part ? toEmitted(part) : null));
  emitValue(props.range ? values : values[0]);
};

/* The popup */

const isOpen = ref(false);

// @deprecated tag:v6 - remove together with the built-in required error
watch(isOpen, (isNowOpen) => {
  if (!isNowOpen) checkValidity();
});

/** A day in the month the calendar shows */
const viewDay = ref("");
/** The day the calendar marks as today */
const today = ref("");
/** The times the time picker shows, one for each end of a range */
const draftTimes = ref<Time[]>([]);

const getToday = () =>
  isPlainDate.value
    ? dayOf(new Date())
    : toDateOnlyString(new Date(), resolvedTimeZone.value) ?? dayOf(new Date());

const getCurrentTime = (): Time => {
  const now = new TZDate(Date.now(), clockTimeZone.value);
  return { hours: now.getHours(), minutes: now.getMinutes() };
};

// The time picker shows the time of the value, or the current time for an end without a value.
// While the popup is open, a time the user chose for an end without a day yet is kept.
const syncDraftTimes = ({ keepChosen }: { keepChosen: boolean }) => {
  draftTimes.value = shownValue.value.map((shown, index) => {
    if (shown) return { hours: shown.hours, minutes: shown.minutes };

    return (keepChosen && draftTimes.value[index]) || getCurrentTime();
  });
};

watch(shownValue, () => {
  if (isOpen.value) syncDraftTimes({ keepChosen: true });
});

const shownTimes = computed(() =>
  draftTimes.value.map(({ hours, minutes }) => ({ hours, minutes })),
);

const calendarValue = computed(() => {
  const days = shownValue.value.map((shown) => shown?.day || null);
  return props.range ? ([days[0], days[1]] as [string | null, string | null]) : days[0];
});

const open = () => {
  if (isDisabled.value || isOpen.value) return;

  today.value = getToday();
  viewDay.value = shownValue.value.find((shown) => shown?.day)?.day ?? today.value;
  syncDraftTimes({ keepChosen: false });
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

// The popup closes when the user presses somewhere else. The field it belongs to is not
// somewhere else: pressing the input keeps the popup open.
const onPointerDownOutside = (event: Event) => {
  const target = event.target;
  if (target instanceof Node && input.value?.contains(target)) event.preventDefault();
};

const onEscape = () => {
  discardTyping();
  typedText.value = null;
};

/* Picking in the popup */

const onSelectDay = (day: string) => {
  discardTyping();
  typedText.value = null;
  emitShown([{ ...draftTimes.value[0], day }]);
  close();
};

const onSelectRange = ([start, end]: [string, string | null]) => {
  discardTyping();
  typedText.value = null;
  emitShown([
    { ...draftTimes.value[0], day: start },
    end ? { ...draftTimes.value[1], day: end } : null,
  ]);

  if (end) close();
};

const onTimeChange = (index: number, time: Time) => {
  draftTimes.value = draftTimes.value.map((draft, i) => (i === index ? time : draft));

  if (props.dateType === "time") {
    emitShown([{ day: "", ...time }]);
    return;
  }

  // A time without a day is not a value yet. It is used once a day is picked.
  if (!shownValue.value[index]) return;

  emitShown(
    shownValue.value.map((shown, i) => (shown && i === index ? { ...shown, ...time } : shown)),
  );
};

/* Typing */

const onTextInput = (event: Event) => {
  const text = (event.target as HTMLInputElement).value;
  typedText.value = text;
  startTyping();

  const shown = parseText(text);
  if (shown === undefined) return;

  if (shown === null) {
    emitValue(null);
    return;
  }

  emitShown(shown);

  // The calendar follows what is typed
  const day = shown.find((part) => part?.day)?.day;
  if (day) viewDay.value = day;
};

/** Passes on what was typed. Text that is no value stays, so the user can correct it. */
const confirmText = () => {
  const isValue = typedText.value !== null && parseText(typedText.value) !== undefined;
  confirmTyping();

  if (isValue) typedText.value = null;
};

const onInputKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();

    if (typedText.value !== null) {
      confirmText();
      close();
    } else if (isOpen.value) {
      close();
    } else {
      open();
    }
    return;
  }

  if (event.key === "Tab") {
    confirmText();
    return;
  }

  if (event.key === "Escape") {
    onEscape();
    return;
  }

  // The arrow key takes the user into the calendar
  if (event.key === "ArrowDown" && isOpen.value) {
    const menu = document.querySelector(".mt-datepicker__menu");
    const day = menu?.querySelector<HTMLElement>(
      "[data-selected], [data-mt-today], .mt-datepicker-calendar__day, button",
    );
    if (day) {
      event.preventDefault();
      day.focus();
    }
  }
};

// Pressing the clear button takes the focus off the input before the click arrives, and leaving
// the input confirms what was typed. The press is noticed first, so that what was typed is thrown
// away instead. The flag is reset once the press is over, also when it ends somewhere else.
let isClearing = false;

const onClearPointerDown = () => {
  isClearing = true;
  window.addEventListener(
    "pointerup",
    () => {
      setTimeout(() => {
        isClearing = false;
      });
    },
    { once: true },
  );
};

const onClearClick = () => {
  isClearing = false;
  discardTyping();
  typedText.value = null;
  emitValue(null);
  close();
};

const onInputFocusOut = (event: FocusEvent) => {
  // Moving on into the popup is not leaving the picker. What was typed counts only when the user
  // confirms it in the field, a day picked in the calendar replaces it.
  const next = event.relatedTarget;
  if (isClearing || (next instanceof Element && next.closest(".mt-datepicker__menu"))) {
    discardTyping();
    return;
  }

  confirmText();
};
</script>

<style lang="css">
.mt-datepicker__wrapper {
  display: grid;
  grid-template-areas:
    "label help-text"
    "input input"
    "error error"
    "hint hint";
  grid-template-columns: 1fr auto;
  align-content: start;
}

.mt-datepicker__label {
  line-height: var(--font-line-height-xs) !important;
  margin-bottom: var(--scale-size-2);
  font-size: var(--font-size-xs);
}

.mt-datepicker__field {
  position: relative;
  display: flex;
  align-items: center;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
}

.mt-datepicker__input {
  width: 100%;
  min-height: var(--scale-size-48);
  padding-inline: var(--scale-size-16) var(--scale-size-88);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  font: inherit;
  color: var(--color-text-primary-default);
  background: var(--color-background-primary-default);
  outline: none;

  &::placeholder {
    color: var(--color-text-secondary-default);
    opacity: 1;
  }

  &:focus-visible,
  &[aria-expanded="true"] {
    outline: var(--scale-size-2) solid var(--color-border-brand-default);
    outline-offset: var(--scale-size-2);
  }

  &:disabled {
    background: var(--color-background-tertiary-default);
    color: var(--color-text-primary-disabled);
    cursor: default;
  }

  &:read-only:not(:disabled) {
    cursor: pointer;
  }
}

.mt-datepicker__wrapper--small .mt-datepicker__input {
  min-height: var(--scale-size-32);
}

.mt-datepicker__wrapper.has-error .mt-datepicker__input {
  border-color: var(--color-border-critical-default);
  background: var(--color-background-critical-dark);
}

.mt-datepicker__clear-button {
  position: absolute;
  right: var(--scale-size-56);
  display: grid;
  place-items: center;
  height: var(--scale-size-32);
  aspect-ratio: 1/1;
  border-radius: var(--border-radius-button);
  color: var(--color-icon-primary-default);
  outline-color: var(--color-border-brand-default);
  transition: background 0.2s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover,
  &:focus-visible {
    background: var(--color-interaction-secondary-hover);
  }
}

.mt-datepicker__wrapper--small .mt-datepicker__clear-button {
  height: var(--scale-size-24);
}

.mt-datepicker__icon {
  position: absolute;
  inset-block: var(--scale-size-1);
  right: var(--scale-size-1);
  display: grid;
  place-items: center;
  width: var(--scale-size-48);
  border-left: 1px solid var(--color-border-primary-default);
  border-start-end-radius: var(--border-radius-xs);
  border-end-end-radius: var(--border-radius-xs);
  background: var(--color-background-tertiary-default);
  color: var(--color-icon-primary-default);
  cursor: pointer;
}

.mt-datepicker__wrapper--disabled .mt-datepicker__icon {
  cursor: default;
}

.mt-datepicker__menu {
  z-index: var(--z-index-popover, 1000);
  display: grid;
  gap: var(--scale-size-8);
  padding: var(--scale-size-8);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-s);
  background: var(--color-elevation-surface-overlay, var(--color-background-primary-default));
  color: var(--color-text-primary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  filter: drop-shadow(0px 1px 3px #0000001a);
}

.mt-datepicker__times {
  display: grid;
  gap: var(--scale-size-8);
}

.mt-datepicker-calendar + .mt-datepicker__times {
  padding-top: var(--scale-size-8);
  border-top: 1px solid var(--color-border-primary-default);
}

.mt-datepicker__hint {
  margin-top: var(--scale-size-4);
}
</style>
