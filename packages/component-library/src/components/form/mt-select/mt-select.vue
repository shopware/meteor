<template>
  <mt-field-label
    v-if="label && id"
    :id="id"
    :has-error="!!error"
    data-testid="mt-select__label"
    @click="nextTick(() => (isOpen = true))"
  >
    {{ label }}
  </mt-field-label>

  <div
    :class="[
      'mt-select__box',
      {
        'mt-select__box--has-error': !!error,
        'mt-select__box--small': small,
      },
    ]"
    ref="box"
    @mousedown="isOpen = true"
  >
    <div v-if="!!$slots.prefix" class="mt-select__affix mt-select__affix--prefix">
      <slot name="prefix" />
    </div>

    <input
      role="combobox"
      class="mt-select__input"
      :aria-controls="isOpen ? `mt-select__listbox--${id}` : undefined"
      :aria-expanded="isOpen"
      :id="id"
      type="text"
      :value="selectedItem"
      :disabled="disabled"
      :placeholder="placeholder"
      :aria-activedescendant="`mt-select--${id}__listitem--${filteredOptions[indexOfSelectedOption]?.value}`"
      @input="searchTerm = ($event.target as HTMLInputElement).value"
      @keydown.esc="hideListbox"
      @keydown.enter="
        () => {
          const newOption = filteredOptions[indexOfSelectedOption];
          if (!newOption) return;

          changeValue(newOption.value, newOption.label);
        }
      "
      @keydown.arrow-up="
        () => {
          isOpen = true;

          const reachedStart = indexOfSelectedOption === 0;
          if (indexOfSelectedOption === 'none' || reachedStart) {
            indexOfSelectedOption = filteredOptions.length - 1;
            return;
          }

          indexOfSelectedOption--;
        }
      "
      @keydown.arrow-down="
        () => {
          isOpen = true;

          const reachedEnd = indexOfSelectedOption === filteredOptions.length - 1;
          if (indexOfSelectedOption === 'none' || reachedEnd) {
            indexOfSelectedOption = 0;
            return;
          }

          indexOfSelectedOption++;
        }
      "
    />

    <mt-icon
      name="regular-chevron-down-xs"
      color="var(--color-icon-primary-default)"
      class="mt-select__indicator"
      aria-hidden="true"
      :style="{
        transform: isOpen ? 'rotate(180deg)' : undefined,
      }"
    />
  </div>

  <mt-field-error v-if="!!error" :error="error" data-testid="mt-select__error" />

  <div v-if="!!$slots.hint" class="mt-select__hint" data-testid="mt-select__hint">
    <slot name="hint" />
  </div>

  <div
    v-if="isOpen"
    ref="listbox"
    role="listbox"
    class="mt-select__listbox"
    :id="`mt-select__listbox--${id}`"
    :style="floatingStyles"
  >
    <div
      v-for="(option, index) in filteredOptions"
      :id="`mt-select--${id}__listitem--${option.value}`"
      :key="option.value"
      role="option"
      :aria-selected="indexOfSelectedOption === index"
      @mouseover="() => (indexOfSelectedOption = index)"
      :class="[
        'mt-select__option',
        {
          'mt-select__option--selected': indexOfSelectedOption === index,
        },
      ]"
      @click="() => changeValue(option.value, option.label)"
    >
      <span>
        {{ option.label }}
      </span>

      <mt-icon
        v-if="model === option.value"
        name="regular-checkmark-xs"
        color="var(--color-icon-primary-default)"
        data-testid="mt-select__selected-indicator"
        aria-hidden="true"
        :style="{
          marginInlineStart: 'auto',
        }"
      />
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="
    T extends {
      value: string;
      label: string;
    }
  "
>
import { computed, ref, useTemplateRef } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useId } from "@/composables/useId";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import { autoUpdate, flip, offset, shift, size, useFloating } from "@floating-ui/vue";
import { nextTick } from "process";

const id = useId();

const props = withDefaults(
  defineProps<{
    valueProperty?: string;
    options: T[];
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: {
      detail: string;
    };
    small?: boolean;
    searchFunction?: (params: { searchTerm: string; option: T }) => boolean;
  }>(),
  {
    valueProperty: "value",
    searchFunction: ({ option, searchTerm }: { option: T; searchTerm: string }) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  },
);

