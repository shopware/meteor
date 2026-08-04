<script setup lang="ts">
import { camelCase, kebabCase, upperFirst } from "scule";
import { formatType, literalUnion } from "#shared/utils/formatType";
import type { ComponentPropMeta } from "~/types/component-meta";

const props = withDefaults(
  defineProps<{
    /** Component name, e.g. "MtButton". Defaults to the page slug. */
    name?: string;
    /** Member names (props, events, slots, exposed) to hide. */
    ignore?: string[];
  }>(),
  {
    name: undefined,
    ignore: () => [],
  },
);

const route = useRoute();

const componentName =
  props.name ?? `Mt${upperFirst(camelCase(route.path.split("/").pop() ?? ""))}`;

const { data: meta } = await useFetchComponentMeta(componentName);

interface Cell {
  value?: string;
  code?: boolean;
  required?: boolean;
  /** Rendered on its own line beneath the cell value (used for the name column). */
  description?: string;
}

const visible = <T extends { name: string }>(items: T[] | undefined) =>
  (items ?? []).filter((item) => !props.ignore.includes(item.name));

// Prefer the resolved schema's literal union (e.g. a named enum type alias
// expanded to its actual values) over the printed type, which can be an opaque
// alias name or a broad `string`. Falls back to the printed type otherwise.
const propType = (prop: ComponentPropMeta): string | undefined =>
  literalUnion(prop.schema) ?? formatType(prop.type);

const sections = computed(() => {
  const m = meta.value?.meta;

  return [
    {
      title: "Props",
      headers: ["Prop", "Type", "Default"],
      rows: visible(m?.props).map((prop): Cell[] => [
        {
          value: kebabCase(prop.name),
          code: true,
          required: prop.required,
          description: prop.description,
        },
        { value: propType(prop), code: true },
        { value: prop.default, code: true },
      ]),
    },
    {
      title: "Events",
      headers: ["Event", "Payload"],
      rows: visible(m?.events).map((event): Cell[] => [
        { value: event.name, code: true, description: event.description },
        { value: formatType(event.type), code: true },
      ]),
    },
    {
      title: "Slots",
      headers: ["Slot", "Bindings"],
      rows: visible(m?.slots).map((slot): Cell[] => [
        { value: slot.name, code: true, description: slot.description },
        { value: formatType(slot.type), code: true },
      ]),
    },
    {
      title: "Exposed",
      headers: ["Name", "Type"],
      rows: visible(m?.exposed).map((exposed): Cell[] => [
        { value: exposed.name, code: true, description: exposed.description },
        { value: formatType(exposed.type), code: true },
      ]),
    },
  ].filter((section) => section.rows.length > 0);
});
</script>

<template>
  <template v-for="section in sections" :key="section.title">
    <ProseH3>{{ section.title }}</ProseH3>
    <ProseTable>
      <ProseThead>
        <ProseTr>
          <ProseTh v-for="header in section.headers" :key="header">
            {{ header }}
          </ProseTh>
        </ProseTr>
      </ProseThead>
      <ProseTbody>
        <ProseTr v-for="(row, rowIndex) in section.rows" :key="rowIndex">
          <ProseTd v-for="(cell, cellIndex) in row" :key="cellIndex">
            <ProseCode v-if="cell.code && cell.value">{{
              cell.value
            }}</ProseCode>
            <template v-else-if="cell.value">{{ cell.value }}</template>
            <span v-if="cell.required" class="text-error"> *</span>
            <div v-if="cell.description" class="mt-1 text-sm text-muted">
              {{ cell.description }}
            </div>
          </ProseTd>
        </ProseTr>
      </ProseTbody>
    </ProseTable>
  </template>
</template>
