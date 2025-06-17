<template>
    <mt-select
        v-bind="$attrs"
        v-model="internalValue"
        :options="computedOptions"
        :label-property="labelProperty"
        :value-property="valueProperty"
        class="mt-entity-select"
        :search-function="search"
        @search-term-change="searchTerm = $event"
    >
        <template v-for="(_, name) in mappedSlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
        </template>

        <template #after-item-list>
            <span ref="infinityScroll" aria-hidden="true" class="mt-entity-select__infinity-scroll"></span>
            <mt-loader v-if="isLoading" />
            <slot name="after-item-list" />
        </template>
    </mt-select>
</template>

<script setup lang="ts" generic="EntityName extends keyof EntitySchema.Entities">
import { computed, ref, useSlots, useTemplateRef, onBeforeMount, watch } from 'vue';
import { composables } from '@shopware-ag/meteor-admin-sdk';
import EntityCollection from '@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection';
import { useIntersectionObserver } from '@vueuse/core';
import Criteria from '@shopware-ag/meteor-admin-sdk/es/data/Criteria';
import { debounce } from '@/utils/debounce';

const emit = defineEmits(['update:modelValue']);

const props = withDefaults(
    defineProps<{
        modelValue: EntitySchema.Entity<EntityName>;
        entityName: EntityName;
        pageSize?: number;
        labelProperty?: string | string[];
        valueProperty?: string;
        searchFunction?: (options: {
            options: any;
            labelProperty: string | string[];
            searchTerm: string;
        }) => Promise<EntityCollection<EntityName>>;
    }>(),
    {
        pageSize: 10,
        labelProperty: () => [
            'label',
            'name',
            'description',
            'translated.label',
            'translated.name',
            'translated.description',
        ],
        valueProperty: '',
        searchFunction: undefined,
    },
);

useIntersectionObserver(useTemplateRef<HTMLElement>('infinityScroll'), ([entry]) => entry?.isIntersecting && loadMore());

const repository = composables.useRepository(computed(() => props.entityName) as any) as any;
const criteria = computed(() => new Criteria(1, props.pageSize));
const options = ref<EntityCollection<EntityName>>(getNewCollection());
const searchTerm = ref<string | null>(null);
const isLoading = ref(false);
const slots = useSlots();

const mappedSlots = computed(() => {
    return Object.fromEntries(
        Object.entries(slots).filter(
            ([key]) =>
                ![
                    'after-item-list',
                    'result-label-property',
                ].includes(key),
        ),
    );
});

const internalValue = computed<(EntitySchema.Entities[EntityName] & { id: string }) | undefined>({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    },
});

// to ensure that the internal value is always part of the options
const computedOptions = computed(() => {
    if (!internalValue.value || options.value.some((entity) => entity.id === internalValue.value?.id)) {
        return options.value;
    }

    return [
        ...options.value,
        internalValue.value,
    ];
});

onBeforeMount(fetch);
watch(
    [
        criteria,
        repository,
    ],
    () => reset(),
);

function reset() {
    internalValue.value = undefined;
    criteria.value.setPage(1);
    options.value = getNewCollection();
    fetch();
}

async function fetch(concatResults: boolean = false) {
    const result = (await repository.value.search(criteria.value)) ?? getNewCollection();

    if (concatResults) {
        result.forEach((entity: EntitySchema.Entity<EntityName>) => options.value.add(entity));
    } else {
        options.value = result;
    }
}

async function loadMore() {
    if (isLoading.value || !!searchTerm.value) return;

    if ((options.value?.length ?? 0) >= (options.value?.total ?? 0)) return;

    isLoading.value = true;
    criteria.value.setPage((criteria.value.page ?? 0) + 1);
    await fetch(true);
    isLoading.value = false;
}

let lastResolve: ((results: EntityCollection<EntityName> | undefined) => void) | null = null;
const debouncedSearch = debounce(async function search(params: {
    options: EntityCollection<EntityName>;
    labelProperty: string;
    searchTerm: string;
}) {
    let results: EntityCollection<EntityName>;

    if (props.searchFunction) {
        results = await props.searchFunction(params);
    } else {
        const searchCriteria = new Criteria();
        searchCriteria.setTerm(params.searchTerm);
        results = (await repository.value.search(searchCriteria)) ?? getNewCollection();
    }
    if (lastResolve) lastResolve(results);

    isLoading.value = false;
}, 300);

function search(params: { options: EntityCollection<EntityName>; labelProperty: string; searchTerm: string }) {
    isLoading.value = true;
    return new Promise((resolve) => {
        if (lastResolve) lastResolve(undefined);
        lastResolve = resolve;
        debouncedSearch(params);
    });
}

function getNewCollection() {
    return new EntityCollection(repository.value.source, props.entityName, Shopware.Context.api, criteria.value);
}
</script>