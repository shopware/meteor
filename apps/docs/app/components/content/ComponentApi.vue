<script setup lang="ts">
import { camelCase, kebabCase, upperFirst } from "scule";
import { formatType } from "#shared/utils/formatType";

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
}

const visible = <T extends { name: string }>(items: T[] | undefined) =>
  (items ?? []).filter((item) => !props.ignore.includes(item.name));

const sections = computed(() => {
  const m = meta.value?.meta;

  return [
    {
      title: "Props",
      headers: ["Prop", "Type", "Default", "Description"],
      rows: visible(m?.props).map((prop): Cell[] => [
        { value: kebabCase(prop.name), code: true, required: prop.required },
        { value: formatType(prop.type), code: true },
        { value: prop.default, code: true },
        { value: prop.description },
      ]),
    },
    {
      title: "Events",
      headers: ["Event", "Payload", "Description"],
      rows: visible(m?.events).map((event): Cell[] => [
        { value: event.name, code: true },
        { value: formatType(event.type), code: true },
        { value: event.description },
      ]),
    },
    {
      title: "Slots",
      headers: ["Slot", "Bindings", "Description"],
      rows: visible(m?.slots).map((slot): Cell[] => [
        { value: slot.name, code: true },
        { value: formatType(slot.type), code: true },
        { value: slot.description },
      ]),
    },
    {
      title: "Exposed",
      headers: ["Name", "Type", "Description"],
      rows: visible(m?.exposed).map((exposed): Cell[] => [
        { value: exposed.name, code: true },
        { value: formatType(exposed.type), code: true },
        { value: exposed.description },
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
          </ProseTd>
        </ProseTr>
      </ProseTbody>
    </ProseTable>
  </template>
</template>
