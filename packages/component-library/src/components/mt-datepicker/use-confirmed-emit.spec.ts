import { effectScope, ref, type EffectScope } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useConfirmedEmit } from "./use-confirmed-emit";

let scope: EffectScope | undefined;

afterEach(() => {
  scope?.stop();
});

function setup(initialValue: string | null = null) {
  scope = effectScope();
  const modelValue = ref<string | null>(initialValue);
  const emit = vi.fn();
  const confirmedEmit = scope.run(() =>
    useConfirmedEmit<string | null>({
      modelValue: () => modelValue.value,
      toComparable: (value) => JSON.stringify(value ?? null),
      emit,
    }),
  )!;

  return { ...confirmedEmit, modelValue, emit };
}

describe("useConfirmedEmit", () => {
  it("passes on a value that differs from the model value", () => {
    const { emitValue, emit } = setup("a");

    emitValue("b");

    expect(emit).toHaveBeenCalledExactlyOnceWith("b");
  });

  it("does not pass on the model value", () => {
    const { emitValue, emit } = setup("a");

    emitValue("a");

    expect(emit).not.toHaveBeenCalled();
  });

  it("passes on a value once while the parent has not handed it back", () => {
    const { emitValue, emit } = setup("a");

    emitValue("b");
    emitValue("b");

    expect(emit).toHaveBeenCalledOnce();
  });

  it("passes on a value again after the model value changed", () => {
    const { emitValue, emit, modelValue } = setup("a");

    emitValue("b");
    modelValue.value = "c";
    emitValue("b");

    expect(emit).toHaveBeenCalledTimes(2);
  });

  it("passes on the earlier value again when the parent kept it", () => {
    const { emitValue, emit } = setup("a");

    emitValue("b");
    emitValue("a");

    expect(emit.mock.calls).toEqual([["b"], ["a"]]);
  });

  describe("while the user types", () => {
    it("holds values back and passes on the last one when the text is confirmed", () => {
      const { emitValue, startTyping, confirmTyping, emit } = setup();

      startTyping();
      emitValue("2");
      startTyping();
      emitValue("20");
      expect(emit).not.toHaveBeenCalled();

      confirmTyping();

      expect(emit).toHaveBeenCalledExactlyOnceWith("20");
    });

    it("drops the held value when the text is discarded", () => {
      const { emitValue, startTyping, discardTyping, confirmTyping, emit } = setup();

      startTyping();
      emitValue("20");
      discardTyping();
      confirmTyping();

      expect(emit).not.toHaveBeenCalled();
    });

    it("forgets a value read from an earlier text", () => {
      const { emitValue, startTyping, confirmTyping, emit } = setup();

      startTyping();
      emitValue("20");
      startTyping();
      confirmTyping();

      expect(emit).not.toHaveBeenCalled();
    });

    it("passes values on directly again once the text is confirmed", () => {
      const { emitValue, startTyping, confirmTyping, emit } = setup();

      startTyping();
      confirmTyping();
      emitValue("b");

      expect(emit).toHaveBeenCalledExactlyOnceWith("b");
    });
  });
});
