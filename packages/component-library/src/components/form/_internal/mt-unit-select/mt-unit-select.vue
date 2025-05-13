<template>
  <div class="mt-unit-select__container">
    <button
      ref="triggerRef"
      class="mt-unit-select__trigger"
      type="button"
      role="combobox"
      aria-controls="unit-select-listbox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :disabled="disabled"
      data-testid="unit-select-trigger"
      @click="toggleDropdown"
    >
      {{ modelValue }}
      <MtIcon name="chevron-down-xxs" size="var(--scale-size-8)" aria-hidden="true" />
    </button>

    <Teleport to="body">
      <div
        v-show="isOpen"
        ref="dropdownRef"
        class="mt-unit-select"
        :style="{
          ...floatingStyles,
          ...(props.zIndex != null ? { zIndex: props.zIndex } : {}),
        }"
      >
        <ul id="unit-select-listbox" role="listbox" tabindex="-1" :aria-label="t('select-unit')">
          <mt-unit-select-result
            v-for="(unit, index) in units"
            :key="unit"
            :unit="unit"
            :unit-label="getUnitLabel(unit)"
            :class="{
              'mt-unit-select-result--selected': unit === modelValue,
              'mt-unit-select-result--active': index === activeIndex,
            }"
            @click="selectUnit(unit)"
          />
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import MtUnitSelectResult from "./_internal/mt-unit-select-result.vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import type { Unit } from "convert-units";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/vue";
import { onClickOutside } from "@vueuse/core";

const { t } = useI18n({
  messages: {
    de: {
      units: {
        mm: "Millimeter",
        cm: "Zentimeter",
        m: "Meter",
        in: "Zoll",
        ft: "Fuß",
        yd: "Yard",
        g: "Gramm",
        kg: "Kilogramm",
        oz: "Unze",
        lb: "Pfund",
      },
      "select-unit": "Einheit auswählen",
    },
    en: {
      units: {
        mm: "Millimeters",
        cm: "Centimeters",
        m: "Meters",
        in: "Inches",
        ft: "Feet",
        yd: "Yards",
        g: "Grams",
        kg: "Kilograms",
        oz: "Ounces",
        lb: "Pounds",
      },
      "select-unit": "Select unit",
    },
  },
});

const props = defineProps<{
  modelValue: Unit;
  units: Unit[];
  disabled?: boolean;
  zIndex?: number | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Unit): void;
}>();

const isOpen = ref<boolean>(false);
const activeIndex = ref<number>(0);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);

const { floatingStyles, update } = useFloating(triggerRef, dropdownRef, {
  middleware: [offset(4), flip(), shift()],
  whileElementsMounted: autoUpdate,
  placement: "bottom-start",
});

// Close the dropdown when clicking outside
onClickOutside(dropdownRef, (event) => {
  if (
    !dropdownRef.value?.contains(event.target as Node) &&
    !triggerRef.value?.contains(event.target as Node)
  ) {
    closeDropdown();
  }
});

const selectUnit = (value: Unit) => {
  emit("update:modelValue", value);
  activeIndex.value = props.units.findIndex((unit) => unit === value);
  isOpen.value = false;
};

// Get the full unit title
const getUnitLabel = (unit: Unit) => {
  const label = t("units." + unit);
  return {
    plural: label,
    singular: label,
  };
};

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const closeDropdown = () => {
  isOpen.value = false;
  activeIndex.value = props.units.findIndex((unit) => unit === props.modelValue);
};

const navigateWithKeyboard = (event: KeyboardEvent) => {
  if (!isOpen.value) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      activeIndex.value = (activeIndex.value + 1) % props.units.length;
      break;
    case "ArrowUp":
      event.preventDefault();
      activeIndex.value = activeIndex.value === 0 ? props.units.length - 1 : activeIndex.value - 1;
      break;
    case "Enter":
      event.preventDefault();
      if (isOpen.value) {
        selectUnit(props.units[activeIndex.value]);
      }
      break;
    case "Escape":
      event.preventDefault();
      closeDropdown();
      break;
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    activeIndex.value = props.units.findIndex((unit) => unit === newValue);
  },
);

onMounted(() => {
  activeIndex.value = props.units.findIndex((unit) => unit === props.modelValue);
  window.addEventListener("keydown", navigateWithKeyboard);
  nextTick(() => {
    update?.();
  });
});

onUnmounted(() => {
  window.removeEventListener("keydown", navigateWithKeyboard);
});
</script>

<style lang="css" scoped>
.mt-unit-select {
  padding: var(--scale-size-8);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-button);
  background-color: var(--color-elevation-surface-overlay);
  color: var(--color-text-primary);
  font-size: var(--font-size-xs);
  box-shadow: 0 3px 6px 0 #d1d9e0;
}

.mt-unit-select ul {
  list-style: none;
}

.mt-unit-select__trigger {
  height: 100%;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  column-gap: var(--scale-size-8);
  padding-left: var(--scale-size-12);
  padding-right: var(--scale-size-12);
  background: var(--color-interaction-secondary-hover);
  border: 3px solid var(--color-elevation-surface-overlay);
  border-radius: var(--border-radius-s);
  cursor: pointer;
}

.mt-unit-select__trigger:disabled {
  background-color: var(--color-background-primary-disabled);
  border: 3px solid var(--color-background-primary-disabled);
}
</style>
