<template>
  <mt-field-label v-if="label && id" :id="id" data-testid="mt-select__label">
    {{ label }}
  </mt-field-label>

  <div class="mt-select__box" ref="box">
    <input
      class="mt-select__input"
      :id="id"
      type="text"
      @focus="isOpen = true"
      :value="selectedItem"
    />
  </div>

  <div
    v-if="isOpen"
    ref="listbox"
    role="listbox"
    class="mt-select__listbox"
    :style="floatingStyles"
  >
    <button
      v-for="option in options"
      :key="option.value"
      role="listitem"
      class="mt-select__listitem"
      @click="() => changeValue(option.value, option.label)"
    >
      {{ option.label }}
    </button>
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
import { ref, useTemplateRef } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useId } from "@/composables/useId";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import { autoUpdate, flip, offset, shift, size, useFloating } from "@floating-ui/vue";

const id = useId();

withDefaults(
  defineProps<{
    valueProperty?: string;
    options: T[];
    label?: string;
  }>(),
  {
    valueProperty: "value",
  },
);

const isOpen = ref(false);

const listbox = useTemplateRef<HTMLElement>("listbox");
onClickOutside(listbox, () => {
  isOpen.value = false;
});

const model = defineModel();
const selectedItem = ref<string | null>(null);

function changeValue(value: string, label: string) {
  model.value = value;
  selectedItem.value = label;
}

const box = useTemplateRef<HTMLDivElement>("box");

const { floatingStyles } = useFloating(box, listbox, {
  middleware: [
    offset(8),
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
  min-height: var(--scale-size-48);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  background: var(--color-elevation-surface-raised);
  padding-inline: var(--scale-size-16);
  display: flex;
  align-items: center;
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
  outline: none;
  appearance: none;

  &:invalid,
  &:-moz-submit-invalid,
  &:-moz-ui-invalid {
    box-shadow: none;
  }

  &::placeholder {
    color: var(--color-text-secondary-default);
  }
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

.mt-select__listitem {
  width: 100%;
  text-align: left;
  line-height: var(--font-line-height-xs);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  font-family: var(--font-family-body);
  color: var(--color-text-primary-default);
  padding-inline: var(--scale-size-16);
  min-height: var(--scale-size-32);
}
</style>
