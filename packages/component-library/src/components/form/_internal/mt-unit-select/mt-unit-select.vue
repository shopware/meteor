<template>
  <mt-floating-ui :is-opened="isOpen" :offset="4" @close="closeDropdown">
    <template #trigger>
      <button
        class="mt-unit-select__trigger"
        type="button"
        role="combobox"
        aria-controls="unit-select-listbox"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        :disabled="disabled"
        @click="toggleDropdown"
        data-testid="unit-select-trigger"
      >
        {{ modelValue }}
        <MtIcon name="chevron-down-xxs" size="var(--scale-size-8)" aria-hidden="true" />
      </button>
    </template>

    <div class="mt-unit-select">
      <ul id="unit-select-listbox" role="listbox" tabindex="-1" aria-label="Select unit">
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
  </mt-floating-ui>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import MtFloatingUi from "../../../_internal/mt-floating-ui/mt-floating-ui.vue";
import MtUnitSelectResult from "./_internal/mt-unit-select-result.vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import type { Unit } from "convert-units";

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
    },
  },
});

const props = defineProps<{
  modelValue: Unit;
  units: Unit[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Unit): void;
}>();

const isOpen = ref<boolean>(false);
const activeIndex = ref<number>(0);

const selectUnit = (value: Unit) => {
  emit("update:modelValue", value);
  activeIndex.value = props.units.findIndex((unit) => unit === value);
  isOpen.value = false;
};

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

:deep(.mt-floating-ui__trigger) {
  height: 100%;
}

.mt-unit-select__trigger {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--scale-size-8);
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
