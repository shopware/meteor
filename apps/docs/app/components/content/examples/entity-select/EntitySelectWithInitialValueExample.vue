<script setup lang="ts">
  // @ts-nocheck -- demo SFC; the library component's dist types are incomplete for these props
import { ref } from "vue";
import MtEntitySelect from "@shopware-ag/meteor-component-library/MtEntitySelect";

// A small mock entity repository stands in for an Admin SDK repository.
// In an application you pass a real `entity` and the component resolves the
// repository through the Admin SDK, so this `repository` prop is not needed.
const manufacturers = Array.from(Array(150).keys()).map((i) => ({
  id: `manufacturer-${i}`,
  name: `Manufacturer ${i}`,
}));

const mockRepository = () => ({
  search: (criteria: any) => {
    const term = criteria.term?.toLowerCase();
    const filtered = term
      ? manufacturers.filter((m) => m.name.toLowerCase().includes(term))
      : manufacturers;

    const start = (criteria.page - 1) * criteria.limit;
    const paginated = filtered.slice(start, start + criteria.limit);
    const result = Object.assign([...paginated], { total: filtered.length });

    return new Promise((resolve) => setTimeout(() => resolve(result), 300));
  },
  get: (id: string) => Promise.resolve(manufacturers.find((m) => m.id === id)),
});

// The existing value is hydrated to its visible label on mount.
const selected = ref("manufacturer-5");
</script>

<template>
  <mt-entity-select
    v-model="selected"
    entity="product_manufacturer"
    :repository="mockRepository"
    label="Manufacturers"
    label-property="name"
    value-property="id"
  />
</template>
