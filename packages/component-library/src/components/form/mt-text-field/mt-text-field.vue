<template>
  <div>
    <mt-field-label
      :inheritance="isInherited"
      @update:inheritance="handleInheritanceUpdate"
      :label="label"
      id="some-id"
      style="margin-block-end: 1px"
    />

    <div :class="inputClasses">
      <input type="text" id="some-id" :disabled="isInherited" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";

const props = withDefaults(
  defineProps<{
    label: string;
    isInheritanceField?: boolean;
    isInherited?: boolean;
  }>(),
  {
    isInheritanceField: false,
    isInherited: false,
  },
);

const inputClasses = computed(() => {
  return [
    {
      "mt-text-field__input--disabled": props.isInherited,
    },
    "mt-text-field__input",
  ];
});

const emit = defineEmits(["inheritance-restore", "inheritance-remove"]);

function handleInheritanceUpdate(value: boolean) {
  const ifInheritanceRestored = value === true;

  if (ifInheritanceRestored) {
    emit("inheritance-restore");
    return;
  }

  emit("inheritance-remove");
}
</script>

<style scoped>
.mt-text-field__input {
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  background: var(--color-elevation-surface-raised);
  height: 3rem;
  width: 100%;

  &:focus-within {
    border-color: var(--color-border-brand-selected);
    box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
  }
}

.mt-text-field__input--disabled {
  background-color: var(--color-background-primary-disabled);
}

.mt-text-field__input input {
  font-family: var(--font-family-body);
  border: none;
  background: none;
  height: 100%;
  width: 100%;
  padding-inline: 1rem;
  color: var(--color-text-primary-default);
  font-size: var(--font-size-xs);
  outline: none;
  line-height: 1;
}
</style>
