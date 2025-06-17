<template>
  <mt-select
    v-bind="$attrs"
    :model-value="props.modelValue"
    :options="options"
    :is-loading="isLoading"
    :label-property="props.labelProperty"
    :value-property="props.valueProperty"
    @update:model-value="emit('update:modelValue', $event)"
    @search-term-change="onSearchTermChange"
    @paginate="fetchNextPage"
  >
    <!-- Pass through all slots -->
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}"></slot>
    </template>
  </mt-select>
</template>

<script setup lang="ts">
/**
 * This component is a wrapper for the mt-select component.
 *
 * It is used to add automatic data handling for the mt-select component using
 * the repository methods from the meteor-admin-sdk.
 *
 * The developer can provide an entity name, and the component will automatically fetch the
 * data from the repository and pass it to the mt-select component. Pagination and
 * searching is handled automatically.
 *
 * The fallback uses the meteor-admin-sdk's find method to fetch the data. But the developer
 * can also provide a custom repository to use their own data fetching logic.
 */
import { ref, onMounted } from "vue";
import type { PropType } from "vue";
import MtSelect from "@/components/form/mt-select/mt-select.vue";
import type Repository from "@shopware-ag/meteor-admin-sdk/es/data/repository";
import Criteria from "@shopware-ag/meteor-admin-sdk/es/data/Criteria";
import { useRepository } from "@shopware-ag/meteor-admin-sdk/es/data/composables/useRepository";

export interface Props {
  entity: keyof EntitySchema.Entities;
  repository?: typeof Repository;
  modelValue?: any;
  labelProperty?: string | string[];
  valueProperty?: string;
  disabled?: boolean;
  enableMultiSelection?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  repository: undefined,
  modelValue: null,
  labelProperty: "name",
  valueProperty: "id",
  disabled: false,
  enableMultiSelection: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const options = ref<any[]>([]);
const isLoading = ref(false);
const searchTerm = ref("");
const currentPage = ref(1);
const limit = ref(50);
const total = ref(0);

// @ts-expect-error - The repository is not typed exactly the same
const repo = useRepository(props.entity, props.repository);

const getPage = async () => {
  const criteria = new Criteria(currentPage.value, limit.value);

  if (searchTerm.value) {
    criteria.setTerm(searchTerm.value);
  }

  if (typeof props.labelProperty === "string") {
    criteria.addSorting({
      field: props.labelProperty,
      order: "ASC",
      naturalSorting: false,
    });
  }

  try {
    const result = await repo.value.search(criteria);
    if (result) {
      total.value = result.total ?? 0;
      return [...result];
    }
  } catch (e) {
    console.error(`Could not fetch data for entity ${props.entity}`, e);
  }
  return [];
};

const fetchData = async (append = false) => {
  isLoading.value = true;
  const newOptions = await getPage();
  if (append) {
    options.value.push(...newOptions);
  } else {
    options.value = newOptions;
  }
  isLoading.value = false;
};

const fetchSelectedEntities = async () => {
  const ids = (
    Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
  ).filter((v) => !!v);

  if (ids.length === 0) {
    return [];
  }

  const criteria = new Criteria(1, ids.length);
  criteria.addFilter(Criteria.equalsAny("id", ids));

  try {
    const result = await repo.value.search(criteria);
    return result ? [...result] : [];
  } catch (e) {
    console.error("Could not fetch selected entities", e);
    return [];
  }
};

onMounted(async () => {
  isLoading.value = true;

  const pagePromise = getPage();
  let selectedPromise = Promise.resolve<any[]>([]);

  const hasValue =
    (Array.isArray(props.modelValue) && props.modelValue.length > 0) ||
    (!Array.isArray(props.modelValue) &&
      props.modelValue !== null &&
      props.modelValue !== undefined);

  if (hasValue) {
    selectedPromise = fetchSelectedEntities();
  }

  const [pageEntities, selectedEntities] = await Promise.all([
    pagePromise,
    selectedPromise,
  ]);

  const combined = [...selectedEntities, ...pageEntities];
  const unique = combined.reduce((acc, current) => {
    if (!acc.find((item: { id: string }) => item.id === current.id)) {
      acc.push(current);
    }
    return acc;
  }, [] as any[]);

  // sort options by labelProperty
  if (typeof props.labelProperty === "string") {
    unique.sort((a: any, b: any) => {
      const aValue = a[props.labelProperty as string] ?? "";
      const bValue = b[props.labelProperty as string] ?? "";
      return aValue.localeCompare(bValue);
    });
  }

  options.value = unique;

  isLoading.value = false;
});

const onSearchTermChange = (newSearchTerm: string) => {
  searchTerm.value = newSearchTerm;
  currentPage.value = 1;
  fetchData(false);
};

const fetchNextPage = () => {
  if (isLoading.value) {
    return;
  }

  if (options.value.length >= total.value && total.value > 0) {
    return;
  }
  currentPage.value += 1;
  fetchData(true);
};
</script>
