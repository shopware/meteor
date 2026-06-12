<script setup lang="ts">
import { camelCase, kebabCase, upperFirst } from "scule";

const props = withDefaults(
  defineProps<{
    /** Component name, e.g. "MtButton". Defaults to the page slug. */
    name?: string;
    /** Prop names to hide from the table. */
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

const rows = computed(() =>
  (meta.value?.meta?.props ?? [])
    .filter((prop) => !props.ignore.includes(prop.name))
    .map((prop) => ({
      name: kebabCase(prop.name),
      type: prop.type,
      default: prop.default,
      description: prop.description,
      required: prop.required,
    })),
);
</script>

<template>
  <ProseTable>
    <ProseThead>
      <ProseTr>
        <ProseTh>Prop</ProseTh>
        <ProseTh>Type</ProseTh>
        <ProseTh>Default</ProseTh>
        <ProseTh>Description</ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr v-for="row in rows" :key="row.name">
        <ProseTd>
          <ProseCode>{{ row.name }}</ProseCode>
          <span v-if="row.required" class="text-error"> *</span>
        </ProseTd>
        <ProseTd>
          <ProseCode v-if="row.type">{{ row.type }}</ProseCode>
        </ProseTd>
        <ProseTd>
          <ProseCode v-if="row.default">{{ row.default }}</ProseCode>
        </ProseTd>
        <ProseTd>{{ row.description }}</ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
