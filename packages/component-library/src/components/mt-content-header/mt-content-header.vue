<template>
  <div class="mt-content-header">
    <div class="mt-content-header__top">
      <mt-text ref="heading" as="h2" size="xl" weight="semibold" class="mt-content-header__title">
        {{ title }}
      </mt-text>

      <div v-if="hasSlotContent(slots.actions)" class="mt-content-header__actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="hasSlotContent(slots.default)" class="mt-content-header__info">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import MtText from "@/components/mt-text/mt-text.vue";
import { pageContextKey } from "@/components/mt-page/_internal/mt-page-context";
import { hasSlotContent } from "@/utils/slot";

/**
 * The heading block at the top of a page's content: the title of what the page shows, such as a
 * product name, actions at its end, and a full-width row of additional information below. Use it in
 * the default slot of `mt-page`, whose header keeps the breadcrumb and the page actions.
 *
 * - The title wraps instead of truncating.
 * - On a narrow container, the actions move onto their own line.
 * - Inside `mt-page`, the breadcrumb in the page header hides its current crumb while this title
 *   is on screen.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
 */
defineProps<{
  /** The title, such as the name of the product the page shows. */
  title: string;
}>();

const slots = defineSlots<{
  /** Buttons at the end of the title. */
  actions?(): unknown;
  /** Additional information in a full-width row below the title. */
  default?(): unknown;
}>();

const page = inject(pageContextKey, null);
const heading = useTemplateRef<InstanceType<typeof MtText>>("heading");
let unregisterHeading: (() => void) | undefined;

onMounted(() => {
  const element: unknown = heading.value?.$el;
  if (element instanceof HTMLElement) unregisterHeading = page?.registerHeading(element);
});

onBeforeUnmount(() => unregisterHeading?.());
</script>

<style scoped>
.mt-content-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
  width: 100%;
}

.mt-content-header__top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--scale-size-16);
}

.mt-content-header__title {
  flex: 1 1 var(--scale-size-256);
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
}

.mt-content-header__actions {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--scale-size-8);
  margin-inline-start: auto;
}
</style>
