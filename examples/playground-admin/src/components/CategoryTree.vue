<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
import { MtIcon } from "@shopware-ag/meteor-component-library";
import type { Category } from "../../shared/types";

/**
 * One level of the category tree: each category with its expand button, its icon, its name as a
 * link and its active dot, and its open subcategories below it.
 */
const props = defineProps<{
  categories: Category[];
  parentId: string | null;
  selectedId: string | null;
  /** The ids of the open categories. */
  expanded: Set<string>;
  level?: number;
}>();

const emit = defineEmits<{ toggle: [id: string] }>();

const { t } = useI18n();

const children = computed(() =>
  props.categories.filter((category) => category.parentId === props.parentId),
);

function hasChildren(id: string) {
  return props.categories.some((category) => category.parentId === id);
}
</script>

<template>
  <ul class="category-tree" :role="level ? 'group' : 'tree'">
    <li
      v-for="category in children"
      :key="category.id"
      role="treeitem"
      :aria-expanded="hasChildren(category.id) ? expanded.has(category.id) : undefined"
      :aria-selected="category.id === selectedId"
    >
      <div
        class="category-tree__row"
        :class="{ 'is--selected': category.id === selectedId }"
        :style="{ '--level': level ?? 0 }"
      >
        <button
          v-if="hasChildren(category.id)"
          type="button"
          class="category-tree__toggle"
          :aria-label="
            expanded.has(category.id)
              ? t('categories.collapse', { name: category.name })
              : t('categories.expand', { name: category.name })
          "
          @click="emit('toggle', category.id)"
        >
          <mt-icon
            :name="
              expanded.has(category.id)
                ? 'regular-chevron-down-xxs'
                : 'regular-chevron-right-xxs'
            "
            size="var(--scale-size-8)"
            decorative
          />
        </button>
        <span v-else class="category-tree__toggle" />

        <mt-icon
          class="category-tree__icon"
          :name="
            hasChildren(category.id)
              ? expanded.has(category.id)
                ? 'regular-folder-open'
                : 'regular-folder'
              : 'regular-file'
          "
          size="var(--scale-size-16)"
          decorative
        />

        <router-link
          class="category-tree__link"
          :to="{ name: 'category', params: { id: category.id } }"
        >
          {{ category.name }}
        </router-link>

        <span class="category-tree__dot" />
      </div>

      <category-tree
        v-if="hasChildren(category.id) && expanded.has(category.id)"
        :categories="categories"
        :parent-id="category.id"
        :selected-id="selectedId"
        :expanded="expanded"
        :level="(level ?? 0) + 1"
        @toggle="emit('toggle', $event)"
      />
    </li>
  </ul>
</template>

<style scoped>
.category-tree {
  margin: 0;
  padding: 0;
  list-style: none;
}

.category-tree__row {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  min-height: var(--scale-size-40);
  padding-inline: calc(var(--scale-size-8) + var(--level) * var(--scale-size-16))
    var(--scale-size-12);
  font-size: var(--font-size-xs);
  border-radius: var(--border-radius-xs);
}

.category-tree__row:hover {
  background-color: var(--color-interaction-secondary-hover);
}

.category-tree__row.is--selected {
  background-color: var(--color-background-brand-default);
}

.category-tree__toggle {
  display: inline-grid;
  flex: none;
  place-items: center;
  width: var(--scale-size-16);
  height: var(--scale-size-16);
  padding: 0;
  color: var(--color-icon-secondary-default);
  background: none;
  border: 0;
  border-radius: var(--border-radius-2xs);
  cursor: pointer;
}

.category-tree__icon {
  flex: none;
  color: var(--color-icon-secondary-default);
}

.category-tree__link {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-primary-default);
  text-decoration: none;
}

.is--selected .category-tree__link {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-brand-default);
}

.category-tree__link:focus-visible,
.category-tree__toggle:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.category-tree__dot {
  flex: none;
  width: var(--scale-size-6);
  height: var(--scale-size-6);
  background-color: var(--color-icon-positive-default);
  border-radius: 50%;
}
</style>
