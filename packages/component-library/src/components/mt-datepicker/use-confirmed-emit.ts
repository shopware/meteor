import { watch } from "vue";

const NOTHING = Symbol("nothing");

/**
 * Decides which values of a picker reach its parent.
 *
 * - While the user types, the picker reads a value from every text it can, including unfinished
 *   ones such as the year 2020 for "20". Those values are held back. The last one is passed on
 *   when the user confirms the text, and dropped when they discard it.
 * - A value equal to the current one is not passed on, so a value reported twice is emitted
 *   once. The current value is the model value. After an emit it is the emitted value, until the
 *   model value changes: a parent that does not hand the emitted value back still has received it.
 */
export function useConfirmedEmit<T>(options: {
  /** The value the parent hands in */
  modelValue: () => unknown;
  /** Brings a value into a form in which two values can be compared */
  toComparable: (value: unknown) => string;
  emit: (value: T) => void;
}) {
  let isTyping = false;
  let typedValue: T | typeof NOTHING = NOTHING;
  let lastEmitted: string | typeof NOTHING = NOTHING;

  watch(
    options.modelValue,
    () => {
      lastEmitted = NOTHING;
    },
    { flush: "sync" },
  );

  const emitValue = (value: T) => {
    if (isTyping) {
      typedValue = value;
      return;
    }

    const comparable = options.toComparable(value);
    const current =
      lastEmitted === NOTHING ? options.toComparable(options.modelValue()) : lastEmitted;
    if (comparable === current) return;

    lastEmitted = comparable;
    options.emit(value);
  };

  /**
   * The text changed. Only what is read from the current text can be confirmed, not a value read
   * from an earlier, shorter text.
   */
  const startTyping = () => {
    isTyping = true;
    typedValue = NOTHING;
  };

  const discardTyping = () => {
    isTyping = false;
    typedValue = NOTHING;
  };

  const confirmTyping = () => {
    const value = typedValue;
    discardTyping();

    if (value !== NOTHING) emitValue(value);
  };

  return { emitValue, startTyping, confirmTyping, discardTyping };
}