defineSlots<{
  hint(): void;
  prefix(): void;
}>();

const searchTerm = ref("");

const filteredOptions = computed(() => {
  return props.options.filter((option) =>
    props.searchFunction({ searchTerm: searchTerm.value, option }),
  );
});

const isOpen = ref(false);

const listbox = useTemplateRef<HTMLElement>("listbox");
onClickOutside(listbox, hideListbox);

const model = defineModel();
const selectedItem = ref<string | null>(null);

function changeValue(value: string, label: string) {
  model.value = value;
  selectedItem.value = label;

  hideListbox();
}

function hideListbox() {
  indexOfSelectedOption.value = filteredOptions.value.findIndex(
    (option) => option.value === model.value,
  );

  isOpen.value = false;
}

const indexOfSelectedOption = ref<number | "none">("none");

const box = useTemplateRef<HTMLDivElement>("box");

const { floatingStyles } = useFloating(box, listbox, {
  middleware: [
    offset(4),
    flip(),
    shift(),
    size({
      apply({ rects, elements }) {
        Object.assign(elements.floating.style, {
          minWidth: `${rects.reference.width}px`,
        });
      },
    }),
  ],
  whileElementsMounted: autoUpdate,
});
</script>

<style scoped>
.mt-select__box {
  cursor: text;
  min-height: var(--scale-size-48);
  height: var(--scale-size-48);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  background: var(--color-elevation-surface-raised);
  display: flex;
  align-items: center;

  &:has(input:disabled) {
    background: var(--color-background-primary-disabled);
  }

  &:has(input:focus-visible) {
    border-color: var(--color-border-brand-selected);
    box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
  }
}

.mt-select__box--has-error {
  border-color: var(--color-border-critical-default);
  background-color: var(--color-background-critical-dark);
}

.mt-select__affix {
  height: 100%;
  display: grid;
  place-items: center;
  background-color: var(--color-interaction-secondary-dark);
  color: var(--color-text-primary-default);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-xs);
  font-weight: var(--font-weight-regular);
  font-family: var(--font-family-body);
  padding-inline: var(--scale-size-16);

  & .mt-icon {
    color: var(--color-icon-primary-default);
  }
}

.mt-select__affix--prefix {
  border-top-left-radius: var(--border-radius-xs);
  border-bottom-left-radius: var(--border-radius-xs);
  border-inline-end: 1px solid var(--color-border-primary-default);
}

.mt-select__input {
  display: block;
  width: 100%;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: var(--font-size-xs);
  font-family: var(--font-size-body);
  line-height: var(--line-height-xs);
  color: var(--color-text-primary-default);
  padding-inline: var(--scale-size-16);
  outline: none;
  appearance: none;

  &:invalid,
  &:-moz-submit-invalid,
  &:-moz-ui-invalid {
    box-shadow: none;
  }

  &:disabled {
    color: var(--color-text-primary-disabled);
  }

  &::placeholder {
    color: var(--color-text-secondary-default);
  }

  &:disabled::placeholder {
    color: var(--color-text-secondary-disabled);
  }
}

.mt-select__box--small {
  min-height: var(--scale-size-32);
}

.mt-select__indicator {
  transition: 0.125s transform cubic-bezier(0.785, 0.135, 0.15, 0.86);
  pointer-events: none;
}

.mt-select__listbox {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-overlay);
  background-color: var(--color-elevation-surface-overlay);
  box-shadow: 0 3px 6px 0 var(--color-elevation-shadow-default);
  padding: var(--scale-size-8);
}

.mt-select__option {
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  line-height: var(--font-line-height-xs);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  font-family: var(--font-family-body);
  color: var(--color-text-primary-default);
  padding-inline: var(--scale-size-16);
  min-height: var(--scale-size-32);
  border-radius: var(--border-radius-xs);
}

.mt-select__option--selected {
  color: var(--color-text-brand-default);
  background-color: var(--color-background-brand-default);
}

.mt-select__hint {
  color: var(--color-text-tertiary-default);
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);

  & .mt-icon {
    color: var(--color-icon-tertiary-default);
  }
}
</style>
